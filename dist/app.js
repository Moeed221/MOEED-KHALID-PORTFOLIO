const projects = [
 {slug:'iqprompt',name:'IQPrompt',category:'AI SaaS · Web & mobile',label:'AI & SAAS',image:'iqprompt-web-clear.jpg',phone:'iqprompt-mobile.png',color:'#e4e7f1',summary:'An AI product experience across a web platform and a mobile writing assistant.',role:'UI/UX design',scope:'Web platform & mobile app',problem:'Prompt-management and writing workflows need to feel clear, accessible, and easy to use across different contexts.',approach:'I organized the web experience around clear information architecture and consistent components, then designed the mobile experience around writing in the moment. The smart keyboard supports rewriting text in different tones without interrupting the user’s workflow.',decisions:['Give complex prompt workflows a clear information structure.','Use consistent components to support a scalable product interface.','Make tone selection and writing assistance easy to find on mobile.','Prepare high-fidelity Figma prototypes for developer handoff.'],captions:['IQPrompt web interface','IQPrompt mobile writing assistant']},
 {slug:'mnimi',name:'MNIMI',category:'Healthcare · Web & mobile',label:'HEALTHCARE',image:'mnimi-web-dashboard.jpg',phone:'mnimi-mobile.png',color:'#dfe7e4',summary:'A role-based healthcare experience connecting operational dashboards with day-to-day care.',role:'UI/UX design',scope:'Healthcare dashboards & mobile app',problem:'Healthcare teams and families need different information, while sharing a clear view of care, schedules, and updates.',approach:'I designed dedicated web dashboards for Super Admins, Admins, Hospitals, and Nurses, alongside mobile experiences for Patients, Caregivers, and Family Members. Each interface focuses on the information and actions relevant to its role.',decisions:['Organize web dashboards around the operational needs of each role.','Keep patient care, staff activity, and scheduling easy to navigate.','Bring medication schedules, journals, incidents, and daily activities into the mobile experience.','Support communication and care updates across connected roles.'],captions:['MNIMI hospital dashboard','MNIMI mobile care dashboard']},
 {slug:'cuidaapr',name:'CUIDAAPR',category:'Caregiver marketplace · Mobile',label:'MARKETPLACE',image:'cuidaapr-mobile.png',color:'#eadfe8',summary:'Helping people discover and book caregivers around their location and care needs.',role:'UI/UX design',scope:'Mobile marketplace',problem:'Finding a suitable caregiver requires people to understand their options and move confidently from discovery to booking.',approach:'I designed a mobile experience that brings service discovery, caregiver comparison, care requests, and booking into a coherent journey.',decisions:['Make location and care needs useful starting points for discovery.','Support comparison of caregiver options.','Give care requests and booking a clear place in the flow.','Keep important service information accessible on mobile.'],captions:['Caregiver discovery and service categories']},
 {slug:'aeonian',name:'Aeonian',category:'School transport · Mobile',label:'LOGISTICS',image:'aeonian-seat-reservation.png',color:'#eee6cf',summary:'A school-transport experience for parents and drivers, from seat reservations to live tracking.',role:'UI/UX design',scope:'Parent & driver mobile interfaces',problem:'School pick-ups and drop-offs involve reservations, timing, vehicle location, and status updates that need to be easy to understand at a glance.',approach:'I designed a seat-reservation and live school-transport experience with interfaces for both parents and drivers. The flows connect ride management with vehicle tracking and clear updates.',decisions:['Create understandable school pick-up and drop-off reservation flows.','Make vehicle tracking and ride status visible.','Support the different tasks of parents and drivers.','Keep ride-management information concise and easy to scan.'],captions:['School transport reservations and tracking dashboard']},
 {slug:'snooker',name:'Snooker Management',category:'B2B/B2C · Booking & dashboards',label:'B2B / B2C',image:'snooker-dashboard.jpg',color:'#e2e3ec',summary:'A management platform bringing table bookings, players, and tournaments into one interface.',role:'UI/UX design',scope:'Web management platform',problem:'Club operations and consumer bookings involve different tasks, from table availability to player management and tournament organization.',approach:'I designed a web-based management system for business and consumer users, organizing booking, player management, tournaments, and real-time updates into understandable interfaces.',decisions:['Create intuitive table-booking interfaces.','Organize player management and tournament activities.','Make real-time operational updates easy to scan.','Support both business and consumer workflows.'],captions:['Snooker club management dashboard']},
 {slug:'balochistan',name:'Balochistan e-Wallet',category:'Fintech · Mobile application',label:'FINTECH',image:'balochistan.png',color:'#dcebea',summary:'A government-funded mobile project focused on financial accessibility and interface clarity.',role:'UI/UX design contribution · TXLabz',scope:'Mobile fintech application',problem:'A financial application serving people with varied levels of technical literacy needs understandable interfaces and consistent interactions.',approach:'I contributed prototyping and wireframing work to improve usability and visual consistency across the Balochistan e-Wallet application.',decisions:['Focus on accessible, understandable mobile interfaces.','Use wireframes to establish clear screen structure.','Explore interactions through prototypes.','Maintain visual consistency across the application.'],captions:['Balochistan e-Wallet welcome interface']},
 {slug:'developer-x',name:'Developer.X',category:'Content platform · Responsive web',label:'CONTENT',image:'developer-x-blog.jpg',color:'#e9e4df',summary:'A website and blogging experience built around clear navigation and readable content.',role:'UI/UX design · Developer.X',scope:'Company website & blogging platform',problem:'Readers need to discover relevant content and navigate a blogging platform comfortably across screen sizes.',approach:'I designed the company website and blogging platform with a focus on information hierarchy, responsive layouts, and readability.',decisions:['Establish clear navigation and information hierarchy.','Use typography to support comfortable reading.','Make content discoverable.','Adapt layouts for different devices.'],captions:['Developer.X website and content layout']}
];
const originals=[...projects];
const iq=projects[0],mn=projects[1];
projects.splice(0,2,
 {...iq,name:'IQPrompt Web',category:'AI SaaS · Web platform',scope:'Web platform',phone:null,summary:'A clear web experience for AI prompt management and writing workflows.',approach:'I organized the web experience around clear information architecture and consistent components to make prompt-management and writing workflows easier to navigate.',decisions:[iq.decisions[0],iq.decisions[1],iq.decisions[3]]},
 {...mn,name:'MNIMI Web',category:'Healthcare · Web dashboards',scope:'Role-based web dashboards',phone:null,summary:'Role-based healthcare dashboards for hospital operations, staff, and schedules.',approach:'I designed dedicated web dashboards for Super Admins, Admins, Hospitals, and Nurses. Each interface focuses on the information and actions relevant to its role.',decisions:[mn.decisions[0],mn.decisions[1],mn.decisions[3]]},
 {...iq,slug:'iqprompt-mobile',name:'IQPrompt Mobile',image:iq.phone,phone:null,category:'AI writing assistant · Mobile',scope:'Mobile writing assistant',captions:[iq.captions[1]],summary:'An AI writing assistant that brings tone selection and rewriting into the mobile workflow.',approach:'I designed the mobile experience around writing in the moment. The smart keyboard supports rewriting text in different tones without interrupting the user’s workflow.',decisions:[iq.decisions[2],iq.decisions[3]]},
 {...mn,slug:'mnimi-mobile',name:'MNIMI Mobile',image:mn.phone,phone:null,category:'Healthcare · Mobile care',scope:'Patient, caregiver & family mobile app',captions:[mn.captions[1]],summary:'A mobile care experience connecting patients, caregivers, and family members.',approach:'I designed mobile experiences for Patients, Caregivers, and Family Members, bringing medication schedules, journals, incidents, and daily activities into the care journey.',decisions:[mn.decisions[2],mn.decisions[3]]});
