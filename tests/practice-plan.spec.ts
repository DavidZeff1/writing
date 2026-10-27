import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { byId } from '../content/curriculum';
import { practiceAssignments, reviewDimensions } from '../content/practice-plan';
import { emptyWorkbook, mergeWorkbook, STORAGE_KEY, validateWorkbook } from '../lib/workbook';

test('practice backups migrate older workbooks, validate dates and steps, and preserve local resets',()=>{
 const old=emptyWorkbook();delete old.practice;
 expect(validateWorkbook(old).practice).toEqual({});
 const incoming={...emptyWorkbook(),practice:{'2026-10-22':{checked:['read'],minutes:90 as const},'2026-10-21':{checked:['write'],minutes:30 as const}}};
 const local={...emptyWorkbook(),practice:{'2026-10-22':{checked:[],minutes:30 as const}}};
 expect(mergeWorkbook(local,validateWorkbook(incoming)).practice).toEqual({...incoming.practice,...local.practice});
 for(const practice of [
  {'2026-02-30':{checked:[],minutes:90}},
  {'2026-10-22':{checked:['unknown'],minutes:90}},
  {'2026-10-22':{checked:['read','read'],minutes:90}},
  {'2026-10-22':{checked:[],minutes:60}},
 ])expect(()=>validateWorkbook({...old,practice})).toThrow();
 for(const assignment of practiceAssignments){expect(byId[assignment.id]).toBe(assignment);for(const criterion of assignment.rubric||[])expect(byId[criterion.revisit]).toBeTruthy();}
 for(const dimension of reviewDimensions)expect(byId[dimension.practice]).toBeTruthy();
});

test('daily routine saves, changes duration, resets only its checks, and survives backup import',async({page})=>{
 await page.goto('/');await expect(page.getByRole('heading',{level:1})).toHaveText('Daily checklist');
 await expect(page.getByRole('checkbox').first()).toBeInViewport();
 await page.getByRole('checkbox').first().check();
 await page.getByRole('link',{name:'Practice plan',exact:true}).click();
 await expect(page.getByRole('heading',{level:1})).toHaveText('Practice plan');
 await expect(page.getByRole('checkbox').first()).toBeChecked();
 await expect(page.getByRole('checkbox')).toHaveCount(5);
 await expect(page.locator('.routine-minutes')).toHaveText(['15 min','10 min','35 min','20 min','10 min']);
 await page.getByRole('checkbox').first().check();await page.getByRole('radio',{name:'30 minutes',exact:true}).check();
 await page.reload();await expect(page.getByRole('checkbox').first()).toBeChecked();
 await expect(page.locator('.routine-minutes')).toHaveText(['5 min','5 min','12 min','5 min','3 min']);
 await page.getByRole('link',{name:'Backups & storage',exact:true}).click();
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'Export complete backup'}).click();
 const exported=JSON.parse(await readFile((await (await download).path())!,'utf8'));
 expect(Object.values(exported.practice)).toEqual([{checked:['read'],minutes:30}]);
 await page.evaluate(k=>localStorage.removeItem(k),STORAGE_KEY);await page.reload();
 await page.locator('#backup-file').setInputFiles({name:'practice.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(exported))});
 await page.getByRole('button',{name:'Merge backup',exact:true}).click();
 await page.goto('/#plan');await expect(page.getByRole('checkbox').first()).toBeChecked();
 await page.getByRole('button',{name:'Reset today’s checklist'}).click();await page.reload();
 await expect(page.getByRole('checkbox').first()).not.toBeChecked();await expect(page.getByRole('radio',{name:'30 minutes',exact:true})).toBeChecked();
});

test('the checklist starts a fresh local day when midnight passes in an open tab',async({page})=>{
 await page.goto('/');const midnight=await page.evaluate(()=>new Date(2026,9,22,23,59,50).getTime());
 await page.clock.install({time:midnight});await page.goto('/#plan');
 await page.getByRole('checkbox').first().check();
 await page.clock.runFor(31000);
 await expect(page.getByRole('checkbox').first()).not.toBeChecked();
 const practice=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)!).practice,STORAGE_KEY);
 expect(practice['2026-10-22'].checked).toEqual(['read']);
 await page.getByRole('checkbox').last().check();
 expect(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)!).practice['2026-10-23'].checked,STORAGE_KEY)).toEqual(['reflect']);
});

