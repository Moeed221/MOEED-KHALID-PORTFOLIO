import * as THREE from './assets/three.module.js';
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const lerp=(a,b,t)=>a+(b-a)*t;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');

export function initJourney(projects){
 const root=document.querySelector('#journey');if(!root)return;
 let canvas=document.querySelector('#journey-canvas'),renderer=null,ctx=null,raf=0,visible=false,elapsed=0,last=0,lastPaint=0,active=-1,target=0,current=0,pinned=false,manualSelection=null,userInteracted=false,workStart=0,workDistance=1,pointer={x:0,y:0},smoothPointer={x:0,y:0};
 const work=document.querySelector('#work'),heroToggle=document.querySelector('.motion-toggle'),toggle=document.querySelector('.journey-motion');
 let paused=reduced.matches;
 const windows=[...root.querySelectorAll('.scene-window')];
 const fallback=document.querySelector('#showroom-fallback');
 fallback.innerHTML=projects.map((p,i)=>`<a class="fallback-screen ${['iqprompt','mnimi','snooker','developer-x'].includes(p.slug)?'':'is-phone'}" href="/projects/${p.slug}/" aria-label="Explore ${p.name}" data-index="${i}" tabindex="-1" aria-hidden="true"><img src="/assets/${p.image}" alt="${p.name} interface" loading="${i<3?'eager':'lazy'}" draggable="false"></a>`).join('');
 const fallbackCards=[...fallback.children];
 const pagination=document.querySelector('#project-pagination');
 pagination.innerHTML=projects.map((p,i)=>`<button type="button" aria-label="Show ${p.name}" data-index="${i}">${String(i+1).padStart(2,'0')}</button>`).join('');
 const pageButtons=[...pagination.children],prev=document.querySelector('#showroom-prev'),next=document.querySelector('#showroom-next');
 function updateProject(index){
  if(index===active)return;active=index;const p=projects[index];
  document.querySelector('#project-counter').innerHTML=`${String(index+1).padStart(2,'0')} <small>/ ${String(projects.length).padStart(2,'0')}</small>`;
  document.querySelector('#project-category').textContent=p.category;
  document.querySelector('#active-project-title').textContent=p.name;
  document.querySelector('#active-project-summary').textContent=p.summary;
  const link=document.querySelector('#project-visit');link.href=`/projects/${p.slug}/`;link.setAttribute('aria-label',`Explore ${p.name}`);
  pageButtons.forEach((b,i)=>b.setAttribute('aria-current',String(i===index)));prev.disabled=index===0;next.disabled=index===projects.length-1;
  fallbackCards.forEach((card,i)=>{card.tabIndex=i===index&&!renderer?0:-1;card.setAttribute('aria-hidden',String(i!==index||!!renderer));card.style.pointerEvents=i===index&&!renderer?'auto':'none';});
 }
 function goTo(index){
  index=clamp(index,0,projects.length-1);
  if(pinned){manualSelection=index;target=index;updateProject(index);window.scrollTo({top:workStart+workDistance*index/(projects.length-1),behavior:paused?'instant':'smooth'});}else{target=index;updateProject(index);wake();}
 }
 pageButtons.forEach((button,i)=>button.addEventListener('click',()=>goTo(i)));prev.addEventListener('click',()=>goTo(active-1));next.addEventListener('click',()=>goTo(active+1));
 const showroom=root.querySelector('[data-scene="work"]');
 showroom.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();goTo(active+(e.key==='ArrowRight'?1:-1));}if(e.key==='Enter'&&e.target===showroom)location.assign(`/projects/${projects[active].slug}/`);});
 let down=null,suppressClick=false;
 showroom.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};suppressClick=false;});
 showroom.addEventListener('pointerup',e=>{if(!down)return;const dx=e.clientX-down.x,dy=e.clientY-down.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){suppressClick=true;goTo(active+(dx<0?1:-1));}down=null;});
 showroom.addEventListener('pointercancel',()=>down=null);
 function setPause(value){paused=value;document.documentElement.classList.toggle('portfolio-paused',value);root.classList.toggle('motion-paused',value);toggle.textContent=value?'Resume motion':'Pause motion';toggle.setAttribute('aria-pressed',String(value));last=0;wake();}
 toggle.addEventListener('click',()=>{const value=!paused;if(heroToggle&&heroToggle.getAttribute('aria-pressed')!==String(value))heroToggle.click();setPause(value);});
 if(heroToggle)new MutationObserver(()=>setPause(heroToggle.getAttribute('aria-pressed')==='true')).observe(heroToggle,{attributes:true,attributeFilter:['aria-pressed']});
 reduced.addEventListener('change',e=>{setPause(e.matches);measure();});setPause(paused);
 try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<760?1.3:1.6));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;renderer.autoClear=false;}catch{software();}
 function software(){renderer=null;const fresh=document.createElement('canvas');fresh.id='journey-canvas';fresh.className='journey-canvas';fresh.setAttribute('aria-hidden','true');canvas.replaceWith(fresh);canvas=fresh;ctx=canvas.getContext('2d',{alpha:true});root.classList.remove('gpu-ready');root.classList.add('software-ready');active=-1;updateProject(Math.round(target));}
 const gpu=!!renderer,segments=gpu?100:44,radial=gpu?12:6;
 let environment=null;
 if(renderer){
  const studio=new THREE.Scene();studio.background=new THREE.Color('#32203e');
  for(const [color,w,h,x,y,z] of [['#ffffff',5,8,-4,4,5],['#e4b4ff',4,7,5,0,3],['#8353ff',6,5,-2,-4,1],['#c4e3ff',5,2,0,5,-2]]){const light=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide}));light.position.set(x,y,z);light.lookAt(0,0,0);studio.add(light);}
  const generator=new THREE.PMREMGenerator(renderer);environment=generator.fromScene(studio,.05);generator.dispose();studio.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
 }
 const chrome=new THREE.MeshPhysicalMaterial({color:'#d3c2ed',metalness:.94,roughness:.19,clearcoat:1,envMap:environment?.texture,envMapIntensity:1.6});
 const lilac=new THREE.MeshPhysicalMaterial({color:'#ad75d7',metalness:.72,roughness:.24,clearcoat:1,envMap:environment?.texture});
 const dark=new THREE.MeshStandardMaterial({color:'#392247',metalness:.75,roughness:.29,envMap:environment?.texture});
 const scenes=windows.map(host=>{const scene=new THREE.Scene();scene.environment=environment?.texture;const camera=new THREE.PerspectiveCamera(38,1,.1,80);camera.position.set(0,0,8.4);scene.add(new THREE.HemisphereLight(0xe5c9ff,0x1a0c29,2));const a=new THREE.DirectionalLight(0xffffff,4);a.position.set(-3,5,6);scene.add(a);const b=new THREE.DirectionalLight(0xc577ff,3);b.position.set(4,-2,3);scene.add(b);return{host,scene,camera,type:host.dataset.scene,group:new THREE.Group(),uniforms:[],renderables:[]};});
 function halo(entry,color){
  if(!gpu)return;
  const uniforms={uTime:{value:0},uColor:{value:new THREE.Color(color)}};
  const material=new THREE.ShaderMaterial({uniforms,transparent:true,depthWrite:false,side:THREE.DoubleSide,vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'varying vec2 vUv; uniform float uTime; uniform vec3 uColor; void main(){vec2 p=(vUv-.5)*2.;float r=length(p);float a=atan(p.y,p.x);float wave=sin(r*15.-uTime*.5+sin(a*3.+uTime*.12)*1.3)*.5+.5;float glow=exp(-pow((r-.43)*5.,2.));float alpha=glow*(.065+wave*.085)*smoothstep(1.,.4,r);gl_FragColor=vec4(uColor,alpha);}'});
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(14,14),material);mesh.position.z=-3.5;entry.scene.add(mesh);entry.uniforms.push(uniforms);
 }
 function ring(radius,tube,material=chrome){return new THREE.Mesh(new THREE.TorusGeometry(radius,tube,radial,segments),material);}
 function orb(radius,material=chrome){return new THREE.Mesh(new THREE.IcosahedronGeometry(radius,gpu?2:1),material);}
 function lines(geometry,color,opacity=.4){return new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({color,transparent:true,opacity}));}
 let screenGroups=[],screenMeshes=[];
 for(const entry of scenes){
  const {scene,group,type}=entry;scene.add(group);halo(entry,type==='portal'?'#b365ff':'#b493e3');
  if(type==='work'){
   entry.camera.position.set(0,.12,8.4);entry.camera.fov=36;
   const loader=new THREE.TextureLoader();
   projects.forEach((p,i)=>{
    const phone=!['iqprompt','mnimi','snooker','developer-x'].includes(p.slug),g=new THREE.Group();g.userData.project=i;
    const width=phone?1.62:4.35,height=phone?3.65:3.35;
    const shape=new THREE.Shape(),x=-width/2,y=-height/2,r=phone?.18:.12;
    shape.moveTo(x+r,y);shape.lineTo(x+width-r,y);shape.quadraticCurveTo(x+width,y,x+width,y+r);shape.lineTo(x+width,y+height-r);shape.quadraticCurveTo(x+width,y+height,x+width-r,y+height);shape.lineTo(x+r,y+height);shape.quadraticCurveTo(x,y+height,x,y+height-r);shape.lineTo(x,y+r);shape.quadraticCurveTo(x,y,x+r,y);
    const frame=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.065,bevelEnabled:true,bevelThickness:.038,bevelSize:.035,bevelSegments:2,steps:1,curveSegments:8}),dark);g.add(frame);
    const screen=new THREE.Mesh(new THREE.PlaneGeometry(width-.14,height-.14),new THREE.MeshBasicMaterial({color:'#7c6397',toneMapped:false}));screen.position.z=.109;screen.userData.project=i;g.add(screen);screenMeshes.push(screen);
    if(gpu)loader.load('/assets/'+p.image,texture=>{texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(4,renderer?.capabilities.getMaxAnisotropy()||1);if(!phone){const crop=Math.min(1,(texture.image.width/texture.image.height)/((width-.14)/(height-.14)));texture.repeat.y=crop;texture.offset.y=1-crop;}screen.material.map=texture;screen.material.color.set('#ffffff');screen.material.needsUpdate=true;if(i===0)root.classList.add('gpu-ready');wake();},undefined,()=>{root.classList.remove('gpu-ready');});
    const edges=lines(new THREE.EdgesGeometry(frame.geometry,30),'#bd92e0',.6);g.add(edges);group.add(g);screenGroups.push(g);
   });
   const orbit=ring(3.8,.012,new THREE.MeshBasicMaterial({color:'#8d58b0',transparent:true,opacity:.4}));orbit.rotation.x=1.43;orbit.position.set(0,-2.1,-1.3);scene.add(orbit);
   entry.orbit=orbit;
  }
  if(type==='method'){
   entry.plates=[];group.rotation.set(.5,-.42,-.19);
   for(let i=0;i<4;i++){
    const layer=new THREE.Group();const slab=new THREE.Mesh(new THREE.BoxGeometry(2.85,.09,2.1),i===3?chrome:(i%2?lilac:dark));layer.add(slab);layer.add(lines(new THREE.EdgesGeometry(slab.geometry),'#e0bdff',.75));
    for(let j=0;j<5;j++){const tile=new THREE.Mesh(new THREE.BoxGeometry(j===0?2.25:.57,.055,j===0?.17:.45),new THREE.MeshStandardMaterial({color:j===0?'#eedaff':j%2?'#9b6ac2':'#d4b3ec',metalness:.4,roughness:.3}));tile.position.set(j===0?0:((j-1)%3-1)*.76,.09,j===0?-.7:Math.floor((j-1)/3)*.65-.15);layer.add(tile);}
    entry.plates.push(layer);group.add(layer);
   }
   const loop=ring(2.65,.022,lilac);loop.rotation.set(1.12,.6,-.25);scene.add(loop);entry.orbit=loop;
   entry.satellites=Array.from({length:3},(_,i)=>{const o=orb(.09+i*.02,chrome);scene.add(o);return o;});
  }
  if(type==='orbit'){
   const sphere=orb(1.45,dark);group.add(sphere);const wire=lines(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.5,2)),'#b286d5',.6);group.add(wire);
   entry.rings=[];for(let i=0;i<3;i++){const o=ring(2.02+i*.17,i===0?.055:.028,i===0?chrome:lilac);o.rotation.set(.6+i*.7,.4+i*.8,.25);group.add(o);entry.rings.push(o);}
   entry.satellites=Array.from({length:7},(_,i)=>{const o=orb(i===0?.17:.07,chrome);group.add(o);return o;});
  }
  if(type==='network'){
   const positions=[];for(let i=0;i<65;i++){const x=Math.sin(i*12.31)*7,y=Math.cos(i*5.97)*3.2,z=Math.sin(i*2.13)*2;positions.push(x,y,z);}
   const nodes=new THREE.BufferGeometry();nodes.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));group.add(new THREE.Points(nodes,new THREE.PointsMaterial({color:'#dfbcfa',size:.048,transparent:true,opacity:.85})));
   const connections=[];for(let i=0;i<65;i++)for(let j=i+1;j<65;j++){const a=new THREE.Vector3().fromArray(positions,i*3),b=new THREE.Vector3().fromArray(positions,j*3);if(a.distanceTo(b)<2.35)connections.push(...a.toArray(),...b.toArray());}
   const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(connections,3));group.add(lines(geo,'#b580dc',.36));entry.camera.position.z=10;
  }
  if(type==='portal'){
   entry.rings=[];for(let i=0;i<(gpu?9:5);i++){const material=i===0?chrome:new THREE.MeshStandardMaterial({color:i%2?'#b475e1':'#634585',metalness:.8,roughness:.24,transparent:true,opacity:i===0?1:.65,envMap:environment?.texture});const o=ring(2.5,.048+i*.003,material);o.position.z=-i*1.8;o.rotation.set(.13*Math.sin(i),.18*Math.cos(i),0);group.add(o);entry.rings.push(o);}
   const particles=[];for(let i=0;i<110;i++){const a=i*2.399,r=2.2+(i%8)*.5;particles.push(Math.cos(a)*r,Math.sin(a)*r,-(i%14));}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(particles,3));group.add(new THREE.Points(geo,new THREE.PointsMaterial({color:'#e3c0ff',size:.025,transparent:true,opacity:.6})));
  }
  scene.traverse(o=>{if(o.isMesh&&!o.material.isShaderMaterial||o.isLineSegments||o.isPoints)entry.renderables.push(o);});
 }
 const workScene=scenes.find(s=>s.type==='work'),raycaster=new THREE.Raycaster();
 showroom.addEventListener('click',e=>{if(suppressClick){e.preventDefault();suppressClick=false;return;}if(!renderer||e.target.closest('a'))return;const r=showroom.getBoundingClientRect();raycaster.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,1-(e.clientY-r.top)/r.height*2),workScene.camera);const hit=raycaster.intersectObjects(screenMeshes)[0];if(hit){const i=hit.object.userData.project;if(i===active)location.assign(`/projects/${projects[i].slug}/`);else goTo(i);}});
 function measure(){
  pinned=innerWidth>=760&&innerHeight>=740&&!reduced.matches;work.classList.toggle('is-pinned',pinned);work.style.height=pinned?`${innerHeight+(projects.length-1)*360}px`:'';
  workStart=work.getBoundingClientRect().top+scrollY;workDistance=Math.max(1,work.offsetHeight-innerHeight);
  if(renderer){renderer.setSize(innerWidth,innerHeight,false);}else if(ctx){const dpr=Math.min(devicePixelRatio,1.4);canvas.width=Math.round(innerWidth*dpr);canvas.height=Math.round(innerHeight*dpr);canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';ctx.setTransform(dpr,0,0,dpr,0,0);}
  wake();
 }
 function wake(){if(!raf&&!document.hidden)raf=requestAnimationFrame(frame);}
 const methods=[...root.querySelectorAll('.method-steps article')],chapters=[...root.querySelectorAll(':scope>section')];let chapter='';
 function frame(now){
  raf=0;if(document.hidden)return;
  if(!visible){last=0;return;}
  if(!renderer&&!paused&&now-lastPaint<32){raf=requestAnimationFrame(frame);return;}lastPaint=now;
  const dt=last?Math.min((now-last)/1000,.05):0;last=now;if(!paused)elapsed+=dt;
  if(pinned)target=manualSelection??clamp((scrollY-workStart)/workDistance)*(projects.length-1);
  current=paused?target:lerp(current,target,Math.min(1,dt*10||.15));if(Math.abs(current-target)<.001)current=target;updateProject(Math.round(target));
  smoothPointer.x=paused?0:lerp(smoothPointer.x,pointer.x,.06);smoothPointer.y=paused?0:lerp(smoothPointer.y,pointer.y,.06);
  if(renderer){renderer.setScissorTest(false);renderer.setClearColor(0x000000,0);renderer.clear();renderer.setScissorTest(true);}else if(ctx){ctx.clearRect(0,0,innerWidth,innerHeight);}
  for(const entry of scenes){
   const r=entry.host.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight||r.width<=0||r.height<=0)continue;
   const progress=clamp((innerHeight-r.top)/(innerHeight+r.height));entry.camera.aspect=r.width/r.height;
   if(entry.type==='work')entry.camera.position.z=innerWidth<760?8.2:6.5;
   if(entry.type==='method')entry.camera.position.z=innerWidth<760?9.6:8.4;
   if(entry.type==='orbit')entry.camera.position.z=innerWidth<760?10:8.4;
   entry.camera.updateProjectionMatrix();animate(entry,elapsed,paused?.5:progress);
   if(renderer){renderer.setViewport(r.left,innerHeight-r.bottom,r.width,r.height);renderer.setScissor(Math.max(0,r.left),Math.max(0,innerHeight-r.bottom),Math.min(innerWidth,r.right)-Math.max(0,r.left),Math.min(innerHeight,r.bottom)-Math.max(0,r.top));renderer.render(entry.scene,entry.camera);}else if(ctx&&entry.type!=='work'){drawSoftware(entry,r);}
   if(entry.type==='work'&&!renderer){fallbackCards.forEach((card,i)=>{const d=i-current;card.style.visibility=Math.abs(d)<2.1?'visible':'hidden';card.style.zIndex=String(10-Math.round(Math.abs(d)*3));card.style.opacity=String(clamp(1-Math.abs(d)*.24,.2,1));card.style.transform=`translate(-50%,-50%) translate3d(${d*(innerWidth<760?240:460)}px,${Math.sin(elapsed*.6+i)*(!paused?7:0)+Math.abs(d)*18}px,${-Math.abs(d)*240}px) rotateY(${-d*23+smoothPointer.x*5}deg) rotateZ(${-d*3}deg)`;});}
  }
  let nextChapter='01 / WORK';chapters.forEach((section,i)=>{if(section.getBoundingClientRect().top<innerHeight*.45)nextChapter=['01 / WORK','02 / PROCESS','03 / ABOUT','04 / CONTACT'][i]||nextChapter;});if(nextChapter!==chapter){chapter=nextChapter;document.querySelector('#journey-chapter').textContent=chapter;}
  const methodRect=root.querySelector('#process').getBoundingClientRect(),step=clamp(Math.floor((innerHeight*.8-methodRect.top)/(methodRect.height*.8)*4),0,3);methods.forEach((el,i)=>el.classList.toggle('is-active',i===step));
  if(!paused||Math.abs(current-target)>.001)raf=requestAnimationFrame(frame);
 }
 function animate(entry,t,progress){
  const {group,type}=entry;entry.uniforms.forEach(u=>u.uTime.value=t);
  if(type==='work'){
   screenGroups.forEach((g,i)=>{const d=i-current;g.visible=Math.abs(d)<2.2;g.position.set(d*4.2,-Math.abs(d)*.13+Math.sin(t*.7+i)*(paused?0:.045),-Math.abs(d)*1.35);g.rotation.set(.02+smoothPointer.y*.07,-d*.34+smoothPointer.x*.09,-d*.025);});entry.orbit.rotation.z=t*.04;
  }
  if(type==='method'){
   const spread=paused?.62:.34+Math.sin(progress*Math.PI)*.64;entry.plates.forEach((layer,i)=>{layer.position.y=(i-1.5)*spread;layer.rotation.y=Math.sin(t*.35+i*.3)*.055;});group.rotation.y=-.46+t*.09+smoothPointer.x*.12;group.rotation.x=.47+Math.sin(progress*Math.PI)*.1;entry.orbit.rotation.z=t*.06;entry.satellites.forEach((o,i)=>o.position.set(Math.cos(t*.35+i*2.1)*2.5,Math.sin(t*.35+i*2.1)*2.4,Math.sin(t*.35+i)*.7));
  }
  if(type==='orbit'){
   group.rotation.set(.15+smoothPointer.y*.12,t*.13+progress*.7,.12);entry.rings.forEach((r,i)=>{r.rotation.z=t*(i%2?-.09:.08)+i*.6;});entry.satellites.forEach((o,i)=>{const a=t*.28+i*.9;o.position.set(Math.cos(a)*2.18,Math.sin(a)*1.7,Math.sin(a+i)*1.3);});
  }
  if(type==='network'){group.rotation.set(.1*Math.sin(t*.1),Math.sin(t*.08)*.14,(progress-.5)*.12);}
  if(type==='portal'){entry.rings.forEach((r,i)=>{r.rotation.x=Math.sin(t*.18+i*.35)*.18;r.rotation.y=Math.cos(t*.14+i*.22)*.21;r.rotation.z=t*.035+i*.12;const s=1+Math.sin(t*.45-i*.6)*.075;r.scale.setScalar(s);});group.rotation.z=(progress-.5)*.24+smoothPointer.x*.03;}
 }
 // The same scene geometry is projected in browsers that cannot create a GPU context.
 const a=new THREE.Vector3(),b=new THREE.Vector3(),c=new THREE.Vector3(),normal=new THREE.Vector3(),ab=new THREE.Vector3(),ac=new THREE.Vector3(),light=new THREE.Vector3(-.35,.6,1).normalize(),mvp=new THREE.Matrix4();
 function drawSoftware(entry,r){
  entry.scene.updateMatrixWorld();entry.camera.updateMatrixWorld();const shapes=[];
  for(const object of entry.renderables){
   if(!object.visible)continue;const geometry=object.geometry,position=geometry.attributes.position;if(!position)continue;const material=Array.isArray(object.material)?object.material[0]:object.material,color=material.color||new THREE.Color('#c6a2e0'),opacity=material.opacity??1;
   mvp.multiplyMatrices(entry.camera.projectionMatrix,entry.camera.matrixWorldInverse).multiply(object.matrixWorld);
   if(object.isMesh){
    const count=geometry.index?geometry.index.count:position.count;
    for(let i=0;i<count;i+=3){const ids=geometry.index?[geometry.index.getX(i),geometry.index.getX(i+1),geometry.index.getX(i+2)]:[i,i+1,i+2];a.fromBufferAttribute(position,ids[0]);b.fromBufferAttribute(position,ids[1]);c.fromBufferAttribute(position,ids[2]);ab.subVectors(b,a);ac.subVectors(c,a);normal.crossVectors(ab,ac).transformDirection(object.matrixWorld);const shine=Math.pow(Math.max(0,normal.dot(light)),14),shade=.45+Math.abs(normal.dot(light))*.4;a.applyMatrix4(mvp);b.applyMatrix4(mvp);c.applyMatrix4(mvp);if(a.z>1||b.z>1||c.z>1)continue;const rgb=[color.r,color.g,color.b].map(v=>Math.round(clamp(v*shade+shine*.55)*255));shapes.push({type:'face',points:[a.x,a.y,b.x,b.y,c.x,c.y],z:(a.z+b.z+c.z)/3,color:`rgba(${rgb.join(',')},${opacity})`});}
   }else if(object.isLineSegments){for(let i=0;i<position.count;i+=2){a.fromBufferAttribute(position,i).applyMatrix4(mvp);b.fromBufferAttribute(position,i+1).applyMatrix4(mvp);shapes.push({type:'line',points:[a.x,a.y,b.x,b.y],z:(a.z+b.z)/2,color:`rgba(${Math.round(color.r*255)},${Math.round(color.g*255)},${Math.round(color.b*255)},${opacity})`});}}
   else if(object.isPoints){for(let i=0;i<position.count;i++){a.fromBufferAttribute(position,i).applyMatrix4(mvp);shapes.push({type:'point',points:[a.x,a.y],z:a.z,color:'#d3aaeaaa'});}}
  }
  shapes.sort((a,b)=>b.z-a.z);ctx.save();ctx.beginPath();ctx.rect(r.left,r.top,r.width,r.height);ctx.clip();
  for(const s of shapes){const pts=s.points;ctx.beginPath();ctx.moveTo(r.left+(pts[0]+1)*r.width/2,r.top+(1-pts[1])*r.height/2);for(let i=2;i<pts.length;i+=2)ctx.lineTo(r.left+(pts[i]+1)*r.width/2,r.top+(1-pts[i+1])*r.height/2);if(s.type==='face'){ctx.closePath();ctx.fillStyle=s.color;ctx.fill();}else if(s.type==='line'){ctx.strokeStyle=s.color;ctx.lineWidth=.85;ctx.stroke();}else{ctx.fillStyle=s.color;ctx.fillRect(r.left+(pts[0]+1)*r.width/2,r.top+(1-pts[1])*r.height/2,2,2);}}
  ctx.restore();
 }
 root.addEventListener('pointermove',e=>{pointer.x=e.clientX/innerWidth-.5;pointer.y=e.clientY/innerHeight-.5;wake();},{passive:true});root.addEventListener('pointerleave',()=>{pointer={x:0,y:0};});
 root.querySelectorAll('.experience-deck article').forEach(card=>{card.addEventListener('pointermove',e=>{if(paused||e.pointerType==='touch')return;const r=card.getBoundingClientRect();card.style.setProperty('--tilt-x',`${-(e.clientY-r.top-r.height/2)/r.height*7}deg`);card.style.setProperty('--tilt-y',`${(e.clientX-r.left-r.width/2)/r.width*9}deg`);});card.addEventListener('pointerleave',()=>{card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg');});});
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;root.classList.toggle('is-visible',visible);if(visible)wake();else{cancelAnimationFrame(raf);raf=0;last=0;}},{threshold:0});observer.observe(root);
 function releaseSelection(){manualSelection=null;userInteracted=true;wake();}
 window.addEventListener('wheel',releaseSelection,{passive:true});window.addEventListener('touchmove',releaseSelection,{passive:true});window.addEventListener('keydown',e=>{if(['PageDown','PageUp','Home','End',' '].includes(e.key))releaseSelection();});window.addEventListener('pointerdown',e=>{if(e.clientX>=document.documentElement.clientWidth)releaseSelection();});
 window.addEventListener('resize',measure);window.addEventListener('scroll',wake,{passive:true});document.addEventListener('visibilitychange',()=>{last=0;if(!document.hidden)wake();else{cancelAnimationFrame(raf);raf=0;}});window.addEventListener('pageshow',()=>{measure();wake();});
 if(renderer)canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();software();measure();wake();},{once:true});
 measure();updateProject(0);document.fonts.ready.then(()=>{measure();const anchor=location.hash&&document.getElementById(location.hash.slice(1));if(anchor&&!userInteracted)anchor.scrollIntoView({block:'start',behavior:'instant'});});
}
