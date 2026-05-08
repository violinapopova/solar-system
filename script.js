const canvas=document.getElementById('space');
const ctx=canvas.getContext('2d');
const scene=document.getElementById('scene');
function resize(){canvas.width=scene.offsetWidth;canvas.height=scene.offsetHeight;}
resize();window.addEventListener('resize',resize);

const stars=Array.from({length:200},()=>({x:Math.random(),y:Math.random(),r:Math.random()*1.3+0.2,a:Math.random()*0.6+0.3,twinkle:Math.random()*Math.PI*2}));

const planets=[
  {name:'Mercury',radius:6,  orbitR:0.10,speed:4.7, color:'#b5b5b5',angle:0.3,
   facts:['Closest planet to the Sun','A year lasts just 88 Earth days','No atmosphere — extreme temperature swings','Surface covered in impact craters','Diameter: 4,879 km']},
  {name:'Venus',  radius:9,  orbitR:0.15,speed:3.5, color:'#e8cda0',angle:1.2,
   facts:['Hottest planet at 465°C average','Rotates backwards and very slowly','Thick CO₂ atmosphere traps heat','A day on Venus is longer than its year','Diameter: 12,104 km']},
  {name:'Earth',  radius:10, orbitR:0.21,speed:2.9, color:'#4fa3e0',angle:2.1,moon:true,
   facts:['Only known planet with life','71% of surface covered in water','One natural satellite — the Moon','Magnetic field shields us from solar wind','Diameter: 12,756 km']},
  {name:'Mars',   radius:7,  orbitR:0.27,speed:2.4, color:'#c1440e',angle:0.8,
   facts:['Called the Red Planet','Home to Olympus Mons, tallest volcano in the solar system','Has two small moons: Phobos & Deimos','A day is 24 hours and 37 minutes','Diameter: 6,792 km']},
  {name:'Jupiter',radius:22, orbitR:0.36,speed:1.3, color:'#c88b3a',angle:3.5,bands:true,
   facts:['Largest planet in the solar system','Great Red Spot storm is over 350 years old','Has 95 known moons','Powerful magnetic field','Diameter: 142,984 km']},
  {name:'Saturn', radius:18, orbitR:0.46,speed:0.96,color:'#e4d191',angle:5.1,rings:true,
   facts:['Famous for its stunning ring system','Rings made of ice and rock particles','Least dense planet — would float on water','Has 146 known moons','Diameter: 120,536 km']},
  {name:'Uranus', radius:13, orbitR:0.56,speed:0.68,color:'#7de8e8',angle:1.8,
   facts:['Ice giant with a faint ring system','Rotates on its side at 98° tilt','Coldest planetary atmosphere: −224°C','27 moons named after Shakespeare characters','Diameter: 51,118 km']},
  {name:'Neptune',radius:13, orbitR:0.65,speed:0.54,color:'#4b70dd',angle:4.2,
   facts:['Farthest planet from the Sun','Strongest winds in the solar system at 2,100 km/h','Has 16 known moons; Triton orbits backwards','One year equals 165 Earth years','Diameter: 49,528 km']},
];

let t=0,paused=false,focusedPlanet=null;
const FOCUS_SCALE=4;
const cam={x:0,y:0,scale:1};
const camT={x:0,y:0,scale:1};

function lighten(hex,amt){const n=parseInt(hex.slice(1),16);return`rgb(${Math.min(255,(n>>16)+amt)},${Math.min(255,((n>>8)&0xff)+amt)},${Math.min(255,(n&0xff)+amt)})`;}

// Info panel
const panel=document.createElement('div');
panel.className='info-panel';
scene.appendChild(panel);

function focusPlanet(p){
  focusedPlanet=p;
  camT.scale=FOCUS_SCALE;
  panel.innerHTML=`<button class="panel-close" id="pcl">✕</button><div class="panel-name" style="color:${p.color}">${p.name}</div><ul class="panel-facts">${p.facts.map(f=>`<li>${f}</li>`).join('')}</ul>`;
  document.getElementById('pcl').addEventListener('click',unfocus);
  panel.classList.add('visible');
}

function unfocus(){
  focusedPlanet=null;
  camT.x=0;camT.y=0;camT.scale=1;
  panel.classList.remove('visible');
}

document.addEventListener('keydown',e=>{
  if(e.code==='Space'){e.preventDefault();paused=!paused;}
  if(e.code==='Escape'&&focusedPlanet)unfocus();
});

