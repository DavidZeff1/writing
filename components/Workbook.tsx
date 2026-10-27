'use client';
import { useEffect, useRef, useState } from 'react';
import { byId, lessons, units } from '../content/curriculum';
import { Lesson } from '../content/types';
import { isPracticeAssignment, practiceAssignments } from '../content/practice-plan';
import PracticePlan from './PracticePlan';
import DailyChecklist from './DailyChecklist';
import WriterArchives from './WriterArchives';
import { sectionGuidance } from '../content/guidance';
import { blankFields, Draft, emptyWorkbook, feedbackRequest, Fields, makeDraft, mergeWorkbook, Snapshot, STORAGE_KEY, uid, validateWorkbook, Workbook as Book, writingText } from '../lib/workbook';

type LessonTarget=keyof Fields|'learn'|'practice'|'review';
type View={page:'home'|'curriculum'|'writers'|'writing'|'notebook'|'backup'|'plan'|'lesson';id?:string;target?:LessonTarget};
const parseView=():View=>{
 const [page,id,target]=window.location.hash.slice(1).split('/');
 if(page==='lesson'&&byId[id])return {page:'lesson',id,target:['text','plan','feedback','reflection','learn','practice','review'].includes(target)?target as LessonTarget:undefined};
 if(['curriculum','writers','writing','notebook','backup','plan'].includes(page))return {page:page as View['page']};
 return {page:'home'};
};
const formatDate=(s:string)=>new Date(s).toLocaleString(undefined,{dateStyle:'medium',timeStyle:'short'});
function download(name:string,content:string,type='text/plain'){
 const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
const label=(l:Lesson)=>isPracticeAssignment(l.id)?'Practice plan assignment':l.kind==='baseline'?'Starting point':l.kind==='portfolio'?'Independent work':l.kind==='checkpoint'?'Fresh assignment':l.kind==='workshop'?'Combined practice':`Skill ${units[l.unit].lessons.filter(x=>!x.kind).findIndex(x=>x.id===l.id)+1}`;

export default function Workbook(){
 const [book,setBook]=useState<Book>(emptyWorkbook);const bookRef=useRef(book);
 const [ready,setReady]=useState(false);const [view,setView]=useState<View>({page:'home'});
 const [save,setSave]=useState('Loading your workbook…');const [error,setError]=useState('');
 const blocked=useRef(false);const unreadable=useRef(false);const rawRecovery=useRef('');const heading=useRef<HTMLElement>(null);const firstHash=useRef(true);const entryTarget=useRef('');
 const [notice,setNotice]=useState('');const [pending,setPending]=useState<Book|null>(null);
 const [query,setQuery]=useState('');const [filter,setFilter]=useState('all');const [writingFilter,setWritingFilter]=useState('all');
 const [note,setNote]=useState('');const [evidence,setEvidence]=useState('');const [noteLesson,setNoteLesson]=useState('complete-thought');
 const [copyText,setCopyText]=useState('');

 useEffect(()=>{
  if(!copyText)return;
  const frame=requestAnimationFrame(()=>{const area=document.getElementById('manual-copy');area?.focus({preventScroll:true});area?.scrollIntoView({block:'center'});});
  return()=>cancelAnimationFrame(frame);
 },[copyText]);

 useEffect(()=>{
  try{const raw=localStorage.getItem(STORAGE_KEY);if(raw){rawRecovery.current=raw;const data=validateWorkbook(JSON.parse(raw));bookRef.current=data;setBook(data);}setSave('Saved on this device');}
  catch{blocked.current=true;unreadable.current=true;setError('Your saved workbook could not be read. It has not been overwritten. Download the stored data below or import a valid backup to recover. Your current edits can still be copied or exported.');setSave('Not saved to this device');}
  setView(parseView());setReady(true);
  const hash=()=>{setView(parseView());setNotice('');setCopyText('');window.scrollTo(0,0);};
  const storage=(e:StorageEvent)=>{if(e.key===STORAGE_KEY||e.key===null){blocked.current=true;setError('Another tab changed this workbook. To protect both versions, saving here is paused. Export this tab’s work, then reload to load the other tab. You can merge the exported backup afterwards.');setSave('Saving paused — another tab changed the workbook');}};
  window.addEventListener('hashchange',hash);window.addEventListener('storage',storage);
  return()=>{window.removeEventListener('hashchange',hash);window.removeEventListener('storage',storage);};
 },[]);
 function commit(update:(b:Book)=>Book){
  const next=update(bookRef.current);bookRef.current=next;setBook(next);
  if(blocked.current){setSave('In memory only — export a backup');return;}
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(next));setSave('Saved on this device');setError('');}
  catch{setSave('Not saved — export a backup');setError('This browser could not save your latest changes. Storage may be full or unavailable. Your edits are still here in this tab: download your writing or export a backup before closing it.');}
 }
 useEffect(()=>{
  if(!ready)return;
  if(view.page==='lesson'&&entryTarget.current){
   const editor=document.getElementById(`editor-${entryTarget.current}`);let parent=editor?.parentElement;
   while(parent){if(parent instanceof HTMLDetailsElement)parent.open=true;parent=parent.parentElement;}
   editor?.scrollIntoView({block:'start'});editor?.querySelector('textarea')?.focus({preventScroll:true});entryTarget.current='';return;
  }
  if(view.page==='lesson'&&view.target&&view.id){
   const id=view.id;const target=view.target;
   const frame=requestAnimationFrame(()=>{
    const stage=['text','plan','feedback','reflection'].includes(target);
    if(stage)window.dispatchEvent(new CustomEvent('writing-room-stage',{detail:{id,tab:target}}));
    const section=stage?'main-draft':target==='practice'&&!byId[id].exercises.length?'assignment':target;
    const element=document.getElementById(section)||document.getElementById('main-draft');
    element?.scrollIntoView({block:'start'});
    if(stage)document.getElementById('main-draft-text')?.focus({preventScroll:true});else element?.focus({preventScroll:true});
   });
   firstHash.current=false;return()=>cancelAnimationFrame(frame);
  }
  if(firstHash.current){firstHash.current=false;return;}
  heading.current?.focus({preventScroll:true});
 // View changes, rather than each keystroke, move keyboard focus.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[view,ready]);
 const go=(id:string)=>`#lesson/${id}`;
 const changeDraft=(id:string,lessonId:string,title:string,field:keyof Fields,value:string)=>commit(b=>{
  const d=b.drafts[id]||makeDraft(id,lessonId,title);return {...b,lastLesson:isPracticeAssignment(lessonId)?b.lastLesson:lessonId,drafts:{...b.drafts,[id]:{...d,[field]:value,updatedAt:new Date().toISOString()}}};
 });
 function snapshot(d:Draft,name:string){
  const revision:Snapshot={text:d.text,plan:d.plan,feedback:d.feedback,reflection:d.reflection,id:uid(),label:name.trim()||'Saved revision',savedAt:new Date().toISOString()};
  commit(b=>({...b,drafts:{...b.drafts,[d.id]:{...d,revisions:[...d.revisions,revision]}}}));setNotice('Revision saved. Earlier versions are kept below.');
 }
 function restore(d:Draft,r:Snapshot){
  const safety:Snapshot={text:d.text,plan:d.plan,feedback:d.feedback,reflection:d.reflection,id:uid(),label:'Before restoring an earlier version',savedAt:new Date().toISOString()};
  commit(b=>({...b,drafts:{...b.drafts,[d.id]:{...d,text:r.text,plan:r.plan,feedback:r.feedback,reflection:r.reflection,updatedAt:new Date().toISOString(),revisions:[...d.revisions,safety]}}}));setNotice('Earlier version restored. The previous working draft is kept as a revision.');
 }
 async function copy(text:string){
  try{await navigator.clipboard.writeText(text);setNotice('Copied to clipboard.');return true;}
  catch{setCopyText(text);setNotice('Clipboard access is unavailable. Select and copy the text below.');return false;}
 }
 async function readBackup(file:File|undefined){
  if(!file)return;
  try{if(file.size>30*1024*1024)throw new Error('Choose a backup smaller than 30 MB.');const parsed=validateWorkbook(JSON.parse(await file.text()));setPending(parsed);setNotice('Backup checked. Review the merge below.');}
  catch(e){setPending(null);setNotice(e instanceof Error?e.message:'The backup could not be read.');}
 }
 const current=view.id?byId[view.id]:null;const last=lessons.find(l=>l.id===book.lastLesson)||lessons[0];
 const substantive=Object.values(book.drafts).filter(d=>d.text||d.plan||d.feedback||d.reflection||d.revisions.length);
 const isPractice=!!current&&isPracticeAssignment(current.id);
 const sequence=isPractice?practiceAssignments:lessons;
 const next=current?sequence[sequence.findIndex(l=>l.id===current.id)+1]:null;
 const resume=book.completed.includes(last.id)?lessons[lessons.findIndex(l=>l.id===last.id)+1]||last:last;
 function jump(target:string){document.getElementById(target)?.scrollIntoView({block:'start'});document.getElementById(target)?.focus({preventScroll:true});}
 function carryWriting(source:Draft,lesson:Lesson,destination:'text'|'plan'='text'){
  const savedAt=new Date().toISOString();
  commit(b=>{
   const existing=b.drafts[lesson.id]||makeDraft(lesson.id,lesson.id,lesson.title);
   const safety:Snapshot={text:existing.text,plan:existing.plan,feedback:existing.feedback,reflection:existing.reflection,id:uid(),label:'Before bringing in earlier writing',savedAt};
   const revisions=existing.text||existing.plan||existing.feedback||existing.reflection?[...existing.revisions,safety]:existing.revisions;
   const carried=destination==='plan'?{text:'',plan:[source.plan,source.text].filter(Boolean).join('\n\n')}:{text:source.text,plan:source.plan};
   const original:Snapshot={...carried,feedback:'',reflection:'',id:uid(),label:`Before revision — from ${source.title}`,savedAt};
   return {...b,lastLesson:isPracticeAssignment(lesson.id)?b.lastLesson:lesson.id,drafts:{...b.drafts,[lesson.id]:{...existing,...carried,feedback:'',reflection:'',revisions:[...revisions,original],updatedAt:savedAt}}};
  });
  setNotice('Writing copied into this lesson. The source is unchanged, and a before-revision snapshot is saved.');
  requestAnimationFrame(()=>{window.dispatchEvent(new CustomEvent('writing-room-stage',{detail:{id:lesson.id,tab:destination}}));jump('main-draft');document.getElementById('main-draft-text')?.focus({preventScroll:true});});
 }

 return <>
 <a className="skip" href="#main-content" onClick={e=>{e.preventDefault();heading.current?.focus();}}>Skip to content</a>
 <header className="site-header"><div className="header-inner"><a href="#home" className="brand" aria-label="The writing room home">The writing room</a><nav aria-label="Main navigation"><a href="#home" aria-current={view.page==='home'?'page':undefined}>Home</a><a href="#plan" aria-current={view.page==='plan'||isPractice?'page':undefined}>Practice plan</a><a href="#curriculum" aria-current={view.page==='curriculum'||view.page==='lesson'&&!isPractice?'page':undefined}>Curriculum</a><a href="#writers" aria-current={view.page==='writers'?'page':undefined}>Writers</a><a href="#writing" aria-current={view.page==='writing'?'page':undefined}>My writing</a><a href="#notebook" aria-current={view.page==='notebook'?'page':undefined}>Practice notes</a></nav></div></header>
 <main id="main-content" ref={heading} tabIndex={-1} className={view.page==='lesson'?'lesson-main':'page-main'}>
 {error&&<div className="error" role="alert"><strong>Keep a copy of your work.</strong><p>{error}</p><a href="#backup">Open backups and recovery</a></div>}
 {!ready?<p className="loading" role="status">Opening your workbook…</p>:<>
 {view.page==='home'&&<div className="home-workspace">
 <DailyChecklist primary resumeId={resume.id} book={book} update={(day,value)=>commit(b=>({...b,practice:{...b.practice,[day]:value}}))}>
  <div className="checklist-actions"><a className="button primary" href={go(resume.id)} onClick={()=>commit(b=>({...b,lastLesson:resume.id}))}>Continue learning</a><span>{resume.title}</span></div>
 </DailyChecklist>
 <section className="home-assignments"><h2>Writing assignments</h2><ul>{practiceAssignments.map(l=><li key={l.id}><a href={go(l.id)}>{l.title}</a></li>)}</ul><a href="#plan">View the full practice plan</a></section>
 </div>}

 {view.page==='plan'&&<PracticePlan book={book} resumeId={resume.id} update={(day,value)=>commit(b=>({...b,practice:{...b.practice,[day]:value}}))}/>}

 {view.page==='writers'&&<><div className="page-title"><h1>Writers</h1><p className="lead">Explore journalism, essays, satire, fiction, science, and unconventional voices.</p></div><WriterArchives/></>}

 {view.page==='curriculum'&&<>
 <div className="page-title"><h1>The curriculum</h1><p className="lead">Choose a lesson or continue from your saved place.</p></div>
 <div className="course-note"><a href={go(resume.id)} onClick={()=>commit(b=>({...b,lastLesson:resume.id}))}>Your next page: {resume.title}</a><details className="course-instructions"><summary>How to use the course</summary><ol><li>Start with a short unassisted piece and keep its first draft.</li><li>Follow the lessons in order. Practise one skill, then combine skills in workshops. Checkpoints give you fresh material.</li><li>Finish with four independent articles and a portfolio review.</li></ol><p>Try the exercises, review a passage, and revise before choosing “Next in the course.” Revisit a skill when you need more practice.</p></details></div>
 <label className="search-label" htmlFor="lesson-search">Find a lesson or skill</label><input id="lesson-search" type="search" placeholder="Try clarity, sources, or endings" value={query} onChange={e=>setQuery(e.target.value)}/>
 <div className="filter-row" aria-label="Filter curriculum">{[['all','Everything'],['lesson','Lessons'],['workshop','Workshops'],['checkpoint','Checkpoints'],['portfolio','Portfolio']].map(([v,t])=><button key={v} className={filter===v?'filter active':'filter'} onClick={()=>setFilter(v)} aria-pressed={filter===v}>{t}</button>)}</div>
 {units.map(u=>{
  const shown=u.lessons.filter(l=>(filter==='all'||(l.kind||'lesson')===filter)&&`${l.title} ${l.objective} ${u.title} ${l.explanation.join(' ')}`.toLowerCase().includes(query.toLowerCase()));
  return shown.length?<section className="unit" key={u.number}><div className="unit-heading"><span className="unit-number">{u.number===0?'Start':u.number===11?'Portfolio':String(u.number).padStart(2,'0')}</span><div><h2>{u.title}</h2><p>{u.description}</p><details className="unit-guide"><summary>What you will work on in this section</summary><p>{sectionGuidance[u.number].work}</p><p><strong>What you will make:</strong> {sectionGuidance[u.number].outcome}</p></details></div></div><ol className="lesson-list">{shown.map(l=><li key={l.id}><a href={go(l.id)}><span className="completion-dot" aria-hidden="true">{book.completed.includes(l.id)?'✓':''}</span><span>{l.title}<small>{l.kind?label(l):l.objective}{l.id===resume.id?' · Your next page':''}</small></span><span className="row-end">{book.completed.includes(l.id)?'Marked complete':label(l)} <span aria-hidden="true">↗</span></span></a></li>)}</ol></section>:null;
 })}
 {!lessons.some(l=>(filter==='all'||(l.kind||'lesson')===filter)&&`${l.title} ${l.objective} ${units[l.unit].title} ${l.explanation.join(' ')}`.toLowerCase().includes(query.toLowerCase()))&&<p className="empty">No lessons match. Try a broader word or choose Everything.</p>}
 </>}

 {view.page==='lesson'&&current&&<div className="lesson-layout">
 <aside className="lesson-sidebar">{isPractice?<><a href="#plan" className="back-link">‹ Your practice plan</a><nav aria-label="Practice plan assignments">{practiceAssignments.map(l=><a key={l.id} href={go(l.id)} aria-current={current.id===l.id?'page':undefined}>{l.title}</a>)}</nav></>:<><a href="#curriculum" className="back-link">‹ All skills</a><p className="eyebrow">{units[current.unit].title}</p><nav aria-label="Lessons in this section">{units[current.unit].lessons.map(l=><a key={l.id} href={go(l.id)} aria-current={current.id===l.id?'page':undefined}><span>{book.completed.includes(l.id)?'✓':<span className="tiny-dot"/>}</span>{l.title}</a>)}</nav><a href="#notebook">Recurring weaknesses</a></>}</aside>
 <article className="lesson-reading" key={current.id}>
 <div className="lesson-top"><span>{isPractice?'Your practice plan':current.unit===0?'Start':current.unit===11?'Portfolio':`Section ${current.unit} of 10`} · {label(current)}{!isPractice&&<> · Page {units[current.unit].lessons.findIndex(l=>l.id===current.id)+1} of {units[current.unit].lessons.length}</>}</span><span>{isPractice?'Practice alongside the course':book.completed.includes(current.id)?'Marked complete by you':book.lastLesson===current.id?'Your current lesson':<button className="small-button" onClick={()=>{commit(b=>({...b,lastLesson:current.id}));setNotice('Saved as your current lesson. Continue learning will return here.');}}>Set as my current lesson</button>}</span></div>
 <h1>{current.title}</h1><p className="objective">{current.objective}</p>
 <section id="learn" tabIndex={-1} className="prose" aria-label="Learn">{current.explanation.map((p,i)=><p key={i}>{p}</p>)}</section>
 {current.material&&<section className="background"><h2>Source material</h2><p>{current.material}</p></section>}
 {current.assignment&&<section id="assignment" tabIndex={-1} className="assignment"><h2>Your assignment</h2><p>{current.assignment}</p><a className="text-link" href="#main-draft" onClick={e=>{e.preventDefault();window.dispatchEvent(new CustomEvent('writing-room-stage',{detail:{id:current.id,tab:'text'}}));jump('main-draft');document.getElementById('main-draft-text')?.focus({preventScroll:true});}}>Go to the writing area ↓</a></section>}
 {current.examples.length>0&&(current.kind==='checkpoint'?<details className="reveal"><summary>After your first attempt: see a criterion example</summary><Examples lesson={current}/></details>:<section><h2>Look at the choices</h2><Examples lesson={current}/></section>)}
 {current.exercises.length>0&&<section id="practice" tabIndex={-1} className="practice-section"><h2>{current.kind?'Steps for this assignment':'Try the exercises in order'}</h2>{current.exercises.map((e,i)=><section key={i} className="exercise"><div className="exercise-title"><span>{i+1}</span><h3>{e.title}</h3></div><p>{e.prompt}</p><details className="reveal"><summary>Show a hint</summary><p>{e.hint}</p></details><details className="reveal"><summary>Show a sample response</summary><p>{e.sample}</p></details>{!current.kind||book.drafts[`${current.id}:exercise:${i}`]?<>{current.kind&&<p className="legacy-step-note">Your saved step notes from an earlier visit. Use the main writing area below for the complete piece.</p>}<Editor key={`${current.id}:exercise:${i}`} id={`${current.id}:exercise:${i}`} lesson={current} title={`${current.title} — ${e.title}`} assignment={e.prompt} compact book={book} save={save} change={changeDraft} snapshot={snapshot} restore={restore} copy={copy}/></>:<button className="small-button" onClick={()=>{window.dispatchEvent(new CustomEvent('writing-room-stage',{detail:{id:current.id,tab:i===0?'plan':i===1?'text':'reflection'}}));jump('main-draft');document.getElementById('main-draft-text')?.focus({preventScroll:true});}}>Open {i===0?'Plan':i===1?'Draft':'Reflect'} for this piece</button>}</section>)}</section>}
 <section id="review" tabIndex={-1} className="review-section"><h2>{current.kind==='baseline'?'After writing: keep your starting point':current.kind?'Review your piece':'Choose writing to revise'}</h2>{!current.kind&&<WritingChooser lesson={current} drafts={substantive} carry={carryWriting}/>}<ul className="review-list">{current.checklist.map((q,i)=><li key={i}>{q}</li>)}</ul></section>
 {current.rubric&&<section className="rubric"><h2>A rubric for review</h2>{current.rubric.map((r,i)=><div className="rubric-row" key={i}><h3>{r.name}</h3><p><strong>Meeting the criterion:</strong> {r.meets}</p><p><strong>Still developing:</strong> {r.developing}</p><a href={go(r.revisit)}>Practise: {byId[r.revisit]?.title}</a></div>)}</section>}
 <section className="revision-task"><h2>{current.kind==='baseline'?'Keep this attempt before making changes':'Your revision task'}</h2><p>{current.revision}</p></section>
 <section id="main-draft" tabIndex={-1} className="main-draft"><h2>{current.kind==='baseline'?'Your first piece':current.kind?'Your article & process':'Your revision & notes'}</h2>{!!current.kind&&current.kind!=='baseline'&&<WritingChooser lesson={current} drafts={substantive} carry={carryWriting}/>}<Editor key={current.id} id={current.id} lesson={current} title={current.title} book={book} save={save} change={changeDraft} snapshot={snapshot} restore={restore} copy={copy}/></section>
 <details className="extra-practice"><summary>Optional extra practice</summary><p>{current.extra}</p><Editor key={`${current.id}:extra`} id={`${current.id}:extra`} lesson={current} title={`${current.title} — extra practice`} assignment={current.extra} compact book={book} save={save} change={changeDraft} snapshot={snapshot} restore={restore} copy={copy}/></details>
 <section id="next-step" tabIndex={-1} className="lesson-finish"><button className={book.completed.includes(current.id)?'button complete':'button'} onClick={()=>commit(b=>({...b,lastLesson:isPractice?b.lastLesson:current.id,completed:b.completed.includes(current.id)?b.completed.filter(x=>x!==current.id):[...b.completed,current.id]}))}>{book.completed.includes(current.id)?'Marked complete · undo':'Mark lesson complete'}</button>{next&&<a className="button primary next-lesson" href={go(next.id)} onClick={()=>commit(b=>({...b,lastLesson:isPractice?b.lastLesson:next.id}))}><span>{isPractice?'Next in your practice plan':'Next in the course'}<br/><strong>{next.title}</strong></span><span aria-hidden="true">↗</span></a>}<a className="text-link" href="#notebook" onClick={()=>setNoteLesson(current.id)}>Record a recurring weakness</a></section>
 <details className="transfer"><summary>Related practice</summary><p>{current.transfer.text}</p><a href={go(current.transfer.lesson)}>{byId[current.transfer.lesson]?.title} ↗</a></details>
 </article></div>}

 {view.page==='writing'&&<><div className="page-title"><h1>My writing</h1><p className="lead">Your drafts, practice responses, and saved revisions.</p></div><div className="writing-toolbar"><label htmlFor="writing-filter">Show</label><select id="writing-filter" value={writingFilter} onChange={e=>setWritingFilter(e.target.value)}><option value="all">All writing</option><option value="main">Articles & main drafts</option><option value="exercise">Practice responses</option></select><a href="#backup">Export a complete backup</a></div>
 {!substantive.length?<div className="empty"><h2>No saved writing</h2><p>Begin with a short unassisted piece. Your writing will appear here as you type.</p><a className="button" href={go('baseline')}>Open the starting assignment</a></div>:<div className="writing-list">{substantive.filter(d=>writingFilter==='all'||(writingFilter==='main'?!d.id.includes(':'):d.id.includes(':'))).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)).map(d=><a className="writing-row" key={d.id} href={go(d.lessonId)} onClick={()=>{entryTarget.current=d.id;}}><div><span className="draft-type">{d.id.includes(':')?'Practice response':byId[d.lessonId]?.kind==='portfolio'?'Portfolio':'Main draft'}</span><h2>{d.title}</h2><p className="draft-preview">{d.text.slice(0,180)||'Planning and process notes saved.'}{d.text.length>180?'…':''}</p><small>Updated {formatDate(d.updatedAt)} · {d.revisions.length} saved {d.revisions.length===1?'revision':'revisions'}</small></div><span aria-hidden="true">↗</span></a>)}</div>}
 </>}

 {view.page==='notebook'&&<><div className="page-title"><h1>Practice notes</h1><p className="lead">Keep a short record of recurring weaknesses, the passages that reveal them, and the skill to practise next.</p></div><form className="note-form" onSubmit={e=>{e.preventDefault();if(!note.trim())return;const w={id:uid(),text:note.trim(),lessonId:noteLesson,evidence,resolved:false};commit(b=>({...b,weaknesses:[...b.weaknesses,w]}));setNote('');setEvidence('');setNotice('Practice note saved.');}}><label htmlFor="weakness">What keeps causing difficulty?</label><input id="weakness" value={note} onChange={e=>setNote(e.target.value)} required placeholder="For example: I state a judgment without explaining why"/><label htmlFor="weakness-evidence">A passage, feedback note, or next practice task</label><textarea id="weakness-evidence" value={evidence} onChange={e=>setEvidence(e.target.value)} rows={3} placeholder="Quote a passage and name its effect on the reader."/><label htmlFor="weakness-lesson">A lesson to revisit</label><select id="weakness-lesson" value={noteLesson} onChange={e=>setNoteLesson(e.target.value)}>{[...lessons,...practiceAssignments].map(l=><option key={l.id} value={l.id}>{l.title}</option>)}</select><button className="button primary" type="submit">Save practice note</button></form><div className="notes-list">{!book.weaknesses.length?<p className="quiet-note">No patterns recorded yet. Add a note when the same difficulty appears in more than one piece.</p>:book.weaknesses.map(w=><article className={w.resolved?'practice-note resolved':'practice-note'} key={w.id}><div><h2>{w.text}</h2><span>{w.resolved?'Less frequent — keep observing':'A focus for practice'}</span></div><p className="preserve-lines">{w.evidence}</p><a href={go(w.lessonId)}>Revisit: {byId[w.lessonId].title}</a><button className="small-button" onClick={()=>commit(b=>({...b,weaknesses:b.weaknesses.map(x=>x.id===w.id?{...x,resolved:!x.resolved}:x)}))}>{w.resolved?'Bring back to practice':'Mark as less frequent'}</button></article>)}</div></>}

 {view.page==='backup'&&<><div className="page-title"><h1>Backups & storage</h1><p className="lead">Your writing is saved in this browser. Export a backup to keep a copy elsewhere.</p></div><section className="backup-section"><h2>Keep a copy outside this browser</h2><p>Clearing website data, using a private window, changing browser, or moving to another device can remove access to your work. Export regularly. Backups contain your writing and notes as readable JSON; keep them somewhere you trust.</p><button className="button primary" onClick={()=>{download(`writing-room-backup-${new Date().toISOString().slice(0,10)}.json`,JSON.stringify(book,null,2),'application/json');setNotice('Backup download started.');}}>Export complete backup</button><p className="quiet-note">Includes all working drafts, saved revisions, process notes, practice notes, daily practice checklists, and manual completion records.</p></section><section className="backup-section"><h2>Import a backup</h2><p>We check the file before changing anything. Import merges with your current workbook. If a draft differs, your current draft stays in place and the imported version is kept in its revision history, including its process notes.</p><label className="file-label" htmlFor="backup-file">Choose a Writing Room JSON backup</label><input id="backup-file" type="file" accept=".json,application/json" onChange={e=>{readBackup(e.target.files?.[0]);e.target.value='';}}/>
 {pending&&<div className="import-preview"><h3>Ready to merge</h3><p>{Object.keys(pending.drafts).length} writing entries, {pending.completed.length} completion records, and {pending.weaknesses.length} practice notes. Existing work will be preserved.</p><button className="button" onClick={()=>{const merged=mergeWorkbook(bookRef.current,pending);if(blocked.current){download(`writing-room-merged-recovery-${new Date().toISOString().slice(0,10)}.json`,JSON.stringify(merged,null,2),'application/json');setNotice('A merged recovery backup was downloaded. Saving remains paused. Preserve this tab’s work, reload, and import the file into the current workbook.');}else{commit(()=>merged);setNotice('Backup merged. Conflicting imported drafts are available in revision history.');}setPending(null);}}>Merge backup</button><button className="small-button" onClick={()=>setPending(null)}>Cancel import</button>{unreadable.current&&<><p className="recovery-note">To recover unreadable storage, first download the original stored data below. This action downloads it again, then replaces the unreadable value with your merged, validated workbook.</p><button className="button" onClick={()=>{download('writing-room-original-stored-recovery.txt',rawRecovery.current);const merged=mergeWorkbook(bookRef.current,pending);blocked.current=false;unreadable.current=false;commit(()=>merged);setPending(null);setNotice('Recovery attempted. Check the save status; your original stored data was downloaded.');}}>Recover storage from this backup</button></>}</div>}
 </section><section className="backup-section"><h2>What leaves this device?</h2><p>The workbook sends no writing to a server. Copying a feedback request does not contact a reviewer; you decide where to paste it. If you paste it into another service, that service’s storage and privacy rules apply.</p><p>If a browser cannot save, the page will say so. Keep the tab open long enough to copy or export your changes.</p>{rawRecovery.current&&error&&<button className="button" onClick={()=>download('writing-room-stored-recovery.txt',rawRecovery.current)}>Download original stored data</button>}</section></>}
 </>}
 {copyText&&<div className="copy-fallback"><label htmlFor="manual-copy">Select and copy this text</label><textarea id="manual-copy" readOnly value={copyText} rows={10} onFocus={e=>e.target.select()}/><button onClick={()=>setCopyText('')}>Close copy area</button></div>}
 </main>
 <footer className="site-footer"><div><span className="save-indicator">{save}</span><a href="#backup">Backups & storage</a></div></footer>
 <div className="notice" role="status" aria-live="polite">{notice&&<><span>{notice}</span><button aria-label="Dismiss notification" onClick={()=>setNotice('')}>×</button></>}</div>
 </>;
}

