'use client';
import { units } from '../content/curriculum';
import { phases } from '../content/practice-plan';
import { ChecklistProps } from './DailyChecklist';
import DailyChecklist from './DailyChecklist';
import WriterArchives from './WriterArchives';

export default function PracticePlan({book,update,resumeId}:ChecklistProps){
 return <article className="practice-plan">
  <div className="page-title"><h1>Practice plan</h1><p>Practise five or six days a week. Use the shorter routine when time is limited.</p></div>
  <DailyChecklist book={book} update={update} resumeId={resumeId}/>

  <section className="plan-next" aria-labelledby="plan-next-title"><h2 id="plan-next-title">Begin with two short pieces</h2><ol>
   <li><h3>Return to Doing Dishes</h3><p>Preserve your original, diagnose the main weaknesses, and revise it yourself. Keep the voice and humour that make it yours.</p><a href="#lesson/practice-dishes">Revise Doing Dishes</a></li>
   <li><h3>Try a different everyday subject</h3><p>Write a fresh 250–350-word explanation. Concentrate on one skill: making every sentence clear and necessary.</p><a href="#lesson/practice-explanation">Write the new explanation</a></li>
  </ol><p className="quiet-note"><a href={`#lesson/${resumeId}`}>Return to your course page</a>.</p></section>

  <section className="plan-cycle" aria-labelledby="cycle-title"><h2 id="cycle-title">Revision process</h2><ol>{['Write','Diagnose','Revise','Feedback','Rewrite','Compare'].map(step=><li key={step}>{step}</li>)}</ol><p>Save your first draft. Identify the main problem and attempt a repair. Get specific feedback, rewrite, and compare the versions. Record what changed in Reflect.</p><p>Review the purpose, argument, content, and order before polishing sentences. <a href="https://owl.purdue.edu/owl/general_writing/the_writing_process/feedback/editor-reviewer_feedback.html">Purdue’s guide to prioritising feedback</a> explains this order of revision.</p><p>Use AI as an instructor: ask for a diagnosis, an explanation, or a targeted exercise. Try your own revision before reading its rewritten example.</p></section>

  <details className="course-phases"><summary>Course phases and suggested timetable</summary><p>These time ranges are planning guides. Keep practising a difficult skill and revisit earlier lessons when a new draft exposes a gap.</p><ol className="training-phases">{phases.map(phase=><li key={phase.title}><p className="phase-time">{phase.time}</p><h3>{phase.title}</h3><p>{phase.text}</p><div className="phase-links">{phase.units.map(number=><a key={number} href={`#lesson/${units[number].lessons[0].id}`}>{units[number].title}</a>)}</div><details><summary>What to look for before moving on</summary><p>{phase.ready}</p></details></li>)}</ol></details>

  <section className="plan-review" aria-labelledby="review-plan-title"><h2 id="review-plan-title">Review your writing every four weeks</h2><p>Write a fresh piece under similar conditions without assistance. Keep the first draft, revise it, and compare actual passages with earlier work. Note differences in topic, time, and help received.</p><p>Occasionally ask a human reader who has not been involved in drafting to give an independent response.</p><a className="button" href="#lesson/practice-review">Open the four-week review</a></section>

  <section className="plan-reading" aria-labelledby="reading-title"><h2 id="reading-title">Writer archives</h2><p>Choose one essay or column. Identify its main point, the job of each paragraph, and one choice to try in your own writing.</p><WriterArchives collapsible={false}/><p><a href="https://media.utoronto.ca/writing-an-effective-opinion-piece/">University of Toronto: Writing an Effective Opinion Piece</a></p></section>

 </article>;
}
