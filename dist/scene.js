import * as THREE from './assets/three.module.js';

export function initScene(){
 const canvas=document.querySelector('#scene'),host=document.querySelector('#hero-art');if(!canvas||!host)return;
 let renderer;
 try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});}catch{host.classList.add('failed');document.querySelector('.motion-toggle').hidden=true;return;}
 renderer.setPixelRatio(Math.min(window.devicePixelRatio,window.innerWidth<800?1.4:1.75));
 renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
 renderer.shadowMap.enabled=window.innerWidth>=800;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(36,1,.1,40);camera.position.set(0,.4,9.6);camera.lookAt(0,.1,0);
 scene.add(new THREE.HemisphereLight(0xffffff,0x8891bb,2.5));
 const key=new THREE.DirectionalLight(0xffffff,5);key.position.set(-3,7,6);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-6;key.shadow.camera.right=6;key.shadow.camera.top=6;key.shadow.camera.bottom=-6;key.shadow.bias=-.001;scene.add(key);
 const rim=new THREE.DirectionalLight(0xb8cdff,4);rim.position.set(4,2,-2);scene.add(rim);
 const light=new THREE.PointLight(0x799dff,20,15);light.position.set(1,-1,4);scene.add(light);
 const world=new THREE.Group();scene.add(world);
 const shape=new THREE.Shape();shape.moveTo(-1.4,-1.1);shape.lineTo(-1.4,1.15);shape.lineTo(-.72,1.15);shape.lineTo(0,.15);shape.lineTo(.72,1.15);shape.lineTo(1.4,1.15);shape.lineTo(1.4,-1.1);shape.lineTo(.67,-1.1);shape.lineTo(.67,.04);shape.lineTo(0,-.82);shape.lineTo(-.67,.04);shape.lineTo(-.67,-1.1);shape.closePath();
 const geometry=new THREE.ExtrudeGeometry(shape,{depth:.52,bevelEnabled:true,bevelSegments:6,steps:1,bevelSize:.12,bevelThickness:.12,curveSegments:20});geometry.center();
 const sculpture=new THREE.Mesh(geometry,new THREE.MeshPhysicalMaterial({color:0x2448ef,metalness:.48,roughness:.22,clearcoat:1,clearcoatRoughness:.13}));sculpture.castShadow=true;sculpture.rotation.set(.09,-.35,-.14);sculpture.position.set(.2,.2,0);world.add(sculpture);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(2.25,.018,12,100),new THREE.MeshStandardMaterial({color:0x8e99bd,metalness:.5,roughness:.4}));ring.rotation.set(1.15,.2,-.2);ring.position.set(.1,-.3,-.8);world.add(ring);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(20,20),new THREE.ShadowMaterial({opacity:.11}));floor.rotation.x=-Math.PI/2;floor.position.y=-2.1;floor.receiveShadow=true;scene.add(floor);
 const loader=new THREE.TextureLoader();const screens=[];
 function device(file,w,h,pos,rot){
  const g=new THREE.Group();
  const frame=new THREE.Mesh(new THREE.BoxGeometry(w+.10,h+.10,.13),new THREE.MeshStandardMaterial({color:0x252731,metalness:.7,roughness:.3}));frame.castShadow=true;g.add(frame);
  const edge=new THREE.Mesh(new THREE.BoxGeometry(w+.13,h+.13,.08),new THREE.MeshStandardMaterial({color:0xb9bdc9,metalness:.6,roughness:.22}));edge.position.z=-.05;g.add(edge);
  loader.load('/assets/'+file,texture=>{texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());const screen=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:texture}));screen.position.z=.071;g.add(screen);render();},undefined,()=>{});
  g.position.set(...pos);g.rotation.set(...rot);g.userData={baseY:pos[1],phase:screens.length*1.7};world.add(g);screens.push(g);return g;
 }
 device('iqprompt-web-clear.jpg',1.9,1.61,[-1.72,1.17,-.8],[.04,.32,.12]);
 device('cuidaapr-mobile.png',.7,1.70,[2.03,.4,.35],[.08,-.28,-.12]);
 device('mnimi-mobile.png',.65,1.42,[-.95,-1.14,.7],[-.1,.22,.10]);
 const smallOrb=new THREE.Mesh(new THREE.SphereGeometry(.16,24,24),new THREE.MeshPhysicalMaterial({color:0x8199ff,metalness:.65,roughness:.2}));smallOrb.position.set(1.5,1.75,-.4);world.add(smallOrb);
 const media=matchMedia('(prefers-reduced-motion: reduce)');let paused=media.matches,visible=true,tabVisible=!document.hidden,raf=0,pointer={x:0,y:0},scrollProgress=0,last=0;
 const button=document.querySelector('.motion-toggle');function buttonState(){button.textContent=paused?'Resume motion':'Pause motion';button.setAttribute('aria-pressed',String(paused));}buttonState();
 function render(){renderer.render(scene,camera)}
 function resize(){const rect=host.getBoundingClientRect();renderer.setSize(rect.width,rect.height,false);camera.aspect=rect.width/rect.height;camera.position.z=rect.width<500?10.8:9.6;camera.updateProjectionMatrix();render();}resize();
 const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
 function frame(t){raf=0;if(!visible||!tabVisible||paused){render();return;}if(t-last>=1000/(window.innerWidth<800?30:60)){const time=t*.001;world.rotation.y+=(pointer.x*.13+scrollProgress*.13-world.rotation.y)*.04;world.rotation.x+=(-pointer.y*.07-world.rotation.x)*.04;sculpture.position.y=.2+Math.sin(time*.7)*.09;sculpture.rotation.z=-.14+Math.sin(time*.4)*.025;ring.rotation.z=-.2+time*.035;screens.forEach(g=>{g.position.y=g.userData.baseY+Math.sin(time*.65+g.userData.phase)*.08;});smallOrb.position.y=1.75+Math.sin(time)*.12;render();last=t;}raf=requestAnimationFrame(frame);}
 function schedule(){if(!raf&&!paused&&visible&&tabVisible)raf=requestAnimationFrame(frame);else render();}
 button.addEventListener('click',()=>{paused=!paused;buttonState();schedule();});
 media.addEventListener('change',e=>{paused=e.matches;buttonState();schedule();});
 host.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||paused)return;const r=host.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width-.5;pointer.y=(e.clientY-r.top)/r.height-.5;});host.addEventListener('pointerleave',()=>{pointer.x=pointer.y=0;});
 window.addEventListener('scroll',()=>{scrollProgress=Math.min(1,window.scrollY/700);},{passive:true});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:0}).observe(host);
 document.addEventListener('visibilitychange',()=>{tabVisible=!document.hidden;schedule();});
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();paused=true;host.classList.add('failed');button.hidden=true;});
 schedule();
}

