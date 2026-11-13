import React,{useState} from 'react';

export default function Lore({onVideoOpen}){
 const [playing,setPlaying]=useState(false);
 const toggle=active=>{setPlaying(active);onVideoOpen(active)};
 return <section className="lore-section" id="story" aria-labelledby="lore-heading">
  <div className="lore-copy">
   <h2 id="lore-heading">A little meme.<br/>A meaningful purpose.</h2>
   <p>AUTI is a charity memecoin on pump.fun. Our playful, Saxon-inspired mascot brings a rainbow lollipop and a little kindness to the trenches.</p>
   <p className="lore-pledge"><strong>Our pledge: 100% of the creator fees we receive will be donated to Autism Speaks through <a href="https://www.donate.gg/" target="_blank" rel="noreferrer">donate.gg</a>.</strong></p>
   <p className="lore-charity"><a href="https://www.autismspeaks.org/about-autism-speaks" target="_blank" rel="noreferrer">About Autism Speaks ↗</a><br/>A nonprofit supporting autistic people and their families through resources, advocacy, services, and research to improve quality of life.</p>
  </div>
  <div className="lore-video">
   <div className="interview-frame">
    {playing?<iframe src="https://www.youtube-nocookie.com/embed/O4wBUysNe2k?start=1944&end=1980&autoplay=1&rel=0&hl=en&cc_lang_pref=en" title="Elon Musk talks about Saxon — Joe Rogan Experience #2404, 32:24" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/>:<button className="interview-play" onClick={()=>toggle(true)} aria-label="Play Elon Musk talking about Saxon, starting at 32:24"><img src="https://i.ytimg.com/vi/O4wBUysNe2k/hqdefault.jpg" alt="Elon Musk on the Joe Rogan Experience" loading="lazy"/><span className="interview-play-icon">▶</span><span className="interview-time">Watch from 32:24</span></button>}
   </div>
   <div className="interview-caption"><div><h3>The story behind the inspiration.</h3><p>Elon talks about Saxon and his different perspective.<br/>Joe Rogan Experience #2404 · 32:24</p></div>{playing&&<button onClick={()=>toggle(false)} className="close-interview" aria-label="Close interview video">×</button>}</div>
   <a className="interview-source" href="https://www.youtube.com/watch?v=O4wBUysNe2k&t=1944s" target="_blank" rel="noreferrer">Watch the original on YouTube ↗</a>
  </div>
 </section>
}

