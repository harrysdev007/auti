import React,{useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';

export default function Character({paused}){
 const host=useRef(null),settings=useRef({paused});
 const [status,setStatus]=useState('loading');
 useEffect(()=>{settings.current.paused=paused},[paused]);
 useEffect(()=>{
  const container=host.current;
  let renderer;
  try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'})}catch{setStatus('error');return}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0x000000,0);
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(33,1,.1,100);camera.position.set(0,.15,7.4);camera.lookAt(0,0,0);
  scene.add(new THREE.HemisphereLight(0xe4f5ff,0x95ad65,2.5));
  const sun=new THREE.DirectionalLight(0xfff1db,3.5);sun.position.set(-3,6,5);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-3;sun.shadow.camera.right=3;sun.shadow.camera.top=3;sun.shadow.camera.bottom=-3;sun.shadow.normalBias=.025;scene.add(sun);
  const fill=new THREE.DirectionalLight(0xcce9ff,1.5);fill.position.set(3,2,-3);scene.add(fill);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(12,12),new THREE.ShadowMaterial({opacity:.35}));ground.rotation.x=-Math.PI/2;ground.position.y=-1.7;ground.receiveShadow=true;scene.add(ground);
  // A soft contact shadow keeps the soles firmly attached to the meadow.
  const shadowCanvas=document.createElement('canvas');shadowCanvas.width=128;shadowCanvas.height=128;
  const ctx=shadowCanvas.getContext('2d');const gradient=ctx.createRadialGradient(64,64,8,64,64,64);gradient.addColorStop(0,'rgba(22,48,5,.55)');gradient.addColorStop(1,'rgba(22,48,5,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);
  const contactTexture=new THREE.CanvasTexture(shadowCanvas);
  const contact=new THREE.Mesh(new THREE.PlaneGeometry(1.65,1.0),new THREE.MeshBasicMaterial({map:contactTexture,transparent:true,depthWrite:false}));contact.rotation.x=-Math.PI/2;contact.position.set(0,-1.695,.05);scene.add(contact);
  const pivot=new THREE.Group();scene.add(pivot);
  let model=null,disposed=false,frame=0,elapsed=0,last=performance.now(),target=0;
  const disposeModel=root=>root.traverse(o=>{if(o.isMesh){o.geometry.dispose();for(const m of (Array.isArray(o.material)?o.material:[o.material])){for(const v of Object.values(m))if(v?.isTexture)v.dispose();m.dispose()}}});
  const loader=new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  loader.load('/auti-character.glb',gltf=>{
   if(disposed){disposeModel(gltf.scene);return}
   model=gltf.scene;
   const box=new THREE.Box3().setFromObject(model),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
   const scale=3.4/size.y;model.scale.setScalar(scale);model.position.copy(center).multiplyScalar(-scale);
   model.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});pivot.add(model);setStatus('ready');
  },undefined,error=>{console.error('AUTI model could not load',error);if(!disposed)setStatus('error')});
  const resize=()=>{const w=container.clientWidth,h=container.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.position.z=camera.aspect<.65?9.3:7.4;camera.updateProjectionMatrix()};
  const observer=new ResizeObserver(resize);observer.observe(container);resize();
  const move=e=>{target=(e.clientX/innerWidth-.5)*.23};window.addEventListener('pointermove',move);
  const animate=now=>{
   const dt=Math.min((now-last)/1000,.05);last=now;
   if(!document.hidden){
    if(!settings.current.paused)elapsed+=dt;
    pivot.rotation.y+=((settings.current.paused?0:target)-pivot.rotation.y)*.035;
    // Rotate only around the vertical axis: feet never lift off the ground.
    pivot.rotation.z=0;
    renderer.render(scene,camera);
   }
   frame=requestAnimationFrame(animate);
  };frame=requestAnimationFrame(animate);
  return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('pointermove',move);if(model)disposeModel(model);ground.geometry.dispose();ground.material.dispose();contact.geometry.dispose();contact.material.dispose();contactTexture.dispose();sun.shadow.dispose();renderer.dispose();renderer.domElement.remove()};
 },[]);
 return <div className="character-stage" aria-label="AUTI 3D character"><div className="character-canvas" ref={host}/>{status==='loading'&&<div className="model-status" role="status">AUTI is on the way…</div>}{status==='error'&&<div className="model-status" role="status">Could not load AUTI. Please refresh the page.</div>}</div>
}