export function initGallery(projects){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 document.querySelectorAll('.project-card').forEach((card,i)=>{
  const host=card.querySelector('.project-image'),p=projects[i];if(!p)return;
  const observer=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)return;observer.disconnect();start();},{rootMargin:'180px'});observer.observe(host);
  function start(){
   const canvas=document.createElement('canvas');canvas.className='gallery-canvas';canvas.setAttribute('aria-hidden','true');
   let renderer;try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});}catch{return;}
   renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;host.append(canvas);
   const scene=new THREE.Scene(),group=new THREE.Group();scene.add(group);const camera=new THREE.PerspectiveCamera(34,1,.1,20);camera.position.set(0,0,7.5);camera.lookAt(0,0,0);scene.add(new THREE.HemisphereLight(0xffffff,0x5c6482,3));const light=new THREE.DirectionalLight(0xffffff,4);light.position.set(-3,4,5);scene.add(light);
   const loader=new THREE.TextureLoader();let loaded=0,needed=p.phone?2:1;const frames=[];
   function device(file,height,x,y,z,angle){loader.load('/assets/'+file,texture=>{
    texture.colorSpace=THREE.SRGBColorSpace;const width=height*texture.image.width/texture.image.height;const g=new THREE.Group();const frame=new THREE.Mesh(new THREE.BoxGeometry(width+.08,height+.08,.1),new THREE.MeshStandardMaterial({color:0x343642,metalness:.5,roughness:.35}));const screen=new THREE.Mesh(new THREE.PlaneGeometry(width,height),new THREE.MeshBasicMaterial({map:texture}));screen.position.z=.051;g.add(frame,screen);g.position.set(x,y,z);g.rotation.set(.04,angle,angle*.3);group.add(g);frames.push(g);
    loaded++;if(loaded===needed){host.classList.add('webgl-ready');resize();}
   },undefined,()=>{canvas.remove();renderer.dispose();});}
   if(p.phone){device(p.image,2.15,-.3,.08,0,-.17);device(p.phone,2.25,1.05,-.1,.35,.14);}else{device(p.image,2.8,0,0,0,-.16);}
   function render(){renderer.render(scene,camera)}
   function resize(){const r=host.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();render();}
   const ro=new ResizeObserver(resize);ro.observe(host);resize();let raf=0;
   function update(){if(!raf)raf=requestAnimationFrame(()=>{raf=0;render();});}
   host.addEventListener('pointermove',e=>{if(reduced.matches||e.pointerType==='touch')return;const r=host.getBoundingClientRect();group.rotation.y=((e.clientX-r.left)/r.width-.5)*.24;group.rotation.x=-((e.clientY-r.top)/r.height-.5)*.12;update();});
   host.addEventListener('pointerleave',()=>{group.rotation.set(0,0,0);update();});
   canvas.addEventListener('webglcontextlost',()=>{host.classList.remove('webgl-ready');canvas.remove();});
  }
 });
}
