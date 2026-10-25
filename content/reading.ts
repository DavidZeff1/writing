// Keep readings accessible without payment or account registration. Verify article pages, not just author indexes.
// Reading access checked on 2026-10-23; use specific free pieces when a publication also has subscriber content.
export const writerAreas = [
  {
    "id": "reportage",
    "name": "Journalism & reportage",
    "description": "Profiles, reported scenes, and firsthand observation."
  },
  {
    "id": "essays",
    "name": "Essays & arguments",
    "description": "Clear thinking, persuasive structure, and considered evidence."
  },
  {
    "id": "satire",
    "name": "Humour & satire",
    "description": "Irony, comic timing, and unconventional social criticism."
  },
  {
    "id": "fiction",
    "name": "Fiction & storytelling",
    "description": "Character, dialogue, scenes, and endings."
  },
  {
    "id": "experimental",
    "name": "Unconventional voices",
    "description": "Strange structures, risk, and distinctive language."
  },
  {
    "id": "craft",
    "name": "Writing about writing",
    "description": "Close reading, creative process, and revision."
  },
  {
    "id": "science",
    "name": "Science & explanation",
    "description": "Analogies and making complex ideas understandable."
  }
] as const;
export type WriterArea = (typeof writerAreas)[number]['id'];

export const writerArchives = [
 {name:'George Orwell',area:'essays',url:'https://www.orwellfoundation.com/the-orwell-foundation/orwell/essays-and-other-works/',publisher:'The Orwell Foundation',focus:'Study clear arguments and concrete language.',subscription:false},
 {name:'Paul Graham',area:'essays',url:'https://www.paulgraham.com/articles.html',publisher:'Author’s website',focus:'Study plain sentences and how a question develops into an essay.',subscription:false},
 {name:'Ursula K. Le Guin',area:'craft',url:'https://www.ursulakleguin.com/blog',publisher:'Author’s website',focus:'Study how close observation leads to reflection.',subscription:false},
 {name:'Oliver Burkeman',area:'essays',url:'https://www.oliverburkeman.com/posts',publisher:'Author’s website',focus:'Study how an everyday question becomes an explanatory column.',subscription:false},
 {name:'Marina Hyde',area:'satire',url:'https://www.marinahyde.com/p/tom-hiddleston-is-three-to-five-per',publisher:'Always On · Public essay',focus:'Read the Tom Hiddleston column; dismiss the optional signup prompt. Study satire, sharp comparisons, and comic timing.',subscription:false},
 {name:'Rebecca Solnit',area:'essays',url:'https://www.opendemocracy.net/en/change-in-time-of-climate-change/',publisher:'openDemocracy · Change in a time of climate change',focus:'Study how concrete examples and an extended metaphor build a larger argument.',subscription:false},
 {name:'Gary Younge',area:'reportage',url:'https://www.garyyounge.com/article/how-racism-shaped-my-critical-eye',publisher:'Author’s website · How racism shaped my critical eye',focus:'Study how reporting and personal experience support a position.',subscription:false},
 {name:'David Sedaris',area:'satire',url:'https://www.thisamericanlife.org/639/transcript',publisher:'This American Life · Free transcript',focus:'Read Act One, The Youth in Asia. Study observation, personal storytelling, and humour.',subscription:false},
 {name:'Joan Didion',area:'reportage',url:'https://www.saturdayeveningpost.com/2018/12/the-big-rock-candy-figgy-pudding-pitfall/',publisher:'The Saturday Evening Post · The Big Rock Candy Figgy Pudding Pitfall',focus:'Study precise details, sentence rhythm, and controlled tone.',subscription:false},
 {name:'Zadie Smith',area:'craft',url:'https://lithub.com/zadie-smith-on-reading-while-you-write/',publisher:'Literary Hub · Reading While You Write (excerpt)',focus:'Study how a contrast, an analogy, and a personal example develop an idea about learning from other writers.',subscription:false},
 {name:'David Brooks',area:'essays',url:'https://comment.org/wisdom-is-not-intelligence/',publisher:'Comment · Wisdom Is Not Intelligence',focus:'Study how examples and transitions develop an argument.',subscription:false},
 {name:'James Baldwin',area:'essays',url:'https://progressive.org/magazine/letter-nephew/',publisher:'The Progressive · A Letter to My Nephew',focus:'Study sentence rhythm, moral argument, and personal voice.',subscription:false},
 {name:'Charles Bukowski',area:'experimental',url:'https://www.poetryfoundation.org/poems/49567/vegas',publisher:'Poetry Foundation · vegas · Poem',focus:'Study plain speech colliding with strange imagery, the rhythm of the line breaks, and the dry closing turn.',subscription:false},
 {name:'Hunter S. Thompson',area:'reportage',url:'https://grantland.com/features/looking-back-hunter-s-thompson-classic-story-kentucky-derby/',publisher:'Grantland · The Kentucky Derby Is Decadent and Depraved · Reported essay',focus:'After the introduction, begin Thompson’s piece. Study vivid scenes, comic exaggeration, and how the reporter becomes part of the story.',subscription:false},
 {name:'Tom Wolfe',area:'reportage',url:'https://web.stanford.edu/class/e145/2007_fall/materials/noyce.html',publisher:'Stanford University · The Tinkerings of Robert Noyce · Reported profile',focus:'Study how vivid scenes, detailed character portraits, and sharp social observation turn the history of Silicon Valley into a compelling narrative.',subscription:false},
 {name:'Lucia Berlin',area:'fiction',url:'https://lithub.com/tiger-bites/',publisher:'Literary Hub · Tiger Bites · Short story',focus:'Study fast scene changes, unruly dialogue, and the way rough humour and precise physical details carry tenderness.',subscription:false},
 {name:'Clarice Lispector',area:'experimental',url:'https://lithub.com/clarice-lispector-a-woman-knows-to-say-no/',publisher:'Literary Hub · A Woman Knows To Say No · Translated chronicle',focus:'Study how an everyday invitation becomes a strange interior argument through questions, repetition, and unexpected images.',subscription:false},
 {name:'Kurt Vonnegut',area:'fiction',url:'https://www.gutenberg.org/cache/epub/21279/pg21279-images.html',publisher:'Project Gutenberg · 2 B R 0 2 B · Short story',focus:'Study short, apparently cheerful sentences that expose a horrifying social bargain. Track how the final reversal changes the opening.',subscription:false},
 {name:'Franz Kafka',area:'experimental',url:'https://www.gutenberg.org/files/5200/5200-h/5200-h.htm',publisher:'Project Gutenberg · Metamorphosis · Translated novella',focus:'Begin with the opening scene in Part I. Study the calm, exact treatment of an impossible event and the contrast between horror and ordinary work worries.',subscription:false},
 {name:'Fyodor Dostoevsky',area:'fiction',url:'https://www.gutenberg.org/cache/epub/600/pg600-images.html',publisher:'Project Gutenberg · Notes from the Underground · Translated novella',focus:'Begin with Part I, chapters I–III. Study self-correction, contradiction, and direct address: the narrator keeps undermining his own explanations.',subscription:false},
 {name:'Lydia Davis',area:'experimental',url:'https://lithub.com/claim-to-fame-1-9/',publisher:'Literary Hub · Claim to Fame #1–9 · Very short stories',focus:'Study how exact wording, disproportionate detail, and deadpan understatement turn tiny observations into complete comic pieces.',subscription:false},
 {name:'Leonora Carrington',area:'experimental',url:'https://lithub.com/read-a-previously-unpublished-story-by-leonora-carrington/',publisher:'Literary Hub · Mr. Gregory’s Fly · Short story',focus:'Study the matter-of-fact telling of grotesque, impossible events. Notice how small concrete details make the absurd feel consistent.',subscription:false},
 {name:'Ambrose Bierce',area:'satire',url:'https://www.gutenberg.org/cache/epub/972/pg972-images.html',publisher:'Project Gutenberg · The Devil’s Dictionary · Satirical definitions',focus:'Read five to ten definitions from A. Study compressed setups, precise word choices, and endings that overturn the respectable meaning of a word.',subscription:false},
 {name:'H. L. Mencken',area:'satire',url:'https://www.gutenberg.org/cache/epub/18948/pg18948-images.html',publisher:'Project Gutenberg · Damn! A Book of Calumny · Essays',focus:'Start with The Burden of Humor (IV) and Moral Indignation (VI). Study argumentative momentum, escalating lists, and the placement of a cutting final sentence.',subscription:false},
 {name:'Mark Twain',area:'satire',url:'https://www.gutenberg.org/cache/epub/2572/pg2572-images.html',publisher:'Project Gutenberg · On the Decay of the Art of Lying · Essay',focus:'Study the mock-serious defence of lying: conversational asides, deliberately respectable language, and examples that expose social hypocrisy.',subscription:false},
 {"name":"Gay Talese","area":"reportage","url":"https://www.esquire.com/news-politics/a638/frank-sinatra-has-a-cold-gay-talese/","publisher":"Esquire · Frank Sinatra Has a Cold · Profile","focus":"Study how observation and secondary interviews build a portrait without a direct interview.","subscription":false},
 {"name":"George Saunders","area":"craft","url":"https://www.theguardian.com/books/2017/mar/04/what-writers-really-do-when-they-write","publisher":"The Guardian · What Writers Really Do When They Write · Essay","focus":"Study how an analogy makes the slow process of revision understandable.","subscription":false},
 {"name":"W. E. B. Du Bois","area":"essays","url":"https://www.gutenberg.org/ebooks/408","publisher":"Project Gutenberg · The Souls of Black Folk · Essays","focus":"Begin with Of Our Spiritual Strivings. Study how memory, metaphor, and argument combine.","subscription":false},
 {"name":"Frederick Douglass","area":"essays","url":"https://teachingamericanhistory.org/document/what-to-the-slave-is-the-fourth-of-july-4/","publisher":"Teaching American History · What to the Slave Is the Fourth of July? · Speech","focus":"Study repetition, rhetorical questions, and a forceful moral argument.","subscription":false},
 {"name":"Virginia Woolf","area":"craft","url":"https://www.gutenberg.org/ebooks/64457","publisher":"Project Gutenberg · The Common Reader · Essays","focus":"Read The Modern Essay. Study transitions and the movement of thought.","subscription":false},
 {"name":"Oscar Wilde","area":"satire","url":"https://www.gutenberg.org/ebooks/887","publisher":"Project Gutenberg · Intentions · Essays","focus":"Start with The Decay of Lying. Study paradox, wit, and provocative dialogue.","subscription":false},
 {"name":"Saki (H. H. Munro)","area":"satire","url":"https://www.gutenberg.org/ebooks/3688","publisher":"Project Gutenberg · The Chronicles of Clovis · Stories","focus":"Read Tobermory. Study economical setups and endings exposing absurdity.","subscription":false},
 {"name":"Anton Chekhov","area":"fiction","url":"https://www.gutenberg.org/ebooks/13415","publisher":"Project Gutenberg · The Lady with the Dog · Story","focus":"Study precise detail, understated emotion, and unresolved endings.","subscription":false},
 {"name":"Zora Neale Hurston","area":"essays","url":"https://www.cengage.com/custom/static_content/OLC/s76656_76218lf/hurston.pdf","publisher":"Cengage · How It Feels to Be Colored Me · Essay (PDF)","focus":"Study confident personal voice, concrete memories, and vivid metaphors.","subscription":false},
 {"name":"Richard Feynman","area":"science","url":"https://calteches.library.caltech.edu/51/2/CargoCult.htm","publisher":"Caltech · Cargo Cult Science · Speech","focus":"Study how concrete stories expose failures in scientific reasoning.","subscription":false},
 {"name":"Stephen Jay Gould","area":"science","url":"https://www.stat.berkeley.edu/~rice/Stat2/GouldCancer.html","publisher":"UC Berkeley · The Median Isn't the Message · Essay","focus":"Study how personal experience illuminates a statistical distinction.","subscription":false},
 {"name":"Chimamanda Ngozi Adichie","area":"essays","url":"https://www.ted.com/talks/chimamanda_ngozi_adichie_the_danger_of_a_single_story?view=transcript","publisher":"TED · The Danger of a Single Story · Transcript","focus":"Study how personal stories build a persuasive larger argument.","subscription":false},
 {"name":"Tim Urban","area":"science","url":"https://waitbutwhy.com/2015/01/artificial-intelligence-revolution-1.html","publisher":"Wait But Why · The AI Revolution · Explainer","focus":"Study analogy and clear sections that make a technical subject accessible.","subscription":false},
] as const;

export const startingEssay = {title:'A Nice Cup of Tea',writer:'George Orwell',url:'https://www.orwellfoundation.com/the-orwell-foundation/orwell/essays-and-other-works/a-nice-cup-of-tea/'};