// Pause indicator
const pauseEl=document.createElement('div');
pauseEl.className='pause-indicator';
pauseEl.textContent='PAUSED';
scene.appendChild(pauseEl);

// Hint
const hint=document.createElement('div');
hint.className='hint';
hint.innerHTML='Click a planet to explore &nbsp;·&nbsp; Space to pause &nbsp;·&nbsp; Esc to go back';
scene.appendChild(hint);

function draw(){
  const W=canvas.width,H=canvas.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='#020814';ctx.fillRect(0,0,W,H);

  cam.x+=(camT.x-cam.x)*0.07;
  cam.y+=(camT.y-cam.y)*0.07;
  cam.scale+=(camT.scale-cam.scale)*0.07;

  const sunX=W*0.5,sunY=H*0.5;

  planets.forEach(p=>{
    const orbitPx=p.orbitR*Math.min(W,H)*1.7;
    const angle=p.angle+t*p.speed*0.001;
    p.worldX=sunX+Math.cos(angle)*orbitPx;
    p.worldY=sunY+Math.sin(angle)*orbitPx*0.3;
    p.orbitPx=orbitPx;
    p.curAngle=angle;
  });

  if(focusedPlanet){
    camT.x=-(focusedPlanet.worldX-W/2)*camT.scale;
    camT.y=-(focusedPlanet.worldY-H/2)*camT.scale;
  }

  ctx.save();
  ctx.translate(W/2+cam.x,H/2+cam.y);
  ctx.scale(cam.scale,cam.scale);
  ctx.translate(-W/2,-H/2);

  stars.forEach(s=>{
    const tw=Math.sin(t*0.8+s.twinkle)*0.25+0.75;
    ctx.beginPath();ctx.arc(s.x*W,s.y*H,s.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(255,255,255,${s.a*tw})`;ctx.fill();
  });

  planets.forEach(p=>{
    const px=p.worldX,py=p.worldY,orbitPx=p.orbitPx,angle=p.curAngle;

    ctx.beginPath();ctx.ellipse(sunX,sunY,orbitPx,orbitPx*0.3,-0.15,0,Math.PI*2);
    ctx.strokeStyle='rgba(255,255,255,0.07)';ctx.lineWidth=0.5;ctx.stroke();

    if(p.rings){
      ctx.save();ctx.translate(px,py);ctx.rotate(-0.15);ctx.scale(1,0.3);
      ctx.beginPath();ctx.ellipse(0,0,p.radius*2.4,p.radius*2.4,0,0,Math.PI*2);
      ctx.strokeStyle='rgba(228,209,145,0.45)';ctx.lineWidth=3.5;ctx.stroke();
      ctx.beginPath();ctx.ellipse(0,0,p.radius*1.9,p.radius*1.9,0,0,Math.PI*2);
      ctx.strokeStyle='rgba(228,209,145,0.2)';ctx.lineWidth=2;ctx.stroke();
      ctx.restore();
    }

    const grad=ctx.createRadialGradient(px-p.radius*0.3,py-p.radius*0.3,0,px,py,p.radius);
    grad.addColorStop(0,lighten(p.color,60));grad.addColorStop(1,p.color);
    ctx.beginPath();ctx.arc(px,py,p.radius,0,Math.PI*2);ctx.fillStyle=grad;ctx.fill();

    if(p.bands){
      for(let b=0;b<3;b++){ctx.beginPath();ctx.ellipse(px,py-p.radius*0.5+b*p.radius*0.45,p.radius,p.radius*0.18,0,0,Math.PI*2);ctx.fillStyle='rgba(160,100,40,0.3)';ctx.fill();}
    }
    if(p.moon){
      const ma=angle*8,mr=p.radius+7;
      ctx.beginPath();ctx.arc(px+Math.cos(ma)*mr,py+Math.sin(ma)*mr*0.4,1.8,0,Math.PI*2);
      ctx.fillStyle='#ccc';ctx.fill();
    }

    if(p!==focusedPlanet){
      ctx.save();
      ctx.font='bold 11px system-ui';
      ctx.fillStyle='rgba(255,255,255,0.55)';
      ctx.textAlign='center';
      ctx.fillText(p.name,px,py-p.radius-7);
      ctx.restore();
    }
  });

  const sg=ctx.createRadialGradient(sunX,sunY,0,sunX,sunY,40);
  sg.addColorStop(0,'#fff7d6');sg.addColorStop(0.4,'#ffcc44');sg.addColorStop(1,'#ff7700');
  ctx.beginPath();ctx.arc(sunX,sunY,36,0,Math.PI*2);ctx.fillStyle=sg;ctx.fill();
  const gg=ctx.createRadialGradient(sunX,sunY,18,sunX,sunY,110);
  gg.addColorStop(0,'rgba(255,180,40,0.3)');gg.addColorStop(1,'rgba(255,120,0,0)');
  ctx.beginPath();ctx.arc(sunX,sunY,110,0,Math.PI*2);ctx.fillStyle=gg;ctx.fill();

  ctx.restore();

  pauseEl.style.opacity=paused?'1':'0';
  if(!paused)t++;
  requestAnimationFrame(draw);
}
draw();

function toWorld(ex,ey){
  const rect=canvas.getBoundingClientRect();
  const W=canvas.width,H=canvas.height;
  return{
    x:(ex-rect.left-W/2-cam.x)/cam.scale+W/2,
    y:(ey-rect.top-H/2-cam.y)/cam.scale+H/2
  };
}

canvas.addEventListener('click',e=>{
  const{x:wx,y:wy}=toWorld(e.clientX,e.clientY);
  for(const p of planets){
    if(p.worldX===undefined)continue;
    const dx=wx-p.worldX,dy=wy-p.worldY;
    if(Math.sqrt(dx*dx+dy*dy)<p.radius+12){
      if(focusedPlanet===p)unfocus();
      else focusPlanet(p);
      return;
    }
  }
  if(focusedPlanet)unfocus();
});

// Hover card
const card=document.createElement('div');
card.className='planet-card';
card.style.display='none';
scene.appendChild(card);

canvas.addEventListener('mousemove',e=>{
  if(focusedPlanet){card.style.display='none';return;}
  const{x:wx,y:wy}=toWorld(e.clientX,e.clientY);
  let hit=null;
  for(const p of planets){
    if(p.worldX===undefined)continue;
    const dx=wx-p.worldX,dy=wy-p.worldY;
    if(Math.sqrt(dx*dx+dy*dy)<p.radius+10){hit=p;break;}
  }
  if(hit){
    card.innerHTML=`<div class="pc-name" style="color:${hit.color}">${hit.name}</div><ul class="pc-facts">${hit.facts.map(f=>`<li>${f}</li>`).join('')}</ul>`;
    const cardW=220,cardH=card.offsetHeight||140;
    let cx=e.clientX+18,cy=e.clientY-20;
    if(cx+cardW>window.innerWidth-10)cx=e.clientX-cardW-18;
    if(cy+cardH>window.innerHeight-10)cy=window.innerHeight-cardH-10;
    card.style.left=cx+'px';card.style.top=cy+'px';card.style.display='block';
  }else{
    card.style.display='none';
  }
});
canvas.addEventListener('mouseleave',()=>{card.style.display='none';});

// Rocket cursor
(function(){
  const rocket=document.createElement('div');
  rocket.style.cssText='position:fixed;pointer-events:none;z-index:9999;font-size:26px;top:0;left:0;will-change:transform;line-height:1';
  rocket.textContent='🚀';
  document.body.appendChild(rocket);
  let lx=-100,ly=-100,angle=0;
  document.addEventListener('mousemove',e=>{
    const dx=e.clientX-lx,dy=e.clientY-ly;
    if(Math.abs(dx)+Math.abs(dy)>2){
      angle=Math.atan2(dy,dx)*180/Math.PI+45;
      const p=document.createElement('div');
      p.style.cssText=`position:fixed;pointer-events:none;z-index:9998;left:${e.clientX-6}px;top:${e.clientY-6}px;font-size:${10+Math.random()*8}px;opacity:.9;transition:opacity .5s ease,transform .5s ease;line-height:1`;
      p.textContent=['✨','⭐','💫'][Math.floor(Math.random()*3)];
      document.body.appendChild(p);
      requestAnimationFrame(()=>{p.style.opacity='0';p.style.transform=`translate(${(Math.random()-.5)*24}px,${(Math.random()-.5)*24}px) scale(0.2)`;});
      setTimeout(()=>p.remove(),500);
    }
    rocket.style.transform=`translate(${e.clientX-13}px,${e.clientY-13}px) rotate(${angle}deg)`;
    lx=e.clientX;ly=e.clientY;
  });
})();