const imageSizes = {"snooker-dashboard.jpg": [1440, 1788], "balochistan.png": [664, 1322], "aeonian-seat-reservation.png": [243, 593], "mnimi-web-dashboard.jpg": [1600, 1341], "mnimi-mobile.png": [242, 527], "iqprompt-mobile.png": [262, 625], "cuidaapr-mobile.png": [262, 637], "developer-x-blog.jpg": [1594, 4232], "iqprompt-web-clear.jpg": [932, 792]};
const grid = document.querySelector('#project-grid');
function projectCard(p,i){
 const mobile=!['iqprompt','mnimi','snooker','developer-x'].includes(p.slug);
 return `<a class="motion-project ${mobile?'is-mobile':'is-web'}" href="/projects/${p.slug}/" aria-label="Explore ${p.name}"><div class="motion-image" style="--project-color:${p.color}"><img src="/assets/${p.image}" alt="${p.name} interface" width="${imageSizes[p.image][0]}" height="${imageSizes[p.image][1]}" loading="lazy" decoding="async"><span class="motion-open" aria-hidden="true">↗</span></div><div class="motion-caption"><span class="motion-number">${String(i+1).padStart(2,'0')}</span><div><h3>${p.name}</h3><p>${p.category}</p></div></div></a>`;
}
if(grid) initMotionGallery();
const slug=location.pathname.split('/').filter(Boolean)[1];
if(location.pathname.startsWith('/projects/')){
 const p=projects.find(x=>x.slug===slug);
 if(p){
  document.title=`${p.name} — Moeed Naik`;
  document.querySelector('meta[name="description"]').content=p.summary;
  const next=projects[(projects.indexOf(p)+1)%projects.length];
  document.querySelector('#main').innerHTML=`<div class="case-page" style="--case-color:${p.color}"><a class="case-back" href="/#work">Back to projects</a><div class="case-header"><div><p class="eyebrow">${p.label} / SELECTED PROJECT</p><h1>${p.name}</h1></div><p>${p.summary}</p></div><div class="case-cover"><img src="/assets/${p.image}" alt="${p.captions[0]}">${p.phone?`<img class="case-phone" src="/assets/${p.phone}" alt="${p.captions[1]}">`:''}</div><div class="case-facts"><div><span>MY ROLE</span><p>${p.role}</p></div><div><span>PROJECT SCOPE</span><p>${p.scope}</p></div><div><span>FOCUS</span><p>${p.category}</p></div></div><section class="case-story"><h2>The challenge.</h2><p>${p.problem}</p></section><section class="case-story"><h2>The approach.</h2><p>${p.approach}</p></section><section class="case-story"><h2>Design decisions.</h2><ul>${p.decisions.map(x=>`<li>${x}</li>`).join('')}</ul></section><section class="case-details"><h2>A closer look.</h2><div class="case-gallery">${[p.image,p.phone].filter(Boolean).map((x,i)=>`<figure><img src="/assets/${x}" alt="${p.captions[i]}" loading="lazy"><figcaption>${p.captions[i]}</figcaption></figure>`).join('')}</div></section><div class="case-next"><div><p>NEXT PROJECT</p><a href="/projects/${next.slug}/">${next.name}</a></div><a href="mailto:moeedkhalid22@gmail.com" style="font-size:16px">Discuss a project</a></div></div>`;
 }else{document.querySelector('#main').innerHTML='<div class="case-page"><h1>Project not found</h1><a class="button primary" href="/#work">Explore projects</a></div>';}
}else{
 import('/scene.js?v=20260930f').then(m=>{m.initScene();}).catch(()=>document.querySelector('#hero-art')?.classList.add('failed'));
}

