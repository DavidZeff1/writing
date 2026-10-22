import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { byId, lessons, units } from '../content/curriculum';
import { emptyWorkbook, makeDraft, mergeWorkbook, STORAGE_KEY, validateWorkbook } from '../lib/workbook';

test('curriculum is complete, authored, and has no broken practice links',()=>{
 const focused=lessons.filter(l=>!l.kind);
 expect(focused).toHaveLength(64);expect(lessons.filter(l=>l.kind==='workshop')).toHaveLength(5);expect(lessons.filter(l=>l.kind==='checkpoint')).toHaveLength(6);
 expect(new Set(lessons.map(l=>l.id)).size).toBe(lessons.length);
 for(const l of lessons){
  expect(byId[l.transfer.lesson],l.id+' transfer').toBeTruthy();
  for(const r of l.rubric||[])expect(byId[r.revisit],l.id+' rubric').toBeTruthy();
  if(!l.kind){expect(l.explanation.join(' ').split(/\s+/).length,l.id+' explanation').toBeGreaterThan(65);expect(l.examples.length,l.id).toBeGreaterThanOrEqual(2);expect(l.exercises.length,l.id).toBeGreaterThanOrEqual(3);expect(l.checklist.length,l.id).toBeGreaterThanOrEqual(3);expect(l.revision,l.id).toBeTruthy();for(const e of l.exercises){expect(e.hint).toBeTruthy();expect(e.sample).toBeTruthy();}}
 }
 expect(new Set(focused.map(l=>l.explanation.join(' '))).size).toBe(64);
 expect(units).toHaveLength(12);
});

test('backup validation rejects invalid identifiers and repeated merge preserves one imported snapshot',()=>{
 const local=emptyWorkbook();local.drafts.baseline={...makeDraft('baseline','baseline','Baseline'),text:'Local'};
 const incoming=emptyWorkbook();incoming.drafts.baseline={...makeDraft('baseline','baseline','Baseline'),text:'Incoming'};
 const once=mergeWorkbook(local,incoming);const twice=mergeWorkbook(once,incoming);expect(twice.drafts.baseline.revisions).toHaveLength(1);
 expect(()=>validateWorkbook({...incoming,lastLesson:'constructor'})).toThrow();
 const bad=JSON.parse(JSON.stringify(incoming));Object.defineProperty(bad.drafts,'__proto__',{value:{...bad.drafts.baseline,id:'__proto__'},enumerable:true});expect(()=>validateWorkbook(bad)).toThrow();
});

test('learn, practise, autosave, manually complete, and continue',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/#lesson/complete-thought');
 await expect(page.getByRole('heading',{level:1})).toHaveText('Write a complete thought');
 const exercise=page.locator('.exercise').first();await expect(exercise.getByText('The cup on the shelf has a cracked handle. Has supplies the missing verb.')).toBeHidden();
 await exercise.getByText('Show a hint',{exact:true}).click();await expect(exercise.getByText('Ask: what does the cup do, or what is it like?')).toBeVisible();
 await exercise.getByRole('textbox').fill('The cup has a cracked handle.');
 await page.reload();await expect(page.locator('.exercise').first().getByRole('textbox')).toHaveValue('The cup has a cracked handle.');
 await page.getByRole('button',{name:'Mark lesson complete',exact:true}).click();await expect(page.getByRole('button',{name:'Marked complete · undo'})).toBeVisible();
 await page.getByRole('link',{name:'Home',exact:true}).click();await page.getByRole('link',{name:'Continue learning'}).click();await expect(page).toHaveURL(/clear-reference/);
 await page.goto('/#lesson/complete-thought');await expect(page.getByRole('button',{name:'Marked complete · undo'})).toBeVisible();expect(errors).toEqual([]);
});

