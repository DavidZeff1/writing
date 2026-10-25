'use client';
import { useState } from 'react';
import { writerAreas, writerArchives, WriterArea } from '../content/reading';

export default function WriterArchives(){
 const [category,setCategory]=useState<'all' | WriterArea>('all');
 const [query,setQuery]=useState('');
 const term=query.trim().toLowerCase();
 const matching=writerArchives.filter(writer=>(category==='all'||writer.area===category)&&[writer.name,writer.publisher,writer.focus,writer.area].join(' ').toLowerCase().includes(term));
 const visibleAreas=writerAreas.filter(area=>matching.some(writer=>writer.area===area.id));
 return <div className="writers-library">
  <div className="writers-intro"><p>Explore excellent writers across different styles. Each entry links to a free piece or collection and highlights a technique to study.</p><p>Choose a reading, examine how several paragraphs work, and try one technique in a short draft. Categories describe each reading's focus, not everything the writer has written.</p></div>
  <label className="search-label" htmlFor="writer-search">Find a writer, title, or technique</label>
  <input id="writer-search" type="search" autoComplete="off" placeholder="Try Wolfe, satire, dialogue, or clear arguments" value={query} onChange={e=>setQuery(e.target.value)}/>
  <div className="writer-filters" role="group" aria-label="Filter writers by area">
   <button type="button" className={category==='all'?'writer-filter selected':'writer-filter'} aria-pressed={category==='all'} onClick={()=>setCategory('all')}>All areas <span>{writerArchives.length}</span></button>
   {writerAreas.map(area=><button type="button" key={area.id} className={category===area.id?'writer-filter selected':'writer-filter'} aria-pressed={category===area.id} onClick={()=>setCategory(area.id)}>{area.name} <span>{writerArchives.filter(writer=>writer.area===area.id).length}</span></button>)}
  </div>
  <p className="writers-count" role="status">{matching.length} {matching.length===1?'writer':'writers'} shown</p>
  {visibleAreas.map(area=><section className="writer-area" key={area.id} aria-labelledby={'writer-area-'+area.id}>
    <header className="writer-area-header"><div><h2 id={'writer-area-'+area.id}>{area.name}</h2><p>{area.description}</p></div><span>{matching.filter(writer=>writer.area===area.id).length}</span></header>
    <div className="writer-grid">{matching.filter(writer=>writer.area===area.id).map(writer=><article className="writer-card" key={writer.name}>
      <h3>{writer.name}</h3><p className="writer-publication">{writer.publisher}</p><p className="writer-focus">{writer.focus}</p>
      <a href={writer.url} target="_blank" rel="noopener noreferrer">Open free reading <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>
    </article>)}</div>
  </section>)}
  {!matching.length&&<div className="writer-empty"><h2>No writers found</h2><p>Try another word or select All areas.</p><button type="button" className="button" onClick={()=>{setCategory('all');setQuery('');}}>Clear filters</button></div>}
 </div>;
}
