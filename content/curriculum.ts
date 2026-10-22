import { Lesson, Unit } from './types';
import { sentences } from './01-sentences';
import { paragraphs } from './02-paragraphs';
import { thinking } from './03-thinking';
import { articles } from './04-articles';
import { explanation } from './05-explanation';
import { research } from './06-research';
import { argument } from './07-argument';
import { interest } from './08-interest';
import { style } from './09-style';
import { revision } from './10-revision';
import { baseline, workshops, checkpoints, portfolio } from './studio';
import { practiceAssignments } from './practice-plan';
const add = (n:number, lessons:Unit['lessons']) => [...lessons,...workshops.filter(l=>l.unit===n),...checkpoints.filter(l=>l.unit===n)];
export const units:Unit[] = [
 {number:0,title:'Your starting point',description:'Keep an honest first attempt. There is no entrance test.',lessons:[baseline]},
 {number:1,title:'Sentences',description:'Express a complete thought, make meaning clear, and control the boundaries.',lessons:sentences},
 {number:2,title:'Paragraphs',description:'Give an idea room to develop, then connect it to the next.',lessons:add(2,paragraphs)},
 {number:3,title:'Thinking before writing',description:'Notice, ask, narrow, and choose a reason to write.',lessons:add(3,thinking)},
 {number:4,title:'Article foundations',description:'Build a purposeful whole from an opening to an ending.',lessons:articles},
 {number:5,title:'Explanation',description:'Make an unfamiliar idea understandable without flattening it.',lessons:add(5,explanation)},
 {number:6,title:'Evidence and research',description:'Find out, check, attribute, and say what remains uncertain.',lessons:add(6,research)},
 {number:7,title:'Argument',description:'Make a case that gives a thoughtful reader reasons to agree.',lessons:add(7,argument)},
 {number:8,title:'Reader interest',description:'Choose revealing details, shape scenes, and examine their meaning.',lessons:add(8,interest)},
 {number:9,title:'Style',description:'Make language precise, natural, and easy to read.',lessons:style},
 {number:10,title:'Revision and independence',description:'Diagnose, rethink, edit, and make a reasoned decision to finish.',lessons:add(10,revision)},
 {number:11,title:'Your independent portfolio',description:'Write for four purposes, assess the work, and continue practising.',lessons:portfolio}
];
export const lessons = units.flatMap(u=>u.lessons);
export const byId:Record<string,Lesson> = Object.assign(Object.create(null),Object.fromEntries([...lessons,...practiceAssignments].map(l=>[l.id,l])));