function Examples({lesson}:{lesson:Lesson}){return <div className="examples">{lesson.examples.map((e,i)=><figure key={i}><figcaption>{e.label}</figcaption><blockquote>{e.text}</blockquote><p className="annotation"><span aria-hidden="true">↳</span> {e.note}</p></figure>)}</div>;}

function WritingChooser({lesson,drafts,carry}:{lesson:Lesson;drafts:Draft[];carry:(d:Draft,l:Lesson,destination:'text'|'plan')=>void}){
 const [choice,setChoice]=useState('');const [destination,setDestination]=useState<'text'|'plan'>(lesson.unit===3?'plan':'text');
 const available=drafts.filter(d=>d.id!==lesson.id&&(d.text||d.plan)).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
 const baseline=available.find(d=>d.id==='baseline');
 const independent=available.find(d=>d.id===`${lesson.id}:exercise:${lesson.exercises.length-1}`);
 const suggested=/baseline/i.test(lesson.revision)?baseline:independent;
 const selected=available.find(d=>d.id===(choice||suggested?.id||''));
 if(!available.length)return null;
 return <details className="writing-chooser"><summary>Use earlier writing</summary><div><label htmlFor={`source-${lesson.id}`}>Choose earlier writing</label><select id={`source-${lesson.id}`} value={selected?.id||''} onChange={e=>setChoice(e.target.value)}><option value="">Choose a response or draft</option>{available.map(d=><option key={d.id} value={d.id}>{d.id==='baseline'?'Baseline — ':''}{d.title}</option>)}</select>{selected&&<p className="source-preview">{selected.text.slice(0,160)||selected.plan.slice(0,160)}{(selected.text||selected.plan).length>160?'…':''}</p>}<label htmlFor={`destination-${lesson.id}`}>Use it as</label><select id={`destination-${lesson.id}`} value={destination} onChange={e=>setDestination(e.target.value as 'text'|'plan')}><option value="text">Draft — writing to revise</option><option value="plan">Plan — ideas or an outline to develop</option></select><button className="button" disabled={!selected} onClick={()=>selected&&carry(selected,lesson,destination)}>Bring this writing into the revision area</button><p className="quiet-note">Copies the selected writing. Existing work is kept in revision history.</p></div></details>;
}

