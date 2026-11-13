import React,{useEffect,useRef,useState} from 'react';

const memes=[
 {id:'jarvis',title:'Jarvis, touch grass.',alt:'AUTI inside a futuristic helmet with a holographic interface'},
 {id:'chad',title:'Built different.',alt:'A superhero-sized muscular AUTI under a dramatic sky'},
 {id:'cinema',title:'Absolute cinema.',alt:'AUTI in a director’s chair with both hands raised'},
 {id:'money',title:'A very special interest.',alt:'AUTI in a wide-legged stance holding a fan of dollar bills'},
 {id:'soldier',title:'Born for the trenches.',alt:'AUTI in an oversized helmet in a jungle movie scene'},
 {id:'peak',title:'Peak.',alt:'AUTI conducting a masterpiece with one hand raised'},
];

export default function MemeGallery(){
 const [selected,setSelected]=useState(null);const dialog=useRef(null);
 useEffect(()=>{
  if(selected!==null){if(!dialog.current.open)dialog.current.showModal()}else if(dialog.current.open)dialog.current.close();
 },[selected]);
 const step=amount=>setSelected(i=>(i+amount+memes.length)%memes.length);
 useEffect(()=>{
  if(selected===null)return;
  const key=e=>{if(e.key==='ArrowRight'){e.preventDefault();step(1)}if(e.key==='ArrowLeft'){e.preventDefault();step(-1)}};
  window.addEventListener('keydown',key);const previous=document.body.style.overflow;document.body.style.overflow='hidden';
  return()=>{window.removeEventListener('keydown',key);document.body.style.overflow=previous};
 },[selected]);
 return <section className="meme-gallery" id="memes" aria-labelledby="gallery-title">
  <div className="gallery-backdrop"/>
  <div className="gallery-heading"><div><h1 id="gallery-title">The AUTI archives.</h1><p>Same AUTI. Different timelines.</p></div><a className="back-to-world" href="#world">Back to the meadow ↗</a></div>
  <div className="meme-grid">{memes.map((m,i)=><button className={`meme-print print-${i}`} key={m.id} onClick={()=>setSelected(i)} aria-label={`Open meme: ${m.title}`}>
   <img src={`/memes/${m.id}.webp`} alt={m.alt} loading="lazy" width="900" height="900"/>
   <span className="print-caption">{m.title}<span>↗</span></span>
  </button>)}</div>
  <div className="gallery-end"><span>Made for your group chat.</span><a href="#world">auti</a></div>
  <dialog className="meme-viewer" ref={dialog} onCancel={()=>setSelected(null)} onClose={()=>setSelected(null)} onClick={e=>{if(e.target===dialog.current)setSelected(null)}} aria-label={selected!==null?memes[selected].title:'Meme viewer'}>
   {selected!==null&&<div className="viewer-inner"><button className="viewer-close" onClick={()=>setSelected(null)} aria-label="Close meme">×</button><button className="viewer-prev" onClick={()=>step(-1)} aria-label="Previous meme">‹</button><img src={`/memes/${memes[selected].id}.webp`} alt={memes[selected].alt}/><button className="viewer-next" onClick={()=>step(1)} aria-label="Next meme">›</button><div className="viewer-caption"><span>{memes[selected].title}</span><a href={`/memes/${memes[selected].id}.webp`} download={`AUTI-${memes[selected].id}.webp`}>Download image ↓</a></div></div>}
  </dialog>
 </section>
}
