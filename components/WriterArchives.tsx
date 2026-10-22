import { writerArchives } from '../content/reading';

export default function WriterArchives({collapsible=true}:{collapsible?:boolean}){
 const list=<ul className="writer-archives">{writerArchives.map(writer=><li key={writer.name}>
  <a href={writer.url} target="_blank" rel="noopener noreferrer">{writer.name}<span className="sr-only"> archive (opens in a new tab)</span></a>
  <small>{writer.publisher}{writer.subscription?' · May require a subscription':''}</small>
  <p>{writer.focus}</p>
 </li>)}</ul>;
 return collapsible?<details className="archive-picker"><summary>Writer archives</summary>{list}</details>:list;
}