if(!location.pathname.startsWith('/projects/')){
 const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');reveal.unobserve(e.target);}}),{threshold:.1});
 document.querySelectorAll('.project-card,.process-steps article,.about-layout,.experience-list article').forEach(el=>{el.classList.add('reveal');reveal.observe(el)});

}

function initMotionGallery(){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'), wide=matchMedia('(min-width: 1000px)'), tablet=matchMedia('(min-width: 620px)');
 const section=grid.closest('section'), toggle=document.querySelector('.motion-toggle');
 let columns=[], visible=false, raf=0, count=0, opening=false;
 const paused=()=>reduced.matches||toggle?.getAttribute('aria-pressed')==='true';
 function draw(){
  raf=0;
  if(!visible||document.hidden)return;
  const rect=grid.getBoundingClientRect();
  const progress=Math.max(-1,Math.min(1,(innerHeight*.5-(rect.top+rect.height*.5))/(innerHeight+rect.height)*2));
  columns.forEach((column,i)=>{column.style.transform=`translate3d(0,${paused()||count===1?0:progress*[-34,26,-18][i]}px,0)`;});
 }
 function wake(){if(!raf)raf=requestAnimationFrame(draw);}
 function layout(){
  const next=wide.matches?3:tablet.matches?2:1;
  if(next!==count){
   count=next;grid.innerHTML=Array.from({length:count},()=>'<div class="motion-column"></div>').join('');columns=[...grid.children];
   projects.forEach((p,i)=>columns[i%count].insertAdjacentHTML('beforeend',projectCard(p,i)));
  }
  wake();
 }
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)wake();else{cancelAnimationFrame(raf);raf=0;}},{rootMargin:'120px'}).observe(section);
 window.addEventListener('scroll',wake,{passive:true});window.addEventListener('resize',layout);
 wide.addEventListener('change',layout);tablet.addEventListener('change',layout);reduced.addEventListener('change',wake);
 if(toggle)new MutationObserver(wake).observe(toggle,{attributes:true,attributeFilter:['aria-pressed']});
 document.addEventListener('visibilitychange',wake);grid.addEventListener('load',wake,true);
 grid.addEventListener('click',async event=>{
  const link=event.target.closest('.motion-project');
  if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||paused())return;
  const source=link.querySelector('.motion-image'), rect=source.getBoundingClientRect();
  if(!source.animate)return;
  event.preventDefault();if(opening)return;opening=true;
  const overlay=document.createElement('div');overlay.className='project-transition'+(link.classList.contains('is-mobile')?' is-mobile':'');overlay.setAttribute('aria-hidden','true');
  const preview=source.cloneNode(true);preview.classList.add('transition-preview');preview.querySelector('.motion-open')?.remove();
  Object.assign(preview.style,{position:'fixed',left:`${rect.left}px`,top:`${rect.top}px`,width:`${rect.width}px`,height:`${rect.height}px`,margin:'0'});
  overlay.append(preview);document.body.append(overlay);
  const mobile=link.classList.contains('is-mobile'), targetWidth=Math.min(innerWidth*(mobile?.55:.82),mobile?330:1080),targetHeight=Math.min(innerHeight*.78,mobile?targetWidth*2.15:targetWidth*.72);
  overlay.animate([{backgroundColor:'rgba(23,16,33,0)'},{backgroundColor:'rgba(23,16,33,.96)'}],{duration:480,fill:'forwards',easing:'ease-out'});
  const animation=preview.animate([{left:`${rect.left}px`,top:`${rect.top}px`,width:`${rect.width}px`,height:`${rect.height}px`,borderRadius:'10px'},{left:`${(innerWidth-targetWidth)/2}px`,top:`${(innerHeight-targetHeight)/2}px`,width:`${targetWidth}px`,height:`${targetHeight}px`,borderRadius:'16px'}],{duration:520,fill:'forwards',easing:'cubic-bezier(.22,1,.36,1)'});
  try{await animation.finished;}catch{}location.assign(link.href);
 });
 window.addEventListener('pageshow',()=>{document.querySelectorAll('.project-transition').forEach(el=>el.remove());opening=false;wake();});
 layout();
}
