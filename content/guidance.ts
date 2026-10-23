import { Lesson } from './types';

// Teaching instructions live with the curriculum rather than the interface.
export const sectionGuidance:Record<number,{buildsOn:string;work:string;outcome:string;next:string}>={
 0:{buildsOn:'No preparation is needed.',work:'Write a short explanation using what you can do today. Save the first attempt before getting help. You are not expected to know how to organise it yet.',outcome:'An honest starting piece and a note about what felt difficult.',next:'Start Sentences. You do not need to fix or pass the baseline first.'},
 1:{buildsOn:'Your starting piece gives you material to revisit; no grammar knowledge is assumed.',work:'Write a few sentences at a time. Each lesson gives new practice. For revision, use the response or baseline passage named in the task.',outcome:'Sentences whose meaning you can explain, including why you chose a particular repair.',next:'Paragraphs brings these sentences together around one idea. If complete thoughts still feel unclear, repeat a short sentence exercise before trying a paragraph.'},
 2:{buildsOn:'You have practised complete, clear sentences.',work:'Build one paragraph at a time, then combine paragraphs in the place workshop. The checkpoint uses a different situation so you can see what transfers.',outcome:'A short piece with focused paragraphs, relevant details, and an order a newcomer can follow.',next:'Thinking before writing teaches you to choose what an article should be about, rather than only improve supplied material.'},
 3:{buildsOn:'You can try focused paragraphs, even if they still need revision.',work:'Observe and collect ideas first. From “Choose a manageable scope” onward, keep one everyday topic as a practice project. Carry your planning notes forward as you choose its reader, purpose, and angle. The checkpoint is a separate task.',outcome:'A plan naming the reader, question, boundaries, and missing information. You do not need a finished article yet.',next:'Article foundations turns that plan into an opening, body, and ending.'},
 4:{buildsOn:'Use the topic and plan you developed in Thinking before writing. If you skipped that section, choose one familiar, low-risk task to explain to a beginner.',work:'Keep working on the same practice article through this section. Bring earlier writing into each lesson using “Choose earlier writing” below. Draft only the part requested, then fit it into the article. Exercise responses are experiments; your main writing area holds the version you are developing.',outcome:'A complete practice article with a main point, purposeful sections, an opening, and an ending.',next:'Explanation helps you find and repair the places where a beginner would still be confused.'},
 5:{buildsOn:'Use your practice article from Article foundations, or a short explanation you have already written.',work:'Try each new skill on the supplied exercises, then apply it to your practice article where useful. The Lantern Room workshop and seed-cupboard checkpoint are new assignments, not extra sections to add to that article.',outcome:'An explanation a newcomer can follow, tested on a fresh system as well as a familiar piece.',next:'Evidence and research teaches you how to support claims when experience or supplied facts are not enough.'},
 6:{buildsOn:'You have practised explaining ideas and separating observed detail from guesses.',work:'Begin with the short supplied cases. When a lesson asks for a real source or “your research question,” choose one small public-service or everyday-process question. Keep that question, source log, and claim notes through the research workshop. The evidence-pack checkpoint is separate.',outcome:'A source-backed article with traceable claims and clear limits, plus a fresh test of your source judgment.',next:'Argument uses these evidence skills to support a position and treat objections fairly.'},
 7:{buildsOn:'You can distinguish a claim from the evidence and interpretation behind it.',work:'Choose a modest everyday decision in the first lesson and develop that position through the lessons. The collection-hours workshop and socket-table checkpoint give you different cases; do not mix their fictional facts into your own argument.',outcome:'A complete opinion piece with reasons, relevant support, a serious objection, and a proportionate conclusion.',next:'Reader interest explores how details, scenes, and reflection can make a piece worth reading.'},
 8:{buildsOn:'You can give a piece a purpose and structure, and keep claims within their support.',work:'Use true observations and memories for your own writing. From the anecdote lesson onward, you may develop one remembered experience into an essay. The essay workshop is where you assemble a complete version.',outcome:'A personal essay connecting a particular experience to a specific change in understanding.',next:'Style improves the language of drafts you already have. It does not require starting a new article for every lesson.'},
 9:{buildsOn:'You have workshop drafts available to edit.',work:'Practise each language choice on the short exercises. Then choose a passage from one of your existing pieces and edit it for that lesson’s skill. Keep the meaning, evidence, and important qualifications intact.',outcome:'Before-and-after passages with reasons for the changes, rather than a list of words you have banned.',next:'Revision and independence moves back out from individual sentences to judging the whole draft.'},
 10:{buildsOn:'You have at least one complete draft from a workshop or your practice project.',work:'Choose one complete draft for the revision lessons and carry it forward. Diagnose and restructure before editing and proofreading. The final checkpoint asks for a new explanation without a template.',outcome:'A revised piece with a finishing rationale, plus a fresh attempt showing what you can do independently.',next:'The portfolio asks you to make these choices on four new pieces with different purposes.'},
 11:{buildsOn:'You have tried the skills together and practised diagnosing your own drafts.',work:'Write four separate articles: an explanation, an opinion piece, a personal essay, and a research-based article. Choose new material for each. Keep the initial drafts, feedback, revisions, and reasons for changes.',outcome:'Four independent pieces and a review supported by passages from the writing.',next:'Use the portfolio review to choose a recurring weakness, practise it on new material, and repeat the writing–feedback–revision cycle.'}
};