test('planning, draft snapshots, comparison, and lossless restoration',async({page})=>{
 await page.goto('/#lesson/baseline');const editor=page.locator('#editor-baseline');
 await editor.locator('.writing-area').fill('I put the clean cups on the low shelf.');
 await editor.getByRole('tab',{name:'Plan',exact:true}).click();await editor.locator('.writing-area').fill('Reader: a new housemate.');
 await editor.getByText('Save & compare revisions',{exact:false}).click();await editor.getByPlaceholder('Baseline — before feedback').fill('First attempt');await editor.getByRole('button',{name:'Save revision',exact:true}).click();
 await editor.getByRole('tab',{name:'Draft',exact:true}).click();await editor.locator('.writing-area').fill('Clean cups go on the low shelf, where everyone can reach them.');
 await editor.getByRole('tab',{name:'Reflect',exact:true}).click();await editor.locator('.writing-area').fill('I added the reason for choosing the shelf.');
 const select=editor.getByLabel('Compare an earlier version with the working draft');const option=await select.locator('option').nth(1).getAttribute('value');await select.selectOption(option!);
 await expect(editor.locator('.comparison section').first()).toContainText('I put the clean cups');await expect(editor.locator('.comparison section').last()).toContainText('where everyone can reach them');
 await editor.getByRole('button',{name:'Restore this version',exact:false}).click();await editor.getByRole('tab',{name:'Draft',exact:true}).click();await expect(editor.getByRole('textbox').first()).toHaveValue('I put the clean cups on the low shelf.');
 const stored=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)!),STORAGE_KEY);expect(stored.drafts.baseline.revisions).toHaveLength(2);expect(stored.drafts.baseline.revisions[1].reflection).toContain('added the reason');expect(stored.drafts.baseline.plan).toBe('Reader: a new housemate.');
 await page.reload();await expect(page.locator('#main-draft-text')).toHaveValue('I put the clean cups on the low shelf.');
});

test('feedback request includes assignment, source pack, rubric, draft, and revision-first instructions',async({page})=>{
 await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async(text:string)=>{(window as unknown as {copied:string}).copied=text;}}}));
 await page.goto('/#lesson/checkpoint-research');const editor=page.locator('#editor-checkpoint-research');await editor.locator('.writing-area').fill('The policy requires confirmation before collection.');await editor.getByRole('button',{name:'Copy feedback request'}).click();
 const copied=await page.evaluate(()=>(window as unknown as {copied:string}).copied);
 expect(copied).toContain('Birch Desk');expect(copied).toContain('Source evaluation');expect(copied).toContain('TWO most important weaknesses');expect(copied).toContain('BEFORE supplying any rewritten example');expect(copied).toContain('specific passages');expect(copied).toContain('The policy requires confirmation before collection.');
});

test('clipboard denial provides a usable copy area and writing downloads include process notes',async({page})=>{
 await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{throw new Error('Denied');}}}));
 await page.goto('/#lesson/baseline');const editor=page.locator('#editor-baseline');await editor.locator('.writing-area').fill('A draft with a clear action.');await editor.getByRole('tab',{name:'Plan',exact:true}).click();await editor.locator('.writing-area').fill('For a new reader.');await editor.getByRole('button',{name:'Focus view',exact:true}).click();await editor.getByRole('button',{name:'Copy feedback request'}).click();await expect(page.getByLabel('Select and copy this text')).toContainText('A draft with a clear action.');await expect(page.getByRole('dialog')).toHaveCount(0);await expect(page.getByLabel('Select and copy this text')).toBeFocused();
 const event=page.waitForEvent('download');await editor.getByRole('button',{name:'Download writing',exact:true}).click();const dl=await event;const text=await readFile((await dl.path())!,'utf8');expect(text).toContain('A draft with a clear action.');expect(text).toContain('For a new reader.');
});

test('export, validate, and merge a conflicting backup without losing either version',async({page})=>{
 await page.goto('/#lesson/baseline');await page.locator('#main-draft-text').fill('My local version.');await page.getByRole('link',{name:'Backups & storage',exact:true}).click();
 const event=page.waitForEvent('download');await page.getByRole('button',{name:'Export complete backup'}).click();const dl=await event;const exported=validateWorkbook(JSON.parse(await readFile((await dl.path())!,'utf8')));expect(exported.drafts.baseline.text).toBe('My local version.');
 exported.drafts.baseline.text='An imported different version.';exported.drafts.baseline.plan='Imported plan preserved.';exported.completed=['complete-thought'];
 await page.locator('#backup-file').setInputFiles({name:'backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(exported))});await page.getByRole('button',{name:'Merge backup',exact:true}).click();
 await page.goto('/#lesson/baseline');await expect(page.locator('#main-draft-text')).toHaveValue('My local version.');const stored=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)!),STORAGE_KEY);expect(stored.drafts.baseline.revisions[0].text).toBe('An imported different version.');expect(stored.drafts.baseline.revisions[0].plan).toBe('Imported plan preserved.');expect(stored.completed).toContain('complete-thought');
 await page.goto('/#backup');await page.locator('#backup-file').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{"version":99}')});await expect(page.getByRole('status')).toContainText('not a supported');expect(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)!).drafts.baseline.text,STORAGE_KEY)).toBe('My local version.');
});

