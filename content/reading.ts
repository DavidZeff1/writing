// Keep readings accessible without payment or account registration. Verify article pages, not just author indexes.
// Reading access checked on 2026-10-23; use specific free pieces when a publication also has subscriber content.
export const writerArchives = [
 {name:'George Orwell',url:'https://www.orwellfoundation.com/the-orwell-foundation/orwell/essays-and-other-works/',publisher:'The Orwell Foundation',focus:'Study clear arguments and concrete language.',subscription:false},
 {name:'Paul Graham',url:'https://www.paulgraham.com/articles.html',publisher:'Author’s website',focus:'Study plain sentences and how a question develops into an essay.',subscription:false},
 {name:'Ursula K. Le Guin',url:'https://www.ursulakleguin.com/blog',publisher:'Author’s website',focus:'Study how close observation leads to reflection.',subscription:false},
 {name:'Oliver Burkeman',url:'https://www.oliverburkeman.com/posts',publisher:'Author’s website',focus:'Study how an everyday question becomes an explanatory column.',subscription:false},
 {name:'Marina Hyde',url:'https://www.marinahyde.com/p/tom-hiddleston-is-three-to-five-per',publisher:'Always On · Public essay',focus:'Read the Tom Hiddleston column; dismiss the optional signup prompt. Study satire, sharp comparisons, and comic timing.',subscription:false},
 {name:'Rebecca Solnit',url:'https://www.opendemocracy.net/en/change-in-time-of-climate-change/',publisher:'openDemocracy · Change in a time of climate change',focus:'Study how concrete examples and an extended metaphor build a larger argument.',subscription:false},
 {name:'Gary Younge',url:'https://www.garyyounge.com/article/how-racism-shaped-my-critical-eye',publisher:'Author’s website · How racism shaped my critical eye',focus:'Study how reporting and personal experience support a position.',subscription:false},
 {name:'David Sedaris',url:'https://www.thisamericanlife.org/639/transcript',publisher:'This American Life · Free transcript',focus:'Read Act One, The Youth in Asia. Study observation, personal storytelling, and humour.',subscription:false},
 {name:'Joan Didion',url:'https://www.saturdayeveningpost.com/2018/12/the-big-rock-candy-figgy-pudding-pitfall/',publisher:'The Saturday Evening Post · The Big Rock Candy Figgy Pudding Pitfall',focus:'Study precise details, sentence rhythm, and controlled tone.',subscription:false},
 {name:'Zadie Smith',url:'https://lithub.com/zadie-smith-on-reading-while-you-write/',publisher:'Literary Hub · Reading While You Write (excerpt)',focus:'Study how a contrast, an analogy, and a personal example develop an idea about learning from other writers.',subscription:false},
 {name:'David Brooks',url:'https://comment.org/wisdom-is-not-intelligence/',publisher:'Comment · Wisdom Is Not Intelligence',focus:'Study how examples and transitions develop an argument.',subscription:false},
 {name:'James Baldwin',url:'https://progressive.org/magazine/letter-nephew/',publisher:'The Progressive · A Letter to My Nephew',focus:'Study sentence rhythm, moral argument, and personal voice.',subscription:false},
] as const;

export const startingEssay = {title:'A Nice Cup of Tea',writer:'George Orwell',url:'https://www.orwellfoundation.com/the-orwell-foundation/orwell/essays-and-other-works/a-nice-cup-of-tea/'};
