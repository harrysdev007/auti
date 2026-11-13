import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import './style.css';
import Character from './Character.jsx';
import VideoBackground from './VideoBackground.jsx';
import MemeGallery from './MemeGallery.jsx';
import Lore from './Lore.jsx';

function App(){
 const [reducedMotion]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [interviewOpen,setInterviewOpen]=useState(false);
 const paused=reducedMotion||interviewOpen;
 const [fallback,setFallback]=useState(false),[full,setFull]=useState(false);
 const videoError=React.useCallback(()=>setFallback(true),[]);
 useEffect(()=>{const f=()=>setFull(!!document.fullscreenElement);document.addEventListener('fullscreenchange',f);return()=>document.removeEventListener('fullscreenchange',f)},[]);
 const fullscreen=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{}};
 return <><main className="scene ready" id="world">
  <img className="backdrop" src="/auti-landscape.png" alt="A rainbow over green hills and AUTI cloud lettering"/>
  {!fallback&&<VideoBackground paused={paused} onError={videoError}/>}
  <div className="shade"/>
  <Character paused={paused}/>
  <header><a className="wordmark" href="#world" aria-label="AUTI — home">auti</a><nav className="scene-nav" aria-label="Main navigation"><a href="#world">The world</a><a href="#story">Our story</a><a href="#memes">Memes <span>↘</span></a><a className="x-link" href="https://x.com/auti_on_sol" target="_blank" rel="noopener noreferrer" aria-label="AUTI on X" title="Follow AUTI on X"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.3l7.9-9L.8 2h6.5l4.5 6.7L18.9 2Zm-1.1 18h1.7L6.4 3.9H4.6L17.8 20Z"/></svg></a></nav><button className="expand" onClick={fullscreen} aria-label={full?'Exit fullscreen':'Enter fullscreen'} title={full?'Exit fullscreen':'Enter fullscreen'}>{full?'↙':'↗'}</button></header>
  <footer><div className="note"><div>Stay a little.<small>There’s no rush here.</small></div></div><span className="hint">{fallback?'A quiet corner of AUTI':'Move your cursor. Feel the depth.'}</span></footer>
 </main><Lore onVideoOpen={setInterviewOpen}/><MemeGallery/></>
}
createRoot(document.getElementById('root')).render(<App/>);