test('practice notebook persists and links back to the selected lesson',async({page})=>{
 await page.goto('/#notebook');await page.getByLabel('What keeps causing difficulty?').fill('I repeat judgments instead of developing them.');await page.getByLabel('A passage, feedback note, or next practice task').fill('Paragraph 2 repeats useful three times.');await page.getByLabel('A lesson to revisit').selectOption('paragraph-depth');await page.getByRole('button',{name:'Save practice note'}).click();await page.reload();await expect(page.locator('.practice-note')).toContainText('Paragraph 2');await page.getByRole('button',{name:'Mark as less frequent'}).click();await expect(page.locator('.practice-note')).toContainText('Less frequent');await page.getByRole('link',{name:'Revisit: Develop a thin paragraph'}).click();await expect(page.getByRole('heading',{level:1})).toHaveText('Develop a thin paragraph');
});

test('mobile navigation, hidden help, focus dialog, keyboard stages, and no horizontal overflow',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');await expect(page.getByRole('link',{name:'Continue learning'})).toBeVisible();await page.screenshot({path:'test-results/mobile-home.png',fullPage:true});
 await page.getByRole('link',{name:'Curriculum',exact:true}).click();await page.getByLabel('Find a lesson or skill').fill('complete thought');await page.locator('.lesson-list').getByRole('link').first().click();
 const editor=page.locator('.exercise').first().locator('.editor');await editor.getByRole('button',{name:'Focus view',exact:true}).click();await expect(page.getByRole('dialog')).toBeVisible();
 const tabs=page.getByRole('dialog').getByRole('tab');await tabs.nth(1).focus();await page.keyboard.press('ArrowRight');await expect(tabs.nth(2)).toHaveAttribute('aria-selected','true');
 await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);await expect(editor.getByRole('button',{name:'Focus view'})).toBeFocused();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 await page.screenshot({path:'test-results/mobile-lesson.png',fullPage:true});
});

test('unavailable storage reports unsaved edits and still exports them',async({page})=>{
 await page.addInitScript(()=>{Storage.prototype.setItem=function(){throw new DOMException('Full','QuotaExceededError');};});
 await page.goto('/#lesson/baseline');await page.locator('#main-draft-text').fill('This must survive in an export.');await expect(page.locator('.error[role=alert]')).toContainText('could not save');await page.getByRole('link',{name:'Open backups and recovery'}).click();const event=page.waitForEvent('download');await page.getByRole('button',{name:'Export complete backup'}).click();const dl=await event;const data=JSON.parse(await readFile((await dl.path())!,'utf8'));expect(data.drafts.baseline.text).toBe('This must survive in an export.');
});