export function pageRoute(l:Lesson):{title:string;text:string;target:string}[]{
 if(l.kind==='baseline')return [
  {title:'Write your first attempt',text:'Read the assignment, then write in Draft without help.',target:'assignment'},
  {title:'Keep the starting version',text:'Save a revision named Baseline. In Reflect, note what felt difficult and any help used.',target:'main-draft'},
  {title:'Begin the sentence lessons',text:'Keep this first attempt and begin the sentence lessons.',target:'next-step'}
 ];
 if(l.kind==='checkpoint')return [
  {title:'Make a fresh attempt',text:'Read the assignment and background. Draft independently before opening the example.',target:'assignment'},
  {title:'Review and revise',text:'Save the first attempt. Check passages against the rubric, get feedback, and revise.',target:'review'},
  {title:'Choose the next step',text:'Use a practice link for a weak skill, or continue to the next assignment.',target:'next-step'}
 ];
 if(l.kind)return [
  {title:'Understand and plan',text:'Read the assignment and source material. Put your decisions in Plan.',target:'assignment'},
  {title:'Write one complete piece',text:'Write the piece in Draft. Save its first version before revising.',target:'main-draft'},
  {title:'Get feedback, then revise',text:'Ask for feedback, attempt your own revision, and explain the changes in Reflect.',target:'review'},
  {title:'Decide what to do next',text:'Use the rubric to choose more practice or the next assignment.',target:'next-step'}
 ];
 return [
  {title:'Read and study',text:'Read the explanation, examples, and notes about the writing choices.',target:'learn'},
  {title:'Try the exercises in order',text:'Write beneath each prompt before opening its hint or sample.',target:'practice'},
  {title:'Review one response and revise it',text:'Choose the passage named in the revision task. Save its first version, review it, and revise.',target:'review'},
  {title:'Choose the next lesson',text:'Explain your revision, then continue. Use the optional practice if you are still unsure.',target:'next-step'}
 ];
}

export function preparation(l:Lesson):string{
 if(l.kind==='baseline')return 'This comes first so you have an unassisted piece to compare with later work.';
 if(l.kind==='checkpoint')return 'This is a fresh assignment to see which decisions you can make without a model. It is not a graded test.';
 if(l.kind==='workshop')return 'This workshop combines the section’s skills in one complete piece. Keep its planning, draft, feedback, and reflection together.';
 if(l.kind==='portfolio')return 'This is independent work. Choose your own material and structure; revisit a lesson whenever it would help.';
 return sectionGuidance[l.unit].work;
}
