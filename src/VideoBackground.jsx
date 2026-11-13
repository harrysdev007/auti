import React,{useEffect,useRef,useState} from 'react';

const FADE_SECONDS=1.4;

export default function VideoBackground({paused,onError}){
 const a=useRef(null),b=useRef(null),engine=useRef(null);
 const [sound,setSound]=useState(false),[audioError,setAudioError]=useState(false);
 const settings=useRef({paused,sound});settings.current={paused,sound};
 useEffect(()=>{
  const videos=[a.current,b.current];
  let active=0,transition=null,disposed=false,frame=0;
  const audio={context:null,gains:[],sources:[]};
  const setLevels=(outgoing=1,incoming=0)=>{
   if(!audio.context)return;
   const levels=[0,0];levels[active]=outgoing;levels[1-active]=incoming;
   audio.gains.forEach((gain,i)=>gain.gain.value=settings.current.sound?levels[i]*.65:0);
  };
  const play=async video=>{
   try{await video.play();if(disposed||settings.current.paused||document.hidden)video.pause();return !video.paused}
   catch(error){if(error.name!=='AbortError')console.warn('Background playback',error);return false}
  };
  const sync=()=>{
   if(settings.current.paused||document.hidden){videos.forEach(v=>v.pause());return}
   play(videos[active]);if(transition)play(videos[1-active]);
  };
  const begin=()=>{
   if(transition)return;
   const next=videos[1-active];
   transition={started:false,starting:true};
   next.currentTime=0;next.style.zIndex='1';next.style.opacity='0';
   play(next).then(ok=>{if(disposed||!transition)return;transition.starting=false;transition.started=ok});
  };
  const finish=()=>{
   const old=videos[active],next=videos[1-active];
   next.style.opacity='1';next.style.zIndex='0';old.style.opacity='0';old.style.zIndex='0';
   old.pause();active=1-active;transition=null;old.currentTime=0;setLevels();
  };
  const draw=()=>{
   if(disposed)return;
   if(!settings.current.paused&&!document.hidden){
    const current=videos[active];
    const fade=Math.min(FADE_SECONDS,current.duration/3);
    if(Number.isFinite(current.duration)&&current.currentTime>=current.duration-fade&&!transition)begin();
    if(transition?.started){
     const next=videos[1-active];
     // The incoming media clock drives the blend, so buffering cannot jump it.
     const progress=Math.min(next.currentTime/fade,1);
     const eased=progress*progress*(3-2*progress);
     next.style.opacity=String(eased);
     setLevels(Math.cos(progress*Math.PI/2),Math.sin(progress*Math.PI/2));
     if(progress>=1)finish();
    }else{
     setLevels();
     if(transition&&!transition.starting&&!transition.started&&videos[1-active].readyState>=3){transition.starting=true;play(videos[1-active]).then(ok=>{if(transition){transition.starting=false;transition.started=ok}})}
    }
   }
   frame=requestAnimationFrame(draw);
  };
  engine.current={sync,enableAudio:async()=>{
   if(!audio.context){
    const Context=window.AudioContext||window.webkitAudioContext;
    if(!Context)throw Error('Web Audio is unavailable');
    audio.context=new Context();
    videos.forEach(video=>{
     const source=audio.context.createMediaElementSource(video),gain=audio.context.createGain();
     gain.gain.value=0;source.connect(gain).connect(audio.context.destination);
     audio.sources.push(source);audio.gains.push(gain);video.muted=false;
    });
   }
   await audio.context.resume();
  }};
  videos[0].style.opacity='1';videos[1].style.opacity='0';
  videos[0].addEventListener('loadeddata',sync);document.addEventListener('visibilitychange',sync);
  sync();frame=requestAnimationFrame(draw);
  return()=>{disposed=true;cancelAnimationFrame(frame);videos.forEach(v=>v.pause());videos[0].removeEventListener('loadeddata',sync);document.removeEventListener('visibilitychange',sync);audio.sources.forEach(s=>s.disconnect());audio.gains.forEach(g=>g.disconnect());audio.context?.close();engine.current=null};
 },[]);
 useEffect(()=>{engine.current?.sync()},[paused]);
 const toggleSound=async()=>{
  if(sound){setSound(false);return}
  try{await engine.current.enableAudio();setSound(true);setAudioError(false)}catch(error){console.warn(error);setAudioError(true)}
 };
 return <>
  <div className="video-layers" aria-label="Living AUTI background with smooth transitions">
   <video ref={a} className="hero-video" src="/auti-background-v2.mp4" poster="/auti-landscape.png" muted playsInline preload="auto" onError={onError}/>
   <video ref={b} className="hero-video" src="/auti-background-v2.mp4" muted playsInline preload="auto" onError={onError} aria-hidden="true"/>
  </div>
  <button className="sound-control" onClick={toggleSound} aria-pressed={sound} aria-label={sound?'Mute sound':'Enable sound'} title={audioError?'Click again to enable sound':undefined}>
   <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4Z"/>{sound?<><path d="M15 8c3 2 3 6 0 8M18 5c5 4 5 10 0 14"/></>:<path d="m16 9 5 6m0-6-5 6"/>}</svg><span>{sound?'Sound on':'Enable sound'}</span>
  </button>
 </>;
}