test('checklist actions open the lesson or latest draft at the requested stage and survive reloads',async({page})=>{
 await page.goto('/#lesson/complete-thought');
 await page.getByRole('button',{name:'Set as my current lesson'}).click();
 await page.getByRole('link',{name:'Home',exact:true}).click();
 await page.getByRole('link',{name:'Open current lesson',exact:true}).click();
 await expect(page.locator('#learn')).toBeFocused();
 await page.getByRole('link',{name:'Home',exact:true}).click();
 await page.getByRole('link',{name:'Open writing assignment',exact:true}).click();
 await expect(page.locator('#main-draft-text')).toBeFocused();
 await page.locator('#main-draft-text').fill('A new independent explanation, saved from the daily checklist.');
 await page.getByRole('link',{name:'Home',exact:true}).click();
 await page.getByRole('link',{name:'Open draft to revise',exact:true}).click();
 await expect(page.locator('#main-draft-text')).toHaveValue('A new independent explanation, saved from the daily checklist.');
 await expect(page.locator('#editor-practice-explanation').getByRole('tab',{name:'Draft',exact:true})).toHaveAttribute('aria-selected','true');
 await page.getByRole('link',{name:'Home',exact:true}).click();
 await page.getByRole('link',{name:'Open reflection notes',exact:true}).click();
 await expect(page.locator('#editor-practice-explanation').getByRole('tab',{name:'Reflect',exact:true})).toHaveAttribute('aria-selected','true');
 await page.locator('#main-draft-text').fill('I replaced a vague sentence with a concrete example.');
 await page.reload();
 await expect(page.locator('#main-draft-text')).toHaveValue('I replaced a vague sentence with a concrete example.');
 await expect(page.locator('#editor-practice-explanation').getByRole('tab',{name:'Reflect',exact:true})).toHaveAttribute('aria-selected','true');
 const book=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)!),STORAGE_KEY);
 expect(book.lastLesson).toBe('complete-thought');
 expect(book.drafts['practice-explanation'].text).toBe('A new independent explanation, saved from the daily checklist.');
});

test('personal assignments preserve original writing and the course bookmark',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/#lesson/baseline');await page.locator('#main-draft-text').fill('My original piece about washing dishes.');
 await page.goto('/#lesson/complete-thought');await page.getByRole('button',{name:'Set as my current lesson'}).click();
 await page.goto('/#plan');await page.getByRole('link',{name:'Revise Doing Dishes',exact:true}).click();
 await page.getByText('Use earlier writing',{exact:true}).click();await page.getByLabel('Choose earlier writing',{exact:true}).selectOption('baseline');
 await page.getByRole('button',{name:'Bring this writing into the revision area'}).click();
 await expect(page.locator('#main-draft-text')).toHaveValue('My original piece about washing dishes.');
 await page.locator('#main-draft-text').fill('My revised piece keeps a clear reason for each step.');
 await page.getByRole('button',{name:'Save revision now',exact:true}).click();await page.getByRole('button',{name:'Mark lesson complete',exact:true}).click();
 await page.getByRole('link',{name:/Next in your practice plan/}).click();await page.locator('#main-draft-text').fill('A different everyday explanation.');
 await page.getByRole('link',{name:'Home',exact:true}).click();await page.getByRole('link',{name:'Continue learning'}).click();await expect(page).toHaveURL(/complete-thought/);
 const book=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)!),STORAGE_KEY);
 expect(book.drafts.baseline.text).toBe('My original piece about washing dishes.');
 expect(book.drafts['practice-dishes'].revisions[0].text).toBe(book.drafts.baseline.text);
 await page.getByRole('link',{name:'My writing',exact:true}).click();await page.locator('.writing-row').filter({hasText:'Revise Doing Dishes'}).click();
 await expect(page.locator('#main-draft-text')).toHaveValue('My revised piece keeps a clear reason for each step.');
 await page.goto('/#lesson/practice-review');await expect(page.getByRole('heading',{name:'A rubric for review'})).toBeVisible();
 await expect(page.locator('.rubric-row')).toHaveCount(5);
 await page.getByRole('link',{name:'Record a recurring weakness',exact:true}).click();
 await expect(page.getByLabel('A lesson to revisit')).toHaveValue('practice-review');
 await page.getByLabel('What keeps causing difficulty?').fill('My examples need more detail.');
 await page.getByRole('button',{name:'Save practice note'}).click();
 await page.getByRole('link',{name:'Revisit: Your four-week writing review'}).click();
 await expect(page.getByRole('heading',{level:1})).toHaveText('Your four-week writing review');expect(errors).toEqual([]);
});

test('practice plan and assignments fit desktop and mobile and every internal plan link resolves',async({page})=>{
 await page.setViewportSize({width:1280,height:900});await page.goto('/#plan');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 await page.screenshot({path:'test-results/desktop-practice-plan.png'});
 await page.setViewportSize({width:390,height:844});await page.goto('/#plan');
 const hrefs=await page.locator('.practice-plan a[href^="#lesson/"]').evaluateAll(links=>links.map(link=>link.getAttribute('href')!));
 for(const href of hrefs)expect(byId[href.split('/')[1]],href).toBeTruthy();
 await expect(page.getByRole('heading',{name:'Daily checklist',exact:true})).toBeInViewport();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 await page.screenshot({path:'test-results/mobile-practice-plan.png',fullPage:true});
 for(const assignment of practiceAssignments){await page.goto('/#lesson/'+assignment.id);await expect(page.getByRole('heading',{level:1})).toHaveText(assignment.title);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);}
});

