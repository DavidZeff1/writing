import { byId } from '../content/curriculum';
import { Lesson } from '../content/types';
export const STORAGE_KEY = 'writing-room:v1';
export type Fields = { text:string; plan:string; feedback:string; reflection:string };
export type Snapshot = Fields & { id:string; label:string; savedAt:string };
export type Draft = Fields & { id:string; lessonId:string; title:string; updatedAt:string; revisions:Snapshot[] };
export type Weakness = { id:string; text:string; lessonId:string; evidence:string; resolved:boolean };
export type Workbook = { version:1; drafts:Record<string,Draft>; completed:string[]; lastLesson:string; weaknesses:Weakness[] };
export const blankFields:Fields = {text:'',plan:'',feedback:'',reflection:''};
export const emptyWorkbook = ():Workbook => ({version:1,drafts:{},completed:[],lastLesson:'baseline',weaknesses:[]});
export const makeDraft = (id:string,lessonId:string,title:string):Draft => ({...blankFields,id,lessonId,title,updatedAt:new Date().toISOString(),revisions:[]});
export const uid = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const record = (v:unknown):v is Record<string,unknown> => !!v && typeof v==='object' && !Array.isArray(v);
const str = (v:unknown):v is string => typeof v==='string';
const fields = (v:Record<string,unknown>) => ['text','plan','feedback','reflection'].every(k=>str(v[k]));
const date = (v:unknown) => str(v) && Number.isFinite(Date.parse(v));
// Reject malformed backups before any state changes. Text is always rendered as text.
export function validateWorkbook(raw:unknown):Workbook {
 if(!record(raw) || raw.version!==1 || !record(raw.drafts) || !Array.isArray(raw.completed) || !raw.completed.every(x=>str(x)&&!!byId[x]) || !str(raw.lastLesson) || !byId[raw.lastLesson] || !Array.isArray(raw.weaknesses)) throw new Error('This is not a supported Writing Room backup (version 1).');
 if(Object.keys(raw.drafts).length>10000 || raw.weaknesses.length>10000) throw new Error('This backup contains too many records.');
 for(const [key,value] of Object.entries(raw.drafts)) {
  if(!record(value)||value.id!==key||!str(value.lessonId)||!byId[value.lessonId]||!str(value.title)||!fields(value)||!date(value.updatedAt)||!Array.isArray(value.revisions)) throw new Error('A draft in this backup is incomplete or invalid.');
  if(key!==value.lessonId&&key!==`${value.lessonId}:extra`&&!(key.startsWith(`${value.lessonId}:exercise:`)&&/^\d+$/.test(key.slice(`${value.lessonId}:exercise:`.length)))) throw new Error('A draft has an invalid assignment identifier.');
  for(const rev of value.revisions) if(!record(rev)||!fields(rev)||!str(rev.id)||!str(rev.label)||!date(rev.savedAt)) throw new Error('A saved revision in this backup is invalid.');
 }
 for(const w of raw.weaknesses) if(!record(w)||!str(w.id)||!str(w.text)||!str(w.evidence)||!str(w.lessonId)||!byId[w.lessonId]||typeof w.resolved!=='boolean') throw new Error('A practice note in this backup is invalid.');
 // JSON round-trip strips inherited properties and ensures a plain, serialisable value.
 return JSON.parse(JSON.stringify(raw)) as Workbook;
}
export function mergeWorkbook(current:Workbook,incoming:Workbook):Workbook {
 const drafts = {...current.drafts};
 for(const [id,imported] of Object.entries(incoming.drafts)) {
  const local=drafts[id];
  if(!local) { drafts[id]=imported; continue; }
  const revisions=[...local.revisions];
  for(const r of imported.revisions) if(!revisions.some(x=>x.id===r.id && JSON.stringify(x)===JSON.stringify(r))) revisions.push({...r,id:revisions.some(x=>x.id===r.id)?uid():r.id});
  const differs=['text','plan','feedback','reflection'].some(k=>local[k as keyof Fields]!==imported[k as keyof Fields]);
  const alreadyKept=revisions.some(r=>r.savedAt===imported.updatedAt&&['text','plan','feedback','reflection'].every(k=>r[k as keyof Fields]===imported[k as keyof Fields]));
  if(differs&&!alreadyKept) {
   revisions.push({text:imported.text,plan:imported.plan,feedback:imported.feedback,reflection:imported.reflection,id:uid(),label:'Imported working draft — local draft kept',savedAt:imported.updatedAt});
  }
  drafts[id]={...local,revisions};
 }
 const weaknesses=[...current.weaknesses];
 for(const w of incoming.weaknesses) if(!weaknesses.some(x=>JSON.stringify(x)===JSON.stringify(w))) weaknesses.push({...w,id:weaknesses.some(x=>x.id===w.id)?uid():w.id});
 return {...current,drafts,completed:[...new Set([...current.completed,...incoming.completed])],weaknesses};
}
export function feedbackRequest(lesson:Lesson,draft:Draft,assignment?:string):string {
 const rubric=lesson.rubric?.map(c=>`${c.name}: ${c.meets}\nIf developing: ${c.developing}`).join('\n\n') || lesson.checklist.map(c=>`- ${c}`).join('\n');
 return `WRITING FEEDBACK REQUEST\n\nAssignment: ${assignment||lesson.assignment||`Revision exercise: ${lesson.revision}`}\n\nLesson: ${lesson.title}\nObjective: ${lesson.objective}\n${lesson.material?`\nBackground material:\n${lesson.material}\n`:''}\nRubric / review criteria:\n${rubric}\n\nPlease assess the actual writing, not completion, checkboxes, or word count. Do not assign a mastery label.\n1. Identify what is working, with a specific passage and its effect on the reader.\n2. Identify the TWO most important weaknesses. Point to specific passages, explain their effect on the intended reader, and prioritise meaning, development, and structure before minor editing.\n3. Give me one focused revision task I can attempt myself.\n4. Let me attempt the revision BEFORE supplying any rewritten example. Do not rewrite the draft in your first response.\n5. Do not invent facts or sources. If a factual claim needs checking, identify what must be verified.\n\nPlanning / intended reader:\n${draft.plan||'(not recorded)'}\n\nDRAFT:\n${draft.text||'(draft not yet written)'}\n\nMy feedback notes / questions:\n${draft.feedback||'(none yet)'}\n\nMy reflection / assistance used:\n${draft.reflection||'(not recorded)'}`;
}
export function writingText(d:Draft):string {
 return `${d.title}\n\n${d.text}\n\n--- Planning ---\n${d.plan}\n\n--- Feedback notes ---\n${d.feedback}\n\n--- Reflection and revision reasons ---\n${d.reflection}`;
}
