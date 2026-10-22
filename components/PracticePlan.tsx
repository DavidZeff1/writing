'use client';
import { useEffect, useState } from 'react';
import { units } from '../content/curriculum';
import { phases, reviewDimensions, routine } from '../content/practice-plan';
import { PracticeDay, Workbook } from '../lib/workbook';

export const localDay = () => {
 const now=new Date();
 return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
};

export default function PracticePlan({book,update,resumeId}:{book:Workbook;update:(day:string,value:PracticeDay)=>void;resumeId:string}){
 const [today,setToday]=useState(localDay);
 useEffect(()=>{
  const refresh=()=>setToday(localDay());
  const interval=window.setInterval(refresh,30000);
  window.addEventListener('focus',refresh);document.addEventListener('visibilitychange',refresh);
  return()=>{window.clearInterval(interval);window.removeEventListener('focus',refresh);document.removeEventListener('visibilitychange',refresh);};
 },[]);
 const day=book.practice?.[today]||{checked:[],minutes:90};
 const short=day.minutes===30;

 return <article className="practice-plan">
  <div className="page-title"><h1>Your writing apprenticeship</h1><p className="lead">Build clear sentences, then purposeful paragraphs, then articles worth reading. Make critical rewriting the centre of your practice.</p><p className="plan-intro">Aim for 60–90 minutes on five or six days a week. Use the shorter routine when time is tight, and move through the course when your writing shows you are ready.</p></div>

  <section className="plan-next" aria-labelledby="plan-next-title"><h2 id="plan-next-title">Begin with two short pieces</h2><ol>
   <li><h3>Return to Doing Dishes</h3><p>Preserve your original, diagnose the main weaknesses, and revise it yourself. Keep the voice and humour that make it yours.</p><a href="#lesson/practice-dishes">Revise Doing Dishes</a></li>
   <li><h3>Try a different everyday subject</h3><p>Write a fresh 250–350-word explanation. Concentrate on one skill: making every sentence clear and necessary.</p><a href="#lesson/practice-explanation">Write the new explanation</a></li>
  </ol><p className="quiet-note">These assignments sit alongside the course. Your lesson bookmark stays where you left it. <a href={`#lesson/${resumeId}`}>Return to your course page</a>.</p></section>

  <section className="daily-practice" aria-labelledby="routine-title"><div className="routine-heading"><div><h2 id="routine-title">Today’s practice</h2><p><time dateTime={today}>{new Date(`${today}T12:00:00`).toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'})}</time></p></div><fieldset className="routine-duration"><legend>Time available</legend>{([90,30] as const).map(minutes=><label key={minutes}><input type="radio" name="routine-duration" value={minutes} checked={day.minutes===minutes} onChange={()=>update(today,{...day,minutes})}/>{minutes} minutes</label>)}</fieldset></div>
   <p className="quiet-note">{short?'A shorter session keeps the same five activities. Choose one small passage or exercise.':'Read, learn, draft, revise, and reflect. Spread a longer assignment across several sessions.'}</p>
   <p className="routine-progress" role="status" aria-live="polite">{day.checked.length} of {routine.length} activities checked</p>
   <ul className="routine-list">{routine.map(step=><li key={step.id}><label><input type="checkbox" checked={day.checked.includes(step.id)} onChange={e=>update(today,{...day,checked:e.target.checked?[...day.checked,step.id]:day.checked.filter(id=>id!==step.id)})}/><span><strong>{step.title}</strong><small>{step.text}</small></span><span className="routine-minutes">{short?step.shortMinutes:step.minutes} min</span></label></li>)}</ul>
   <div className="routine-footer"><button className="small-button" disabled={!day.checked.length} onClick={()=>update(today,{...day,checked:[]})}>Reset today’s checklist</button><a href="#writing">Open my drafts</a><a href="#notebook">Record a practice note</a></div><p className="quiet-note">Checks record activity, not writing quality. They are saved with your workbook. Each local calendar day starts with a fresh checklist.</p>
  </section>

  <section className="plan-cycle" aria-labelledby="cycle-title"><h2 id="cycle-title">Finish the whole cycle</h2><ol>{['Write','Diagnose','Revise','Feedback','Rewrite','Compare'].map(step=><li key={step}>{step}</li>)}</ol><p>Draft in your own words. Identify the main problem and attempt a repair. Ask a reader for specific feedback, rewrite, and compare the versions. Use Plan, Draft, Feedback, and Reflect to keep the work together.</p><p>Review the purpose, argument, content, and order before polishing sentences. <a href="https://owl.purdue.edu/owl/general_writing/the_writing_process/feedback/editor-reviewer_feedback.html">Purdue’s guide to prioritising feedback</a> explains this order of revision.</p><p>Use AI as an instructor: ask for a diagnosis, an explanation, or a targeted exercise. Try your own revision before reading its rewritten example.</p></section>

  <section aria-labelledby="phases-title"><h2 id="phases-title">The long-term route</h2><p>These time ranges are planning guides. Keep practising a difficult skill and revisit earlier lessons when a new draft exposes a gap.</p><ol className="training-phases">{phases.map(phase=><li key={phase.title}><p className="phase-time">{phase.time}</p><h3>{phase.title}</h3><p>{phase.text}</p><div className="phase-links">{phase.units.map(number=><a key={number} href={`#lesson/${units[number].lessons[0].id}`}>{units[number].title}</a>)}</div><details><summary>What to look for before moving on</summary><p>{phase.ready}</p></details></li>)}</ol></section>

  <section className="plan-review" aria-labelledby="review-plan-title"><h2 id="review-plan-title">Review your writing every four weeks</h2><p>Write a fresh piece under similar conditions without assistance. Keep the first draft, revise it, and compare actual passages with earlier work. Note differences in topic, time, and help received.</p><dl className="review-dimensions">{reviewDimensions.map(d=><div key={d.name}><dt>{d.name}</dt><dd>{d.question}</dd></div>)}</dl><p>Occasionally ask a human reader who has not been involved in drafting to give an independent response.</p><a className="button" href="#lesson/practice-review">Open the four-week review</a></section>

  <section className="plan-reading" aria-labelledby="reading-title"><h2 id="reading-title">Read with a writer’s eye</h2><p>Study George Orwell for direct arguments, David Brooks for the development of ideas, and David Sedaris for observation, storytelling, and humour. Examine their choices without trying to borrow their personality.</p><p>For each piece, ask: What is the main point? Why does the opening work? What does each paragraph contribute? How does the writer make an abstract idea concrete?</p><ul><li><a href="https://www.orwellfoundation.com/the-orwell-foundation/orwell/essays-and-other-works/politics-and-the-english-language/">George Orwell: Politics and the English Language</a> — a starting text for examining precise language and argument.</li><li><a href="https://media.utoronto.ca/writing-an-effective-opinion-piece/">University of Toronto: Writing an Effective Opinion Piece</a> — return to this when you begin developing opinion articles.</li></ul></section>

  <details className="plan-assessment"><summary>Your starting assessment and possible milestones</summary><p>The assessment you brought to this plan rated your 227-word Doing Dishes piece 4/10 against a competent, paid newspaper columnist as the 10/10 benchmark. That is an assessment of one short piece. An argumentative article would provide more evidence about your potential as a columnist.</p><p><strong>Strengths to preserve:</strong> a recognisable voice, a sense of humour, and an instinct to explain why something matters.</p><p><strong>Skills to strengthen:</strong> sentence construction, precision, punctuation, paragraph development, and choosing what to include or leave out.</p><p>The suggested practical target was 7/10 within a year, followed by sustained work toward professional quality. The estimates below assume serious practice, study, revision, and regular critical feedback.</p><table><caption>Illustrative estimates from your plan, not predicted scores</caption><thead><tr><th scope="col">Time</th><th scope="col">Estimate</th><th scope="col">Possible development</th></tr></thead><tbody>{[
   ['Today','4/10','Understandable, engaging beginner writing'],['3 months','5/10','Clearer sentences and better paragraphs'],['6–12 months','7/10','Well-structured articles with fewer weaknesses'],['1–2 years','8/10','Confident essays with arguments, evidence, and style'],['3–5+ years','10/10','Potentially professional-calibre columns'],
  ].map(([time,score,text])=><tr key={time}><th scope="row">{time}</th><td>{score}</td><td>{text}</td></tr>)}</tbody></table><p>Progress is rarely linear. Neither writing every day nor completing this course guarantees professional quality. Use passages and reader feedback to judge progress.</p></details>
 </article>;
}