test('unreadable stored data is not overwritten and can be recovered from a validated backup',async({page})=>{
 await page.goto('/');await page.evaluate(k=>localStorage.setItem(k,'unreadable original'),STORAGE_KEY);await page.reload();await expect(page.locator('.error[role=alert]')).toContainText('has not been overwritten');expect(await page.evaluate(k=>localStorage.getItem(k),STORAGE_KEY)).toBe('unreadable original');
 const backup=emptyWorkbook();backup.drafts.baseline={...makeDraft('baseline','baseline','Baseline'),text:'Recovered draft.'};await page.getByRole('link',{name:'Open backups and recovery'}).click();await page.locator('#backup-file').setInputFiles({name:'recover.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});await page.getByRole('button',{name:'Recover storage from this backup'}).click();await expect(page.locator('.error[role=alert]')).toHaveCount(0);await page.goto('/#lesson/baseline');await expect(page.locator('#main-draft-text')).toHaveValue('Recovered draft.');await page.reload();await expect(page.locator('#main-draft-text')).toHaveValue('Recovered draft.');
});

test('another tab cannot silently overwrite this tab’s draft',async({page,context})=>{
 await page.goto('/#lesson/baseline');await page.locator('#main-draft-text').fill('First tab version.');const second=await context.newPage();await second.goto('/#lesson/baseline');await second.locator('#main-draft-text').fill('Second tab version.');await expect(page.locator('.error[role=alert]')).toContainText('Another tab changed');await page.locator('#main-draft-text').fill('Unsaved first tab changes.');expect(await second.evaluate(k=>JSON.parse(localStorage.getItem(k)!).drafts.baseline.text,STORAGE_KEY)).toBe('Second tab version.');
});

test('My writing reopens a saved optional exercise rather than hiding it',async({page})=>{
 await page.goto('/#lesson/clear-reference');await page.getByText('Optional extra practice',{exact:true}).click();await page.locator('#editor-clear-reference\\:extra').getByRole('textbox').fill('A second viewpoint.');await page.getByRole('link',{name:'My writing',exact:true}).click();await page.locator('.writing-row').click();await expect(page.locator('#editor-clear-reference\\:extra').getByRole('textbox')).toHaveValue('A second viewpoint.');await expect(page.locator('#editor-clear-reference\\:extra').getByRole('textbox')).toBeFocused();
});

test('all course pages render and preserve accessible labels without runtime errors',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');
 for(const l of lessons){await page.goto('/#lesson/'+l.id);await expect(page.getByRole('heading',{level:1})).toHaveText(l.title);await expect(page.locator('#main-draft-text')).toHaveAttribute('spellcheck','true');}
 expect(errors).toEqual([]);
});

test('later applications are clearly separate and browsing does not move the course bookmark',async({page})=>{
 await page.goto('/#lesson/complete-thought');await page.getByRole('button',{name:'Set as my current lesson'}).click();
 await expect(page.getByRole('heading',{name:'What to do on this page'})).toBeVisible();
 await page.getByText('Later application — not your next step',{exact:true}).click();await page.locator('.transfer').getByRole('link').click();
 await expect(page.getByRole('heading',{level:1})).toHaveText('Support a main idea with details');
 await page.getByRole('link',{name:'Home',exact:true}).click();await page.getByRole('link',{name:'Continue learning'}).click();await expect(page).toHaveURL(/complete-thought/);
 await page.getByRole('link',{name:/Next in the course/}).click();await expect(page).toHaveURL(/clear-reference/);
 await page.getByRole('link',{name:'Home',exact:true}).click();await page.getByRole('link',{name:'Continue learning'}).click();await expect(page).toHaveURL(/clear-reference/);
});

test('an independent response can become the revision draft with both originals preserved',async({page})=>{
 await page.goto('/#lesson/complete-thought');const independent=page.locator('.exercise').nth(2).locator('.writing-area');await independent.fill('The fan turns. A bird sings. My pencil rolls.');
 await page.locator('#main-draft-text').fill('An earlier revision draft.');
 await page.getByRole('button',{name:'Bring this writing into the revision area'}).click();
 await expect(page.locator('#main-draft-text')).toHaveValue('The fan turns. A bird sings. My pencil rolls.');await expect(independent).toHaveValue('The fan turns. A bird sings. My pencil rolls.');
 const stored=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)!),STORAGE_KEY);expect(stored.drafts['complete-thought'].revisions.map((r:{text:string})=>r.text)).toContain('An earlier revision draft.');expect(stored.drafts['complete-thought'].revisions).toHaveLength(2);
 await page.locator('#editor-complete-thought').getByRole('button',{name:'Save revision now',exact:true}).click();await page.reload();expect(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)!).drafts['complete-thought'].revisions.length,STORAGE_KEY)).toBe(3);
});

test('workshops have one primary writing area and the preparation links select the right stage',async({page})=>{
 await page.goto('/#lesson/workshop-place');await expect(page.locator('.exercise .editor')).toHaveCount(0);
 await page.getByRole('button',{name:'Open Plan for this piece'}).click();const editor=page.locator('#editor-workshop-place');await expect(editor.getByRole('tab',{name:'Plan',exact:true})).toHaveAttribute('aria-selected','true');await editor.locator('.writing-area').fill('A first-time visitor needs to identify the entrance.');
 await page.getByRole('button',{name:'Open Draft for this piece'}).click();await expect(editor.getByRole('tab',{name:'Draft',exact:true})).toHaveAttribute('aria-selected','true');
 await page.getByRole('button',{name:'Open Reflect for this piece'}).click();await expect(editor.getByRole('tab',{name:'Reflect',exact:true})).toHaveAttribute('aria-selected','true');
});

test('planning material can be carried forward into Plan without becoming an article draft',async({page})=>{
 await page.goto('/#lesson/generate-ideas');await page.locator('.exercise').last().locator('.writing-area').fill('Question: how do I organise our shared shopping list?');
 await page.goto('/#lesson/narrow-topic');await page.getByLabel('Choose earlier writing',{exact:true}).selectOption('generate-ideas:exercise:2');await page.getByLabel('Use it as',{exact:true}).selectOption('plan');await page.getByRole('button',{name:'Bring this writing into the revision area'}).click();
 const editor=page.locator('#editor-narrow-topic');await expect(editor.getByRole('tab',{name:'Plan',exact:true})).toHaveAttribute('aria-selected','true');await expect(editor.locator('.writing-area')).toHaveValue('Question: how do I organise our shared shopping list?');await editor.getByRole('tab',{name:'Draft',exact:true}).click();await expect(editor.locator('.writing-area')).toHaveValue('');
});