type EditorProps={id:string;lesson:Lesson;title:string;assignment?:string;compact?:boolean;book:Book;save:string;change:(id:string,lessonId:string,title:string,field:keyof Fields,value:string)=>void;snapshot:(d:Draft,label:string)=>void;restore:(d:Draft,r:Snapshot)=>void;copy:(text:string)=>Promise<boolean>};
function Editor({id,lesson,title,assignment,compact,book,save,change,snapshot,restore,copy}:EditorProps){
 const d=book.drafts[id]||{...blankFields,id,lessonId:lesson.id,title,updatedAt:'',revisions:[]};
 const [tab,setTab]=useState<keyof Fields>('text');const [revisionLabel,setRevisionLabel]=useState('');const [compare,setCompare]=useState<string>('');const [focus,setFocus]=useState(false);
 const ref=useRef<HTMLTextAreaElement>(null);const container=useRef<HTMLDivElement>(null);const tabs: [keyof Fields,string][]=[['plan','Plan'],['text','Draft'],['feedback','Feedback'],['reflection','Reflect']];
 const selected=d.revisions.find(r=>r.id===compare);const main=id===lesson.id;
 const placeholders:Fields={plan:'Reader, purpose, main point, and outline.',text:lesson.kind==='baseline'?'Start with your own words.':'Write your draft here.',feedback:'Reader comments and changes to try.',reflection:'What did you change, and why?'};
 useEffect(()=>{const stage=(event:Event)=>{const detail=(event as CustomEvent<{id:string;tab:keyof Fields}>).detail;if(detail.id===id)setTab(detail.tab);};window.addEventListener('writing-room-stage',stage);return()=>window.removeEventListener('writing-room-stage',stage);},[id]);
 useEffect(()=>{if(!focus)return;const close=(e:KeyboardEvent)=>{if(e.key==='Escape')setFocus(false);if(e.key==='Tab'){
  const controls=Array.from(container.current?.querySelectorAll<HTMLElement>('button:not(:disabled),textarea,input,select,summary,[tabindex="0"]')||[]).filter(el=>el.tabIndex>=0&&el.getClientRects().length>0);const first=controls[0],last=controls[controls.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
 }};document.addEventListener('keydown',close);const old=document.body.style.overflow;document.body.style.overflow='hidden';ref.current?.focus();return()=>{document.removeEventListener('keydown',close);document.body.style.overflow=old;container.current?.querySelector<HTMLButtonElement>('.editor-head button')?.focus({preventScroll:true});};},[focus]);
 function tabKey(e:React.KeyboardEvent<HTMLButtonElement>,i:number){let n=i;if(e.key==='ArrowRight')n=(i+1)%4;else if(e.key==='ArrowLeft')n=(i+3)%4;else if(e.key==='Home')n=0;else if(e.key==='End')n=3;else return;e.preventDefault();setTab(tabs[n][0]);document.getElementById(`${id}-tab-${tabs[n][0]}`)?.focus();}
 async function copyFromEditor(text:string){if(!await copy(text))setFocus(false);}
 return <div ref={container} className={`${compact?'editor compact':'editor'}${focus?' focus-editor':''}`} id={`editor-${id}`} role={focus?'dialog':undefined} aria-modal={focus||undefined} aria-label={focus?`Writing focus: ${title}`:undefined}>
 <div className="editor-head"><span>{compact?'Your response':title}</span><button className="small-button" onClick={()=>setFocus(!focus)}>{focus?'Leave focus view (Esc)':'Focus view'}</button></div>
 <div className="editor-tabs" role="tablist" aria-label={`${title} writing stages`}>{tabs.map(([key,name],i)=><button key={key} id={`${id}-tab-${key}`} role="tab" aria-selected={tab===key} aria-controls={`${id}-panel`} tabIndex={tab===key?0:-1} onClick={()=>setTab(key)} onKeyDown={e=>tabKey(e,i)}>{name}</button>)}</div>
 <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${tab}`}>
 <label className="sr-only" htmlFor={main?'main-draft-text':`${id}-text`}>{title}: {tabs.find(x=>x[0]===tab)?.[1]}</label><textarea ref={ref} id={main?'main-draft-text':`${id}-text`} className="writing-area" value={d[tab]} onChange={e=>change(id,lesson.id,title,tab,e.target.value)} placeholder={compact&&tab==='text'?'Try your response here before opening the sample.':placeholders[tab]} spellCheck rows={compact?5:13}/>
 </div>
 <div className="editor-meta"><span>{save}</span><span>{d.text.trim()?`${d.text.trim().split(/\s+/).length} words · for reference only`:'0 words'}</span></div>
 <div className="editor-actions"><button onClick={()=>snapshot(d,lesson.kind==='baseline'?'Baseline — before feedback':'Before revision')} disabled={!d.text&&!d.plan&&!d.feedback&&!d.reflection}>Save revision now</button><button onClick={()=>copyFromEditor(d.text)} disabled={!d.text}>Copy writing</button><button onClick={()=>download(`${id.replace(/[^a-z0-9-]/gi,'-')}.txt`,writingText(d))} disabled={!d.text&&!d.plan&&!d.feedback&&!d.reflection}>Download writing</button><button onClick={()=>copyFromEditor(feedbackRequest(lesson,d,assignment))} disabled={!d.text}>Copy feedback request</button></div>
 <details className="revision-history"><summary>Save & compare revisions {d.revisions.length>0&&`(${d.revisions.length})`}</summary><p>Autosave keeps the working draft. A saved revision preserves a separate snapshot of the draft and all process notes. Save before making important changes.</p><div className="snapshot-form"><label className="sr-only" htmlFor={`${id}-revision-name`}>Revision name</label><input id={`${id}-revision-name`} value={revisionLabel} onChange={e=>setRevisionLabel(e.target.value)} placeholder={lesson.kind==='baseline'?'Baseline — before feedback':'For example: before restructuring'}/><button className="button" disabled={!d.text&&!d.plan&&!d.feedback&&!d.reflection} onClick={()=>{snapshot(d,revisionLabel|| (lesson.kind==='baseline'?'Baseline — before feedback':'Saved revision'));setRevisionLabel('');}}>Save revision</button></div>
 {d.revisions.length>0&&<><label htmlFor={`${id}-revision-select`}>Compare an earlier version with the working draft</label><select id={`${id}-revision-select`} value={compare} onChange={e=>setCompare(e.target.value)}><option value="">Choose a saved revision</option>{[...d.revisions].reverse().map((r,i)=><option key={r.id} value={r.id}>{r.label} · {formatDate(r.savedAt)} · version {d.revisions.length-i}</option>)}</select>{selected&&<><div className="comparison"><section><h4>{selected.label}</h4><p className="preserve-lines">{selected.text||'(No draft text in this version)'}</p></section><section><h4>Working draft</h4><p className="preserve-lines">{d.text||'(No draft text yet)'}</p></section></div><details className="reveal"><summary>Earlier planning, feedback, and reflection</summary><h4>Planning</h4><p className="preserve-lines">{selected.plan||'(None)'}</p><h4>Feedback</h4><p className="preserve-lines">{selected.feedback||'(None)'}</p><h4>Reflection</h4><p className="preserve-lines">{selected.reflection||'(None)'}</p></details><button className="small-button" onClick={()=>restore(d,selected)}>Restore this version (keep current draft as a snapshot)</button></>}</>}
 </details>
 </div>;
}

