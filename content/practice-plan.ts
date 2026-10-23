import { Lesson, criterion } from './types';

export const routine = [
 {id:'read',title:'Read and analyse',minutes:15,shortMinutes:5,text:'Read excellent prose. Name one choice that makes it work: the opening, a specific detail, or the job of a paragraph.'},
 {id:'learn',title:'Learn one technique',minutes:10,shortMinutes:5,text:'Study one small skill in your current lesson, such as sentence boundaries, transitions, or concrete detail.'},
 {id:'write',title:'Write independently',minutes:35,shortMinutes:12,text:'Write new material in Draft without AI suggestions or grammar corrections. Make your own decisions before asking for help.'},
 {id:'revise',title:'Revise',minutes:20,shortMinutes:5,text:'Return to yesterday’s draft. Save a revision first. Fix the most important problem before editing individual sentences.'},
 {id:'reflect',title:'Reflect',minutes:10,shortMinutes:3,text:'In Reflect, record what improved, what was difficult, and one lesson to apply tomorrow.'},
] as const;

export const phases = [
 {title:'Build the foundations',time:'Weeks 1–8',text:'Practise complete sentences, punctuation, focused paragraphs, transitions, clarity, and conciseness. Write 150–400 words most days and rewrite weak paragraphs.',units:[1,2],ready:'Try a fresh short explanation. Can a reader follow the sentences and paragraphs, and can you explain your main revision choices? If those decisions still feel uncertain, repeat targeted practice before moving on.'},
 {title:'Learn to write articles',time:'Months 3–4',text:'Practise openings, endings, examples, and logical order. Work toward one complete 400–800-word article each week, keeping time for revision.',units:[3,4,5],ready:'Look for a complete piece with one main point, purposeful paragraphs, and enough detail for its reader. Use the article checkpoint to see what transfers to a new subject.'},
 {title:'Develop arguments and depth',time:'Months 5–8',text:'Write opinion essays, analytical articles, and researched explanations. Verify claims, choose relevant evidence, and answer serious objections fairly.',units:[6,7],ready:'Can another reader trace your claims to their support and identify the strongest objection? Review fresh work as well as a heavily revised draft.'},
 {title:'Develop a columnist’s craft',time:'Months 9–18',text:'Find original angles, build stronger openings, use narrative with purpose, and attend to rhythm. Complete independent articles, share selected work, and seek demanding editorial feedback.',units:[8,9,10,11],ready:'Look across several pieces for a voice that serves different subjects and readers. Choose the next weakness from the writing and feedback, rather than the number of lessons completed.'},
 {title:'Professional refinement',time:'Year 2 onward',text:'Build expertise in subjects you understand deeply. Produce researched columns consistently, work with editors, refine a portfolio, and pitch publications.',units:[11],ready:'Keep testing the work with readers and editors. Professional quality depends on judgment, subject knowledge, reliable research, and revision as well as fluent sentences.'},
];

export const reviewDimensions = [
 {name:'Clarity',question:'Can a reader understand the meaning on the first reading?',practice:'complete-thought'},
 {name:'Structure',question:'Do ideas follow naturally, with each paragraph doing a useful job?',practice:'coherence'},
 {name:'Development',question:'Do specific examples or evidence support the claims?',practice:'support-details'},
 {name:'Style',question:'Is the language precise, engaging, and recognisably yours?',practice:'precise-language'},
 {name:'Editing',question:'Which weaknesses could you identify and fix independently?',practice:'diagnosis'},
];

const common = {
 unit:0, examples:[], exercises:[],
 checklist:reviewDimensions.map(d=>d.question),
 extra:'Choose one sentence or paragraph that still feels uncertain. Try a second version and explain how its meaning changes.',
};

export const practiceAssignments:Lesson[] = [
 {
  ...common,id:'practice-dishes',kind:'workshop',title:'Revise Doing Dishes',
  objective:'Make every sentence clear and necessary while preserving your voice and humour.',
  explanation:['Begin with your own 227-word piece, Doing Dishes. If it is already saved in this workbook, use “Choose earlier writing” below to copy it here. Otherwise paste your original into Draft.', 'Save the original before editing. Read once for the whole piece: what does it explain, why does it matter, and what belongs? Then work on unclear sentences, punctuation, and paragraph development. Keep the observations and humour that serve the point.'],
  assignment:'Bring your original Doing Dishes into Draft and save a revision named “Doing Dishes — original”. In Feedback, identify the two most important problems using actual passages. Attempt your own revision before asking to see a rewritten example. Save the revised version and explain two meaningful changes in Reflect.',
  revision:'Compare the original with your revision. Check whether each sentence says exactly what you mean and whether each detail helps the reader. If you remove a sentence, explain what the piece gains. Keep both versions.',
  transfer:{text:'Apply the same clarity check to a new everyday subject.',lesson:'practice-explanation'},
 },
 {
  ...common,id:'practice-explanation',kind:'workshop',title:'Write a fresh everyday explanation',
  objective:'Write 250–350 words on a different everyday subject, with every sentence clear and necessary.',
  explanation:['Choose a familiar everyday subject other than washing dishes. Explain one small thing to a beginner: how you pack a bag, organise a shared shelf, or prepare a workspace. Decide what the reader needs to understand and why it matters.', 'Draft independently without AI suggestions or grammar corrections. Save the first attempt. Review what belongs, revise unclear sentences, and seek passage-specific feedback. The word range keeps the task manageable; it is not a quality score.'],
  assignment:'Write a new 250–350-word explanation of a different everyday subject. Include one difficulty a beginner might face and explain why a step or choice matters. Keep the focus on clarity and relevance. Save the unassisted first draft before reviewing or revising it.',
  revision:'Read each sentence aloud. Mark anything that could mean two different things and anything the reader does not need. Repair those passages yourself, get feedback, then save a revised snapshot. In Reflect, quote one before-and-after sentence and explain the improvement.',
  transfer:{text:'Return to the sentence lessons and practise whichever choice was hardest.',lesson:'complete-thought'},
 },
 {
  ...common,id:'practice-review',kind:'checkpoint',title:'Your four-week writing review',
  objective:'Compare fresh, independent writing with an earlier attempt using evidence from actual passages.',
  explanation:['Every four weeks, write a fresh 250–350-word explanation on a new everyday subject under similar conditions: the same time allowance, a comparable reader, and no drafting assistance. Record the date, time allowed, topic, and any help used in Plan. Keep those conditions comparable at each review.', 'Use this writing area again at the next review. Before replacing a previous piece, save its finished version with a dated name. For each new attempt, save a dated “first draft” snapshot before feedback and a dated “revised” snapshot afterwards. Earlier writing and process notes stay in revision history.'],
  assignment:'Write the fresh explanation independently. Save a revision named with today’s date and “first draft”. In Feedback, compare this first draft with an earlier first draft on clarity, structure, development, style, and editing. Quote a passage for each judgment and note differences in the task or assistance. Occasionally ask a human reader who has not seen your drafting to give their own diagnosis.',
  revision:'Choose one recurring weakness, attempt a revision, and save a dated “revised” snapshot. In Reflect, explain the changes, what you could fix independently, and what still needed help. Compare revised work with revised work separately from the first-draft comparison. Add the next focus to Practice notes.',
  rubric:reviewDimensions.map(d=>criterion(d.name,d.question,'Point to a passage where the reader still needs to guess, or where you needed help. Choose one repair to try.',d.practice)),
  transfer:{text:'Use the review to choose one recurring weakness to practise.',lesson:'diagnosis'},
 },
];

export const isPracticeAssignment = (id:string) => practiceAssignments.some(l=>l.id===id);
