'use client';
import { ReactNode, useEffect, useState } from 'react';
import { routine } from '../content/practice-plan';
import { PracticeDay, Workbook } from '../lib/workbook';
import { startingEssay } from '../content/reading';
import { byId } from '../content/curriculum';

export type ChecklistProps = {book:Workbook;resumeId:string;update:(day:string,value:PracticeDay)=>void;primary?:boolean;children?:ReactNode};

export const localDay = () => {
 const now=new Date();
 return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
};

export default function DailyChecklist({book,resumeId,update,primary=false,children}:ChecklistProps){
 const [today,setToday]=useState(localDay);
 useEffect(()=>{
  const refresh=()=>setToday(localDay());
  const interval=window.setInterval(refresh,30000);
  window.addEventListener('focus',refresh);document.addEventListener('visibilitychange',refresh);
  return()=>{window.clearInterval(interval);window.removeEventListener('focus',refresh);document.removeEventListener('visibilitychange',refresh);};
 },[]);
 const day=book.practice?.[today]||{checked:[],minutes:90};
 const short=day.minutes===30;
 const recent=Object.values(book.drafts).filter(d=>d.id===d.lessonId&&d.text.trim()).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt))[0];
 const revisionId=recent?.lessonId||'practice-dishes';
 const reflectionId=recent?.lessonId||'practice-explanation';
 const actions:Record<string,{label:string;href:string;context?:string}>={
  learn:{label:'Open current lesson',href:`#lesson/${resumeId}/learn`,context:byId[resumeId].title},
  write:{label:'Open writing assignment',href:'#lesson/practice-explanation/text'},
  revise:{label:'Open draft to revise',href:`#lesson/${revisionId}/text`,context:byId[revisionId].title},
  reflect:{label:'Open reflection notes',href:`#lesson/${reflectionId}/reflection`,context:byId[reflectionId].title},
 };

 const Title=primary?'h1':'h2';
 return (
<section className={`daily-practice${primary?' home-checklist':''}`} aria-labelledby="routine-title"><div className="routine-heading"><div><Title id="routine-title">Daily checklist</Title><p><time dateTime={today}>{new Date(`${today}T12:00:00`).toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'})}</time></p></div><fieldset className="routine-duration"><legend>Time available</legend>{([90,30] as const).map(minutes=><label key={minutes}><input type="radio" name="routine-duration" value={minutes} checked={day.minutes===minutes} onChange={()=>update(today,{...day,minutes})}/>{minutes} minutes</label>)}</fieldset></div>
   {children}
   <p className="routine-progress" role="status" aria-live="polite">{day.checked.length} of {routine.length} activities checked</p>
   <ul className="routine-list">{routine.map(step=><li key={step.id}>
    <label><input type="checkbox" checked={day.checked.includes(step.id)} onChange={e=>update(today,{...day,checked:e.target.checked?[...day.checked,step.id]:day.checked.filter(id=>id!==step.id)})}/><span><strong>{step.title}</strong><small>{step.text}</small></span><span className="routine-minutes">{short?step.shortMinutes:step.minutes} min</span></label>
    {step.id==='read'?<><div className="checklist-task"><a href={startingEssay.url} target="_blank" rel="noopener noreferrer">Read: {startingEssay.title}<span className="sr-only"> (opens in a new tab)</span></a><small>{startingEssay.writer} — notice how he gives reasons for an everyday preference.</small></div><div className="checklist-task"><a href="#writers">Browse more writers and free readings by category</a></div></>:<div className="checklist-task"><a href={actions[step.id].href}>{actions[step.id].label}</a>{actions[step.id].context&&<small>{actions[step.id].context}</small>}</div>}
   </li>)}</ul>
   <div className="routine-footer"><button className="small-button" disabled={!day.checked.length} onClick={()=>update(today,{...day,checked:[]})}>Reset today’s checklist</button><a href="#writing">Open my drafts</a><a href="#notebook">Record a practice note</a></div><p className="quiet-note">Saved automatically. Starts fresh each day.</p>
  </section>
 );
}
