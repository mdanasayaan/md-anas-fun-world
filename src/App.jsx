import { useState, useEffect, useRef, useCallback } from "react";

const COLORS=["#FF6B6B","#FFD93D","#6BCB77","#4D96FF","#FF6FC8","#A855F7","#FF9A3C","#00D2FF"];

// ── Storage ───────────────────────────────────────────────────────────────────
const LB_KEY="anasworld_lb_v5";
function getBoard(){try{return JSON.parse(localStorage.getItem(LB_KEY)||"[]");}catch{return[];}}
function saveBoard(b){try{localStorage.setItem(LB_KEY,JSON.stringify(b.slice(0,50)));}catch{}}
// Ensure a user always appears on the leaderboard (even with 0 points) so names persist
function dbEnsureBoard(name,avatar,provider){
  const b=getBoard();
  if(!b.find(r=>r.name===name)){
    b.push({name,scores:{},total:0,avatar:avatar||name.slice(0,2).toUpperCase(),provider:provider||"email",joined:Date.now()});
    b.sort((a,c)=>c.total-a.total);
    saveBoard(b);
  }
}

// ── Global CSS ────────────────────────────────────────────────────────────────
const G_CSS=`
@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;800;900&family=Orbitron:wght@700;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;}
body{background:#050510;min-height:100vh;overflow-x:hidden;-webkit-tap-highlight-color:transparent;}
input,textarea,button,select{font-size:16px;}
::-webkit-scrollbar{width:6px;height:6px;}
::-webkit-scrollbar-track{background:#0a0a1a;}
::-webkit-scrollbar-thumb{background:linear-gradient(#A855F7,#FF6B6B);border-radius:4px;}
/* Hide horizontal scrollbar on nav row but keep scrollability */
nav div::-webkit-scrollbar{height:0;display:none;}

/* ── Mobile responsiveness ── */
@media (max-width:640px){
  .logout-text{display:none;}
}
@media (max-width:480px){
  .hide-mobile{display:none!important;}
}

/* ── Keyframes ── */
@keyframes fall{from{transform:translateY(0) rotate(0deg);opacity:1}to{transform:translateY(110vh) rotate(720deg);opacity:0}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}
@keyframes wiggle{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(7deg)}}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
@keyframes floatSlow{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-18px) rotate(3deg)}}
@keyframes popIn{0%{transform:scale(0);opacity:0}80%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-10px)}75%{transform:translateX(10px)}}
@keyframes slideUp{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes slideIn{from{transform:translateX(60px);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes slideDown{from{transform:translateY(-20px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes glow{0%,100%{box-shadow:0 0 12px #FF6B6B55,0 0 24px #FF6B6B22}50%{box-shadow:0 0 28px #FFD93D88,0 0 56px #FFD93D33}}
@keyframes neonPulse{0%,100%{text-shadow:0 0 7px #fff,0 0 14px #A855F7,0 0 28px #A855F7}50%{text-shadow:0 0 7px #fff,0 0 20px #FF6FC8,0 0 40px #FF6FC8}}
@keyframes starTwinkle{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.25;transform:scale(0.5)}}
@keyframes roadMove{0%{background-position:0 0}100%{background-position:0 60px}}
@keyframes carBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
@keyframes flip{0%{transform:rotateY(0)}100%{transform:rotateY(180deg)}}
@keyframes flipBack{0%{transform:rotateY(180deg)}100%{transform:rotateY(0)}}
@keyframes correctPop{0%{transform:scale(1)}50%{transform:scale(1.2)}100%{transform:scale(1)}}
@keyframes wrongShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
@keyframes timerShrink{from{width:100%}to{width:0%}}
@keyframes affirmIn{0%{transform:scale(0.88) translateY(18px);opacity:0}100%{transform:scale(1) translateY(0);opacity:1}}
@keyframes heartbeat{0%,100%{transform:scale(1)}14%{transform:scale(1.3)}28%{transform:scale(1)}}
@keyframes gradShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes shimmerSlide{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
@keyframes orbFloat{0%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-20px) scale(1.1)}66%{transform:translate(-20px,15px) scale(0.95)}100%{transform:translate(0,0) scale(1)}}
@keyframes orb2{0%{transform:translate(0,0)}33%{transform:translate(-40px,20px)}66%{transform:translate(25px,-30px)}100%{transform:translate(0,0)}}
@keyframes rotateSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes borderGlow{0%,100%{border-color:rgba(168,85,247,0.5)}50%{border-color:rgba(255,107,107,0.8)}}
@keyframes scanline{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
@keyframes typewrite{from{width:0}to{width:100%}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes particleDrift{0%{transform:translateY(0) translateX(0) rotate(0deg);opacity:0.8}100%{transform:translateY(-120px) translateX(var(--dx)) rotate(360deg);opacity:0}}
@keyframes cardEntrance{0%{transform:translateY(40px) scale(0.92);opacity:0}100%{transform:translateY(0) scale(1);opacity:1}}
@keyframes logoReveal{0%{clip-path:inset(0 100% 0 0)}100%{clip-path:inset(0 0% 0 0)}}
@keyframes hexPulse{0%,100%{transform:scale(1);opacity:0.6}50%{transform:scale(1.15);opacity:1}}
`;

// ── Shared UI ─────────────────────────────────────────────────────────────────
function Confetti(){
  const p=Array.from({length:80},(_,i)=>({id:i,x:Math.random()*100,color:COLORS[i%COLORS.length],size:Math.random()*12+4,delay:Math.random()*2,dur:Math.random()*2.5+2}));
  return(<div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,overflow:"hidden"}}>{p.map(x=><div key={x.id} style={{position:"absolute",left:`${x.x}%`,top:"-20px",width:x.size,height:x.size,borderRadius:Math.random()>0.5?"50%":"3px",background:x.color,animation:`fall ${x.dur}s ${x.delay}s linear forwards`}}/>)}</div>);
}

// Rich animated background with particles + orbs
function Background(){
  const particles=Array.from({length:40},(_,i)=>({id:i,x:Math.random()*100,y:Math.random()*100,size:Math.random()*3+1,color:COLORS[i%COLORS.length],delay:Math.random()*6,dur:3+Math.random()*4,dx:(Math.random()-0.5)*60}));
  const stars=Array.from({length:60},(_,i)=>({id:i,x:Math.random()*100,y:Math.random()*100,size:Math.random()*2.2+0.6,delay:Math.random()*5,dur:2+Math.random()*4}));
  return(
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
      {/* Deep space gradient */}
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 20% 20%,#1a0533 0%,#050510 50%,#0a0520 100%)"}}/>
      {/* Animated orbs */}
      <div style={{position:"absolute",width:"600px",height:"600px",borderRadius:"50%",background:"radial-gradient(circle,rgba(168,85,247,0.12) 0%,transparent 70%)",top:"-200px",left:"-100px",animation:"orbFloat 12s ease-in-out infinite"}}/>
      <div style={{position:"absolute",width:"500px",height:"500px",borderRadius:"50%",background:"radial-gradient(circle,rgba(77,150,255,0.1) 0%,transparent 70%)",bottom:"-100px",right:"-100px",animation:"orb2 15s ease-in-out infinite"}}/>
      <div style={{position:"absolute",width:"350px",height:"350px",borderRadius:"50%",background:"radial-gradient(circle,rgba(255,107,107,0.08) 0%,transparent 70%)",top:"40%",left:"60%",animation:"orbFloat 10s ease-in-out infinite 3s"}}/>
      {/* Grid overlay */}
      <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(168,85,247,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(168,85,247,0.04) 1px,transparent 1px)",backgroundSize:"60px 60px"}}/>
      {/* Stars */}
      {stars.map(s=><div key={s.id} style={{position:"absolute",left:`${s.x}%`,top:`${s.y}%`,width:s.size,height:s.size,borderRadius:"50%",background:"#fff",animation:`starTwinkle ${s.dur}s ${s.delay}s infinite`}}/>)}
      {/* Floating particles */}
      {particles.map(p=><div key={p.id} style={{position:"absolute",left:`${p.x}%`,top:`${p.y}%`,width:p.size,height:p.size,borderRadius:"50%",background:p.color,animation:`particleDrift ${p.dur}s ${p.delay}s infinite`,["--dx"]:`${p.dx}px`}}/>)}
    </div>
  );
}

// Legacy Stars wrapper for compat
function Stars(){return null;}

const Card=({children,style={}})=>(
  <div style={{background:"rgba(255,255,255,0.045)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"24px",padding:"1.5rem",...style}}>{children}</div>
);

const GText=({children,g="linear-gradient(135deg,#FF6B6B,#FFD93D)",size="1.8rem",style={}})=>(
  <div style={{fontFamily:"'Fredoka One',cursive",fontSize:size,background:g,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",...style}}>{children}</div>
);

const Btn=({children,onClick,g="linear-gradient(135deg,#FF6B6B,#FF9A3C)",style={},disabled=false})=>(
  <button onClick={onClick} disabled={disabled}
    style={{background:g,color:"#fff",border:"none",padding:"0.6rem 1.6rem",borderRadius:"30px",fontFamily:"'Fredoka One',cursive",fontSize:"1rem",cursor:disabled?"default":"pointer",opacity:disabled?0.5:1,transition:"transform 0.15s,box-shadow 0.15s",...style}}
    onMouseEnter={e=>{if(!disabled){e.currentTarget.style.transform="scale(1.05)";e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.4)";}}}
    onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="none";}}
  >{children}</button>
);

// ── MD ANAS Brand Logo SVG ─────────────────────────────────────────────────────
function BrandLogo({size=48}){
  return(
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="logoG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A855F7"/>
          <stop offset="50%" stopColor="#FF6FC8"/>
          <stop offset="100%" stopColor="#FFD93D"/>
        </linearGradient>
        <linearGradient id="logoG2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4D96FF"/>
          <stop offset="100%" stopColor="#6BCB77"/>
        </linearGradient>
      </defs>
      {/* Hexagon background */}
      <polygon points="24,2 44,13 44,35 24,46 4,35 4,13" fill="url(#logoG)" opacity="0.9"/>
      <polygon points="24,6 41,16 41,32 24,42 7,32 7,16" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
      {/* Star */}
      <path d="M24 12 L26.4 19.2 L34 19.2 L27.8 23.8 L30.2 31 L24 26.4 L17.8 31 L20.2 23.8 L14 19.2 L21.6 19.2 Z" fill="#fff"/>
      {/* Bottom dot */}
      <circle cx="24" cy="38" r="2.5" fill="#FFD93D"/>
    </svg>
  );
}

// Section icon illustrations (SVG-based unique images)
function SectionIcon({type,size=52}){
  const icons={
    affirm:(
      <svg width={size} height={size} viewBox="0 0 52 52">
        <defs><linearGradient id="affG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#FFD93D"/><stop offset="100%" stopColor="#FF9A3C"/></linearGradient></defs>
        <circle cx="26" cy="26" r="24" fill="url(#affG)" opacity="0.15"/>
        <circle cx="26" cy="26" r="18" fill="none" stroke="url(#affG)" strokeWidth="2"/>
        <path d="M26 12 L28.4 19.2 L36 19.2 L29.8 23.8 L32.2 31 L26 26.4 L19.8 31 L22.2 23.8 L16 19.2 L23.6 19.2 Z" fill="#FFD93D"/>
        <path d="M18 34 Q26 40 34 34" stroke="#FF9A3C" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      </svg>
    ),
    games:(
      <svg width={size} height={size} viewBox="0 0 52 52">
        <defs><linearGradient id="gmG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#FF6B6B"/><stop offset="100%" stopColor="#FF9A3C"/></linearGradient></defs>
        <rect x="8" y="16" width="36" height="24" rx="8" fill="url(#gmG)" opacity="0.15"/>
        <rect x="8" y="16" width="36" height="24" rx="8" fill="none" stroke="url(#gmG)" strokeWidth="2"/>
        <circle cx="36" cy="28" r="3" fill="#FF6B6B"/>
        <circle cx="42" cy="28" r="3" fill="#FFD93D"/>
        <line x1="14" y1="28" x2="20" y2="28" stroke="#FF6B6B" strokeWidth="3" strokeLinecap="round"/>
        <line x1="17" y1="25" x2="17" y2="31" stroke="#FF6B6B" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
    cars:(
      <svg width={size} height={size} viewBox="0 0 52 52">
        <defs><linearGradient id="carG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#FFD93D"/><stop offset="100%" stopColor="#FF6B6B"/></linearGradient></defs>
        <path d="M8 30 L14 20 L38 20 L44 30 L44 36 L8 36 Z" fill="url(#carG)" opacity="0.2"/>
        <path d="M8 30 L14 20 L38 20 L44 30 L44 36 L8 36 Z" fill="none" stroke="url(#carG)" strokeWidth="2"/>
        <circle cx="16" cy="36" r="5" fill="#333" stroke="#FFD93D" strokeWidth="2"/>
        <circle cx="36" cy="36" r="5" fill="#333" stroke="#FFD93D" strokeWidth="2"/>
        <rect x="18" y="22" width="16" height="8" rx="3" fill="rgba(77,150,255,0.4)"/>
        <path d="M4 30 L8 30" stroke="#FFD93D" strokeWidth="3" strokeLinecap="round"/>
        <path d="M44 30 L48 30" stroke="#FFD93D" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
    football:(
      <svg width={size} height={size} viewBox="0 0 52 52">
        <defs><linearGradient id="ftG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6BCB77"/><stop offset="100%" stopColor="#4D96FF"/></linearGradient></defs>
        <circle cx="26" cy="26" r="20" fill="url(#ftG)" opacity="0.15"/>
        <circle cx="26" cy="26" r="20" fill="none" stroke="url(#ftG)" strokeWidth="2"/>
        <polygon points="26,14 30,21 22,21" fill="#6BCB77"/>
        <polygon points="26,38 30,31 22,31" fill="#6BCB77"/>
        <polygon points="14,26 21,22 21,30" fill="#6BCB77"/>
        <polygon points="38,26 31,22 31,30" fill="#6BCB77"/>
        <circle cx="26" cy="26" r="6" fill="none" stroke="#4D96FF" strokeWidth="2"/>
      </svg>
    ),
    puzzle:(
      <svg width={size} height={size} viewBox="0 0 52 52">
        <defs><linearGradient id="pzG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6BCB77"/><stop offset="100%" stopColor="#00D2FF"/></linearGradient></defs>
        <rect x="10" y="10" width="14" height="14" rx="3" fill="url(#pzG)" opacity="0.3"/>
        <rect x="28" y="10" width="14" height="14" rx="3" fill="url(#pzG)" opacity="0.5"/>
        <rect x="10" y="28" width="14" height="14" rx="3" fill="url(#pzG)" opacity="0.5"/>
        <rect x="28" y="28" width="14" height="14" rx="3" fill="url(#pzG)" opacity="0.3"/>
        <circle cx="26" cy="26" r="5" fill="none" stroke="url(#pzG)" strokeWidth="2"/>
        <path d="M22 26 L30 26 M26 22 L26 30" stroke="#6BCB77" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    brain:(
      <svg width={size} height={size} viewBox="0 0 52 52">
        <defs><linearGradient id="brG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#4D96FF"/><stop offset="100%" stopColor="#A855F7"/></linearGradient></defs>
        <path d="M26 10 C18 10 12 15 12 22 C12 26 14 29 17 31 C17 35 20 38 24 38 L28 38 C32 38 35 35 35 31 C38 29 40 26 40 22 C40 15 34 10 26 10 Z" fill="url(#brG)" opacity="0.2"/>
        <path d="M26 10 C18 10 12 15 12 22 C12 26 14 29 17 31 C17 35 20 38 24 38 L28 38 C32 38 35 35 35 31 C38 29 40 26 40 22 C40 15 34 10 26 10 Z" fill="none" stroke="url(#brG)" strokeWidth="2"/>
        <line x1="26" y1="14" x2="26" y2="38" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="3,3"/>
        <circle cx="20" cy="22" r="3" fill="#4D96FF" opacity="0.8"/>
        <circle cx="32" cy="22" r="3" fill="#A855F7" opacity="0.8"/>
        <path d="M18 28 Q26 24 34 28" stroke="url(#brG)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </svg>
    ),
    iq:(
      <svg width={size} height={size} viewBox="0 0 52 52">
        <defs><linearGradient id="iqG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#A855F7"/><stop offset="100%" stopColor="#FF6FC8"/></linearGradient></defs>
        <path d="M26 8 L42 22 L38 42 L14 42 L10 22 Z" fill="url(#iqG)" opacity="0.15"/>
        <path d="M26 8 L42 22 L38 42 L14 42 L10 22 Z" fill="none" stroke="url(#iqG)" strokeWidth="2"/>
        <text x="26" y="30" textAnchor="middle" fill="#A855F7" fontSize="16" fontFamily="Fredoka One,cursive">?</text>
        <circle cx="26" cy="14" r="3" fill="#FFD93D"/>
      </svg>
    ),
    coding:(
      <svg width={size} height={size} viewBox="0 0 52 52">
        <defs><linearGradient id="cdG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#00D2FF"/><stop offset="100%" stopColor="#4D96FF"/></linearGradient></defs>
        <rect x="8" y="12" width="36" height="28" rx="5" fill="url(#cdG)" opacity="0.12"/>
        <rect x="8" y="12" width="36" height="28" rx="5" fill="none" stroke="url(#cdG)" strokeWidth="2"/>
        <path d="M16 22 L20 26 L16 30" stroke="#00D2FF" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="24" y1="30" x2="32" y2="30" stroke="#4D96FF" strokeWidth="2.5" strokeLinecap="round"/>
        <rect x="8" y="12" width="36" height="6" rx="5" fill="url(#cdG)" opacity="0.3"/>
        <circle cx="13" cy="15" r="1.5" fill="#FF6B6B"/>
        <circle cx="18" cy="15" r="1.5" fill="#FFD93D"/>
        <circle cx="23" cy="15" r="1.5" fill="#6BCB77"/>
      </svg>
    ),
    comedy:(
      <svg width={size} height={size} viewBox="0 0 52 52">
        <defs><linearGradient id="cmG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#FF6FC8"/><stop offset="100%" stopColor="#FFD93D"/></linearGradient></defs>
        <circle cx="26" cy="26" r="20" fill="url(#cmG)" opacity="0.15"/>
        <circle cx="26" cy="26" r="20" fill="none" stroke="url(#cmG)" strokeWidth="2"/>
        <circle cx="20" cy="22" r="3" fill="#FF6FC8"/>
        <circle cx="32" cy="22" r="3" fill="#FF6FC8"/>
        <path d="M16 32 Q26 42 36 32" stroke="#FFD93D" strokeWidth="3" fill="none" strokeLinecap="round"/>
      </svg>
    ),
    draw:(
      <svg width={size} height={size} viewBox="0 0 52 52">
        <defs><linearGradient id="drG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#00D2FF"/><stop offset="100%" stopColor="#6BCB77"/></linearGradient></defs>
        <circle cx="26" cy="26" r="20" fill="url(#drG)" opacity="0.12"/>
        <path d="M14 38 L16 30 L36 14 L42 20 L22 40 Z" fill="url(#drG)" opacity="0.3"/>
        <path d="M14 38 L16 30 L36 14 L42 20 L22 40 Z" fill="none" stroke="url(#drG)" strokeWidth="2"/>
        <line x1="34" y1="16" x2="40" y2="22" stroke="#FFD93D" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="15" cy="37" r="2" fill="#6BCB77"/>
      </svg>
    ),
    english:(
      <svg width={size} height={size} viewBox="0 0 52 52">
        <defs><linearGradient id="enG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#00D2FF"/><stop offset="100%" stopColor="#4D96FF"/></linearGradient></defs>
        <rect x="8" y="6" width="36" height="40" rx="5" fill="url(#enG)" opacity="0.13"/>
        <rect x="8" y="6" width="36" height="40" rx="5" fill="none" stroke="url(#enG)" strokeWidth="2"/>
        <line x1="14" y1="16" x2="38" y2="16" stroke="#00D2FF" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="14" y1="23" x2="38" y2="23" stroke="#4D96FF" strokeWidth="2" strokeLinecap="round"/>
        <line x1="14" y1="30" x2="30" y2="30" stroke="#4D96FF" strokeWidth="2" strokeLinecap="round"/>
        <line x1="14" y1="37" x2="26" y2="37" stroke="#00D2FF" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="40" cy="40" r="7" fill="url(#enG)" opacity="0.9"/>
        <text x="40" y="43.5" textAnchor="middle" fill="#fff" fontSize="7" fontFamily="Fredoka One,cursive">A</text>
      </svg>
    ),
    leaderboard:(
      <svg width={size} height={size} viewBox="0 0 52 52">
        <defs><linearGradient id="lbG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#FFD93D"/><stop offset="100%" stopColor="#6BCB77"/></linearGradient></defs>
        <rect x="8" y="22" width="10" height="22" rx="3" fill="url(#lbG)" opacity="0.4"/>
        <rect x="21" y="14" width="10" height="30" rx="3" fill="url(#lbG)" opacity="0.7"/>
        <rect x="34" y="28" width="10" height="16" rx="3" fill="url(#lbG)" opacity="0.4"/>
        <path d="M17 10 L22 16 L26 14 L30 16 L35 10 L32 20 L20 20 Z" fill="#FFD93D"/>
        <circle cx="26" cy="8" r="3" fill="#FFD93D"/>
      </svg>
    ),
  };
  return icons[type]||<span style={{fontSize:size*0.6+"px"}}>🎮</span>;
}

// ── AUTH ─────────────────────────────────────────────────────────────────────
const DB_KEY="anasworld_db_v1";
function loadDB(){try{return JSON.parse(localStorage.getItem(DB_KEY)||'{"users":{},"sessions":{}}');}catch{return{users:{},sessions:{}};}}
function saveDB(db){try{localStorage.setItem(DB_KEY,JSON.stringify(db));}catch{}}
function dbRegister(name,pass,provider="email",email=""){
  const db=loadDB();
  if(db.users[name])return{ok:false,err:"Username already taken"};
  const uid=Date.now()+Math.random().toString(36).slice(2);
  db.users[name]={uid,name,pass,provider,email,avatar:name.slice(0,2).toUpperCase(),joined:new Date().toLocaleDateString(),scores:{},total:0,activities:[],streak:0,lastActive:Date.now()};
  db.sessions[uid]={name,ts:Date.now()};saveDB(db);
  dbEnsureBoard(name,db.users[name].avatar,provider);
  return{ok:true,user:db.users[name]};
}
function dbLogin(name,pass){
  const db=loadDB();const u=db.users[name];
  if(!u)return{ok:false,err:"Account not found"};
  if(u.pass&&u.pass!==pass)return{ok:false,err:"Wrong password"};
  u.lastActive=Date.now();saveDB(db);
  dbEnsureBoard(name,u.avatar,u.provider);
  return{ok:true,user:u};
}
function dbAddScore(name,game,pts){
  const db=loadDB();const u=db.users[name];if(!u)return;
  u.scores=u.scores||{};u.scores[game]=(u.scores[game]||0)+pts;u.total=(u.total||0)+pts;
  u.activities=u.activities||[];u.activities.unshift({game,pts,ts:new Date().toLocaleString()});
  if(u.activities.length>50)u.activities=u.activities.slice(0,50);
  u.lastActive=Date.now();saveDB(db);
  const b=getBoard();const ex=b.find(r=>r.name===name);
  if(ex){ex.scores=ex.scores||{};ex.scores[game]=(ex.scores[game]||0)+pts;ex.total=(ex.total||0)+pts;}
  else b.push({name,scores:{[game]:pts},total:pts,avatar:u.avatar||name.slice(0,2).toUpperCase(),provider:u.provider||"email"});
  b.sort((a,c)=>c.total-a.total);saveBoard(b);
}
function dbGetUser(name){const db=loadDB();return db.users[name]||null;}

function AuthModal({onLogin}){
  const [screen,setScreen]=useState("main");
  const [name,setName]=useState(""),[email,setEmail]=useState(""),[pass,setPass]=useState(""),[pass2,setPass2]=useState(""),
        [err,setErr]=useState(""),[showPass,setShowPass]=useState(false);

  // Gmail-style username rules: 6-30 chars, letters/numbers/dots only,
  // must start with a letter, no consecutive dots, cannot end with a dot.
  const validateUsername=(u)=>{
    if(u.length<6||u.length>30)return "Username must be 6–30 characters long";
    if(!/^[a-zA-Z]/.test(u))return "Username must start with a letter";
    if(!/^[a-zA-Z0-9.]+$/.test(u))return "Only letters, numbers and dots allowed";
    if(/\.\./.test(u))return "No two dots in a row allowed";
    if(/\.$/.test(u))return "Username cannot end with a dot";
    return "";
  };
  const validateEmail=(e)=>{
    if(!e.trim())return "Please enter your email";
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))return "Enter a valid email (you@example.com)";
    return "";
  };
  const validatePassword=(p)=>{
    if(p.length<8)return "Password must be at least 8 characters";
    if(!/[A-Z]/.test(p))return "Add at least one CAPITAL letter";
    if(!/[a-z]/.test(p))return "Add at least one small letter";
    if(!/[0-9]/.test(p))return "Add at least one number";
    return "";
  };

  const handleSignup=()=>{
    const u=name.trim().toLowerCase();
    const ue=validateUsername(u); if(ue){setErr(ue);return;}
    const ee=validateEmail(email); if(ee){setErr(ee);return;}
    const pe=validatePassword(pass); if(pe){setErr(pe);return;}
    if(pass!==pass2){setErr("Passwords do not match");return;}
    const r=dbRegister(u,pass,"email",email.trim());
    if(!r.ok){setErr(r.err);return;}
    onLogin(u);
  };
  const handleLogin=()=>{
    const u=name.trim().toLowerCase();
    if(!u||!pass){setErr("Please fill in both fields");return;}
    const r=dbLogin(u,pass);
    if(!r.ok){setErr(r.err);return;}
    onLogin(u);
  };
  const handleGuest=()=>{const g="guest"+Math.floor(1000+Math.random()*9000);dbRegister(g,"guestpass",  "guest");onLogin(g);};
  const back=()=>{setScreen("main");setErr("");setName("");setEmail("");setPass("");setPass2("");setShowPass(false);};

  // Live username strength hints (shown on signup)
  const uClean=name.trim().toLowerCase();
  const uChecks=[
    {ok:uClean.length>=6&&uClean.length<=30,label:"6–30 characters"},
    {ok:/^[a-zA-Z]/.test(uClean),label:"Starts with a letter"},
    {ok:uClean.length>0&&/^[a-zA-Z0-9.]+$/.test(uClean),label:"Letters, numbers & dots only"},
  ];
  const pChecks=[
    {ok:pass.length>=8,label:"8+ characters"},
    {ok:/[A-Z]/.test(pass),label:"A capital letter"},
    {ok:/[a-z]/.test(pass),label:"A small letter"},
    {ok:/[0-9]/.test(pass),label:"A number"},
  ];

  const inp={width:"100%",padding:"0.7rem 1rem",borderRadius:"12px",border:"1px solid rgba(255,255,255,0.14)",background:"rgba(255,255,255,0.06)",color:"#fff",fontFamily:"'Nunito',sans-serif",fontSize:"16px",marginBottom:"4px",outline:"none",boxSizing:"border-box"};
  const labelStyle={fontFamily:"'Nunito',sans-serif",fontSize:"0.78rem",color:"rgba(255,255,255,0.6)",fontWeight:700,marginBottom:"4px",display:"block",textAlign:"left"};
  const fieldWrap={marginBottom:"0.85rem"};
  const Check=({ok,label})=>(
    <span style={{display:"inline-flex",alignItems:"center",gap:"4px",fontFamily:"'Nunito',sans-serif",fontSize:"0.68rem",color:ok?"#6BCB77":"rgba(255,255,255,0.35)",marginRight:"10px"}}>
      <span>{ok?"✓":"○"}</span>{label}
    </span>
  );

  return(
    <div style={{position:"fixed",inset:0,zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem",overflowY:"auto",background:"transparent"}}>
      <Background/>
      {/* Floating decorative shapes */}
      <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:1}}>
        {[{x:8,y:12,s:90,c:"#A855F7"},{x:86,y:18,s:64,c:"#4D96FF"},{x:16,y:78,s:54,c:"#FF6FC8"},{x:82,y:72,s:76,c:"#6BCB77"},{x:50,y:8,s:44,c:"#FFD93D"}].map((o,i)=>(
          <div key={i} style={{position:"absolute",left:`${o.x}%`,top:`${o.y}%`,width:o.s,height:o.s,borderRadius:"50%",background:`radial-gradient(circle,${o.c}33,transparent)`,animation:`floatSlow ${6+i*2}s ease-in-out infinite ${i}s`}}/>
        ))}
      </div>

      <div style={{position:"relative",zIndex:2,maxWidth:"420px",width:"100%",margin:"auto",animation:"slideUp 0.5s cubic-bezier(0.34,1.56,0.64,1)"}}>
        <div style={{padding:"2px",borderRadius:"28px",background:"linear-gradient(135deg,#A855F7,#FF6FC8,#FFD93D,#4D96FF,#6BCB77)",backgroundSize:"300% 300%",animation:"gradShift 5s ease infinite"}}>
          <div style={{borderRadius:"27px",background:"linear-gradient(160deg,#0d0d2b 0%,#120820 50%,#0d1a2b 100%)",padding:"clamp(1.5rem,5vw,2.25rem) clamp(1.25rem,5vw,2rem)",backdropFilter:"blur(30px)"}}>

            {/* Brand header */}
            <div style={{textAlign:"center",marginBottom:"1.5rem"}}>
              <div style={{display:"flex",justifyContent:"center",marginBottom:"0.6rem",animation:"floatSlow 4s ease-in-out infinite"}}>
                <BrandLogo size={56}/>
              </div>
              <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:"0.68rem",letterSpacing:"0.22em",color:"rgba(168,85,247,0.85)",textTransform:"uppercase",marginBottom:"3px"}}>MD ANAS</div>
              <div style={{fontFamily:"'Fredoka One',cursive",fontSize:"clamp(1.7rem,7vw,2.1rem)",background:"linear-gradient(135deg,#FF6B6B,#FFD93D,#6BCB77,#4D96FF)",backgroundSize:"200% 200%",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1,animation:"gradShift 5s ease infinite"}}>Fun World</div>
              <p style={{fontFamily:"'Nunito',sans-serif",fontSize:"0.8rem",color:"rgba(255,255,255,0.4)",marginTop:"0.5rem"}}>
                🎮 Play &nbsp;·&nbsp; 📚 Learn &nbsp;·&nbsp; 🌟 Grow
              </p>
            </div>

            {screen==="main"&&(
              <>
                <div style={{textAlign:"center",marginBottom:"1.25rem",fontFamily:"'Nunito',sans-serif",fontSize:"0.9rem",color:"rgba(255,255,255,0.6)",lineHeight:1.6}}>
                  Welcome! 🎉 Create your free account or log in to start your adventure.
                </div>
                <Btn onClick={()=>{setScreen("signup");setErr("");}} g="linear-gradient(135deg,#FF6B6B,#FF9A3C)" style={{width:"100%",padding:"0.85rem",fontSize:"1rem",marginBottom:"0.7rem",animation:"pulse 2.5s infinite"}}>📝 Create Account</Btn>
                <Btn onClick={()=>{setScreen("login");setErr("");}} g="linear-gradient(135deg,#4D96FF,#A855F7)" style={{width:"100%",padding:"0.85rem",fontSize:"1rem",marginBottom:"0.9rem"}}>🔑 Log In</Btn>
                <div style={{display:"flex",alignItems:"center",gap:"10px",margin:"0.5rem 0 0.9rem"}}>
                  <div style={{flex:1,height:"1px",background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)"}}/>
                  <span style={{fontFamily:"'Nunito',sans-serif",fontSize:"0.72rem",color:"rgba(255,255,255,0.3)"}}>or</span>
                  <div style={{flex:1,height:"1px",background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)"}}/>
                </div>
                <button onClick={handleGuest} style={{width:"100%",padding:"0.7rem",borderRadius:"30px",border:"1px solid rgba(107,203,119,0.35)",background:"rgba(107,203,119,0.08)",color:"rgba(255,255,255,0.7)",fontFamily:"'Nunito',sans-serif",fontSize:"0.85rem",fontWeight:700,cursor:"pointer",transition:"all 0.2s"}}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(107,203,119,0.16)"}
                  onMouseLeave={e=>e.currentTarget.style.background="rgba(107,203,119,0.08)"}>
                  👤 Continue as Guest
                </button>

                {/* ── Front-page feature highlights ── */}
                <div style={{marginTop:"1.4rem"}}>
                  <div style={{textAlign:"center",fontFamily:"'Orbitron',sans-serif",fontSize:"0.62rem",letterSpacing:"0.2em",color:"rgba(255,255,255,0.4)",textTransform:"uppercase",marginBottom:"0.75rem"}}>
                    ✨ What's inside ✨
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"7px"}}>
                    {[
                      {icon:"🎮",label:"12+ Fun Games",c:"#FF6B6B"},
                      {icon:"📚",label:"English — 5 Levels",c:"#00D2FF"},
                      {icon:"💻",label:"Learn Python Code",c:"#4D96FF"},
                      {icon:"⚽",label:"Football Zone",c:"#6BCB77"},
                      {icon:"🧠",label:"Brain & IQ Games",c:"#A855F7"},
                      {icon:"😂",label:"Comedy & Jokes",c:"#FF6FC8"},
                      {icon:"🎨",label:"Art Studio",c:"#FFD93D"},
                      {icon:"🏆",label:"Global Leaderboard",c:"#FF9A3C"},
                    ].map((f,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:"7px",
                        background:`${f.c}12`,border:`1px solid ${f.c}30`,borderRadius:"12px",
                        padding:"0.5rem 0.6rem",animation:`cardEntrance 0.4s ${i*0.05}s both`}}>
                        <span style={{fontSize:"1.05rem",flexShrink:0}}>{f.icon}</span>
                        <span style={{fontFamily:"'Nunito',sans-serif",fontSize:"0.68rem",fontWeight:700,color:"rgba(255,255,255,0.78)",lineHeight:1.2}}>{f.label}</span>
                      </div>
                    ))}
                  </div>
                  {/* Mini highlights bar */}
                  <div style={{display:"flex",justifyContent:"space-around",marginTop:"0.9rem",padding:"0.7rem 0.5rem",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"14px"}}>
                    {[["🎯","30+","Activities"],["🌍","Top 50","Leaderboard"],["💯","Free","Forever"]].map((m,i)=>(
                      <div key={i} style={{textAlign:"center"}}>
                        <div style={{fontSize:"1rem"}}>{m[0]}</div>
                        <div style={{fontFamily:"'Fredoka One',cursive",fontSize:"0.82rem",color:"#FFD93D"}}>{m[1]}</div>
                        <div style={{fontFamily:"'Nunito',sans-serif",fontSize:"0.58rem",color:"rgba(255,255,255,0.4)"}}>{m[2]}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <p style={{fontFamily:"'Nunito',sans-serif",fontSize:"0.68rem",color:"rgba(255,255,255,0.25)",marginTop:"1rem",textAlign:"center",lineHeight:1.5}}>
                  🔒 Your account is stored safely on your own device.
                </p>
              </>
            )}

            {screen==="signup"&&(
              <>
                <GText g="linear-gradient(135deg,#FF6B6B,#FFD93D)" size="1.5rem" style={{marginBottom:"1.1rem",textAlign:"center"}}>Create Your Account 🎉</GText>
                <div style={fieldWrap}>
                  <label style={labelStyle}>Username</label>
                  <input placeholder="e.g. anas.khan99" value={name} autoCapitalize="none" autoCorrect="off" spellCheck={false} onChange={e=>setName(e.target.value)} style={inp}/>
                  <div style={{display:"flex",flexWrap:"wrap",marginTop:"6px"}}>
                    {uChecks.map((c,i)=><Check key={i} ok={c.ok} label={c.label}/>)}
                  </div>
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle}>Email</label>
                  <input placeholder="you@example.com" value={email} type="email" inputMode="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} onChange={e=>setEmail(e.target.value)} style={inp}/>
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle}>Password</label>
                  <div style={{position:"relative"}}>
                    <input placeholder="Create a strong password" value={pass} type={showPass?"text":"password"} onChange={e=>setPass(e.target.value)} style={{...inp,marginBottom:0,paddingRight:"3rem"}}/>
                    <button onClick={()=>setShowPass(s=>!s)} type="button" style={{position:"absolute",right:"8px",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:"1.1rem",padding:"4px"}}>{showPass?"🙈":"👁️"}</button>
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",marginTop:"6px"}}>
                    {pChecks.map((c,i)=><Check key={i} ok={c.ok} label={c.label}/>)}
                  </div>
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle}>Confirm Password</label>
                  <input placeholder="Type your password again" value={pass2} type={showPass?"text":"password"} onChange={e=>setPass2(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSignup()} style={inp}/>
                  {pass2.length>0&&<div style={{marginTop:"6px"}}><Check ok={pass===pass2&&pass.length>0} label="Passwords match"/></div>}
                </div>
                {err&&<p style={{color:"#FF6B6B",fontFamily:"'Nunito',sans-serif",fontSize:"0.82rem",margin:"2px 0 10px",animation:"shake 0.3s",textAlign:"center"}}>⚠️ {err}</p>}
                <Btn onClick={handleSignup} g="linear-gradient(135deg,#FF6B6B,#FFD93D)" style={{width:"100%",padding:"0.8rem",marginBottom:"10px",fontSize:"1rem"}}>Join the Adventure! 🚀</Btn>
                <button onClick={back} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",fontFamily:"'Nunito',sans-serif",fontSize:"0.82rem",cursor:"pointer",width:"100%",padding:"6px"}}>‹ Back</button>
              </>
            )}

            {screen==="login"&&(
              <>
                <GText g="linear-gradient(135deg,#4D96FF,#A855F7)" size="1.5rem" style={{marginBottom:"1.1rem",textAlign:"center"}}>Welcome Back! 🎮</GText>
                <div style={fieldWrap}>
                  <label style={labelStyle}>Username</label>
                  <input placeholder="Your username" value={name} autoCapitalize="none" autoCorrect="off" spellCheck={false} onChange={e=>setName(e.target.value)} style={inp}/>
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle}>Password</label>
                  <div style={{position:"relative"}}>
                    <input placeholder="Your password" value={pass} type={showPass?"text":"password"} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} style={{...inp,marginBottom:0,paddingRight:"3rem"}}/>
                    <button onClick={()=>setShowPass(s=>!s)} type="button" style={{position:"absolute",right:"8px",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:"1.1rem",padding:"4px"}}>{showPass?"🙈":"👁️"}</button>
                  </div>
                </div>
                {err&&<p style={{color:"#FF6B6B",fontFamily:"'Nunito',sans-serif",fontSize:"0.82rem",margin:"2px 0 10px",animation:"shake 0.3s",textAlign:"center"}}>⚠️ {err}</p>}
                <Btn onClick={handleLogin} g="linear-gradient(135deg,#4D96FF,#A855F7)" style={{width:"100%",padding:"0.8rem",marginBottom:"10px",fontSize:"1rem"}}>Let's Play! 🎮</Btn>
                <button onClick={back} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",fontFamily:"'Nunito',sans-serif",fontSize:"0.82rem",cursor:"pointer",width:"100%",padding:"6px"}}>‹ Back</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── NAVBAR ─────────────────────────────────────────────────────────────────────
function Navbar({active,setActive,user,onLogout}){
  const items=[{id:"home",label:"🏠 Home"},{id:"affirm",label:"🌟 Affirm"},{id:"games",label:"🎮 Games"},{id:"cars",label:"🚗 Race"},{id:"football",label:"⚽ Football"},{id:"puzzle",label:"🧩 Puzzle"},{id:"brain",label:"🧠 Brain"},{id:"iq",label:"💡 IQ"},{id:"comedy",label:"😂 Comedy"},{id:"coding",label:"💻 Code"},{id:"english",label:"📚 English"},{id:"draw",label:"🎨 Draw"}];
  return(
    <nav style={{position:"sticky",top:0,zIndex:1000,background:"rgba(5,5,16,0.92)",backdropFilter:"blur(28px)",WebkitBackdropFilter:"blur(28px)",borderBottom:"1px solid rgba(168,85,247,0.18)"}}>
      {/* Top row: brand + user + logout */}
      <div style={{maxWidth:"1350px",margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",minHeight:"52px",padding:"6px 0.75rem",gap:"8px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"8px",flexShrink:0,cursor:"pointer"}} onClick={()=>setActive("home")}>
          <BrandLogo size={30}/>
          <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:"0.68rem",letterSpacing:"0.14em",color:"rgba(168,85,247,0.9)",lineHeight:1.2}}>
            <div>MD ANAS</div>
            <div style={{fontSize:"0.5rem",color:"rgba(255,255,255,0.35)",letterSpacing:"0.1em"}}>FUN WORLD</div>
          </div>
        </div>
        {/* User chip + logout */}
        <div style={{display:"flex",alignItems:"center",gap:"7px",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:"6px",background:"rgba(168,85,247,0.12)",border:"1px solid rgba(168,85,247,0.28)",padding:"4px 10px 4px 5px",borderRadius:"22px"}}>
            <div style={{width:"24px",height:"24px",borderRadius:"50%",background:"linear-gradient(135deg,#A855F7,#FF6FC8)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Fredoka One',cursive",fontSize:"0.66rem",color:"#fff",flexShrink:0}}>{user.slice(0,2).toUpperCase()}</div>
            <span style={{fontFamily:"'Nunito',sans-serif",fontSize:"0.72rem",fontWeight:700,color:"rgba(255,255,255,0.8)",maxWidth:"90px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user}</span>
          </div>
          <button onClick={onLogout}
            style={{display:"inline-flex",alignItems:"center",gap:"5px",background:"rgba(255,107,107,0.14)",color:"#FF8A8A",border:"1px solid rgba(255,107,107,0.3)",padding:"6px 12px",borderRadius:"18px",fontFamily:"'Nunito',sans-serif",fontSize:"0.74rem",fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.2s"}}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,107,107,0.25)";e.currentTarget.style.color="#fff";}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,107,107,0.14)";e.currentTarget.style.color="#FF8A8A";}}>
            <span style={{fontSize:"0.85rem"}}>⏻</span><span className="logout-text">Logout</span>
          </button>
        </div>
      </div>
      {/* Nav items row — horizontally scrollable on mobile */}
      <div style={{borderTop:"1px solid rgba(255,255,255,0.05)"}}>
        <div style={{maxWidth:"1350px",margin:"0 auto",display:"flex",gap:"3px",overflowX:"auto",alignItems:"center",padding:"6px 0.5rem",WebkitOverflowScrolling:"touch",scrollbarWidth:"none"}}>
          {items.map(it=>(
            <button key={it.id} onClick={()=>setActive(it.id)}
              style={{background:active===it.id?"linear-gradient(135deg,#A855F7,#FF6FC8)":"rgba(255,255,255,0.04)",
                color:active===it.id?"#fff":"rgba(255,255,255,0.6)",
                border:active===it.id?"none":"1px solid rgba(255,255,255,0.08)",padding:"6px 11px",borderRadius:"16px",
                fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:"0.72rem",
                cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.2s",flexShrink:0,
                boxShadow:active===it.id?"0 2px 12px rgba(168,85,247,0.4)":"none"}}>
              {it.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

// ── HOME PAGE ─────────────────────────────────────────────────────────────────
function HomePage({setActive,user}){
  const [hovered,setHovered]=useState(null);
  const [time,setTime]=useState(new Date());
  const [tick,setTick]=useState(0);
  useEffect(()=>{const t=setInterval(()=>{setTime(new Date());setTick(k=>k+1);},1000);return()=>clearInterval(t);},[]);
  const greet=()=>{const h=time.getHours();if(h<5)return["🌙","Burning midnight oil"];if(h<12)return["☀️","Good Morning"];if(h<17)return["🌤","Good Afternoon"];if(h<21)return["🌆","Good Evening"];return["🌙","Good Night"];};
  const [greetIcon,greetText]=greet();

  const cards=[
    {id:"affirm",  icon:"affirm",     title:"Affirmations",  desc:"Build confidence daily",       g:"linear-gradient(135deg,#FFD93D,#FF9A3C)",    badge:"✨ Daily",  glow:"#FFD93D"},
    {id:"games",   icon:"games",      title:"Fun Games",     desc:"Click, memory & adventure",    g:"linear-gradient(135deg,#FF6B6B,#FF9A3C)",    badge:"🔥 Hot",    glow:"#FF6B6B"},
    {id:"cars",    icon:"cars",       title:"Car Race",      desc:"3 levels of speed",            g:"linear-gradient(135deg,#FFD93D,#FF6B6B)",    badge:"🏁 Race",   glow:"#FFD93D"},
    {id:"football",icon:"football",   title:"Football",      desc:"Play & quiz about the game",   g:"linear-gradient(135deg,#6BCB77,#4D96FF)",    badge:"⚽ New",    glow:"#6BCB77"},
    {id:"puzzle",  icon:"puzzle",     title:"Puzzle Zone",   desc:"Slide, word & sequences",      g:"linear-gradient(135deg,#6BCB77,#00D2FF)",    badge:"🧩 Think",  glow:"#00D2FF"},
    {id:"brain",   icon:"brain",      title:"Brain Games",   desc:"Mind map & patterns",          g:"linear-gradient(135deg,#4D96FF,#A855F7)",    badge:"⚡ Sharp",  glow:"#A855F7"},
    {id:"iq",      icon:"iq",         title:"IQ Challenge",  desc:"Logic & visual thinking",      g:"linear-gradient(135deg,#A855F7,#FF6FC8)",    badge:"🎯 Test",   glow:"#FF6FC8"},
    {id:"coding",  icon:"coding",     title:"Coding",        desc:"Learn Python & run code live", g:"linear-gradient(135deg,#00D2FF,#4D96FF)",    badge:"🐍 Code",   glow:"#00D2FF"},
    {id:"comedy",  icon:"comedy",     title:"Comedy Zone",   desc:"Jokes, stories & scares",      g:"linear-gradient(135deg,#FF6FC8,#FFD93D)",    badge:"😂 Fun",    glow:"#FF6FC8"},
    {id:"draw",    icon:"draw",       title:"Art Studio",    desc:"Draw, paint & create",         g:"linear-gradient(135deg,#00D2FF,#6BCB77)",    badge:"🖌 Create", glow:"#6BCB77"},
    {id:"english",   icon:"english",    title:"English",       desc:"Learn with silly fun across 5 levels!",  g:"linear-gradient(135deg,#00D2FF,#4D96FF)",    badge:"📚 Fun",  glow:"#00D2FF"},
    {id:"leaderboard",icon:"leaderboard",title:"Leaderboard",desc:"Your stats & rankings",       g:"linear-gradient(135deg,#FFD93D,#FF9A3C)",    badge:"👑 Top",    glow:"#FFD93D"},
  ];

  const stats=[
    {icon:"🎮",val:"12+",label:"Game Modes",color:"#FF6B6B"},
    {icon:"🧠",val:"6",  label:"Brain Games",color:"#A855F7"},
    {icon:"💻",val:"6",  label:"Code Lessons",color:"#00D2FF"},
    {icon:"⚽",val:"20+",label:"Football Q's",color:"#6BCB77"},
    {icon:"📚",val:"5",  label:"Eng Levels",color:"#00D2FF"},
    {icon:"🏆",val:"∞",  label:"Adventure",color:"#FFD93D"},
  ];

  return(
    <div style={{position:"relative",zIndex:1,minHeight:"100vh",paddingBottom:"3rem"}}>

      {/* ── HERO ── */}
      <div style={{position:"relative",overflow:"hidden",padding:"clamp(1.5rem,5vw,2.5rem) clamp(1rem,4vw,1.5rem) clamp(2rem,6vw,3rem)",textAlign:"center"}}>
        {/* Spinning ring decoration */}
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"700px",height:"700px",borderRadius:"50%",border:"1px solid rgba(168,85,247,0.08)",pointerEvents:"none",animation:"rotateSlow 30s linear infinite"}}/>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"520px",height:"520px",borderRadius:"50%",border:"1px solid rgba(77,150,255,0.06)",pointerEvents:"none",animation:"rotateSlow 20s linear infinite reverse"}}/>

        {/* Greeting pill */}
        <div style={{display:"inline-flex",alignItems:"center",gap:"7px",background:"rgba(168,85,247,0.12)",border:"1px solid rgba(168,85,247,0.28)",borderRadius:"30px",padding:"5px 14px",marginBottom:"1.2rem",animation:"slideDown 0.5s"}}>
          <span style={{fontSize:"1rem"}}>{greetIcon}</span>
          <span style={{fontFamily:"'Nunito',sans-serif",fontSize:"0.8rem",color:"rgba(255,255,255,0.6)"}}>{greetText},</span>
          <span style={{fontFamily:"'Fredoka One',cursive",fontSize:"0.85rem",color:"#FFD93D"}}>{user}</span>
          <span style={{fontFamily:"'Nunito',sans-serif",fontSize:"0.72rem",color:"rgba(255,255,255,0.35)",marginLeft:"4px"}}>
            {time.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
          </span>
        </div>

        {/* Main brand */}
        <div style={{marginBottom:"0.6rem"}}>
          {/* MD ANAS label */}
          <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:"clamp(0.7rem,2vw,1rem)",letterSpacing:"0.35em",color:"rgba(168,85,247,0.7)",marginBottom:"0.2rem",textTransform:"uppercase",animation:"neonPulse 4s infinite"}}>
            MD ANAS PRESENTS
          </div>
          {/* Main title */}
          <div style={{fontFamily:"'Fredoka One',cursive",fontSize:"clamp(3rem,10vw,6rem)",lineHeight:0.92,background:"linear-gradient(135deg,#FF6B6B 0%,#FFD93D 25%,#6BCB77 50%,#4D96FF 75%,#A855F7 100%)",backgroundSize:"200% 200%",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"gradShift 5s ease infinite",filter:"drop-shadow(0 0 40px rgba(168,85,247,0.3))"}}>
            Fun World
          </div>
          {/* Tagline */}
          <div style={{fontFamily:"'Nunito',sans-serif",fontSize:"clamp(0.85rem,2vw,1.15rem)",color:"rgba(255,255,255,0.5)",marginTop:"0.5rem",letterSpacing:"0.03em"}}>
            🎉 The Ultimate Kids Adventure Platform — Play · Learn · Grow
          </div>
        </div>

        {/* Brand logo centered */}
        <div style={{display:"flex",justifyContent:"center",margin:"1.2rem 0",animation:"floatSlow 4s ease-in-out infinite"}}>
          <div style={{position:"relative"}}>
            <BrandLogo size={72}/>
            <div style={{position:"absolute",inset:"-8px",borderRadius:"50%",border:"2px solid rgba(168,85,247,0.3)",animation:"hexPulse 2s ease-in-out infinite"}}/>
          </div>
        </div>

        {/* Stats row */}
        <div style={{display:"flex",gap:"10px",justifyContent:"center",flexWrap:"wrap",marginBottom:"1.8rem"}}>
          {stats.map((s,i)=>(
            <div key={s.label} style={{background:"rgba(255,255,255,0.04)",border:`1px solid ${s.color}33`,borderRadius:"16px",padding:"0.7rem 1rem",minWidth:"85px",textAlign:"center",animation:`slideUp 0.4s ${i*0.08}s both`,transition:"all 0.25s",cursor:"default"}}
              onMouseEnter={e=>{e.currentTarget.style.background=`${s.color}14`;e.currentTarget.style.borderColor=`${s.color}66`;e.currentTarget.style.transform="translateY(-3px)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.borderColor=`${s.color}33`;e.currentTarget.style.transform="none";}}>
              <div style={{fontSize:"1.3rem"}}>{s.icon}</div>
              <div style={{fontFamily:"'Fredoka One',cursive",color:s.color,fontSize:"1.25rem"}}>{s.val}</div>
              <div style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.4)",fontSize:"0.65rem"}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div style={{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap"}}>
          <Btn onClick={()=>setActive("games")} g="linear-gradient(135deg,#FF6B6B,#FF9A3C)" style={{padding:"0.8rem 2rem",fontSize:"1rem",animation:"pulse 2s infinite",boxShadow:"0 8px 28px rgba(255,107,107,0.35)"}}>🎮 Start Playing!</Btn>
          <Btn onClick={()=>setActive("football")} g="linear-gradient(135deg,#6BCB77,#4D96FF)" style={{padding:"0.8rem 2rem",fontSize:"1rem",boxShadow:"0 8px 28px rgba(107,203,119,0.25)"}}>⚽ Football Zone</Btn>
          <Btn onClick={()=>setActive("leaderboard")} g="linear-gradient(135deg,#A855F7,#FF6FC8)" style={{padding:"0.8rem 2rem",fontSize:"1rem",boxShadow:"0 8px 28px rgba(168,85,247,0.3)"}}>🏆 Leaderboard</Btn>
        </div>
      </div>

      {/* ── Divider ── */}
      <div style={{maxWidth:"800px",margin:"0 auto 1.5rem",height:"1px",background:"linear-gradient(90deg,transparent,rgba(168,85,247,0.35),rgba(77,150,255,0.35),transparent)"}}/>

      {/* ── Section heading ── */}
      <div style={{textAlign:"center",marginBottom:"1.25rem"}}>
        <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:"0.7rem",letterSpacing:"0.22em",color:"rgba(168,85,247,0.6)",textTransform:"uppercase",marginBottom:"0.3rem"}}>Choose Your Adventure</div>
        <div style={{fontFamily:"'Fredoka One',cursive",fontSize:"1.5rem",color:"rgba(255,255,255,0.85)"}}>What do you want to explore today?</div>
      </div>

      {/* ── Adventure cards ── */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(148px,1fr))",gap:"clamp(0.6rem,2vw,1rem)",maxWidth:"1100px",margin:"0 auto 2rem",padding:"0 clamp(0.75rem,3vw,1rem)"}}>
        {cards.map((c,i)=>(
          <div key={c.id}
            onClick={()=>setActive(c.id)}
            onMouseEnter={()=>setHovered(c.id)}
            onMouseLeave={()=>setHovered(null)}
            style={{position:"relative",borderRadius:"22px",padding:"1.25rem 1rem",cursor:"pointer",overflow:"hidden",
              background:hovered===c.id?c.g:"rgba(255,255,255,0.04)",
              border:`1px solid ${hovered===c.id?"transparent":"rgba(255,255,255,0.08)"}`,
              boxShadow:hovered===c.id?`0 16px 40px ${c.glow}44`:"0 2px 8px rgba(0,0,0,0.3)",
              transform:hovered===c.id?"translateY(-7px) scale(1.04)":"none",
              transition:"all 0.28s cubic-bezier(0.34,1.56,0.64,1)",
              animation:`cardEntrance 0.5s ${i*0.045}s both`}}>
            {/* Background when not hovered */}
            {hovered!==c.id&&<div style={{position:"absolute",inset:0,background:`linear-gradient(135deg,${c.glow}08,transparent)`,borderRadius:"22px"}}/>}
            {/* Shimmer on hover */}
            {hovered===c.id&&<div style={{position:"absolute",inset:0,background:"linear-gradient(45deg,transparent 30%,rgba(255,255,255,0.15) 50%,transparent 70%)",animation:"shimmerSlide 0.6s"}}/>}
            {/* Badge */}
            <div style={{position:"absolute",top:"8px",right:"8px",background:"rgba(0,0,0,0.35)",backdropFilter:"blur(8px)",borderRadius:"20px",padding:"2px 7px",fontFamily:"'Nunito',sans-serif",fontSize:"0.58rem",color:"#fff",fontWeight:700}}>{c.badge}</div>
            {/* Icon */}
            <div style={{marginBottom:"0.5rem",filter:hovered===c.id?"drop-shadow(0 4px 12px rgba(255,255,255,0.3))":"none",transition:"filter 0.25s"}}>
              <SectionIcon type={c.icon} size={48}/>
            </div>
            <div style={{fontFamily:"'Fredoka One',cursive",fontSize:"1.08rem",color:"#fff",marginBottom:"0.18rem"}}>{c.title}</div>
            <div style={{fontFamily:"'Nunito',sans-serif",color:hovered===c.id?"rgba(255,255,255,0.88)":"rgba(255,255,255,0.5)",fontSize:"0.72rem",lineHeight:1.4}}>{c.desc}</div>
          </div>
        ))}
      </div>

      {/* ── Footer strip ── */}
      <div style={{maxWidth:"750px",margin:"0 auto",padding:"0 1rem"}}>
        <div style={{background:"linear-gradient(135deg,rgba(168,85,247,0.1),rgba(77,150,255,0.1))",border:"1px solid rgba(168,85,247,0.2)",borderRadius:"20px",padding:"1.25rem 1.75rem",display:"flex",alignItems:"center",gap:"1.5rem",flexWrap:"wrap",justifyContent:"center"}}>
          <div style={{textAlign:"center"}}>
            <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:"0.6rem",letterSpacing:"0.15em",color:"rgba(168,85,247,0.6)",marginBottom:"3px"}}>MD ANAS</div>
            <BrandLogo size={36}/>
          </div>
          <div style={{flex:1,minWidth:"200px"}}>
            <div style={{fontFamily:"'Fredoka One',cursive",fontSize:"1.1rem",color:"#fff",marginBottom:"0.25rem"}}>🌟 Today's Challenge</div>
            <div style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.55)",fontSize:"0.82rem",lineHeight:1.6}}>Complete at least <strong style={{color:"#FFD93D"}}>3 different games</strong> to climb the leaderboard. Every action earns points! 🚀</div>
          </div>
          <Btn onClick={()=>setActive("games")} g="linear-gradient(135deg,#A855F7,#FF6FC8)" style={{padding:"0.6rem 1.4rem",fontSize:"0.88rem",whiteSpace:"nowrap"}}>Play Now →</Btn>
        </div>
      </div>

      {/* ── Overall website feedback ── */}
      <SiteFeedback/>
    </div>
  );
}


// ── SiteFeedback — overall website feedback box with emojis ───────────────────
function SiteFeedback(){
  const EMOJIS=[
    {e:"🤩",label:"Amazing!"},
    {e:"😀",label:"Great"},
    {e:"🙂",label:"Good"},
    {e:"😐",label:"Okay"},
    {e:"😕",label:"Meh"},
  ];
  const [rating,setRating]=useState(()=>{try{return localStorage.getItem("mda_site_fb_rating")||"";}catch{return"";}});
  const [text,setText]=useState("");
  const [sent,setSent]=useState(false);
  const submit=()=>{
    try{
      localStorage.setItem("mda_site_fb_rating",rating);
      const log=JSON.parse(localStorage.getItem("mda_site_fb_log")||"[]");
      log.unshift({rating,text,ts:Date.now()});
      localStorage.setItem("mda_site_fb_log",JSON.stringify(log.slice(0,50)));
    }catch{}
    setSent(true);
    setTimeout(()=>setSent(false),4500);
  };
  return(
    <div style={{maxWidth:"750px",margin:"1.5rem auto 0",padding:"0 1rem"}}>
      <div style={{background:"linear-gradient(135deg,rgba(255,111,200,0.12),rgba(168,85,247,0.1),rgba(0,210,255,0.1))",border:"1px solid rgba(255,111,200,0.28)",borderRadius:"22px",padding:"1.6rem 1.5rem",textAlign:"center"}}>
        <div style={{fontSize:"2rem",marginBottom:"0.3rem"}}>💖🗨️</div>
        <GText g="linear-gradient(135deg,#FF6FC8,#FFD93D,#00D2FF)" size="1.4rem" style={{marginBottom:"0.25rem"}}>How do you like MD ANAS Fun World?</GText>
        <p style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.5)",fontSize:"0.82rem",marginBottom:"1.1rem"}}>Tap an emoji to rate the whole website — your opinion makes us better! 🌈</p>

        {/* Emoji rating */}
        <div style={{display:"flex",gap:"8px",justifyContent:"center",flexWrap:"wrap",marginBottom:"1.1rem"}}>
          {EMOJIS.map(opt=>(
            <button key={opt.e} onClick={()=>setRating(opt.e)}
              style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"4px",
                background:rating===opt.e?"rgba(255,111,200,0.22)":"rgba(255,255,255,0.05)",
                border:`2px solid ${rating===opt.e?"#FF6FC8":"rgba(255,255,255,0.12)"}`,
                borderRadius:"16px",padding:"0.6rem 0.8rem",cursor:"pointer",transition:"all 0.2s",
                transform:rating===opt.e?"scale(1.12) translateY(-3px)":"scale(1)",minWidth:"66px"}}
              onMouseEnter={e=>{if(rating!==opt.e){e.currentTarget.style.background="rgba(255,255,255,0.1)";e.currentTarget.style.transform="scale(1.06)";}}}
              onMouseLeave={e=>{if(rating!==opt.e){e.currentTarget.style.background="rgba(255,255,255,0.05)";e.currentTarget.style.transform="scale(1)";}}}>
              <span style={{fontSize:"1.85rem",lineHeight:1,animation:rating===opt.e?"bounce 0.5s":"none"}}>{opt.e}</span>
              <span style={{fontFamily:"'Nunito',sans-serif",fontSize:"0.64rem",fontWeight:700,color:rating===opt.e?"#FF6FC8":"rgba(255,255,255,0.45)"}}>{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Comment */}
        <textarea value={text} onChange={e=>setText(e.target.value)} maxLength={250}
          placeholder="✏️ What did you love? What should we add next? (optional)"
          style={{width:"100%",maxWidth:"460px",minHeight:"64px",resize:"vertical",
            background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.14)",
            borderRadius:"14px",padding:"0.7rem 0.9rem",color:"#fff",fontFamily:"'Nunito',sans-serif",
            fontSize:"0.85rem",outline:"none",marginBottom:"0.85rem",lineHeight:1.5}}
          onFocus={e=>e.currentTarget.style.borderColor="#FF6FC8"}
          onBlur={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.14)"}/>

        <div>
          <Btn onClick={submit} disabled={!rating}
            g={rating?"linear-gradient(135deg,#FF6FC8,#A855F7)":"rgba(255,255,255,0.08)"}
            style={{fontSize:"0.9rem",padding:"0.6rem 1.8rem",border:rating?"none":"1px solid rgba(255,255,255,0.14)"}}>
            {sent?"Sent! 🎉":"Send My Feedback 💌"}
          </Btn>
        </div>

        {sent&&(
          <div style={{marginTop:"1rem",background:"rgba(107,203,119,0.12)",border:"1px solid rgba(107,203,119,0.3)",borderRadius:"14px",padding:"0.75rem 1rem",fontFamily:"'Fredoka One',cursive",color:"#6BCB77",fontSize:"0.98rem",animation:"affirmIn 0.4s"}}>
            🎉 Thank you so much! {rating} You're a superstar — keep having fun! 🌟
          </div>
        )}
        {!sent&&!rating&&(
          <div style={{marginTop:"0.6rem",fontFamily:"'Nunito',sans-serif",fontSize:"0.73rem",color:"rgba(255,255,255,0.3)"}}>
            👆 Pick an emoji to send your feedback!
          </div>
        )}
      </div>
    </div>
  );
}


// ── GAMES SECTION ─────────────────────────────────────────────────────────────
// ── BackBar — universal back button row, left-aligned and consistent ──────────
// Sits as the first element of every section, in a fixed-height row so the
// section title below it always lands in the same place across all sections.
function BackBar({onBack,label="Back",color="#A855F7"}){
  return(
    <div style={{
      display:"flex",alignItems:"center",height:"44px",marginBottom:"0.5rem",
      animation:"slideDown 0.3s ease-out"
    }}>
      <button onClick={onBack} aria-label="Go back"
        style={{display:"inline-flex",alignItems:"center",gap:"7px",
          background:"rgba(255,255,255,0.05)",border:`1px solid ${color}40`,
          borderRadius:"12px",padding:"0 14px",height:"36px",
          color:"rgba(255,255,255,0.82)",fontFamily:"'Nunito',sans-serif",
          fontWeight:700,fontSize:"0.8rem",cursor:"pointer",
          transition:"all 0.18s ease",backdropFilter:"blur(8px)",lineHeight:1,
          whiteSpace:"nowrap"}}
        onMouseEnter={e=>{e.currentTarget.style.background=`${color}24`;e.currentTarget.style.borderColor=`${color}90`;e.currentTarget.style.color="#fff";}}
        onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.05)";e.currentTarget.style.borderColor=`${color}40`;e.currentTarget.style.color="rgba(255,255,255,0.82)";}}>
        <span style={{fontSize:"1.05rem",lineHeight:1,marginTop:"-1px"}}>‹</span>
        <span>{label}</span>
      </button>
    </div>
  );
}

// ── FloatBack — fixed floating back button bottom-left (mobile-reachable) ──────
function FloatBack({onBack}){
  return(
    <button onClick={onBack} aria-label="Go back"
      style={{position:"fixed",bottom:"24px",left:"24px",zIndex:600,
        width:"48px",height:"48px",borderRadius:"50%",
        background:"linear-gradient(135deg,#A855F7,#FF6FC8)",
        border:"none",color:"#fff",fontSize:"1.5rem",cursor:"pointer",
        boxShadow:"0 4px 18px rgba(168,85,247,0.5)",
        display:"flex",alignItems:"center",justifyContent:"center",
        lineHeight:1,paddingBottom:"3px",
        animation:"slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        transition:"transform 0.2s,box-shadow 0.2s"}}
      onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.1)";e.currentTarget.style.boxShadow="0 6px 24px rgba(168,85,247,0.7)";}}
      onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="0 4px 18px rgba(168,85,247,0.5)";}}>
      ‹
    </button>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
function ClickGame({onScore}){
  const [score,setScore]=useState(0);
  const [time,setTime]=useState(15);
  const [running,setRunning]=useState(false);
  const [pos,setPos]=useState({top:"40%",left:"40%"});
  const [boom,setBoom]=useState(false);
  const [done,setDone]=useState(false);
  const scoreRef=useRef(0);
  useEffect(()=>{
    if(!running)return;
    if(time<=0){setRunning(false);setDone(true);onScore("ClickStar",scoreRef.current);return;}
    const t=setTimeout(()=>setTime(t=>t-1),1000);return()=>clearTimeout(t);
  },[running,time]);
  const move=()=>setPos({top:`${10+Math.random()*75}%`,left:`${5+Math.random()*82}%`});
  const click=()=>{if(!running)return;scoreRef.current++;setScore(scoreRef.current);setBoom(true);setTimeout(()=>setBoom(false),280);move();}
  const start=()=>{setScore(0);scoreRef.current=0;setTime(15);setRunning(true);setDone(false);move();}
  return(
    <div style={{textAlign:"center"}}>
      <GText g="linear-gradient(135deg,#FF6B6B,#FFD93D)" style={{marginBottom:"0.5rem"}}>🎯 Click the Star!</GText>
      <div style={{display:"flex",justifyContent:"center",gap:"2rem",margin:"0.5rem 0",fontFamily:"'Fredoka One',cursive"}}><span style={{color:"#FFD93D",fontSize:"1.2rem"}}>⭐ {score}</span><span style={{color:"#FF6B6B",fontSize:"1.2rem"}}>⏱ {time}s</span></div>
      {!running&&<Btn onClick={start} style={{animation:"pulse 1.5s infinite"}}>{done?`🎉 Again! (${score} pts)`:"Start 🚀"}</Btn>}
      <div style={{position:"relative",height:"220px",background:"rgba(255,107,107,0.08)",borderRadius:"18px",overflow:"hidden",margin:"0.75rem 0",border:"1.5px dashed rgba(255,211,61,0.4)"}}>
        {running&&<button onClick={click} style={{position:"absolute",...pos,transform:"translate(-50%,-50%)",background:"none",border:"none",fontSize:boom?"3.8rem":"2.4rem",cursor:"pointer",transition:"font-size 0.12s",filter:boom?"drop-shadow(0 0 18px #FFD93D)":"none"}}>⭐</button>}
        {!running&&!done&&<div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.25)",fontSize:"0.9rem"}}>Press Start!</div>}
      </div>
    </div>
  );
}

function MemoryGame({onScore}){
  const emojis=["🐶","🐱","🦊","🐻","🦁","🐯","🦄","🐸"];
  const [cards,setCards]=useState([]);
  const [flipped,setFlipped]=useState([]);
  const [matched,setMatched]=useState([]);
  const [moves,setMoves]=useState(0);
  const [scored,setScored]=useState(false);
  const init=()=>{const deck=[...emojis,...emojis].sort(()=>Math.random()-0.5).map((e,i)=>({id:i,emoji:e}));setCards(deck);setFlipped([]);setMatched([]);setMoves(0);setScored(false);}
  useEffect(()=>init(),[]);
  useEffect(()=>{
    if(flipped.length===2){
      const [a,b]=flipped.map(i=>cards[i]);
      if(a.emoji===b.emoji)setMatched(m=>[...m,a.emoji]);
      setTimeout(()=>setFlipped([]),700);setMoves(m=>m+1);
    }
  },[flipped]);
  useEffect(()=>{if(matched.length===8&&!scored){setScored(true);onScore("Memory",Math.max(10,100-moves*3));}},[ matched,scored]);
  const flip=i=>{if(flipped.length===2||flipped.includes(i)||matched.includes(cards[i]?.emoji))return;setFlipped(f=>[...f,i]);}
  return(
    <div style={{textAlign:"center"}}>
      <GText g="linear-gradient(135deg,#4D96FF,#A855F7)" style={{marginBottom:"0.4rem"}}>🃏 Memory Match</GText>
      <p style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.45)",fontSize:"0.85rem"}}>Moves: {moves} | {matched.length}/8 matched</p>
      {matched.length===8&&<div style={{fontFamily:"'Fredoka One',cursive",color:"#6BCB77",fontSize:"1.1rem",animation:"bounce 0.5s"}}>🎉 Done in {moves} moves!</div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"7px",maxWidth:"300px",margin:"0.6rem auto"}}>
        {cards.map((c,i)=>{const show=flipped.includes(i)||matched.includes(c.emoji);return(
          <div key={c.id} onClick={()=>flip(i)} style={{height:"62px",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.7rem",cursor:"pointer",transition:"all 0.3s",background:show?(matched.includes(c.emoji)?"linear-gradient(135deg,#6BCB77,#00D2FF)":"linear-gradient(135deg,#FFD93D,#FF9A3C)"):"linear-gradient(135deg,#4D96FF,#A855F7)"}}>
            {show?c.emoji:"❓"}
          </div>
        );})}
      </div>
      <Btn onClick={init} g="linear-gradient(135deg,#4D96FF,#A855F7)" style={{fontSize:"0.9rem",padding:"0.4rem 1rem",marginTop:"0.3rem"}}>New Game 🔄</Btn>
    </div>
  );
}

function DarkRoomGame({onScore}){
  const G=5;
  const [phase,setPhase]=useState("intro");
  const [pos,setPos]=useState({r:2,c:2});
  const [exit,setExit]=useState({r:0,c:0});
  const [key,setKey]=useState(null);
  const [ghost,setGhost]=useState({r:4,c:4});
  const [steps,setSteps]=useState(0);
  const [shake,setShake]=useState(false);
  const R=useRef({pos:{r:2,c:2},key:null,ghost:{r:4,c:4},exit:{r:0,c:0},steps:0,phase:"intro"});
  const start=()=>{
    const p={r:2,c:2},e={r:Math.floor(Math.random()*G),c:Math.floor(Math.random()*G)},k={r:Math.floor(Math.random()*G),c:Math.floor(Math.random()*G),found:false},gh={r:0,c:0};
    R.current={pos:p,key:k,ghost:gh,exit:e,steps:0,phase:"playing"};
    setPos(p);setExit(e);setKey({...k});setGhost({...gh});setSteps(0);setPhase("playing");
  };
  useEffect(()=>{
    if(phase!=="playing")return;
    const iv=setInterval(()=>{
      const dirs=[[-1,0],[1,0],[0,-1],[0,1]];const[dr,dc]=dirs[Math.floor(Math.random()*4)];
      const ng={r:Math.max(0,Math.min(G-1,R.current.ghost.r+dr)),c:Math.max(0,Math.min(G-1,R.current.ghost.c+dc))};
      R.current.ghost=ng;setGhost({...ng});
      if(ng.r===R.current.pos.r&&ng.c===R.current.pos.c){setShake(true);setTimeout(()=>setShake(false),500);setPhase("lose");R.current.phase="lose";}
    },1400);return()=>clearInterval(iv);
  },[phase]);
  const move=(dr,dc)=>{
    if(R.current.phase!=="playing")return;
    const nr=Math.max(0,Math.min(G-1,R.current.pos.r+dr)),nc=Math.max(0,Math.min(G-1,R.current.pos.c+dc));
    R.current.pos={r:nr,c:nc};R.current.steps++;setPos({r:nr,c:nc});setSteps(R.current.steps);
    if(R.current.key&&!R.current.key.found&&R.current.key.r===nr&&R.current.key.c===nc){R.current.key={...R.current.key,found:true};setKey({...R.current.key});}
    if(R.current.key?.found&&R.current.exit.r===nr&&R.current.exit.c===nc){const pts=Math.max(10,80-R.current.steps*2);onScore("DarkRoom",pts);setPhase("win");R.current.phase="win";return;}
    if(R.current.ghost.r===nr&&R.current.ghost.c===nc){setShake(true);setTimeout(()=>setShake(false),500);setPhase("lose");R.current.phase="lose";}
  };
  useEffect(()=>{
    const h=e=>{const m={"ArrowUp":[-1,0],"ArrowDown":[1,0],"ArrowLeft":[0,-1],"ArrowRight":[0,1]};if(m[e.key]){e.preventDefault();move(...m[e.key]);}}
    window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);
  },[phase]);
  const vis=(r,c)=>Math.abs(r-pos.r)<=1&&Math.abs(c-pos.c)<=1;
  const cell=(r,c)=>{
    if(pos.r===r&&pos.c===c)return"🔦";
    if(ghost.r===r&&ghost.c===c&&vis(r,c))return"👻";
    if(key&&!key.found&&key.r===r&&key.c===c&&vis(r,c))return"🗝️";
    if(exit.r===r&&exit.c===c&&key?.found&&vis(r,c))return"🚪";
    if(exit.r===r&&exit.c===c&&!key?.found&&vis(r,c))return"🔒";
    return vis(r,c)?"·":"";
  };
  const bStyle={width:"44px",height:"44px",background:"linear-gradient(135deg,#A855F7,#FF6FC8)",color:"#fff",border:"none",borderRadius:"10px",fontFamily:"'Fredoka One',cursive",fontSize:"1.2rem",cursor:"pointer"};
  return(
    <div style={{textAlign:"center"}}>
      <GText g="linear-gradient(135deg,#A855F7,#FF6FC8)" style={{marginBottom:"0.4rem"}}>🌑 Dark Room</GText>
      {phase==="intro"&&<div><p style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.5)",fontSize:"0.83rem",margin:"0.5rem 0"}}>🗝️ find key → 🚪 door, dodge 👻 (arrow keys work too)</p><Btn onClick={start} g="linear-gradient(135deg,#A855F7,#FF6FC8)" style={{animation:"pulse 1.5s infinite"}}>Enter Darkness 🌑</Btn></div>}
      {phase==="playing"&&<>
        <p style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.45)",fontSize:"0.8rem",margin:"0.3rem 0"}}>Steps:{steps} | Key:{key?.found?"✅":"🗝️"}</p>
        <div style={{display:"inline-grid",gridTemplateColumns:`repeat(${G},1fr)`,gap:"4px",background:"#05050f",padding:"10px",borderRadius:"16px",margin:"0.4rem auto",animation:shake?"shake 0.4s":"none",border:"1px solid rgba(168,85,247,0.28)"}}>
          {Array.from({length:G},(_,r)=>Array.from({length:G},(_,c)=><div key={`${r}-${c}`} style={{width:"46px",height:"46px",borderRadius:"8px",background:vis(r,c)?"rgba(45,43,85,0.9)":"rgba(5,5,16,0.95)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem",border:`1px solid ${vis(r,c)?"rgba(168,85,247,0.25)":"transparent"}`,transition:"background 0.3s"}}>{cell(r,c)}</div>))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,44px)",gap:"6px",justifyContent:"center",marginTop:"8px"}}>
          {[["","↑",""],["←","·","→"],["","↓",""]].map((row,ri)=>row.map((b,ci)=>b&&b!=="·"?<button key={`${ri}-${ci}`} onClick={()=>{if(b==="↑")move(-1,0);else if(b==="↓")move(1,0);else if(b==="←")move(0,-1);else move(0,1);}} style={bStyle}>{b}</button>:<div key={`${ri}-${ci}`}/>))}
        </div>
      </>}
      {phase==="win"&&<div style={{padding:"1rem"}}><div style={{fontSize:"3rem",animation:"bounce 0.5s"}}>🏆</div><div style={{fontFamily:"'Fredoka One',cursive",color:"#6BCB77",fontSize:"1.2rem"}}>Escaped in {steps} steps!</div><Btn onClick={start} g="linear-gradient(135deg,#A855F7,#FF6FC8)" style={{marginTop:"10px"}}>Again 🌑</Btn></div>}
      {phase==="lose"&&<div style={{padding:"1rem"}}><div style={{fontSize:"3rem",animation:"wiggle 0.5s"}}>👻</div><div style={{fontFamily:"'Fredoka One',cursive",color:"#FF6B6B",fontSize:"1.2rem"}}>Ghost got you!</div><Btn onClick={start} g="linear-gradient(135deg,#FF6B6B,#A855F7)" style={{marginTop:"10px"}}>Try Again!</Btn></div>}
    </div>
  );
}

function GhostChase({onScore}){
  const [phase,setPhase]=useState("intro");
  const [player,setPlayer]=useState({x:50,y:50});
  const [ghosts,setGhosts]=useState([]);
  const [coins,setCoins]=useState([]);
  const [collected,setCollected]=useState(0);
  const [time,setTime]=useState(20);
  const [scored,setScored]=useState(false);
  const pRef=useRef({x:50,y:50});
  const start=()=>{const p={x:50,y:50};pRef.current=p;setGhosts([{x:10,y:10,id:0},{x:90,y:10,id:1},{x:50,y:5,id:2}]);setCoins(Array.from({length:8},(_,i)=>({id:i,x:10+Math.random()*80,y:10+Math.random()*80})));setCollected(0);setTime(20);setPlayer(p);setPhase("playing");setScored(false);}
  useEffect(()=>{
    if(phase!=="playing")return;
    if(time<=0){if(!scored){setScored(true);onScore("GhostChase",collected*8);}setPhase(collected>=5?"win":"lose");return;}
    const t=setTimeout(()=>setTime(t=>t-1),1000);return()=>clearTimeout(t);
  },[phase,time,collected,scored]);
  useEffect(()=>{
    if(phase!=="playing")return;
    const iv=setInterval(()=>{setGhosts(gs=>gs.map(g=>{const dx=pRef.current.x-g.x,dy=pRef.current.y-g.y,dist=Math.sqrt(dx*dx+dy*dy)||1;return{...g,x:Math.max(0,Math.min(100,g.x+(dx/dist)*1.8)),y:Math.max(0,Math.min(100,g.y+(dy/dist)*1.8))};}))},[100]);return()=>clearInterval(iv);
  },[phase]);
  useEffect(()=>{
    if(phase!=="playing")return;
    ghosts.forEach(g=>{if(Math.abs(g.x-player.x)<5&&Math.abs(g.y-player.y)<5&&!scored){setScored(true);onScore("GhostChase",collected*8);setPhase("lose");}});
    setCoins(cs=>{const rem=cs.filter(c=>!(Math.abs(c.x-player.x)<6&&Math.abs(c.y-player.y)<6));if(rem.length<cs.length)setCollected(v=>v+(cs.length-rem.length));return rem;});
  },[player,ghosts,phase]);
  const move=(dx,dy)=>{setPlayer(p=>{const np={x:Math.max(2,Math.min(98,p.x+dx)),y:Math.max(2,Math.min(98,p.y+dy))};pRef.current=np;return np;});}
  const bStyle={width:"44px",height:"44px",background:"linear-gradient(135deg,#FF6FC8,#A855F7)",color:"#fff",border:"none",borderRadius:"10px",fontFamily:"'Fredoka One',cursive",fontSize:"1.2rem",cursor:"pointer"};
  return(
    <div style={{textAlign:"center"}}>
      <GText g="linear-gradient(135deg,#FF6FC8,#A855F7)" style={{marginBottom:"0.4rem"}}>👻 Ghost Chase</GText>
      {phase==="intro"&&<div><p style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.5)",fontSize:"0.83rem",margin:"0.5rem 0"}}>Collect 5+ 🪙 coins, dodge ghosts in 20s!</p><Btn onClick={start} g="linear-gradient(135deg,#FF6FC8,#A855F7)" style={{animation:"pulse 1.5s infinite"}}>Start Chase! 👻</Btn></div>}
      {phase==="playing"&&<>
        <div style={{display:"flex",justifyContent:"center",gap:"1.5rem",margin:"0.3rem 0",fontFamily:"'Fredoka One',cursive",fontSize:"1rem"}}><span style={{color:"#FFD93D"}}>🪙 {collected}</span><span style={{color:"#FF6B6B"}}>⏱ {time}s</span></div>
        <div style={{position:"relative",width:"100%",maxWidth:"310px",height:"260px",background:"linear-gradient(135deg,#1a0a2e,#0a1a2e)",borderRadius:"18px",margin:"0 auto",overflow:"hidden",border:"1.5px solid rgba(255,111,200,0.35)"}}>
          <div style={{position:"absolute",left:`${player.x}%`,top:`${player.y}%`,transform:"translate(-50%,-50%)",fontSize:"1.6rem",zIndex:3}}>🧒</div>
          {ghosts.map(g=><div key={g.id} style={{position:"absolute",left:`${g.x}%`,top:`${g.y}%`,transform:"translate(-50%,-50%)",fontSize:"1.4rem",zIndex:2}}>👻</div>)}
          {coins.map(c=><div key={c.id} style={{position:"absolute",left:`${c.x}%`,top:`${c.y}%`,transform:"translate(-50%,-50%)",fontSize:"1rem",zIndex:1}}>🪙</div>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,44px)",gap:"6px",justifyContent:"center",marginTop:"8px"}}>
          {[["","↑",""],["←","·","→"],["","↓",""]].map((row,ri)=>row.map((b,ci)=>b&&b!=="·"?<button key={`${ri}-${ci}`} onClick={()=>{if(b==="↑")move(0,-8);else if(b==="↓")move(0,8);else if(b==="←")move(-8,0);else move(8,0);}} style={bStyle}>{b}</button>:<div key={`${ri}-${ci}`}/>))}
        </div>
      </>}
      {(phase==="win"||phase==="lose")&&<div style={{padding:"1rem"}}><div style={{fontSize:"3rem"}}>{phase==="win"?"🎉":"😅"}</div><div style={{fontFamily:"'Fredoka One',cursive",color:phase==="win"?"#6BCB77":"#FF6B6B",fontSize:"1.1rem"}}>{phase==="win"?"Ghost Dodger!":"Better luck!"} ({collected} coins)</div><Btn onClick={start} g="linear-gradient(135deg,#FF6FC8,#A855F7)" style={{marginTop:"10px"}}>Again! 👻</Btn></div>}
    </div>
  );
}

function GamesSection({onScore,onBack}){
  const [game,setGame]=useState(()=>{try{return sessionStorage.getItem("mda_games_tab")||"click";}catch{return "click";}});
  const setGameP=t=>{setGame(t);try{sessionStorage.setItem("mda_games_tab",t);}catch{};};
  const tabs=[{id:"click",label:"🎯 Click"},{id:"memory",label:"🃏 Memory"},{id:"dark",label:"🌑 Dark"},{id:"ghost",label:"👻 Ghost"}];
  return(
    <div style={{position:"relative",zIndex:1}}>
      <BackBar onBack={onBack} label="Home" color="#FF6B6B"/>
      <GText g="linear-gradient(135deg,#FF6B6B,#FFD93D)" size="2rem" style={{textAlign:"center",marginBottom:"1rem"}}>🎮 Fun Games Zone</GText>
      <div style={{display:"flex",justifyContent:"center",gap:"7px",marginBottom:"1rem",flexWrap:"wrap"}}>
        {tabs.map(t=><button key={t.id} onClick={()=>setGameP(t.id)} style={{background:game===t.id?"linear-gradient(135deg,#FF6B6B,#FFD93D)":"rgba(255,255,255,0.07)",color:"#fff",border:game===t.id?"none":"1px solid rgba(255,255,255,0.18)",padding:"0.4rem 1rem",borderRadius:"30px",fontFamily:"'Fredoka One',cursive",cursor:"pointer",fontSize:"0.85rem",transition:"all 0.2s"}}>{t.label}</button>)}
      </div>
      <Card style={{maxWidth:"520px",margin:"0 auto"}}>
        {game==="click"&&<ClickGame onScore={onScore}/>}
        {game==="memory"&&<MemoryGame onScore={onScore}/>}
        {game==="dark"&&<DarkRoomGame onScore={onScore}/>}
        {game==="ghost"&&<GhostChase onScore={onScore}/>}
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── CAR RACE — 3 LEVELS ───────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
const CAR_LEVELS=[
  {id:1,label:"Level 1 — Slow 🐢",speed:1.8,spawnMin:75,spawnRand:40,color:"#6BCB77",desc:"Easy pace, wide gaps. Perfect for learning!",pts:1},
  {id:2,label:"Level 2 — Medium 🚀",speed:2.8,spawnMin:50,spawnRand:28,color:"#FFD93D",desc:"Faster obstacles, tighter gaps. Stay focused!",pts:2},
  {id:3,label:"Level 3 — Hard 🔥",speed:4.2,spawnMin:30,spawnRand:18,color:"#FF6B6B",desc:"Blazing fast with double obstacles. Good luck!",pts:3},
];
const PLAYER_CARS=["🚗","🏎️","🚙","🚕","🛻"];
const OBS_EMOJIS=["🌵","🪨","🛑","🚧","💣","⛽"];
const COIN_EMOJI="🪙";
const LANES=[18,50,82];

function CarGame({onScore,onBack}){
  const [screen,setScreen]=useState("menu"); // menu | playing | result
  const [level,setLevel]=useState(null);
  const [carLane,setCarLane]=useState(1);
  const [obstacles,setObstacles]=useState([]);
  const [coins,setCoins]=useState([]);
  const [dist,setDist]=useState(0);
  const [collected,setCollected]=useState(0);
  const [lives,setLives]=useState(3);
  const [flash,setFlash]=useState(false);
  const [myCar]=useState(()=>PLAYER_CARS[Math.floor(Math.random()*PLAYER_CARS.length)]);
  const R=useRef({lane:1,dist:0,lives:3,collected:0,done:false,spawn:0,level:null});
  const fRef=useRef(null);

  const startGame=(lv)=>{
    setLevel(lv);
    R.current={lane:1,dist:0,lives:3,collected:0,done:false,spawn:0,level:lv};
    setCarLane(1);setObstacles([]);setCoins([]);setDist(0);setCollected(0);setLives(3);setFlash(false);setScreen("playing");
  };

  const endGame=useCallback(()=>{
    if(R.current.done)return;
    R.current.done=true;
    cancelAnimationFrame(fRef.current);
    const basePts=Math.round(R.current.dist/10)+R.current.collected*5;
    const lvPts=basePts*(R.current.level?.pts||1);
    onScore("CarRace",lvPts);
    setScreen("result");
  },[onScore]);

  const changeLane=useCallback((dir)=>{
    const nl=Math.max(0,Math.min(2,R.current.lane+dir));
    R.current.lane=nl;setCarLane(nl);
  },[]);

  useEffect(()=>{
    if(screen!=="playing")return;
    const lv=R.current.level;
    const loop=()=>{
      R.current.dist++;R.current.spawn++;
      // spawn obstacle
      if(R.current.spawn>lv.spawnMin+Math.random()*lv.spawnRand){
        R.current.spawn=0;
        const lane=Math.floor(Math.random()*3);
        const emoji=OBS_EMOJIS[Math.floor(Math.random()*OBS_EMOJIS.length)];
        setObstacles(os=>[...os,{id:Date.now()+"o",lane,y:-5,emoji}]);
        // level 3 can spawn second obstacle in different lane
        if(lv.id===3&&Math.random()>0.5){
          const l2=(lane+1+Math.floor(Math.random()*2))%3;
          setObstacles(os=>[...os,{id:Date.now()+"o2",lane:l2,y:-10,emoji:OBS_EMOJIS[Math.floor(Math.random()*OBS_EMOJIS.length)]}]);
        }
      }
      // spawn coin
      if(Math.random()<0.012){
        setCoins(cs=>[...cs,{id:Date.now()+"c",lane:Math.floor(Math.random()*3),y:-5}]);
      }
      setObstacles(os=>{
        const mv=os.map(o=>({...o,y:o.y+lv.speed})).filter(o=>o.y<110);
        const hit=mv.some(o=>o.lane===R.current.lane&&o.y>72&&o.y<92);
        if(hit){
          setFlash(true);setTimeout(()=>setFlash(false),350);
          R.current.lives--;
          setLives(R.current.lives);
          if(R.current.lives<=0){endGame();return[];}
          return mv.filter(o=>!(o.lane===R.current.lane&&o.y>72&&o.y<92));
        }
        return mv;
      });
      setCoins(cs=>{
        const mv=cs.map(c=>({...c,y:c.y+lv.speed})).filter(c=>c.y<110);
        const got=mv.filter(c=>c.lane===R.current.lane&&c.y>72&&c.y<92);
        if(got.length){R.current.collected+=got.length;setCollected(R.current.collected);}
        return mv.filter(c=>!(c.lane===R.current.lane&&c.y>72&&c.y<92));
      });
      setDist(R.current.dist);
      if(!R.current.done)fRef.current=requestAnimationFrame(loop);
    };
    fRef.current=requestAnimationFrame(loop);
    return()=>cancelAnimationFrame(fRef.current);
  },[screen,endGame]);

  useEffect(()=>{
    if(screen!=="playing")return;
    const h=e=>{if(e.key==="ArrowLeft")changeLane(-1);else if(e.key==="ArrowRight")changeLane(1);}
    window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);
  },[screen,changeLane]);

  const finalPts=Math.round(dist/10+collected*5)*(level?.pts||1);

  return(
    <div style={{position:"relative",zIndex:1}}>
      <BackBar onBack={onBack} label="Home" color="#FFD93D"/>
      <GText g="linear-gradient(135deg,#FFD93D,#FF9A3C,#FF6B6B)" size="2rem" style={{textAlign:"center",marginBottom:"1rem"}}>🚗 Car Race Championship</GText>

      {screen==="menu"&&(
        <div style={{maxWidth:"700px",margin:"0 auto"}}>
          <p style={{textAlign:"center",fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.5)",fontSize:"0.9rem",marginBottom:"1.25rem"}}>Choose your speed level — score multiplier increases with difficulty!</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"1rem"}}>
            {CAR_LEVELS.map(lv=>(
              <div key={lv.id} onClick={()=>startGame(lv)} style={{background:`linear-gradient(135deg,${lv.color}22,${lv.color}44)`,border:`2px solid ${lv.color}88`,borderRadius:"22px",padding:"1.5rem",cursor:"pointer",textAlign:"center",transition:"all 0.3s"}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-6px)";e.currentTarget.style.boxShadow=`0 16px 32px ${lv.color}44`;}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
                <div style={{fontSize:"2.5rem",marginBottom:"0.4rem"}}>{lv.id===1?"🐢":lv.id===2?"🚀":"🔥"}</div>
                <div style={{fontFamily:"'Fredoka One',cursive",fontSize:"1.2rem",color:lv.color,marginBottom:"0.3rem"}}>{lv.label}</div>
                <div style={{fontFamily:"'Nunito',sans-serif",fontSize:"0.82rem",color:"rgba(255,255,255,0.6)",marginBottom:"0.75rem"}}>{lv.desc}</div>
                <div style={{background:`${lv.color}33`,borderRadius:"20px",padding:"0.3rem 0.8rem",display:"inline-block",fontFamily:"'Fredoka One',cursive",color:lv.color,fontSize:"0.88rem"}}>×{lv.pts} score multiplier</div>
              </div>
            ))}
          </div>
          <Card style={{marginTop:"1.25rem",textAlign:"center"}}>
            <div style={{fontFamily:"'Nunito',sans-serif",fontSize:"0.88rem",color:"rgba(255,255,255,0.55)",lineHeight:2}}>
              ⬅️ ➡️ arrow keys or on-screen buttons to switch lanes &nbsp;|&nbsp; 🪙 collect coins for bonus &nbsp;|&nbsp; ❤️ 3 lives
            </div>
          </Card>
        </div>
      )}

      {screen==="playing"&&(
        <div style={{textAlign:"center",maxWidth:"380px",margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"center",gap:"1rem",marginBottom:"0.5rem",flexWrap:"wrap"}}>
            <span style={{fontFamily:"'Fredoka One',cursive",color:"#FF6B6B",fontSize:"1rem"}}>{"❤️".repeat(Math.max(0,lives))}</span>
            <span style={{fontFamily:"'Fredoka One',cursive",color:"#FFD93D",fontSize:"1rem"}}>🪙 {collected}</span>
            <span style={{fontFamily:"'Fredoka One',cursive",color:"#6BCB77",fontSize:"1rem"}}>📏 {Math.round(dist/10)}m</span>
            <span style={{fontFamily:"'Fredoka One',cursive",color:level?.color,fontSize:"0.9rem",background:"rgba(255,255,255,0.1)",padding:"2px 10px",borderRadius:"20px"}}>{level?.label.split(" — ")[1]}</span>
          </div>
          {/* Road */}
          <div style={{position:"relative",width:"100%",height:"380px",background:"#1a1a1a",borderRadius:"18px",overflow:"hidden",border:`2px solid ${level?.color}55`,filter:flash?"brightness(2)":"none",transition:"filter 0.1s"}}>
            {/* Lane lines */}
            {[33,67].map(p=><div key={p} style={{position:"absolute",left:`${p}%`,top:0,width:"2px",height:"100%",background:"repeating-linear-gradient(to bottom,#FFD93D 0px,#FFD93D 24px,transparent 24px,transparent 48px)",animation:"roadMove 0.4s linear infinite"}}/>)}
            {/* Edge lines */}
            <div style={{position:"absolute",left:"3px",top:0,width:"4px",height:"100%",background:"#FFD93D"}}/>
            <div style={{position:"absolute",right:"3px",top:0,width:"4px",height:"100%",background:"#FFD93D"}}/>
            {/* Obstacles */}
            {obstacles.map(o=><div key={o.id} style={{position:"absolute",left:`${LANES[o.lane]}%`,top:`${o.y}%`,transform:"translate(-50%,-50%)",fontSize:"1.8rem",zIndex:2}}>{o.emoji}</div>)}
            {/* Coins */}
            {coins.map(c=><div key={c.id} style={{position:"absolute",left:`${LANES[c.lane]}%`,top:`${c.y}%`,transform:"translate(-50%,-50%)",fontSize:"1.3rem",zIndex:2}}>🪙</div>)}
            {/* Player */}
            <div style={{position:"absolute",left:`${LANES[carLane]}%`,bottom:"8%",transform:"translateX(-50%)",fontSize:"2.6rem",zIndex:5,filter:`drop-shadow(0 0 10px ${level?.color})`,transition:"left 0.12s",animation:"carBounce 0.5s infinite"}}>{myCar}</div>
          </div>
          <div style={{display:"flex",gap:"16px",justifyContent:"center",marginTop:"12px"}}>
            <Btn onClick={()=>changeLane(-1)} g={`linear-gradient(135deg,${level?.color},#FF9A3C)`} style={{width:"64px",height:"56px",padding:"0",fontSize:"1.6rem",borderRadius:"16px"}}>◀</Btn>
            <Btn onClick={endGame} g="linear-gradient(135deg,#666,#444)" style={{padding:"0 1rem",fontSize:"0.85rem"}}>Give Up</Btn>
            <Btn onClick={()=>changeLane(1)} g={`linear-gradient(135deg,${level?.color},#FF9A3C)`} style={{width:"64px",height:"56px",padding:"0",fontSize:"1.6rem",borderRadius:"16px"}}>▶</Btn>
          </div>
        </div>
      )}

      {screen==="result"&&(
        <Card style={{maxWidth:"420px",margin:"0 auto",textAlign:"center"}}>
          <div style={{fontSize:"3.5rem",animation:"bounce 0.5s",marginBottom:"0.5rem"}}>🏁</div>
          <GText g={`linear-gradient(135deg,${level?.color},#FFD93D)`} size="1.7rem" style={{marginBottom:"0.5rem"}}>Race Finished!</GText>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px",margin:"1rem 0"}}>
            {[{label:"Distance",val:Math.round(dist/10)+"m",icon:"📏"},{label:"Coins",val:collected,icon:"🪙"},{label:"Score",val:finalPts+" pts",icon:"⭐"}].map(s=>(
              <div key={s.label} style={{background:"rgba(255,255,255,0.07)",borderRadius:"14px",padding:"0.75rem 0.4rem",border:"1px solid rgba(255,255,255,0.12)"}}>
                <div style={{fontSize:"1.5rem"}}>{s.icon}</div>
                <div style={{fontFamily:"'Fredoka One',cursive",color:"#fff",fontSize:"1.1rem"}}>{s.val}</div>
                <div style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.45)",fontSize:"0.7rem"}}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.5)",fontSize:"0.82rem",marginBottom:"1rem"}}>×{level?.pts} multiplier for {level?.label.split(" — ")[0]} applied</div>
          <div style={{display:"flex",gap:"10px",justifyContent:"center",flexWrap:"wrap"}}>
            <Btn onClick={()=>setScreen("menu")} g="linear-gradient(135deg,#4D96FF,#A855F7)">Change Level 🔀</Btn>
            <Btn onClick={()=>startGame(level)} g={`linear-gradient(135deg,${level?.color},#FFD93D)`}>Race Again! 🚗</Btn>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── PUZZLE ZONE ───────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

// ① Sliding Number Puzzle (3×3)
function SlidingPuzzle({onScore}){
  const goal=[1,2,3,4,5,6,7,8,0];
  const shuffle=(arr)=>{let a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  const [tiles,setTiles]=useState(()=>shuffle([...goal]));
  const [moves,setMoves]=useState(0);
  const [solved,setSolved]=useState(false);
  const [scored,setScored]=useState(false);
  const reset=()=>{setTiles(shuffle([...goal]));setMoves(0);setSolved(false);setScored(false);}
  const click=(idx)=>{
    const empty=tiles.indexOf(0);
    const r=Math.floor(idx/3),c=idx%3,er=Math.floor(empty/3),ec=empty%3;
    if(Math.abs(r-er)+Math.abs(c-ec)!==1)return;
    const nt=[...tiles];[nt[idx],nt[empty]]=[nt[empty],nt[idx]];
    setTiles(nt);setMoves(m=>m+1);
    const isGoal=nt.every((v,i)=>v===goal[i]);
    if(isGoal&&!solved){setSolved(true);if(!scored){setScored(true);onScore("SlidePuzzle",Math.max(10,120-moves*3));}}
  };
  return(
    <div style={{textAlign:"center"}}>
      <GText g="linear-gradient(135deg,#6BCB77,#00D2FF)" style={{marginBottom:"0.4rem"}}>🔢 Sliding Puzzle</GText>
      <p style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.45)",fontSize:"0.82rem",margin:"0.3rem 0"}}>Moves: {moves} — arrange 1–8 in order!</p>
      {solved&&<div style={{fontFamily:"'Fredoka One',cursive",color:"#6BCB77",fontSize:"1.1rem",animation:"bounce 0.5s",marginBottom:"0.5rem"}}>🎉 Solved in {moves} moves!</div>}
      <div style={{display:"inline-grid",gridTemplateColumns:"repeat(3,1fr)",gap:"6px",margin:"0.5rem auto",padding:"10px",background:"rgba(107,203,119,0.08)",borderRadius:"16px",border:"1px solid rgba(107,203,119,0.25)"}}>
        {tiles.map((t,i)=>(
          <div key={i} onClick={()=>click(i)} style={{width:"72px",height:"72px",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Fredoka One',cursive",fontSize:"1.6rem",cursor:t===0?"default":"pointer",background:t===0?"rgba(255,255,255,0.04)":solved?"linear-gradient(135deg,#6BCB77,#00D2FF)":"linear-gradient(135deg,#4D96FF,#A855F7)",color:"#fff",transition:"all 0.2s",border:t===0?"1px dashed rgba(255,255,255,0.12)":"none",boxShadow:t!==0?"0 4px 12px rgba(0,0,0,0.3)":"none"}}
            onMouseEnter={e=>{if(t!==0&&!solved)e.currentTarget.style.transform="scale(1.06)";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";}}>
            {t===0?"":t}
          </div>
        ))}
      </div>
      <Btn onClick={reset} g="linear-gradient(135deg,#6BCB77,#00D2FF)" style={{fontSize:"0.9rem",marginTop:"0.4rem"}}>Shuffle 🔀</Btn>
    </div>
  );
}

// ② Word Unscramble
const WORD_LIST=[
  {word:"BRAIN",hint:"You think with this 🧠"},
  {word:"PUZZLE",hint:"A challenge to solve 🧩"},
  {word:"ROCKET",hint:"Goes to space 🚀"},
  {word:"DRAGON",hint:"A fire-breathing beast 🐉"},
  {word:"JUNGLE",hint:"Dense tropical forest 🌴"},
  {word:"CASTLE",hint:"Where kings live 🏰"},
  {word:"PLANET",hint:"Orbits a star 🪐"},
  {word:"FROZEN",hint:"Very very cold ❄️"},
  {word:"TROPHY",hint:"You win this 🏆"},
  {word:"WIZARD",hint:"Casts magical spells 🧙"},
];
const scramble=w=>{let a=w.split("");for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}const s=a.join("");return s===w?scramble(w):s;}

function WordUnscramble({onScore}){
  const [idx,setIdx]=useState(()=>Math.floor(Math.random()*WORD_LIST.length));
  const [sc,setSc]=useState(()=>scramble(WORD_LIST[0].word));
  const [input,setInput]=useState("");
  const [result,setResult]=useState(null);
  const [totalScore,setTotalScore]=useState(0);
  const [round,setRound]=useState(1);
  const [scored,setScored]=useState(false);
  const next=()=>{
    const ni=(idx+1)%WORD_LIST.length;
    setIdx(ni);setSc(scramble(WORD_LIST[ni].word));setInput("");setResult(null);setRound(r=>r+1);
  };
  useEffect(()=>{setSc(scramble(WORD_LIST[idx].word));},[idx]);
  const check=()=>{
    const correct=input.toUpperCase()===WORD_LIST[idx].word;
    setResult(correct?"correct":"wrong");
    if(correct){const s=totalScore+10;setTotalScore(s);if(!scored){setScored(true);onScore("WordUnscramble",s);}}
    setTimeout(next,1200);
  };
  return(
    <div style={{textAlign:"center"}}>
      <GText g="linear-gradient(135deg,#FF9A3C,#FFD93D)" style={{marginBottom:"0.4rem"}}>📝 Word Unscramble</GText>
      <p style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.45)",fontSize:"0.82rem"}}>Round {round} | Score: {totalScore}</p>
      <div style={{margin:"0.75rem 0"}}>
        <div style={{fontFamily:"'Fredoka One',cursive",color:"rgba(255,255,255,0.35)",fontSize:"0.82rem",marginBottom:"0.3rem"}}>Hint: {WORD_LIST[idx].hint}</div>
        <div style={{display:"flex",gap:"6px",justifyContent:"center",margin:"0.5rem 0"}}>
          {sc.split("").map((ch,i)=>(
            <div key={i} style={{width:"40px",height:"44px",borderRadius:"10px",background:"linear-gradient(135deg,#FF9A3C,#FFD93D)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Fredoka One',cursive",fontSize:"1.3rem",color:"#fff",boxShadow:"0 4px 10px rgba(0,0,0,0.3)",animation:`popIn 0.3s ${i*0.05}s both`}}>{ch}</div>
          ))}
        </div>
        <div style={{display:"flex",gap:"8px",justifyContent:"center",marginTop:"0.75rem"}}>
          <input value={input} onChange={e=>setInput(e.target.value.toUpperCase())} onKeyDown={e=>e.key==="Enter"&&input&&check()} placeholder="Type answer..." maxLength={10} style={{padding:"0.5rem 1rem",borderRadius:"20px",border:`1px solid ${result==="correct"?"#6BCB77":result==="wrong"?"#FF6B6B":"rgba(255,255,255,0.2)"}`,background:"rgba(255,255,255,0.07)",color:"#fff",fontFamily:"'Fredoka One',cursive",fontSize:"1rem",outline:"none",width:"160px",textAlign:"center",animation:result==="wrong"?"shake 0.3s":result==="correct"?"correctPop 0.3s":"none"}}/>
          <Btn onClick={check} g="linear-gradient(135deg,#FF9A3C,#FFD93D)" style={{padding:"0.5rem 1rem"}} disabled={!input}>Go!</Btn>
        </div>
        {result&&<div style={{fontFamily:"'Fredoka One',cursive",fontSize:"1rem",color:result==="correct"?"#6BCB77":"#FF6B6B",marginTop:"0.5rem"}}>{result==="correct"?"✅ Correct! +10":"❌ Ans: "+WORD_LIST[idx].word}</div>}
      </div>
    </div>
  );
}

// ③ Number Sequence Puzzle
const SEQ_PUZZLES=[
  {seq:[2,4,6,8,"?"],ans:10,rule:"Add 2 each time"},
  {seq:[1,3,9,27,"?"],ans:81,rule:"Multiply by 3"},
  {seq:[100,50,25,"?",6.25],ans:12.5,rule:"Divide by 2"},
  {seq:[1,4,9,16,"?"],ans:25,rule:"Square numbers"},
  {seq:[2,3,5,8,13,"?"],ans:21,rule:"Fibonacci sequence"},
  {seq:[10,8,6,4,"?"],ans:2,rule:"Subtract 2 each time"},
  {seq:[1,2,4,7,11,"?"],ans:16,rule:"+1, +2, +3, +4, +5..."},
  {seq:[3,6,12,24,"?"],ans:48,rule:"Multiply by 2"},
];

function NumberSequence({onScore}){
  const [qi,setQi]=useState(0);
  const [input,setInput]=useState("");
  const [result,setResult]=useState(null);
  const [score,setScore]=useState(0);
  const [scored,setScored]=useState(false);
  const q=SEQ_PUZZLES[qi];
  const next=()=>{setQi(i=>(i+1)%SEQ_PUZZLES.length);setInput("");setResult(null);}
  const check=()=>{
    const correct=parseFloat(input)===q.ans;
    setResult(correct?"correct":"wrong");
    if(correct){const s=score+12;setScore(s);if(!scored){setScored(true);onScore("NumSequence",s);}}
    setTimeout(next,1400);
  };
  return(
    <div style={{textAlign:"center"}}>
      <GText g="linear-gradient(135deg,#A855F7,#4D96FF)" style={{marginBottom:"0.4rem"}}>🔢 Number Sequence</GText>
      <p style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.45)",fontSize:"0.82rem"}}>Score: {score} pts</p>
      <div style={{margin:"0.75rem 0"}}>
        <div style={{display:"flex",gap:"8px",justifyContent:"center",flexWrap:"wrap",margin:"0.75rem 0"}}>
          {q.seq.map((n,i)=>(
            <div key={i} style={{minWidth:"48px",height:"48px",borderRadius:"12px",background:n==="?"?"rgba(168,85,247,0.15)":"linear-gradient(135deg,#4D96FF,#A855F7)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Fredoka One',cursive",fontSize:"1.2rem",color:n==="?"?"#A855F7":"#fff",border:n==="?"?"2px dashed #A855F7":"none",padding:"0 8px"}}>
              {n}
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:"8px",justifyContent:"center",marginTop:"0.75rem"}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&input&&check()} placeholder="Answer?" type="number" style={{padding:"0.5rem 1rem",borderRadius:"20px",border:`1px solid ${result==="correct"?"#6BCB77":result==="wrong"?"#FF6B6B":"rgba(168,85,247,0.4)"}`,background:"rgba(168,85,247,0.08)",color:"#fff",fontFamily:"'Fredoka One',cursive",fontSize:"1rem",outline:"none",width:"130px",textAlign:"center",animation:result==="wrong"?"shake 0.3s":result==="correct"?"correctPop 0.3s":"none"}}/>
          <Btn onClick={check} g="linear-gradient(135deg,#A855F7,#4D96FF)" style={{padding:"0.5rem 1rem"}} disabled={!input}>Check!</Btn>
        </div>
        {result&&<div style={{fontFamily:"'Fredoka One',cursive",fontSize:"0.95rem",color:result==="correct"?"#6BCB77":"#FF6B6B",marginTop:"0.5rem"}}>{result==="correct"?"✅ Correct! +12":"❌ "+q.ans+" ("+q.rule+")"}</div>}
      </div>
    </div>
  );
}

function PuzzleSection({onScore,onBack}){
  const [tab,setTab]=useState(()=>{try{return sessionStorage.getItem("mda_puzzle_tab")||"slide";}catch{return "slide";}});
  const setTabP=t=>{setTab(t);try{sessionStorage.setItem("mda_puzzle_tab",t);}catch{};};
  const tabs=[{id:"slide",label:"🔢 Slide"},{id:"word",label:"📝 Words"},{id:"seq",label:"🔢 Sequence"}];
  return(
    <div style={{position:"relative",zIndex:1}}>
      <BackBar onBack={onBack} label="Home" color="#6BCB77"/>
      <GText g="linear-gradient(135deg,#6BCB77,#00D2FF,#4D96FF)" size="2rem" style={{textAlign:"center",marginBottom:"1rem"}}>🧩 Puzzle Zone</GText>
      <div style={{display:"flex",justifyContent:"center",gap:"8px",marginBottom:"1rem",flexWrap:"wrap"}}>
        {tabs.map(t=><button key={t.id} onClick={()=>setTabP(t.id)} style={{background:tab===t.id?"linear-gradient(135deg,#6BCB77,#00D2FF)":"rgba(255,255,255,0.07)",color:"#fff",border:tab===t.id?"none":"1px solid rgba(255,255,255,0.18)",padding:"0.4rem 1.1rem",borderRadius:"30px",fontFamily:"'Fredoka One',cursive",cursor:"pointer",fontSize:"0.88rem",transition:"all 0.2s"}}>{t.label}</button>)}
      </div>
      <Card style={{maxWidth:"520px",margin:"0 auto"}}>
        {tab==="slide"&&<SlidingPuzzle onScore={onScore}/>}
        {tab==="word"&&<WordUnscramble onScore={onScore}/>}
        {tab==="seq"&&<NumberSequence onScore={onScore}/>}
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── BRAIN GAMES ───────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

// ① Mind Mapping Race
// Strategy: pure state machine inside a single useRef; setDisplay is only for rendering.
// No closures capture React state — every callback reads R.current.
const MIND_TOPICS=[
  {topic:"🌍 Earth",cats:{
    Animals:["🐘 Elephant","🦁 Lion","🐬 Dolphin","🦅 Eagle","🐍 Snake"],
    Plants:["🌺 Rose","🌴 Palm","🌲 Pine","🌵 Cactus","🌸 Cherry"],
    Oceans:["🌊 Pacific","🌊 Atlantic","🌊 Indian","🌊 Arctic","🌊 Southern"],
    Weather:["⛈ Storm","🌈 Rainbow","❄ Snow","🌪 Tornado","☀ Sunshine"]}},
  {topic:"🚀 Space",cats:{
    Planets:["🪐 Saturn","🔴 Mars","🔵 Neptune","⚫ Uranus","🟠 Jupiter"],
    Stars:["⭐ Sun","💫 Sirius","🌟 Vega","✨ Polaris","🌠 Betelgeuse"],
    Moons:["🌕 Luna","🌙 Phobos","🌛 Europa","🌝 Titan","🌑 Ganymede"],
    Rockets:["🚀 Apollo","🛸 Falcon","🛰 Sputnik","✈ Shuttle","🛩 Starship"]}},
  {topic:"🍕 Food",cats:{
    Fruits:["🍎 Apple","🍌 Banana","🍓 Strawberry","🥝 Kiwi","🍇 Grape"],
    Veggies:["🥕 Carrot","🧅 Onion","🌽 Corn","🥦 Broccoli","🍆 Eggplant"],
    FastFood:["🍕 Pizza","🍔 Burger","🌮 Taco","🍜 Noodles","🌯 Wrap"],
    Desserts:["🍰 Cake","🍦 Ice Cream","🍩 Donut","🍫 Chocolate","🧁 Cupcake"]}},
];

function MindMapRace({onScore}){
  const timerRef=useRef(null);
  // Single source of truth — never read from React state in event handlers
  const G=useRef(null);  // game state object
  const [ui,setUi]=useState({phase:"intro",time:45,score:0,catIdx:0,topicLabel:"",catLabel:"",options:[],selected:[],feedback:null});

  const buildOptions=(topicIdx,catIdx)=>{
    const tp=MIND_TOPICS[topicIdx];
    const catKeys=Object.keys(tp.cats);
    const correct=tp.cats[catKeys[catIdx]];
    const allOther=Object.values(tp.cats).flat().filter(x=>!correct.includes(x));
    const decoys=[...allOther].sort(()=>Math.random()-0.5).slice(0,4);
    return{options:[...correct.slice(0,4),...decoys].sort(()=>Math.random()-0.5),correct};
  };

  const startGame=()=>{
    clearInterval(timerRef.current);
    const topicIdx=Math.floor(Math.random()*MIND_TOPICS.length);
    const tp=MIND_TOPICS[topicIdx];
    const catKeys=Object.keys(tp.cats);
    const {options,correct}=buildOptions(topicIdx,0);
    G.current={topicIdx,catIdx:0,catKeys,score:0,time:45,selected:[],correct,scored:false};
    setUi({phase:"playing",time:45,score:0,catIdx:0,topicLabel:tp.topic,catLabel:catKeys[0],options,selected:[],feedback:null});
    timerRef.current=setInterval(()=>{
      G.current.time--;
      if(G.current.time<=0){
        clearInterval(timerRef.current);
        if(!G.current.scored){G.current.scored=true;onScore("MindMap",G.current.score);}
        setUi(u=>({...u,phase:"done",time:0}));
      } else {
        setUi(u=>({...u,time:G.current.time}));
      }
    },1000);
  };

  useEffect(()=>()=>clearInterval(timerRef.current),[]);

  const pick=(item)=>{
    if(!G.current||G.current.selected.includes(item))return;
    const isRight=G.current.correct.includes(item);
    G.current.selected=[...G.current.selected,item];
    if(isRight){
      G.current.score+=8;
      const rightPicked=G.current.selected.filter(x=>G.current.correct.includes(x)).length;
      setUi(u=>({...u,score:G.current.score,selected:[...G.current.selected],feedback:"✅"}));
      if(rightPicked>=3){
        // Advance to next category after short delay
        setTimeout(()=>{
          if(!G.current)return;
          const nci=(G.current.catIdx+1)%G.current.catKeys.length;
          G.current.catIdx=nci;
          G.current.selected=[];
          const {options:newOpts,correct:newCorrect}=buildOptions(G.current.topicIdx,nci);
          G.current.correct=newCorrect;
          const tp=MIND_TOPICS[G.current.topicIdx];
          setUi(u=>({...u,catIdx:nci,catLabel:G.current.catKeys[nci],options:newOpts,selected:[],feedback:null}));
        },700);
      } else {
        setTimeout(()=>setUi(u=>({...u,feedback:null})),500);
      }
    } else {
      setUi(u=>({...u,selected:[...G.current.selected],feedback:"❌"}));
      setTimeout(()=>setUi(u=>({...u,feedback:null})),600);
    }
  };

  return(
    <div style={{textAlign:"center"}}>
      <GText g="linear-gradient(135deg,#4D96FF,#A855F7)" style={{marginBottom:"0.4rem"}}>🗺️ Mind Mapping Race</GText>
      {ui.phase==="intro"&&(
        <div>
          <p style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.5)",fontSize:"0.85rem",margin:"0.5rem 0 0.75rem"}}>Pick items that belong to each category — race the 45s clock!</p>
          <Btn onClick={startGame} g="linear-gradient(135deg,#4D96FF,#A855F7)" style={{animation:"pulse 1.5s infinite"}}>Start Race! 🗺️</Btn>
        </div>
      )}
      {ui.phase==="playing"&&(
        <>
          <div style={{display:"flex",justifyContent:"center",gap:"1rem",margin:"0.4rem 0",fontFamily:"'Fredoka One',cursive",fontSize:"0.9rem"}}>
            <span style={{color:"#FF6B6B"}}>⏱ {ui.time}s</span>
            <span style={{color:"#FFD93D"}}>⭐ {ui.score}</span>
            <span style={{color:"#6BCB77"}}>Topic: {ui.topicLabel}</span>
          </div>
          <div style={{background:"linear-gradient(135deg,rgba(77,150,255,0.15),rgba(168,85,247,0.15))",borderRadius:"14px",padding:"0.6rem 1rem",marginBottom:"0.75rem",border:"1px solid rgba(77,150,255,0.3)"}}>
            <div style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.5)",fontSize:"0.72rem",marginBottom:"0.15rem"}}>Pick items that belong to:</div>
            <div style={{fontFamily:"'Fredoka One',cursive",color:"#4D96FF",fontSize:"1.2rem"}}>{ui.catLabel}</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"7px",maxWidth:"360px",margin:"0 auto 0.5rem"}}>
            {ui.options.map((item,i)=>{
              const isSel=ui.selected.includes(item);
              const isRight=isSel&&G.current&&G.current.correct.includes(item);
              const isWrong=isSel&&G.current&&!G.current.correct.includes(item);
              return(
                <button key={item+i} onClick={()=>pick(item)} disabled={isSel}
                  style={{background:isRight?"rgba(107,203,119,0.3)":isWrong?"rgba(255,107,107,0.3)":"rgba(255,255,255,0.07)",
                    border:`1px solid ${isRight?"#6BCB77":isWrong?"#FF6B6B":"rgba(255,255,255,0.18)"}`,
                    borderRadius:"12px",padding:"0.6rem 0.4rem",fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:"0.8rem",
                    color:isRight?"#6BCB77":isWrong?"#FF6B6B":"#fff",cursor:isSel?"default":"pointer",transition:"all 0.2s"}}>
                  {item}
                </button>
              );
            })}
          </div>
          {ui.feedback&&<div style={{fontFamily:"'Fredoka One',cursive",fontSize:"1.6rem",animation:"popIn 0.3s"}}>{ui.feedback}</div>}
        </>
      )}
      {ui.phase==="done"&&(
        <div style={{padding:"0.75rem"}}>
          <div style={{fontSize:"3rem",animation:"bounce 0.5s"}}>🧠</div>
          <GText g="linear-gradient(135deg,#4D96FF,#A855F7)" style={{marginBottom:"0.3rem"}}>{ui.score} pts!</GText>
          <p style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.5)",fontSize:"0.85rem",marginBottom:"0.75rem"}}>{ui.score>=60?"🔥 Mind Master!":ui.score>=30?"⭐ Good thinking!":"Keep going!"}</p>
          <Btn onClick={startGame} g="linear-gradient(135deg,#4D96FF,#A855F7)">Play Again! 🗺️</Btn>
        </div>
      )}
    </div>
  );
}

// ② Pattern Recognition
const PATTERNS=[
  {seq:["🔴","🔵","🔴","🔵","?"],ans:0,opts:["🔴","🔵","🟢","🟡"],exp:"Red-Blue-Red-Blue → Red is next"},
  {seq:["⭐","⭐","🌟","⭐","⭐","?"],ans:1,opts:["⭐","🌟","💫","✨"],exp:"Small-Small-Big-Small-Small → Big 🌟 next"},
  {seq:["⬆","➡","⬇","⬅","?"],ans:0,opts:["⬆","➡","⬇","⬅"],exp:"Compass: Up-Right-Down-Left → Up again"},
  {seq:["🐱","🐱","🐶","🐱","🐱","?"],ans:1,opts:["🐱","🐶","🐭","🐰"],exp:"Cat Cat Dog Cat Cat → Dog next"},
  {seq:["🟥","🟧","🟨","🟩","?"],ans:2,opts:["🟥","🟪","🟦","🟧"],exp:"Rainbow colours → Blue 🟦 comes after green"},
  {seq:["🌙","☀","🌙","🌙","☀","?"],ans:0,opts:["🌙","☀","⭐","🌟"],exp:"Moon-Sun-Moon-Moon-Sun → Moon"},
  {seq:["🔺","🔶","🔺","🔶","🔺","?"],ans:1,opts:["🔺","🔶","🔷","🔻"],exp:"Triangle-Diamond alternates → Diamond 🔶"},
  {seq:["2","4","8","16","?"],ans:3,opts:["18","20","24","32"],exp:"Each number is doubled: 16 x 2 = 32"},
];

function PatternGame({onScore}){
  // Keep ALL game state in a ref, only derive UI from it via setUi
  const G=useRef({qi:0,score:0,sel:null,done:false,scored:false});
  const [ui,setUi]=useState({qi:0,score:0,sel:null,exp:null,done:false});

  const reset=()=>{
    G.current={qi:0,score:0,sel:null,done:false,scored:false};
    setUi({qi:0,score:0,sel:null,exp:null,done:false});
  };

  const pick=(optVal)=>{
    if(G.current.sel!==null||G.current.done)return;
    const q=PATTERNS[G.current.qi];
    const isRight=optVal===q.opts[q.ans];
    G.current.sel=optVal;
    if(isRight)G.current.score+=15;
    setUi(u=>({...u,sel:optVal,score:G.current.score,exp:q.exp}));
    setTimeout(()=>{
      const nq=G.current.qi+1;
      if(nq>=PATTERNS.length){
        G.current.done=true;
        if(!G.current.scored){G.current.scored=true;onScore("PatternGame",G.current.score);}
        setUi(u=>({...u,done:true,exp:null}));
      } else {
        G.current.qi=nq;G.current.sel=null;
        setUi(u=>({...u,qi:nq,sel:null,exp:null}));
      }
    },1400);
  };

  const q=PATTERNS[ui.qi];
  const correctVal=q.opts[q.ans];

  return(
    <div style={{textAlign:"center"}}>
      <GText g="linear-gradient(135deg,#FF6FC8,#FF9A3C)" style={{marginBottom:"0.4rem"}}>🔍 Pattern Finder</GText>
      {!ui.done?(
        <>
          <p style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.45)",fontSize:"0.82rem",margin:"0.3rem 0"}}>
            Q {ui.qi+1}/{PATTERNS.length} &nbsp;|&nbsp; Score: {ui.score}
          </p>
          <div style={{display:"flex",gap:"8px",justifyContent:"center",alignItems:"center",flexWrap:"wrap",margin:"0.75rem 0"}}>
            {q.seq.map((s,i)=>(
              <div key={i} style={{minWidth:"46px",height:"50px",borderRadius:"12px",
                background:s==="?"?"rgba(255,111,200,0.12)":"rgba(255,255,255,0.08)",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",
                border:s==="?"?"2px dashed #FF6FC8":"1px solid rgba(255,255,255,0.15)",
                padding:"0 6px"}}>
                {s}
              </div>
            ))}
          </div>
          <p style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.4)",fontSize:"0.78rem",marginBottom:"0.6rem"}}>What comes next?</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"8px",maxWidth:"300px",margin:"0 auto"}}>
            {q.opts.map((o,i)=>{
              let bg="rgba(255,255,255,0.07)",bdr="1px solid rgba(255,255,255,0.15)",col="#fff";
              if(ui.sel!==null){
                if(o===correctVal){bg="rgba(107,203,119,0.3)";bdr="2px solid #6BCB77";col="#6BCB77";}
                else if(o===ui.sel&&o!==correctVal){bg="rgba(255,107,107,0.3)";bdr="2px solid #FF6B6B";col="#FF6B6B";}
              }
              return(
                <button key={i} onClick={()=>pick(o)} disabled={ui.sel!==null}
                  style={{background:bg,border:bdr,borderRadius:"12px",padding:"0.7rem 0.5rem",
                    fontSize:"1.5rem",cursor:ui.sel!==null?"default":"pointer",transition:"all 0.3s",color:col,
                    fontFamily:"'Nunito',sans-serif",fontWeight:700}}>
                  {o}
                </button>
              );
            })}
          </div>
          {ui.exp&&(
            <div style={{marginTop:"0.6rem",fontFamily:"'Nunito',sans-serif",fontSize:"0.83rem",
              color:"rgba(255,255,255,0.5)",animation:"slideUp 0.3s"}}>
              💡 {ui.exp}
            </div>
          )}
        </>
      ):(
        <div style={{padding:"0.75rem"}}>
          <div style={{fontSize:"3rem",animation:"bounce 0.5s"}}>🔍</div>
          <GText g="linear-gradient(135deg,#FF6FC8,#FF9A3C)" style={{marginBottom:"0.3rem"}}>{ui.score}/{PATTERNS.length*15} pts!</GText>
          <p style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.5)",fontSize:"0.85rem",marginBottom:"0.75rem"}}>
            {ui.score>=90?"🏆 Pattern Master!":ui.score>=60?"⭐ Sharp eye!":"Keep trying!"}
          </p>
          <Btn onClick={reset} g="linear-gradient(135deg,#FF6FC8,#FF9A3C)">Play Again! 🔍</Btn>
        </div>
      )}
    </div>
  );
}

// ③ Speed Math — single ref, no stale state
function SpeedMath({onScore}){
  const genQ=()=>{
    const ops=["+","-","x"];const op=ops[Math.floor(Math.random()*ops.length)];
    let a,b,ans;
    if(op==="+"){a=Math.floor(Math.random()*50)+1;b=Math.floor(Math.random()*50)+1;ans=a+b;}
    else if(op==="-"){a=Math.floor(Math.random()*50)+10;b=Math.floor(Math.random()*a)+1;ans=a-b;}
    else{a=Math.floor(Math.random()*12)+1;b=Math.floor(Math.random()*12)+1;ans=a*b;}
    return{a,op,b,ans};
  };
  const timerRef=useRef(null);
  const G=useRef({running:false,time:30,score:0,streak:0,scored:false,q:genQ()});
  const [ui,setUi]=useState({running:false,time:30,score:0,streak:0,q:G.current.q,flash:null,done:false});
  const [input,setInput]=useState("");

  const start=()=>{
    clearInterval(timerRef.current);
    const q=genQ();
    G.current={running:true,time:30,score:0,streak:0,scored:false,q};
    setUi({running:true,time:30,score:0,streak:0,q,flash:null,done:false});
    setInput("");
    timerRef.current=setInterval(()=>{
      G.current.time--;
      if(G.current.time<=0){
        clearInterval(timerRef.current);G.current.running=false;
        if(!G.current.scored){G.current.scored=true;onScore("SpeedMath",G.current.score);}
        setUi(u=>({...u,running:false,done:true,time:0}));
      } else {
        setUi(u=>({...u,time:G.current.time}));
      }
    },1000);
  };

  useEffect(()=>()=>clearInterval(timerRef.current),[]);

  const check=()=>{
    if(!G.current.running||!input.trim())return;
    const val=parseInt(input);
    const nq=genQ();
    if(val===G.current.q.ans){
      G.current.streak++;G.current.score+=10+G.current.streak*2;G.current.q=nq;
      setUi(u=>({...u,score:G.current.score,streak:G.current.streak,q:nq,flash:"correct"}));
    } else {
      G.current.streak=0;G.current.q=nq;
      setUi(u=>({...u,streak:0,q:nq,flash:"wrong"}));
    }
    setTimeout(()=>setUi(u=>({...u,flash:null})),300);
    setInput("");
  };

  return(
    <div style={{textAlign:"center"}}>
      <GText g="linear-gradient(135deg,#FFD93D,#6BCB77)" style={{marginBottom:"0.4rem"}}>⚡ Speed Math</GText>
      {!ui.running&&(
        <div>
          <p style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.45)",fontSize:"0.82rem",margin:"0.5rem 0"}}>Solve as many problems as you can in 30 seconds!</p>
          <Btn onClick={start} g="linear-gradient(135deg,#FFD93D,#6BCB77)" style={{animation:"pulse 1.5s infinite"}}>Start! ⚡</Btn>
          {ui.done&&<p style={{fontFamily:"'Fredoka One',cursive",color:"#FFD93D",fontSize:"1.1rem",marginTop:"0.75rem"}}>Score: {ui.score} pts!</p>}
        </div>
      )}
      {ui.running&&(
        <>
          <div style={{display:"flex",justifyContent:"center",gap:"1.2rem",margin:"0.4rem 0",fontFamily:"'Fredoka One',cursive",fontSize:"0.95rem"}}>
            <span style={{color:"#FF6B6B"}}>⏱ {ui.time}s</span>
            <span style={{color:"#FFD93D"}}>⭐ {ui.score}</span>
            <span style={{color:"#6BCB77"}}>🔥 x{ui.streak}</span>
          </div>
          <div style={{background:`rgba(255,255,255,${ui.flash==="correct"?0.15:ui.flash==="wrong"?0.04:0.07})`,
            borderRadius:"18px",padding:"1.25rem",margin:"0.5rem 0",
            border:`1px solid ${ui.flash==="correct"?"rgba(107,203,119,0.5)":ui.flash==="wrong"?"rgba(255,107,107,0.5)":"rgba(255,255,255,0.15)"}`,
            transition:"all 0.15s"}}>
            <div style={{fontFamily:"'Fredoka One',cursive",fontSize:"2rem",color:"#fff"}}>{ui.q.a} {ui.q.op} {ui.q.b} = ?</div>
          </div>
          <div style={{display:"flex",gap:"8px",justifyContent:"center",marginTop:"0.5rem"}}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&check()}
              type="number" placeholder="Answer"
              style={{padding:"0.55rem 1rem",borderRadius:"20px",border:"1px solid rgba(255,211,61,0.4)",
                background:"rgba(255,211,61,0.08)",color:"#fff",fontFamily:"'Fredoka One',cursive",
                fontSize:"1.1rem",outline:"none",width:"130px",textAlign:"center"}} autoFocus/>
            <Btn onClick={check} g="linear-gradient(135deg,#FFD93D,#6BCB77)" style={{padding:"0.55rem 1rem"}}>OK</Btn>
          </div>
        </>
      )}
    </div>
  );
}

function BrainSection({onScore,onBack}){
  const [tab,setTab]=useState(()=>{try{return sessionStorage.getItem("mda_brain_tab")||"mindmap";}catch{return "mindmap";}});
  const setTabP=t=>{setTab(t);try{sessionStorage.setItem("mda_brain_tab",t);}catch{};};
  const tabs=[{id:"mindmap",label:"🗺️ Mind Map"},{id:"pattern",label:"🔍 Patterns"},{id:"speedmath",label:"⚡ Speed Math"}];
  return(
    <div style={{position:"relative",zIndex:1}}>
      <BackBar onBack={onBack} label="Home" color="#4D96FF"/>
      <GText g="linear-gradient(135deg,#4D96FF,#A855F7,#FF6FC8)" size="2rem" style={{textAlign:"center",marginBottom:"1rem"}}>🧠 Brain Games</GText>
      <div style={{display:"flex",justifyContent:"center",gap:"8px",marginBottom:"1rem",flexWrap:"wrap"}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTabP(t.id)}
            style={{background:tab===t.id?"linear-gradient(135deg,#4D96FF,#A855F7)":"rgba(255,255,255,0.07)",color:"#fff",
              border:tab===t.id?"none":"1px solid rgba(255,255,255,0.18)",padding:"0.4rem 1.1rem",
              borderRadius:"30px",fontFamily:"'Fredoka One',cursive",cursor:"pointer",fontSize:"0.88rem",transition:"all 0.2s"}}>
            {t.label}
          </button>
        ))}
      </div>
      <Card style={{maxWidth:"520px",margin:"0 auto"}}>
        {tab==="mindmap"&&<MindMapRace onScore={onScore}/>}
        {tab==="pattern"&&<PatternGame onScore={onScore}/>}
        {tab==="speedmath"&&<SpeedMath onScore={onScore}/>}
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ── DAILY AFFIRMATIONS ────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
const AFF_DATA=[
  {text:"I am brave, smart, and full of amazing ideas!",icon:"🦁",color:"#FFD93D",tip:"Say this every morning looking in the mirror!"},
  {text:"Every mistake is a chance to learn and grow stronger.",icon:"🌱",color:"#6BCB77",tip:"Mistakes are lessons in disguise — embrace them!"},
  {text:"I believe in myself and my ability to do incredible things.",icon:"⭐",color:"#4D96FF",tip:"Confidence grows when you remember your past wins."},
  {text:"I am kind to myself and others, and that makes the world brighter.",icon:"💛",color:"#FF9A3C",tip:"Kindness is a superpower. Use it every single day!"},
  {text:"Challenges make me stronger. I face them with courage!",icon:"🏋️",color:"#FF6FC8",tip:"Every big goal starts with one brave step forward."},
  {text:"My imagination is my greatest superpower!",icon:"🚀",color:"#A855F7",tip:"Great inventors were once just curious kids like you."},
  {text:"I am enough, exactly as I am, right now, today.",icon:"🌈",color:"#00D2FF",tip:"You do not need to be perfect — just be authentically YOU."},
  {text:"I keep going even when it is hard, because I am unstoppable!",icon:"💪",color:"#FF6B6B",tip:"Persistence is the secret ingredient of every success story."},
  {text:"I have a brilliant mind that can solve any problem!",icon:"🧠",color:"#4D96FF",tip:"Your brain is like a muscle — use it more and it grows stronger!"},
  {text:"Today I will do my best, and my best is always good enough.",icon:"🌟",color:"#FF9A3C",tip:"Progress, not perfection, is the goal every single day."},
];
const MOODS_DATA=[
  {id:"happy",icon:"😊",label:"Happy"},
  {id:"nervous",icon:"😰",label:"Nervous"},
  {id:"sad",icon:"😢",label:"Sad"},
  {id:"excited",icon:"🤩",label:"Excited"},
  {id:"tired",icon:"😴",label:"Tired"},
  {id:"angry",icon:"😤",label:"Angry"},
];
const MOOD_AFF={
  happy:["Your happiness is contagious — keep spreading it! 😊","You are glowing today! Ride this energy all day long! 🌟"],
  nervous:["Breathe deeply. You are more ready than you think. 💙","Nervousness means you care — and caring people do great things!"],
  sad:["It is okay to feel sad. Sunshine always follows clouds. 🌈","Brighter days are already on their way to you. 💛"],
  excited:["Harness that excitement — big things are coming your way! 🚀","Your energy could light up a whole city today!"],
  tired:["Rest is not giving up — it is recharging to conquer tomorrow. 💤","Even superheroes need sleep. Rise stronger! 🦸"],
  angry:["Take three deep breaths. Your calm is your superpower. 🌬️","Redirect that energy into something incredible today."],
};
const BREATH_STEPS=["Breathe IN slowly... 4 seconds 🌬️","Hold your breath... 4 seconds ⏸️","Breathe OUT slowly... 4 seconds 💨","Rest... 4 seconds 😌"];

function Affirmations({onBack}){
  const [screen,setScreen]=useState(()=>{try{return sessionStorage.getItem("mda_affirm_screen")||"home";}catch{return "home";}});
  const setScreenP=s=>{setScreen(s);try{sessionStorage.setItem("mda_affirm_screen",s);}catch{};};
  const [affIdx,setAffIdx]=useState(()=>new Date().getDate()%AFF_DATA.length);
  const [liked,setLiked]=useState(false);
  const [streak,setStreak]=useState(()=>{try{return parseInt(localStorage.getItem("aff_streak")||"1");}catch{return 1;}});
  const [mood,setMood]=useState(null);
  const [moodAff,setMoodAff]=useState("");
  const [breathStep,setBreathStep]=useState(0);
  const [breathing,setBreathing]=useState(false);
  const [breathScale,setBreathScale]=useState(1);
  const [journal,setJournal]=useState(["","",""]);
  const [saved,setSaved]=useState(false);
  const [anim,setAnim]=useState(false);
  const breathRef=useRef(null);

  const nextAff=()=>{setAnim(true);setTimeout(()=>{setAffIdx(i=>(i+1)%AFF_DATA.length);setLiked(false);setAnim(false);},280);}
  const prevAff=()=>{setAnim(true);setTimeout(()=>{setAffIdx(i=>(i-1+AFF_DATA.length)%AFF_DATA.length);setLiked(false);setAnim(false);},280);}
  const like=()=>{if(!liked){setLiked(true);const ns=streak+1;setStreak(ns);try{localStorage.setItem("aff_streak",String(ns));}catch{}}}
  const pickMood=m=>{setMood(m);const arr=MOOD_AFF[m.id];setMoodAff(arr[Math.floor(Math.random()*arr.length)]);}
  const startBreath=()=>{
    setBreathing(true);setBreathStep(0);setBreathScale(1.5);
    let step=0;
    const run=()=>{step=(step+1)%4;setBreathStep(step);setBreathScale(step%2===0?1.5:1);breathRef.current=setTimeout(run,4000);};
    breathRef.current=setTimeout(run,4000);
  }
  const stopBreath=()=>{clearTimeout(breathRef.current);setBreathing(false);setBreathStep(0);setBreathScale(1);}
  useEffect(()=>()=>clearTimeout(breathRef.current),[]);
  const saveJournal=()=>{
    if(!journal[0].trim())return;
    try{localStorage.setItem("aff_j_"+Date.now(),JSON.stringify({entries:journal,date:new Date().toLocaleDateString()}));}catch{}
    setSaved(true);setTimeout(()=>setSaved(false),2000);
  }
  const aff=AFF_DATA[affIdx];
  const menuItems=[
    {id:"daily",icon:"🌅",title:"Daily Affirmation",desc:"Your positive message for today"},
    {id:"mood",icon:"💭",title:"How Do I Feel?",desc:"Get a personalised mood boost"},
    {id:"breathing",icon:"🌬️",title:"Breathing Exercise",desc:"Calm your mind in 2 minutes"},
    {id:"journal",icon:"📓",title:"Gratitude Journal",desc:"Write what you are grateful for"},
  ];
  const menuCard={background:"rgba(255,255,255,0.055)",backdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"20px",padding:"1.4rem",cursor:"pointer",transition:"all 0.3s"};
  const backBtn=(<div style={{textAlign:"center",marginTop:"1rem"}}><Btn onClick={()=>{setScreenP("home");setMood(null);}} g="rgba(255,255,255,0.1)" style={{border:"1px solid rgba(255,255,255,0.2)",fontSize:"0.85rem"}}>← Menu</Btn></div>);

  return(
    <div style={{maxWidth:"680px",margin:"0 auto",position:"relative",zIndex:1}}>
      {screen==="home"
        ? <BackBar onBack={onBack} label="Home" color="#FFD93D"/>
        : <BackBar onBack={()=>{setScreenP("home");setMood(null);}} label="Affirmations" color="#FFD93D"/>}
      <div style={{textAlign:"center",marginBottom:"1.25rem"}}>
        <GText g="linear-gradient(135deg,#FFD93D,#FF9A3C,#FF6FC8)" size="2rem" style={{animation:"neonPulse 3s infinite"}}>🌟 Daily Affirmations</GText>
        <p style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.45)",fontSize:"0.82rem",marginTop:"0.3rem"}}>Build confidence • Reduce stress • Grow stronger every day</p>
        <span style={{fontFamily:"'Fredoka One',cursive",color:"#FFD93D",background:"rgba(255,211,61,0.12)",border:"1px solid rgba(255,211,61,0.25)",padding:"3px 12px",borderRadius:"20px",fontSize:"0.8rem",marginTop:"0.5rem",display:"inline-block"}}>🔥 {streak}-day streak</span>
      </div>

      {screen==="home"&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:"1rem"}}>
          {menuItems.map(item=>(
            <div key={item.id} onClick={()=>setScreenP(item.id)} style={menuCard}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-5px)";e.currentTarget.style.boxShadow="0 14px 30px rgba(0,0,0,0.4)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
              <div style={{fontSize:"2.5rem",marginBottom:"0.5rem"}}>{item.icon}</div>
              <div style={{fontFamily:"'Fredoka One',cursive",color:"#fff",fontSize:"1.1rem",marginBottom:"0.2rem"}}>{item.title}</div>
              <div style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.45)",fontSize:"0.8rem"}}>{item.desc}</div>
            </div>
          ))}
        </div>
      )}

      {screen==="daily"&&(
        <div style={{animation:"affirmIn 0.5s"}}>
          <Card style={{textAlign:"center",background:`linear-gradient(135deg,${aff.color}18,${aff.color}08)`,border:`1px solid ${aff.color}44`}}>
            <div style={{fontSize:"4rem",marginBottom:"0.75rem",animation:"heartbeat 2s infinite"}}>{aff.icon}</div>
            <div style={{fontFamily:"'Fredoka One',cursive",fontSize:anim?"0.1rem":"1.35rem",color:"#fff",lineHeight:1.55,marginBottom:"1.2rem",transition:"font-size 0.25s",maxWidth:"440px",margin:"0 auto 1.2rem"}}>{aff.text}</div>
            <div style={{background:`${aff.color}18`,border:`1px solid ${aff.color}33`,borderRadius:"14px",padding:"0.7rem 1rem",fontFamily:"'Nunito',sans-serif",fontSize:"0.85rem",color:"rgba(255,255,255,0.72)",marginBottom:"1.2rem",lineHeight:1.65}}>
              💡 <strong style={{color:aff.color}}>Daily Tip:</strong> {aff.tip}
            </div>
            <div style={{display:"flex",gap:"10px",justifyContent:"center",flexWrap:"wrap"}}>
              <Btn onClick={prevAff} g="rgba(255,255,255,0.1)" style={{padding:"0.5rem 1rem",fontSize:"0.88rem",border:"1px solid rgba(255,255,255,0.2)"}}>◀ Prev</Btn>
              <Btn onClick={like} g={liked?`linear-gradient(135deg,${aff.color},#FF6B6B)`:"rgba(255,255,255,0.1)"} style={{padding:"0.5rem 1.2rem",fontSize:"0.88rem",border:`1px solid ${aff.color}44`}}>
                {liked?"❤️ Loved it!":"🤍 Love this"}
              </Btn>
              <Btn onClick={nextAff} g={`linear-gradient(135deg,${aff.color},${aff.color}99)`} style={{padding:"0.5rem 1rem",fontSize:"0.88rem"}}>Next ▶</Btn>
            </div>
            <div style={{marginTop:"0.75rem",fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.28)",fontSize:"0.72rem"}}>{affIdx+1} of {AFF_DATA.length}</div>
          </Card>
          {backBtn}
        </div>
      )}

      {screen==="mood"&&(
        <div style={{animation:"affirmIn 0.5s"}}>
          {!mood?(
            <Card style={{textAlign:"center"}}>
              <GText g="linear-gradient(135deg,#FF6FC8,#A855F7)" style={{marginBottom:"0.75rem"}}>💭 How are you feeling right now?</GText>
              <p style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.45)",fontSize:"0.83rem",marginBottom:"1.1rem"}}>Pick your mood and get a personalised affirmation!</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px",maxWidth:"360px",margin:"0 auto"}}>
                {MOODS_DATA.map(m=>(
                  <div key={m.id} onClick={()=>pickMood(m)}
                    style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"16px",padding:"1rem 0.5rem",cursor:"pointer",textAlign:"center",transition:"all 0.2s"}}
                    onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.08)";e.currentTarget.style.background="rgba(255,255,255,0.12)";}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.background="rgba(255,255,255,0.07)";}}>
                    <div style={{fontSize:"2.2rem"}}>{m.icon}</div>
                    <div style={{fontFamily:"'Fredoka One',cursive",color:"rgba(255,255,255,0.8)",fontSize:"0.82rem",marginTop:"0.3rem"}}>{m.label}</div>
                  </div>
                ))}
              </div>
            </Card>
          ):(
            <Card style={{textAlign:"center",animation:"affirmIn 0.4s"}}>
              <div style={{fontSize:"3.5rem",marginBottom:"0.75rem",animation:"heartbeat 2s infinite"}}>{mood.icon}</div>
              <div style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.42)",fontSize:"0.82rem",marginBottom:"0.6rem"}}>Because you are feeling {mood.label}...</div>
              <div style={{fontFamily:"'Fredoka One',cursive",fontSize:"1.25rem",color:"#fff",lineHeight:1.6,marginBottom:"1.25rem",maxWidth:"400px",margin:"0 auto 1.25rem"}}>{moodAff}</div>
              <div style={{display:"flex",gap:"10px",justifyContent:"center",flexWrap:"wrap"}}>
                <Btn onClick={()=>setMood(null)} g="rgba(255,255,255,0.1)" style={{border:"1px solid rgba(255,255,255,0.2)",fontSize:"0.85rem"}}>Change mood</Btn>
                <Btn onClick={()=>pickMood(mood)} g="linear-gradient(135deg,#FF6FC8,#A855F7)" style={{fontSize:"0.85rem"}}>New message 🔀</Btn>
              </div>
            </Card>
          )}
          {backBtn}
        </div>
      )}

      {screen==="breathing"&&(
        <div style={{animation:"affirmIn 0.5s"}}>
          <Card style={{textAlign:"center"}}>
            <GText g="linear-gradient(135deg,#00D2FF,#4D96FF)" style={{marginBottom:"0.5rem"}}>🌬️ Box Breathing</GText>
            <p style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.45)",fontSize:"0.82rem",marginBottom:"1.25rem"}}>Calm your mind and feel more confident in just 2 minutes</p>
            <div style={{position:"relative",width:"160px",height:"160px",margin:"0 auto 1.25rem",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{position:"absolute",inset:0,borderRadius:"50%",background:"rgba(0,210,255,0.07)",border:"2px solid rgba(0,210,255,0.25)",transform:`scale(${breathScale})`,transition:"transform 4s ease-in-out"}}/>
              <div style={{position:"absolute",inset:"20px",borderRadius:"50%",background:"rgba(0,210,255,0.1)",border:"2px solid rgba(0,210,255,0.3)",transform:`scale(${breathScale})`,transition:"transform 4s ease-in-out 0.3s"}}/>
              <div style={{fontSize:"3rem",zIndex:1}}>
                {breathStep===0?"🫁":breathStep===1?"⏸️":breathStep===2?"💨":"😌"}
              </div>
            </div>
            <div style={{fontFamily:"'Fredoka One',cursive",color:"#00D2FF",fontSize:"1.15rem",marginBottom:"0.75rem",animation:breathing?"pulse 1s infinite":"none"}}>
              {BREATH_STEPS[breathStep]}
            </div>
            {!breathing
              ?<Btn onClick={startBreath} g="linear-gradient(135deg,#00D2FF,#4D96FF)" style={{animation:"pulse 1.5s infinite"}}>Start Breathing 🌬️</Btn>
              :<Btn onClick={stopBreath} g="rgba(255,107,107,0.3)" style={{border:"1px solid rgba(255,107,107,0.4)"}}>Stop ◼</Btn>
            }
            <div style={{marginTop:"0.75rem",fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.28)",fontSize:"0.75rem"}}>4 seconds each phase • repeat 4 times for best results</div>
          </Card>
          {backBtn}
        </div>
      )}

      {screen==="journal"&&(
        <div style={{animation:"affirmIn 0.5s"}}>
          <Card>
            <GText g="linear-gradient(135deg,#6BCB77,#FFD93D)" style={{marginBottom:"0.4rem",textAlign:"center"}}>📓 Gratitude Journal</GText>
            <p style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.45)",fontSize:"0.8rem",marginBottom:"1rem",textAlign:"center"}}>Write 3 things you are grateful for — it rewires your brain for happiness!</p>
            {["🌟 I am grateful for...","😊 Something that made me smile today...","💪 One thing I am proud of..."].map((ph,i)=>(
              <div key={i} style={{marginBottom:"0.75rem"}}>
                <div style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.4)",fontSize:"0.78rem",marginBottom:"0.3rem"}}>{ph}</div>
                <textarea rows={2} placeholder={ph.slice(3)} value={journal[i]}
                  onChange={e=>{const j=[...journal];j[i]=e.target.value;setJournal(j);}}
                  style={{width:"100%",padding:"0.6rem 0.9rem",borderRadius:"12px",border:"1px solid rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.06)",color:"#fff",fontFamily:"'Nunito',sans-serif",fontSize:"0.88rem",outline:"none",resize:"vertical"}}/>
              </div>
            ))}
            <div style={{textAlign:"center",marginTop:"0.5rem"}}>
              <Btn onClick={saveJournal} g="linear-gradient(135deg,#6BCB77,#FFD93D)">{saved?"✅ Saved!":"Save Entry 💾"}</Btn>
            </div>
          </Card>
          {backBtn}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ── IQ SECTION — FULLY FIXED + VISUAL MCQ ────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
const IQ_QS=[
  {q:"What comes next? 2, 4, 8, 16, __",opts:["20","24","32","18"],ans:2,exp:"Each number is multiplied by 2 — so 16 x 2 = 32."},
  {q:"You have 3 apples and take 2. How many do YOU have?",opts:["1","2","3","0"],ans:1,exp:"You TOOK 2 apples, so you personally hold 2."},
  {q:"A clock shows 3:00. What is the angle between the hands?",opts:["90 degrees","180 degrees","60 degrees","120 degrees"],ans:0,exp:"Minute hand at 12, hour hand at 3 — that is exactly 90 degrees."},
  {q:"Find the missing number: 1, 1, 2, 3, 5, __, 13",opts:["7","8","9","6"],ans:1,exp:"Fibonacci: each number is the sum of the two before it. 3+5 = 8."},
  {q:"What has hands but cannot clap?",opts:["A robot","A clock","A glove","A tree"],ans:1,exp:"A clock has an hour hand and a minute hand — but they cannot clap!"},
  {q:"RED+RED=10 and RED+BLUE=7. What is BLUE?",opts:["2","3","4","5"],ans:0,exp:"RED = 5 (since 5+5=10), so BLUE = 7 minus 5 = 2."},
  {q:"Always in front of you but can never be seen?",opts:["Air","The future","Light","Space"],ans:1,exp:"The FUTURE is always ahead of you, yet it is completely invisible!"},
  {q:"5 cats catch 5 mice in 5 min. Time for 1 cat to catch 1 mouse?",opts:["1 min","5 min","25 min","10 min"],ans:1,exp:"Each cat catches 1 mouse in 5 minutes — the rate stays exactly the same."},
  {q:"1 kg feathers vs 1 kg iron — which is heavier?",opts:["Feathers","Iron","Same weight","Depends"],ans:2,exp:"Both weigh exactly 1 kilogram — weight is weight regardless of material!"},
  {q:"How many months of the year have at least 28 days?",opts:["1","2","4","12"],ans:3,exp:"ALL 12 months have at least 28 days — even February has exactly 28 (or 29)."},
];

const VISUAL_QS=[
  {
    scene:"🌅 🏠 🌳\n☀️       🐦\n🌿 🌿 🌿",
    question:"What time of day does this scene most likely show?",
    opts:["Midnight","Early morning","Late evening","Noon"],
    ans:1,
    exp:"The rising sun, singing bird, and fresh greenery all suggest early morning — when the new day begins.",
    ctx:"Look at the sunrise position and the bird — birds sing at dawn, not midnight.",
    label:"🌄 Scene Reading"
  },
  {
    scene:"🔥 🪵 🏕️\n⛺ 🌲 🌲\n🌲 🌙 ⭐",
    question:"What activity is most likely happening here?",
    opts:["School lesson","Night camping in forest","City picnic","Swimming"],
    ans:1,
    exp:"Campfire, logs, tent, trees, and night sky all clearly indicate camping outdoors at night.",
    ctx:"Combine every emoji — campfire plus tent plus trees equals what activity?",
    label:"🏕️ Activity Scene"
  },
  {
    scene:"🌧️ ☁️ ⚡\n🌊 🌊 🌊\n🚢 ⚓ ❓",
    question:"What danger does the ship most likely face?",
    opts:["Sunshine","A violent storm","Low fuel","Heavy traffic"],
    ans:1,
    exp:"Rain, dark clouds, lightning, and huge waves all signal a dangerous storm threatening the ship.",
    ctx:"What do rain plus lightning plus rough waves mean for a ship at sea?",
    label:"⛈️ Danger Reading"
  },
  {
    scene:"🏆 🥇 🎉\n🏃 🏃 🏃\n🏟️ 📣 🎊",
    question:"What event has most likely just finished?",
    opts:["A birthday party","A sports race or competition","A school exam","A movie premiere"],
    ans:1,
    exp:"Trophy, gold medal, runners, stadium, and a cheering crowd all point to a sports competition just ending.",
    ctx:"Who uses trophies and medals, and runs inside a stadium?",
    label:"🏆 Event Scene"
  },
  {
    scene:"📚 ✏️ 🧠\n⏰ 💡 🔍\n🎓 🌟 ✨",
    question:"What does this scene best represent?",
    opts:["Playing video games","Sleeping all day","Learning and studying hard","Cooking a meal"],
    ans:2,
    exp:"Books, pencil, brain, clock, light bulb, magnifying glass, and a graduation cap — every single item points to education.",
    ctx:"Notice the graduation cap at the end — what activities lead to graduation?",
    label:"📚 Concept Scene"
  },
  {
    scene:"😢 💔 🌧️\n🤗 🫂 ❤️\n😊 🌈 ☀️",
    question:"What emotional journey does this scene show?",
    opts:["Anger turning to fear","Sadness healing into happiness through support","Boredom turning to excitement","Sickness turning to health"],
    ans:1,
    exp:"The scene flows: sadness and heartbreak in the rain → a warm comforting hug → happiness with a rainbow and sunshine. Support heals sadness.",
    ctx:"Read it top to bottom like a 3-panel story — beginning, middle, happy ending.",
    label:"💭 Emotional Story"
  },
  {
    scene:"🗺️ 🧭 ⛵\n🏝️ 💎 🌴\n❓ 🔐 🔑",
    question:"What kind of adventure story does this scene tell?",
    opts:["A cooking competition","A treasure hunt at sea","A school science project","A mission to outer space"],
    ans:1,
    exp:"Map, compass, boat, island, treasure chest, mystery, locked box, and a key paint a classic sea treasure hunt adventure!",
    ctx:"Put together map + boat + island + treasure — what famous story type is that?",
    label:"🗺️ Story Scene"
  },
  {
    scene:"🌱 💧 ☀️\n🤲 🤲 🤲\n🌻 🌻 🌻",
    question:"What is the main message of this scene?",
    opts:["Destruction of nature","Caring for plants and nurturing growth","Cooking vegetables","Just a rainy day"],
    ans:1,
    exp:"Seeds receiving water, sunlight, and caring hands leading to blooming sunflowers — this powerfully shows nurturing and growth.",
    ctx:"What do gentle hands and blooming sunflowers symbolise when seen together?",
    label:"🌱 Meaning Scene"
  },
];

function IQLogicQuiz({onScore}){
  // Single ref holds all mutable quiz state — eliminates every stale-closure bug
  const S=useRef({cur:0,correct:0,sel:null,done:false,scored:false});
  const [disp,setDisp]=useState({cur:0,sel:null,correct:0,exp:null,done:false,pct:0});

  const reset=()=>{
    S.current={cur:0,correct:0,sel:null,done:false,scored:false};
    setDisp({cur:0,sel:null,correct:0,exp:null,done:false,pct:0});
  };

  const pick=useCallback((optIdx)=>{
    if(S.current.sel!==null||S.current.done)return;
    S.current.sel=optIdx;
    if(optIdx===IQ_QS[S.current.cur].ans) S.current.correct++;
    const expText=IQ_QS[S.current.cur].exp;
    setDisp(d=>({...d,sel:optIdx,correct:S.current.correct,exp:expText}));
    setTimeout(()=>{
      const nc=S.current.cur+1;
      if(nc>=IQ_QS.length){
        const p=Math.round((S.current.correct/IQ_QS.length)*100);
        S.current.done=true;
        if(!S.current.scored){S.current.scored=true;onScore("IQTest",S.current.correct*12);}
        setDisp(d=>({...d,done:true,pct:p,exp:null}));
      } else {
        S.current.cur=nc;
        S.current.sel=null;
        setDisp(d=>({...d,cur:nc,sel:null,exp:null}));
      }
    },1600);
  },[onScore]);

  const q=IQ_QS[disp.cur];
  const rLabel=disp.pct>=80?"🏆 GENIUS!":disp.pct>=60?"🎉 Very smart!":disp.pct>=40?"👍 Good effort!":"😄 Keep practising!";

  return(
    <div>
      <GText g="linear-gradient(135deg,#A855F7,#FF6FC8)" style={{marginBottom:"0.75rem",textAlign:"center"}}>🧩 Logic Questions</GText>
      {!disp.done?(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.45)",fontSize:"0.83rem",marginBottom:"0.6rem"}}>
            <span>Q {disp.cur+1} / {IQ_QS.length}</span><span>✅ {disp.correct} correct</span>
          </div>
          <div style={{height:"5px",background:"rgba(255,255,255,0.08)",borderRadius:"3px",marginBottom:"1rem"}}>
            <div style={{height:"5px",background:"linear-gradient(90deg,#A855F7,#FF6FC8)",borderRadius:"3px",width:`${(disp.cur/IQ_QS.length)*100}%`,transition:"width 0.5s"}}/>
          </div>
          <p style={{fontFamily:"'Fredoka One',cursive",fontSize:"1.1rem",color:"#fff",textAlign:"center",lineHeight:1.5,marginBottom:"1rem"}}>{q.q}</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"9px",marginBottom:"0.75rem"}}>
            {q.opts.map((o,i)=>{
              let bg="rgba(255,255,255,0.07)",bdr="1px solid rgba(255,255,255,0.14)",col="#fff";
              if(disp.sel!==null){
                if(i===q.ans){bg="rgba(107,203,119,0.28)";bdr="2px solid #6BCB77";col="#6BCB77";}
                else if(i===disp.sel&&i!==q.ans){bg="rgba(255,107,107,0.28)";bdr="2px solid #FF6B6B";col="#FF6B6B";}
              }
              return(
                <button key={i} onClick={()=>pick(i)} disabled={disp.sel!==null}
                  style={{background:bg,border:bdr,borderRadius:"14px",padding:"0.7rem 0.5rem",fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:"0.88rem",cursor:disp.sel!==null?"default":"pointer",color:col,transition:"all 0.3s",lineHeight:1.3}}
                  onMouseEnter={e=>{if(disp.sel===null)e.currentTarget.style.background="rgba(255,255,255,0.13)";}}
                  onMouseLeave={e=>{if(disp.sel===null)e.currentTarget.style.background=bg;}}
                >{o}</button>
              );
            })}
          </div>
          {disp.exp&&(
            <div style={{background:"rgba(168,85,247,0.14)",border:"1px solid rgba(168,85,247,0.35)",borderRadius:"12px",padding:"0.65rem 1rem",fontFamily:"'Nunito',sans-serif",fontSize:"0.86rem",color:"#D8B4FE",animation:"slideUp 0.3s",lineHeight:1.55}}>
              💡 {disp.exp}
            </div>
          )}
        </div>
      ):(
        <div style={{textAlign:"center",padding:"1rem 0"}}>
          <div style={{fontSize:"3.5rem",marginBottom:"0.5rem",animation:"bounce 0.6s"}}>{disp.pct>=80?"🏆":disp.pct>=60?"🎉":disp.pct>=40?"👍":"😄"}</div>
          <GText g="linear-gradient(135deg,#A855F7,#FF6FC8)" size="1.6rem" style={{marginBottom:"0.3rem"}}>{disp.correct}/{IQ_QS.length} Correct!</GText>
          <div style={{fontFamily:"'Fredoka One',cursive",color:"#FFD93D",marginBottom:"0.75rem"}}>{disp.pct}% — {rLabel}</div>
          <div style={{background:"rgba(168,85,247,0.12)",border:"1px solid rgba(168,85,247,0.28)",borderRadius:"14px",padding:"0.7rem",margin:"0.5rem 0 1rem",fontFamily:"'Nunito',sans-serif"}}>
            <span style={{color:"rgba(255,255,255,0.5)",fontSize:"0.88rem"}}>Points earned: </span>
            <span style={{fontFamily:"'Fredoka One',cursive",color:"#A855F7",fontSize:"1.3rem"}}>{disp.correct*12} ✨</span>
          </div>
          <Btn onClick={reset} g="linear-gradient(135deg,#A855F7,#FF6FC8)" style={{animation:"pulse 1.5s infinite"}}>Try Again! 🔄</Btn>
        </div>
      )}
    </div>
  );
}

function VisualMCQ({onScore}){
  const S=useRef({cur:0,correct:0,sel:null,done:false,scored:false});
  const [disp,setDisp]=useState({cur:0,sel:null,correct:0,exp:null,ctx:null,done:false,pct:0});

  const reset=()=>{
    S.current={cur:0,correct:0,sel:null,done:false,scored:false};
    setDisp({cur:0,sel:null,correct:0,exp:null,ctx:null,done:false,pct:0});
  };

  const pick=useCallback((optIdx)=>{
    if(S.current.sel!==null||S.current.done)return;
    S.current.sel=optIdx;
    if(optIdx===VISUAL_QS[S.current.cur].ans) S.current.correct++;
    const vq=VISUAL_QS[S.current.cur];
    setDisp(d=>({...d,sel:optIdx,correct:S.current.correct,exp:vq.exp,ctx:vq.ctx}));
    setTimeout(()=>{
      const nc=S.current.cur+1;
      if(nc>=VISUAL_QS.length){
        const p=Math.round((S.current.correct/VISUAL_QS.length)*100);
        S.current.done=true;
        if(!S.current.scored){S.current.scored=true;onScore("VisualIQ",S.current.correct*15);}
        setDisp(d=>({...d,done:true,pct:p,exp:null,ctx:null}));
      } else {
        S.current.cur=nc;
        S.current.sel=null;
        setDisp(d=>({...d,cur:nc,sel:null,exp:null,ctx:null}));
      }
    },2200);
  },[onScore]);

  const q=VISUAL_QS[disp.cur];
  const rLabel=disp.pct>=80?"🔍 Visual Master!":disp.pct>=60?"🎉 Great eye!":disp.pct>=40?"👍 Good try!":"😄 Keep practising!";

  return(
    <div>
      <GText g="linear-gradient(135deg,#00D2FF,#4D96FF,#A855F7)" style={{marginBottom:"0.3rem",textAlign:"center"}}>🖼️ Visual Understanding</GText>
      <p style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.38)",fontSize:"0.77rem",textAlign:"center",marginBottom:"0.75rem"}}>
        Study each emoji scene carefully, then answer the question below it
      </p>
      {!disp.done?(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.45)",fontSize:"0.82rem",marginBottom:"0.5rem"}}>
            <span>Scene {disp.cur+1} / {VISUAL_QS.length}</span><span>✅ {disp.correct}</span>
          </div>
          <div style={{height:"4px",background:"rgba(255,255,255,0.08)",borderRadius:"3px",marginBottom:"0.75rem"}}>
            <div style={{height:"4px",background:"linear-gradient(90deg,#00D2FF,#A855F7)",borderRadius:"3px",width:`${(disp.cur/VISUAL_QS.length)*100}%`,transition:"width 0.5s"}}/>
          </div>
          <div style={{fontFamily:"'Fredoka One',cursive",color:"rgba(255,255,255,0.3)",fontSize:"0.73rem",textAlign:"center",marginBottom:"0.35rem"}}>{q.label}</div>
          <div style={{background:"linear-gradient(135deg,rgba(0,210,255,0.08),rgba(168,85,247,0.1))",border:"2px solid rgba(0,210,255,0.28)",borderRadius:"18px",padding:"1.1rem 1.5rem",marginBottom:"0.65rem",textAlign:"center",fontFamily:"'Nunito',sans-serif",fontSize:"1.55rem",lineHeight:2.1,letterSpacing:"0.06em",whiteSpace:"pre-wrap"}}>
            {q.scene}
          </div>
          <div style={{background:"rgba(255,255,255,0.04)",borderRadius:"10px",padding:"0.45rem 0.85rem",marginBottom:"0.65rem",fontFamily:"'Nunito',sans-serif",fontSize:"0.76rem",color:"rgba(255,255,255,0.36)",lineHeight:1.5,fontStyle:"italic"}}>
            💬 {q.ctx}
          </div>
          <p style={{fontFamily:"'Fredoka One',cursive",fontSize:"1.02rem",color:"#fff",textAlign:"center",lineHeight:1.5,marginBottom:"0.65rem"}}>{q.question}</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"0.65rem"}}>
            {q.opts.map((o,i)=>{
              let bg="rgba(255,255,255,0.07)",bdr="1px solid rgba(255,255,255,0.14)",col="#fff";
              if(disp.sel!==null){
                if(i===q.ans){bg="rgba(107,203,119,0.28)";bdr="2px solid #6BCB77";col="#6BCB77";}
                else if(i===disp.sel&&i!==q.ans){bg="rgba(255,107,107,0.28)";bdr="2px solid #FF6B6B";col="#FF6B6B";}
              }
              return(
                <button key={i} onClick={()=>pick(i)} disabled={disp.sel!==null}
                  style={{background:bg,border:bdr,borderRadius:"13px",padding:"0.62rem 0.4rem",fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:"0.84rem",cursor:disp.sel!==null?"default":"pointer",color:col,transition:"all 0.3s",lineHeight:1.3}}
                  onMouseEnter={e=>{if(disp.sel===null)e.currentTarget.style.background="rgba(255,255,255,0.13)";}}
                  onMouseLeave={e=>{if(disp.sel===null)e.currentTarget.style.background=bg;}}
                >{o}</button>
              );
            })}
          </div>
          {disp.exp&&(
            <div style={{background:"linear-gradient(135deg,rgba(0,210,255,0.11),rgba(168,85,247,0.11))",border:"1px solid rgba(0,210,255,0.28)",borderRadius:"12px",padding:"0.68rem 1rem",fontFamily:"'Nunito',sans-serif",fontSize:"0.84rem",color:"#B2EEFF",animation:"slideUp 0.3s",lineHeight:1.6}}>
              <strong style={{color:"#00D2FF"}}>🔍 Explanation: </strong>{disp.exp}
            </div>
          )}
        </div>
      ):(
        <div style={{textAlign:"center",padding:"1rem 0"}}>
          <div style={{fontSize:"3.5rem",marginBottom:"0.5rem",animation:"bounce 0.6s"}}>{disp.pct>=80?"🔍":disp.pct>=60?"🎉":disp.pct>=40?"👍":"😄"}</div>
          <GText g="linear-gradient(135deg,#00D2FF,#A855F7)" size="1.6rem" style={{marginBottom:"0.3rem"}}>{disp.correct}/{VISUAL_QS.length} Correct!</GText>
          <div style={{fontFamily:"'Fredoka One',cursive",color:"#FFD93D",marginBottom:"0.75rem"}}>{disp.pct}% — {rLabel}</div>
          <div style={{background:"rgba(0,210,255,0.1)",border:"1px solid rgba(0,210,255,0.28)",borderRadius:"14px",padding:"0.7rem",margin:"0.5rem 0 1rem",fontFamily:"'Nunito',sans-serif"}}>
            <span style={{color:"rgba(255,255,255,0.5)",fontSize:"0.88rem"}}>Points earned: </span>
            <span style={{fontFamily:"'Fredoka One',cursive",color:"#00D2FF",fontSize:"1.3rem"}}>{disp.correct*15} ✨</span>
          </div>
          <Btn onClick={reset} g="linear-gradient(135deg,#00D2FF,#4D96FF)" style={{animation:"pulse 1.5s infinite"}}>Try Again! 🖼️</Btn>
        </div>
      )}
    </div>
  );
}

function IQSection({onScore,onBack}){
  const [tab,setTab]=useState(()=>{try{return sessionStorage.getItem("mda_iq_tab")||"logic";}catch{return "logic";}});
  const setTabP=t=>{setTab(t);try{sessionStorage.setItem("mda_iq_tab",t);}catch{};};
  const tabs=[{id:"logic",label:"🧩 Logic Quiz"},{id:"visual",label:"🖼️ Visual MCQ"}];
  return(
    <div style={{maxWidth:"580px",margin:"0 auto",position:"relative",zIndex:1}}>
      <BackBar onBack={onBack} label="Home" color="#A855F7"/>
      <GText g="linear-gradient(135deg,#A855F7,#FF6FC8,#00D2FF)" size="2rem" style={{textAlign:"center",marginBottom:"1rem"}}>💡 IQ Zone</GText>
      <p style={{textAlign:"center",fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.4)",fontSize:"0.82rem",marginBottom:"1rem"}}>
        Logic Quiz — classic brain teasers &nbsp;|&nbsp; Visual MCQ — read emoji scenes and answer
      </p>
      <div style={{display:"flex",justifyContent:"center",gap:"10px",marginBottom:"1.25rem"}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTabP(t.id)}
            style={{background:tab===t.id?"linear-gradient(135deg,#A855F7,#FF6FC8)":"rgba(255,255,255,0.07)",color:"#fff",border:tab===t.id?"none":"1px solid rgba(255,255,255,0.18)",padding:"0.5rem 1.3rem",borderRadius:"30px",fontFamily:"'Fredoka One',cursive",cursor:"pointer",fontSize:"0.92rem",transition:"all 0.2s"}}>{t.label}</button>
        ))}
      </div>
      <Card>
        {tab==="logic"&&<IQLogicQuiz onScore={onScore}/>}
        {tab==="visual"&&<VisualMCQ onScore={onScore}/>}
      </Card>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// ── FOOTBALL ZONE ─────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

// ── Penalty Shootout Game ────────────────────────────────────────────────────
function PenaltyGame({onScore}){
  const ZONES=["Top Left","Top Middle","Top Right","Mid Left","Centre","Mid Right","Bottom Left","Bottom","Bottom Right"];
  const KEEPER=["Dives Left! 🧤","Stays Centre! 🧤","Dives Right! 🧤","Goes Low! 🧤","Stands Tall! 🧤","Dives Low Left! 🧤","Corners! 🧤","Goes High! 🧤","Leaps! 🧤"];
  const [phase,setPhase]=useState("intro"); // intro|aim|result|done
  const [shots,setShots]=useState(0);const [goals,setGoals]=useState(0);
  const [keepDir,setKeepDir]=useState(0);const [shotDir,setShotDir]=useState(null);
  const [msg,setMsg]=useState("");const [scored,setScored]=useState(false);
  const MAX=5;
  const shoot=(zoneIdx)=>{
    if(phase!=="aim")return;
    const kd=Math.floor(Math.random()*ZONES.length);
    setKeepDir(kd);setShotDir(zoneIdx);setPhase("result");
    const isGoal=zoneIdx!==kd;
    const ns=shots+1;const ng=isGoal?goals+1:goals;
    setShots(ns);if(isGoal)setGoals(ng);
    setMsg(isGoal?`⚽ GOAL! Keeper ${KEEPER[kd]}`:`❌ SAVED! Keeper ${KEEPER[kd]}`);
    setTimeout(()=>{
      if(ns>=MAX){
        setPhase("done");
        if(!scored){setScored(true);onScore("Football",ng*20);}
      } else {setShotDir(null);setPhase("aim");setMsg("");}
    },1800);
  };
  const restart=()=>{setPhase("aim");setShots(0);setGoals(0);setShotDir(null);setMsg("");setScored(false);}
  return(
    <div style={{textAlign:"center"}}>
      <GText g="linear-gradient(135deg,#6BCB77,#4D96FF)" style={{marginBottom:"0.4rem"}}>⚽ Penalty Shootout</GText>
      {phase==="intro"&&<div>
        <p style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.5)",fontSize:"0.85rem",margin:"0.5rem 0 0.75rem"}}>
          Click a zone to shoot! Score as many as possible in {MAX} shots. The keeper guesses randomly!
        </p>
        <Btn onClick={()=>setPhase("aim")} g="linear-gradient(135deg,#6BCB77,#4D96FF)" style={{animation:"pulse 1.5s infinite"}}>Start Shootout ⚽</Btn>
      </div>}
      {(phase==="aim"||phase==="result")&&<>
        <div style={{display:"flex",justifyContent:"center",gap:"1.5rem",margin:"0.5rem 0",fontFamily:"'Fredoka One',cursive",fontSize:"1rem"}}>
          <span style={{color:"#6BCB77"}}>⚽ {goals}/{shots} goals</span>
          <span style={{color:"#FFD93D"}}>Shots left: {MAX-shots}</span>
        </div>
        {/* Goal net */}
        <div style={{position:"relative",width:"100%",maxWidth:"320px",margin:"0 auto 0.6rem",
          background:"linear-gradient(180deg,#1a2a1a,#0a1a0a)",borderRadius:"12px",
          border:"3px solid #fff",overflow:"hidden",aspectRatio:"2/1"}}>
          {/* Net lines */}
          {[20,40,60,80].map(x=><div key={x} style={{position:"absolute",left:`${x}%`,top:0,width:"1px",height:"100%",background:"rgba(255,255,255,0.15)"}}/>)}
          {[33,67].map(y=><div key={y} style={{position:"absolute",top:`${y}%`,left:0,width:"100%",height:"1px",background:"rgba(255,255,255,0.15)"}}/>)}
          {/* 3x3 zone buttons */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gridTemplateRows:"repeat(3,1fr)",position:"absolute",inset:0,padding:"4px",gap:"3px"}}>
            {ZONES.map((z,i)=>(
              <button key={i} onClick={()=>shoot(i)}
                disabled={phase==="result"}
                style={{background:phase==="result"?(i===shotDir?"rgba(255,211,61,0.5)":i===keepDir?"rgba(255,107,107,0.4)":"rgba(255,255,255,0.04)"):"rgba(255,255,255,0.06)",
                  border:`1px solid ${phase==="result"&&i===shotDir?"#FFD93D":phase==="result"&&i===keepDir?"#FF6B6B":"rgba(255,255,255,0.1)"}`,
                  borderRadius:"8px",cursor:phase==="aim"?"pointer":"default",
                  fontSize:"1rem",transition:"all 0.2s"}}
                onMouseEnter={e=>{if(phase==="aim")e.currentTarget.style.background="rgba(107,203,119,0.35)"}}
                onMouseLeave={e=>{if(phase==="aim")e.currentTarget.style.background="rgba(255,255,255,0.06)"}}>
                {phase==="result"&&i===shotDir?"⚽":phase==="result"&&i===keepDir?"🧤":""}
              </button>
            ))}
          </div>
        </div>
        {msg&&<div style={{fontFamily:"'Fredoka One',cursive",fontSize:"1.1rem",
          color:msg.startsWith("⚽")?"#6BCB77":"#FF6B6B",animation:"popIn 0.3s",marginBottom:"0.5rem"}}>{msg}</div>}
        {phase==="aim"&&<p style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.4)",fontSize:"0.8rem"}}>⬆ Click a zone to shoot!</p>}
      </>}
      {phase==="done"&&<div style={{padding:"0.75rem"}}>
        <div style={{fontSize:"3rem",animation:"bounce 0.5s"}}>{goals>=4?"🏆":goals>=3?"⭐":goals>=2?"👍":"😅"}</div>
        <GText g="linear-gradient(135deg,#6BCB77,#4D96FF)" style={{marginBottom:"0.3rem"}}>{goals}/{MAX} Goals!</GText>
        <p style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.5)",fontSize:"0.85rem",marginBottom:"0.75rem"}}>
          {goals>=4?"🏆 World Class Striker!":goals>=3?"⭐ Great shooting!":goals>=2?"👍 Decent penalty taker!":"Keep practising!"}
        </p>
        <Btn onClick={restart} g="linear-gradient(135deg,#6BCB77,#4D96FF)">Play Again ⚽</Btn>
      </div>}
    </div>
  );
}

// ── Keepie-Uppie Clicker ─────────────────────────────────────────────────────
function KeepiUppie({onScore}){
  const [keepy,setKeepy]=useState(0);const [time,setTime]=useState(20);const [running,setRunning]=useState(false);
  const [done,setDone]=useState(false);const [ballPos,setBallPos]=useState({x:50,y:50});const [scored,setScored]=useState(false);
  const kRef=useRef(0);
  useEffect(()=>{
    if(!running)return;
    if(time<=0){setRunning(false);setDone(true);if(!scored){setScored(true);onScore("Football",Math.round(kRef.current/2));}return;}
    const t=setTimeout(()=>setTime(t=>t-1),1000);return()=>clearTimeout(t);
  },[running,time,scored]);
  const tap=()=>{
    if(!running)return;
    kRef.current++;setKeepy(kRef.current);
    setBallPos({x:30+Math.random()*40,y:20+Math.random()*60});
  };
  const start=()=>{setKeepy(0);kRef.current=0;setTime(20);setRunning(true);setDone(false);setBallPos({x:50,y:50});setScored(false);}
  return(
    <div style={{textAlign:"center"}}>
      <GText g="linear-gradient(135deg,#FFD93D,#6BCB77)" style={{marginBottom:"0.4rem"}}>🦵 Keepie-Uppie!</GText>
      {!running&&!done&&<div>
        <p style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.5)",fontSize:"0.85rem",margin:"0.5rem 0 0.75rem"}}>Tap the ball as many times as you can in 20 seconds!</p>
        <Btn onClick={start} g="linear-gradient(135deg,#FFD93D,#6BCB77)" style={{animation:"pulse 1.5s infinite"}}>Start! 🦵</Btn>
      </div>}
      {running&&<>
        <div style={{display:"flex",justifyContent:"center",gap:"2rem",margin:"0.5rem 0",fontFamily:"'Fredoka One',cursive"}}>
          <span style={{color:"#FFD93D",fontSize:"1.3rem"}}>⚽ {keepy}</span>
          <span style={{color:"#FF6B6B",fontSize:"1.3rem"}}>⏱ {time}s</span>
        </div>
        <div onClick={tap} style={{position:"relative",height:"220px",background:"linear-gradient(180deg,rgba(77,150,255,0.1),rgba(107,203,119,0.1))",
          borderRadius:"18px",overflow:"hidden",border:"2px dashed rgba(107,203,119,0.35)",cursor:"pointer",userSelect:"none"}}>
          <div style={{position:"absolute",left:`${ballPos.x}%`,top:`${ballPos.y}%`,
            transform:"translate(-50%,-50%)",fontSize:"2.4rem",transition:"all 0.15s",
            filter:"drop-shadow(0 4px 8px rgba(0,0,0,0.4))",pointerEvents:"none"}}>⚽</div>
          <div style={{position:"absolute",bottom:"8px",left:"50%",transform:"translateX(-50%)",
            fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.25)",fontSize:"0.75rem"}}>Tap the ball!</div>
        </div>
        <div style={{marginTop:"0.5rem",fontFamily:"'Fredoka One',cursive",color:"#6BCB77",fontSize:"0.95rem"}}>
          {keepy>=30?"🔥 On fire!":keepy>=15?"⭐ Keep going!":keepy>=5?"👍 Nice!":"Get tapping!"}
        </div>
      </>}
      {done&&<div style={{padding:"0.75rem"}}>
        <div style={{fontSize:"3rem",animation:"bounce 0.5s"}}>{keepy>=40?"🏆":keepy>=25?"⭐":"👍"}</div>
        <GText g="linear-gradient(135deg,#FFD93D,#6BCB77)" style={{marginBottom:"0.3rem"}}>{keepy} keepy-uppies!</GText>
        <p style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.5)",fontSize:"0.85rem",marginBottom:"0.75rem"}}>
          {keepy>=40?"🏆 Ballon d'Or material!":keepy>=25?"⭐ Skilful touch!":"Keep practising!"}
        </p>
        <Btn onClick={start} g="linear-gradient(135deg,#FFD93D,#6BCB77)">Try Again! 🦵</Btn>
      </div>}
    </div>
  );
}

// ── Football Quiz ─────────────────────────────────────────────────────────────
const FOOTBALL_QS=[
  {q:"Which country has won the most FIFA World Cups?",opts:["Germany","Argentina","Brazil","France"],ans:2,exp:"Brazil has won the World Cup 5 times — more than any other nation!"},
  {q:"Who scored the famous 'Hand of God' goal?",opts:["Pelé","Ronaldo","Maradona","Zidane"],ans:2,exp:"Diego Maradona scored the controversial goal against England in 1986."},
  {q:"What is the maximum number of players on the pitch per team?",opts:["10","11","12","9"],ans:1,exp:"Each team plays with 11 players on the pitch at a time."},
  {q:"Which club has won the most UEFA Champions League titles?",opts:["Barcelona","Liverpool","Real Madrid","Bayern Munich"],ans:2,exp:"Real Madrid has won the Champions League/European Cup a record 15 times!"},
  {q:"How long is a standard football match?",opts:["80 minutes","100 minutes","90 minutes","75 minutes"],ans:2,exp:"A standard match is 90 minutes — two 45-minute halves."},
  {q:"Which player is known as CR7?",opts:["Carlos Ruiz","Cristiano Ronaldo","Carlos Rodriguez","Claudio Reyna"],ans:1,exp:"Cristiano Ronaldo — CR for his name, 7 for his famous shirt number!"},
  {q:"What shape is a standard football?",opts:["Perfect sphere","Truncated icosahedron","Oval","Cube"],ans:1,exp:"A football is a truncated icosahedron — 20 hexagons and 12 pentagons!"},
  {q:"Which country hosted the 2022 FIFA World Cup?",opts:["Russia","Brazil","Qatar","USA"],ans:2,exp:"Qatar hosted the 2022 World Cup — the first in the Middle East!"},
  {q:"What is a hat-trick in football?",opts:["3 goals by one player","3 saves by keeper","3 yellow cards","3 corners"],ans:0,exp:"A hat-trick means one player scoring 3 goals in the same match!"},
  {q:"Who won the 2023-24 UEFA Champions League?",opts:["Manchester City","Real Madrid","Bayern Munich","PSG"],ans:1,exp:"Real Madrid defeated Borussia Dortmund 2-0 in the 2024 Champions League Final!"},
  {q:"What is the offside rule about?",opts:["Ball going out","Player ahead of second-last defender","Foul tackle","Handball"],ans:1,exp:"Offside occurs when an attacker is closer to the goal than the second-last defender when the ball is played."},
  {q:"Which player has the most Ballon d'Or awards?",opts:["Ronaldo","Messi","Ronaldinho","Zidane"],ans:1,exp:"Lionel Messi has won the Ballon d'Or 8 times — more than anyone else!"},
  {q:"What colour card means a player is sent off?",opts:["Blue","Orange","Yellow","Red"],ans:3,exp:"A red card means immediate dismissal from the match!"},
  {q:"In which year was the first FIFA World Cup held?",opts:["1934","1950","1930","1938"],ans:2,exp:"The very first World Cup was held in Uruguay in 1930!"},
  {q:"What does VAR stand for in football?",opts:["Video Assisted Referee","Very Accurate Result","Video Action Review","Verified Accurate Referee"],ans:0,exp:"VAR — Video Assisted Referee — uses video technology to help officials make correct decisions!"},
  {q:"Which is the fastest goal ever scored in the Premier League?",opts:["10.4 seconds","5.0 seconds","7.8 seconds","9.7 seconds"],ans:0,exp:"Shane Long scored for Southampton vs Watford in just 7.69 seconds — but the record changes occasionally!"},
  {q:"How many referees officiate a professional football match?",opts:["1","3","4","2"],ans:2,exp:"There are 4 officials: 1 referee, 2 assistant referees (linesmen), and 1 fourth official."},
  {q:"What trophy is awarded to the top scorer in each Premier League season?",opts:["Golden Boot","Golden Glove","Silver Boot","Platinum Boot"],ans:0,exp:"The Golden Boot goes to the player who scores the most goals in a Premier League season!"},
  {q:"Which nation invented the game of football?",opts:["Spain","Brazil","England","Germany"],ans:2,exp:"Modern football was codified in England in 1863 with the formation of The Football Association!"},
  {q:"What is the standard length of a football pitch?",opts:["80-100m","100-110m","50-75m","90-120m"],ans:3,exp:"FIFA regulations state a pitch must be 90-120 metres long and 45-90 metres wide."},
];

function FootballQuiz({onScore}){
  const S=useRef({cur:0,correct:0,sel:null,done:false,scored:false});
  const [disp,setDisp]=useState({cur:0,sel:null,correct:0,exp:null,done:false,pct:0});
  const reset=()=>{S.current={cur:0,correct:0,sel:null,done:false,scored:false};setDisp({cur:0,sel:null,correct:0,exp:null,done:false,pct:0});}
  const pick=useCallback((i)=>{
    if(S.current.sel!==null||S.current.done)return;
    S.current.sel=i;
    if(i===FOOTBALL_QS[S.current.cur].ans)S.current.correct++;
    const expText=FOOTBALL_QS[S.current.cur].exp;
    setDisp(d=>({...d,sel:i,correct:S.current.correct,exp:expText}));
    setTimeout(()=>{
      const nc=S.current.cur+1;
      if(nc>=FOOTBALL_QS.length){
        const p=Math.round((S.current.correct/FOOTBALL_QS.length)*100);
        S.current.done=true;
        if(!S.current.scored){S.current.scored=true;onScore("FootballQuiz",S.current.correct*10);}
        setDisp(d=>({...d,done:true,pct:p,exp:null}));
      }else{S.current.cur=nc;S.current.sel=null;setDisp(d=>({...d,cur:nc,sel:null,exp:null}));}
    },1600);
  },[onScore]);
  const q=FOOTBALL_QS[disp.cur];
  const rLabel=disp.pct>=80?"🏆 Football Expert!":disp.pct>=60?"⭐ Decent fan!":disp.pct>=40?"👍 Keep watching!":"😅 Need more practice!";
  return(
    <div>
      <GText g="linear-gradient(135deg,#6BCB77,#FFD93D)" style={{marginBottom:"0.75rem",textAlign:"center"}}>🧠 Football Quiz</GText>
      {!disp.done?<div>
        <div style={{display:"flex",justifyContent:"space-between",fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.45)",fontSize:"0.83rem",marginBottom:"0.6rem"}}><span>Q {disp.cur+1}/{FOOTBALL_QS.length}</span><span>✅ {disp.correct}</span></div>
        <div style={{height:"5px",background:"rgba(255,255,255,0.08)",borderRadius:"3px",marginBottom:"1rem"}}>
          <div style={{height:"5px",background:"linear-gradient(90deg,#6BCB77,#4D96FF)",borderRadius:"3px",width:`${(disp.cur/FOOTBALL_QS.length)*100}%`,transition:"width 0.5s"}}/>
        </div>
        <p style={{fontFamily:"'Fredoka One',cursive",fontSize:"1.05rem",color:"#fff",textAlign:"center",lineHeight:1.5,marginBottom:"1rem"}}>{q.q}</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"9px",marginBottom:"0.75rem"}}>
          {q.opts.map((o,i)=>{
            let bg="rgba(255,255,255,0.07)",bdr="1px solid rgba(255,255,255,0.14)",col="#fff";
            if(disp.sel!==null){if(i===q.ans){bg="rgba(107,203,119,0.28)";bdr="2px solid #6BCB77";col="#6BCB77";}else if(i===disp.sel&&i!==q.ans){bg="rgba(255,107,107,0.28)";bdr="2px solid #FF6B6B";col="#FF6B6B";}}
            return(<button key={i} onClick={()=>pick(i)} disabled={disp.sel!==null}
              style={{background:bg,border:bdr,borderRadius:"14px",padding:"0.7rem 0.5rem",fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:"0.85rem",cursor:disp.sel!==null?"default":"pointer",color:col,transition:"all 0.3s",lineHeight:1.3}}>{o}</button>);
          })}
        </div>
        {disp.exp&&<div style={{background:"rgba(107,203,119,0.12)",border:"1px solid rgba(107,203,119,0.3)",borderRadius:"12px",padding:"0.65rem 1rem",fontFamily:"'Nunito',sans-serif",fontSize:"0.86rem",color:"#B6F5C8",animation:"slideUp 0.3s",lineHeight:1.55}}>⚽ {disp.exp}</div>}
      </div>:<div style={{textAlign:"center",padding:"1rem 0"}}>
        <div style={{fontSize:"3.5rem",marginBottom:"0.5rem",animation:"bounce 0.6s"}}>{disp.pct>=80?"🏆":disp.pct>=60?"⭐":disp.pct>=40?"👍":"😅"}</div>
        <GText g="linear-gradient(135deg,#6BCB77,#FFD93D)" size="1.6rem" style={{marginBottom:"0.3rem"}}>{disp.correct}/{FOOTBALL_QS.length} Correct!</GText>
        <div style={{fontFamily:"'Fredoka One',cursive",color:"#FFD93D",marginBottom:"0.75rem"}}>{disp.pct}% — {rLabel}</div>
        <div style={{background:"rgba(107,203,119,0.1)",border:"1px solid rgba(107,203,119,0.25)",borderRadius:"14px",padding:"0.7rem",margin:"0.5rem 0 1rem",fontFamily:"'Nunito',sans-serif"}}>
          <span style={{color:"rgba(255,255,255,0.5)",fontSize:"0.88rem"}}>Points: </span>
          <span style={{fontFamily:"'Fredoka One',cursive",color:"#6BCB77",fontSize:"1.3rem"}}>{disp.correct*10} ✨</span>
        </div>
        <Btn onClick={reset} g="linear-gradient(135deg,#6BCB77,#4D96FF)" style={{animation:"pulse 1.5s infinite"}}>Try Again! ⚽</Btn>
      </div>}
    </div>
  );
}

function FootballZone({onScore,onBack}){
  const [tab,setTab]=useState(()=>{try{return sessionStorage.getItem("mda_football_tab")||"shootout";}catch{return "shootout";}});
  const setTabP=t=>{setTab(t);try{sessionStorage.setItem("mda_football_tab",t);}catch{};};
  const tabs=[{id:"shootout",label:"⚽ Penalty Shootout"},{id:"keepy",label:"🦵 Keepie-Uppie"},{id:"quiz",label:"🧠 Football Quiz"}];
  return(
    <div style={{position:"relative",zIndex:1}}>
      <BackBar onBack={onBack} label="Home" color="#6BCB77"/>
      <div style={{textAlign:"center",marginBottom:"1rem"}}>
        <GText g="linear-gradient(135deg,#6BCB77,#4D96FF,#FFD93D)" size="2rem" style={{marginBottom:"0.2rem"}}>⚽ Football Zone</GText>
        <p style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.45)",fontSize:"0.85rem"}}>Play games and test your football knowledge!</p>
      </div>
      <div style={{display:"flex",justifyContent:"center",gap:"8px",marginBottom:"1rem",flexWrap:"wrap"}}>
        {tabs.map(t=><button key={t.id} onClick={()=>setTabP(t.id)}
          style={{background:tab===t.id?"linear-gradient(135deg,#6BCB77,#4D96FF)":"rgba(255,255,255,0.07)",
            color:"#fff",border:tab===t.id?"none":"1px solid rgba(255,255,255,0.18)",padding:"0.45rem 1.1rem",
            borderRadius:"30px",fontFamily:"'Fredoka One',cursive",cursor:"pointer",fontSize:"0.88rem",transition:"all 0.2s"}}>{t.label}</button>)}
      </div>
      <Card style={{maxWidth:"520px",margin:"0 auto"}}>
        {tab==="shootout"&&<PenaltyGame onScore={onScore}/>}
        {tab==="keepy"&&<KeepiUppie onScore={onScore}/>}
        {tab==="quiz"&&<FootballQuiz onScore={onScore}/>}
      </Card>
    </div>
  );
}

const JOKES=[
  {s:"Why don't scientists trust atoms?",p:"Because they make up everything! 😂"},
  {s:"What do you call a fish without eyes?",p:"A fsh! 🐟"},
  {s:"Why did the math book look so sad?",p:"It had too many problems! 📚"},
  {s:"What do you call cheese that isn't yours?",p:"Nacho cheese! 🧀"},
  {s:"Why did the bicycle fall over?",p:"It was two-tired! 🚲"},
  {s:"Why can't Elsa have a balloon?",p:"Because she'll let it go! 🎈"},
  {s:"What do robots eat for breakfast?",p:"Micro-chips and Java! 🤖🍟"},
  {s:"Why was the computer cold at school?",p:"It left its Windows open! 💻❄️"},
  {s:"Why did the programmer quit his job?",p:"Because he didn't get arrays! 😂💻"},
  {s:"What do you call a sleeping dinosaur?",p:"A dino-snore! 🦕😴"},
  {s:"Why did the car go to therapy?",p:"It had too many breakdowns! 🚗😅"},
  {s:"What is a pirate's favourite programming language?",p:"R! 🏴‍☠️"},
  {s:"Why do programmers prefer dark mode?",p:"Because light attracts bugs! 🐛💡"},
  {s:"What did one wall say to the other wall?",p:"I'll meet you at the corner! 🧱"},
];
const TONGUE_TWISTERS=[
  {tw:"She sells seashells by the seashore 🐚",tip:"Try saying it 3 times fast!"},
  {tw:"Peter Piper picked a peck of pickled peppers 🌶️",tip:"The P's will get you every time!"},
  {tw:"How much wood would a woodchuck chuck? 🪵",tip:"Woodchuck can't actually chuck wood!"},
  {tw:"Red lorry, yellow lorry, red lorry, yellow lorry 🚛",tip:"Your tongue will tie itself in knots!"},
  {tw:"Fuzzy Wuzzy was a bear, Fuzzy Wuzzy had no hair 🐻",tip:"Fuzzy Wuzzy wasn't very fuzzy, was he?"},
  {tw:"Buffalo buffalo Buffalo buffalo buffalo buffalo Buffalo buffalo 🦬",tip:"This is an actual grammatically correct sentence!"},
];

function TongueTwister(){
  const [idx,setIdx]=useState(0);const [speed,setSpeed]=useState(0);const [tries,setTries]=useState(0);
  const t=TONGUE_TWISTERS[idx];
  const next=()=>{setIdx(i=>(i+1)%TONGUE_TWISTERS.length);setSpeed(0);setTries(0);}
  return(
    <div style={{textAlign:"center"}}>
      <GText g="linear-gradient(135deg,#6BCB77,#00D2FF)" style={{marginBottom:"0.4rem"}}>👅 Tongue Twisters</GText>
      <p style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.45)",fontSize:"0.8rem",marginBottom:"0.75rem"}}>Say it out loud — as fast as you can!</p>
      <div style={{background:"rgba(107,203,119,0.1)",border:"1px solid rgba(107,203,119,0.3)",borderRadius:"16px",padding:"1.2rem",marginBottom:"0.75rem"}}>
        <div style={{fontFamily:"'Fredoka One',cursive",fontSize:"1.15rem",color:"#fff",lineHeight:1.6,marginBottom:"0.5rem"}}>{t.tw}</div>
        <div style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.45)",fontSize:"0.8rem",fontStyle:"italic"}}>{t.tip}</div>
      </div>
      <div style={{display:"flex",gap:"8px",justifyContent:"center",marginBottom:"0.75rem",flexWrap:"wrap"}}>
        {["Easy 😊","Medium 😅","Hard 😤","Impossible 🤯"].map((lbl,i)=>(
          <button key={i} onClick={()=>{setSpeed(i);setTries(tr=>tr+1);}} style={{background:speed===i?`linear-gradient(135deg,${COLORS[i]},${COLORS[i+2]})`:"rgba(255,255,255,0.07)",color:"#fff",border:"none",padding:"0.35rem 0.8rem",borderRadius:"20px",fontFamily:"'Fredoka One',cursive",cursor:"pointer",fontSize:"0.78rem"}}>{lbl}</button>
        ))}
      </div>
      {tries>0&&<div style={{fontFamily:"'Fredoka One',cursive",color:COLORS[speed],fontSize:"1rem",marginBottom:"0.5rem"}}>{["Nice and easy! 😎","Getting tricky! 😅","Tongue tied! 😤","Your tongue hates you! 🤯"][speed]}</div>}
      <Btn onClick={next} g="linear-gradient(135deg,#6BCB77,#00D2FF)" style={{fontSize:"0.88rem"}}>Next Twister 👅</Btn>
    </div>
  );
}

const STORY_TEMPLATES=[
  (name,setting,event,twist)=>`One ${setting}, ${name} was minding their own business when suddenly ${event}. The twist? ${twist}. Nobody expected it — especially not ${name}!`,
  (name,setting,event,twist)=>`It started as a normal ${setting} for ${name}. Then ${event} happened out of nowhere. As if that wasn't enough, ${twist}. The whole street heard the commotion!`,
  (name,setting,event,twist)=>`${name} had planned everything perfectly for ${setting}. But then ${event} — and somehow, ${twist}. The robot witness took a selfie.`,
  (name,setting,event,twist)=>`During ${setting}, ${name} made a bold decision: ${event}. Predictably, ${twist}. Legend has it ${name} still hasn't recovered.`,
];
const SETTINGS=["a quiet Tuesday afternoon","a chaotic school morning","the annual science fair","a suspiciously calm Friday","the last day of term","a very important Zoom call","a visit to the supermarket","a school trip to the museum"];
const EVENTS=["a pigeon stole their lunch and winked","they accidentally became the school's substitute teacher","a robot they built started giving life advice","they sneezed and invented a new hairstyle","their phone autocorrected 'hello' to 'I challenge you to a duel'","they sat on the TV remote and changed the channel to a cooking competition","a cat followed them home and refused to leave","they found a note that just said 'you know what you did'"];
const TWISTS=["a nearby toaster started playing jazz music in celebration","the headteacher gave a standing ovation for no reason","three pigeons arrived and began judging the situation","it turned out the whole thing had been filmed for a documentary","the school WiFi mysteriously started working perfectly afterwards","their robot friend posted it on RoboGram before they could stop it","the event was declared a national holiday in a country they'd never heard of","a delivery drone arrived with a certificate saying 'Most Chaotic Human 2024'"];
// Fun random character names so every story stars a different silly hero
const STORY_NAMES=["Captain Giggles","Bouncy Bella","Sir Wobblesworth","Pixel Pete","Goofy Greta","Turbo Timmy","Madame Mischief","Ziggy Zoom","Professor Pickle","Daring Dora","Wacky Wally","Bubbles McGee","Rocket Rosa","Sneaky Sam","Jolly Jasper","Loopy Luna","Major Munchkin","Dizzy Dexter","Giggly Gail","Nutty Nora","Zippy Zane","Cosmic Cleo","Banana Bob","Whirlwind Wendy","Sir Sniffalot","Twinkle Tina","Doodle Dan","Marvelous Mia","Wiggly Winston","Splash Sophie"];

function AIStoryGenerator({name,userName}){
  const [story,setStory]=useState("");const [loading,setLoading]=useState(false);const [mode,setMode]=useState("local");
  const [genre,setGenre]=useState("funny");const [anim,setAnim]=useState(false);
  const [hero,setHero]=useState("");
  const rand=arr=>arr[Math.floor(Math.random()*arr.length)];
  const genLocal=()=>{
    setAnim(true);
    const h=rand(STORY_NAMES);
    setHero(h);
    const tpl=rand(STORY_TEMPLATES);
    setStory(tpl(h,rand(SETTINGS),rand(EVENTS),rand(TWISTS)));
    setTimeout(()=>setAnim(false),350);
  };
  const genAI=async()=>{
    setLoading(true);setStory("");
    const h=rand(STORY_NAMES);
    setHero(h);
    const prompts={
      funny:`Write a very short (3-4 sentences), funny and kid-friendly story (suitable for ages 8-12) about a silly character named ${h} who has a hilarious adventure with a robot friend. Make it silly, light-hearted and end with a funny punchline. No violence or scary content.`,
      horror:`Write a very short (3-4 sentences), funny horror-comedy story (suitable for ages 8-12) about a character named ${h} encountering something spooky that turns out to be completely harmless and funny. Make it more funny than scary.`,
      adventure:`Write a very short (3-4 sentences), exciting adventure story (suitable for ages 8-12) about a character named ${h} going on an unexpected quest to find something ridiculous, like the world's largest pizza or a lost sock. Make it fun and triumphant.`,
    };
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:200,messages:[{role:"user",content:prompts[genre]}]})});
      const data=await res.json();
      setStory((data.content&&data.content[0]&&data.content[0].text)||"Story generation failed. Try again!");
    }catch{setStory("Could not generate story — check your connection and try again!");}
    setLoading(false);
  };
  useEffect(()=>{genLocal();},[]);
  return(
    <div style={{textAlign:"center"}}>
      <GText g={genre==="horror"?"linear-gradient(135deg,#A855F7,#FF6B6B)":genre==="adventure"?"linear-gradient(135deg,#4D96FF,#6BCB77)":"linear-gradient(135deg,#FFD93D,#FF9A3C)"}
        style={{marginBottom:"0.35rem"}}>
        {genre==="horror"?"👻 Horror-Comedy Story":genre==="adventure"?"🚀 Adventure Story":"📖 Funny Story Generator"}
      </GText>
      <p style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.4)",fontSize:"0.78rem",marginBottom:"0.75rem"}}>
        Starring <strong style={{color:"#FFD93D"}}>{hero||"a mystery hero"}</strong>! 🎭
      </p>
      {/* Mode tabs */}
      <div style={{display:"flex",gap:"6px",justifyContent:"center",marginBottom:"0.75rem"}}>
        {[["local","⚡ Instant"],["ai","🤖 AI Magic"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setMode(id)}
            style={{background:mode===id?"linear-gradient(135deg,#A855F7,#4D96FF)":"rgba(255,255,255,0.07)",color:"#fff",border:"none",
              padding:"0.3rem 0.85rem",borderRadius:"20px",fontFamily:"'Fredoka One',cursive",cursor:"pointer",fontSize:"0.78rem"}}>
            {lbl}
          </button>
        ))}
      </div>
      {/* Genre tabs */}
      <div style={{display:"flex",gap:"6px",justifyContent:"center",marginBottom:"0.75rem",flexWrap:"wrap"}}>
        {[["funny","😂 Funny"],["horror","👻 Horror"],["adventure","🚀 Adventure"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setGenre(id)}
            style={{background:genre===id?`linear-gradient(135deg,${id==="horror"?"#A855F7,#FF6B6B":id==="adventure"?"#4D96FF,#6BCB77":"#FFD93D,#FF9A3C"})`:"rgba(255,255,255,0.07)",
              color:"#fff",border:"none",padding:"0.3rem 0.85rem",borderRadius:"20px",
              fontFamily:"'Fredoka One',cursive",cursor:"pointer",fontSize:"0.78rem",transition:"all 0.2s"}}>
            {lbl}
          </button>
        ))}
      </div>
      {/* Story display */}
      <div style={{background:genre==="horror"?"rgba(168,85,247,0.1)":genre==="adventure"?"rgba(77,150,255,0.1)":"rgba(255,211,61,0.08)",
        borderRadius:"16px",padding:"1rem 1.2rem",marginBottom:"0.75rem",minHeight:"80px",
        animation:anim?"popIn 0.4s":"none",
        border:`1px solid ${genre==="horror"?"rgba(168,85,247,0.28)":genre==="adventure"?"rgba(77,150,255,0.28)":"rgba(255,211,61,0.28)"}`}}>
        {loading?<div style={{fontFamily:"'Fredoka One',cursive",color:"rgba(255,255,255,0.5)",fontSize:"0.9rem",animation:"pulse 1s infinite"}}>🤖 Claude is writing your story...</div>
        :<p style={{fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:"0.92rem",color:"rgba(255,255,255,0.88)",lineHeight:1.8,textAlign:"left"}}>{story}</p>}
      </div>
      <Btn onClick={mode==="ai"?genAI:genLocal}
        g={genre==="horror"?"linear-gradient(135deg,#A855F7,#FF6B6B)":genre==="adventure"?"linear-gradient(135deg,#4D96FF,#6BCB77)":"linear-gradient(135deg,#FFD93D,#FF9A3C)"}
        style={{animation:"pulse 2s infinite"}} disabled={loading}>
        {loading?"Writing...":mode==="ai"?"✨ Generate AI Story":"🎲 New Story"}
      </Btn>
    </div>
  );
}

// ── Funny Image MCQ (emoji scene + funny answer choices) ─────────────────────
const FUNNY_IMG_QS=[
  {scene:"👨‍💼💼\n🪑💻📊\n😴😴😴",caption:"A businessman in an important meeting...",
    opts:["Presenting groundbreaking strategy","Sleeping with eyes open","Dreaming of pizza 🍕","Playing Minecraft secretly"],
    ans:2,funny:"His presentation slides were literally a pizza delivery menu. No one noticed for 20 minutes."},
  {scene:"🐕🦴\n👀👀\n😇😇😇",caption:"A dog discovers something suspicious...",
    opts:["A delicious bone","A very important document","His owner's homework","The TV remote"],
    ans:2,funny:"The dog ate three essays, a science project, and somehow also the printer. The teacher gave extra marks for creativity."},
  {scene:"👩‍🍳🍳\n💥🔥\n😅🚒",caption:"A chef faces an unexpected situation...",
    opts:["Perfect omelette achieved","The smoke alarm is a music critic","Toast became art","Kitchen hired as a flamethrower factory"],
    ans:1,funny:"The smoke alarm went off and the fire brigade arrived. They stayed for dinner because it actually smelled amazing."},
  {scene:"🐱📱\n😾😾\n🛒🛒🛒",caption:"A cat is spotted using a smartphone...",
    opts:["Ordering premium cat food online","Watching bird videos on loop","Writing a 1-star review of the sofa","Video calling another cat"],
    ans:0,funny:"The cat ordered 47 cans of tuna, a laser pointer, and somehow also a lawnmower. The credit card statement was... interesting."},
  {scene:"🧑‍🎓📚\n😴😴\n📖📖📖",caption:"A student is deep in study mode...",
    opts:["Memorising the entire textbook","Successfully sleeping while pretending to read","Dreaming the exam answers","Inventing a new language"],
    ans:1,funny:"They woke up having drooled on page 47 of Chemistry. The drool created a completely new element. They got full marks."},
  {scene:"🏃💨\n🐕🐕🐕\n😱😱😱",caption:"Someone is running very fast...",
    opts:["Training for the Olympics","Running from their responsibilities","Being chased by very enthusiastic dogs","Late for the bus on the last day of school"],
    ans:2,funny:"It was 3 Labrador puppies who just wanted cuddles. The person ran 5km and accidentally broke the local speed record."},
  {scene:"🤖📱\n💬💬💬\n😂😂😂",caption:"A robot is learning to text...",
    opts:["Sending professional business emails","Accidentally texting the entire contact list","Learning human emotions through memes","Writing a novel using autocomplete"],
    ans:3,funny:"The result was 47,000 words of pure autocomplete poetry. A publisher called it the greatest work of modern literature."},
  {scene:"🧑‍🍳🍕\n🔥🔥\n😬😬😬",caption:"Someone attempts to make pizza at home...",
    opts:["Following the recipe perfectly","Inventing a new pizza variety called 'Chaos Pizza'","Accidentally making a campfire indoors","Discovering pizza doesn't need to be circular"],
    ans:1,funny:"Chaos Pizza featured burnt crust, too much cheese, and somehow a grape. It got 50 million views on social media."},
];

function FunnyImageMCQ(){
  const [qi,setQi]=useState(0);const [sel,setSel]=useState(null);const [revealed,setRevealed]=useState(false);
  const S=useRef({qi:0,sel:null});
  const next=()=>{const nq=(qi+1)%FUNNY_IMG_QS.length;setQi(nq);setSel(null);setRevealed(false);S.current={qi:nq,sel:null};}
  const pick=(i)=>{
    if(sel!==null)return;
    setSel(i);S.current.sel=i;
    setTimeout(()=>setRevealed(true),800);
  };
  const q=FUNNY_IMG_QS[qi];
  return(
    <div style={{textAlign:"center"}}>
      <GText g="linear-gradient(135deg,#FF6FC8,#FFD93D)" style={{marginBottom:"0.3rem"}}>🖼️ Funny Image Quiz</GText>
      <p style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.4)",fontSize:"0.78rem",marginBottom:"0.75rem"}}>
        Look at the scene and pick the FUNNIEST answer! {qi+1}/{FUNNY_IMG_QS.length}
      </p>
      {/* Emoji scene */}
      <div style={{background:"linear-gradient(135deg,rgba(255,111,200,0.1),rgba(255,211,61,0.1))",
        border:"2px solid rgba(255,111,200,0.28)",borderRadius:"18px",padding:"1rem 1.5rem",marginBottom:"0.75rem",
        fontFamily:"'Nunito',sans-serif",fontSize:"2rem",lineHeight:2.2,whiteSpace:"pre-wrap",letterSpacing:"0.1em"}}>
        {q.scene}
      </div>
      <div style={{fontFamily:"'Fredoka One',cursive",color:"#fff",fontSize:"1rem",marginBottom:"0.75rem",lineHeight:1.4}}>
        {q.caption}
      </div>
      {/* Options */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"0.75rem"}}>
        {q.opts.map((o,i)=>{
          const isCorrect=i===q.ans;const isSelected=sel===i;
          let bg="rgba(255,255,255,0.07)",bdr="1px solid rgba(255,255,255,0.15)",col="#fff";
          if(sel!==null){
            if(isCorrect){bg="rgba(255,111,200,0.25)";bdr="2px solid #FF6FC8";col="#FF6FC8";}
            else if(isSelected&&!isCorrect){bg="rgba(255,107,107,0.2)";bdr="1px solid #FF6B6B";col="#FF6B6B";}
          }
          return(
            <button key={i} onClick={()=>pick(i)} disabled={sel!==null}
              style={{background:bg,border:bdr,borderRadius:"14px",padding:"0.7rem 0.5rem",
                fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:"0.82rem",
                cursor:sel!==null?"default":"pointer",color:col,transition:"all 0.3s",lineHeight:1.4,textAlign:"left"}}>
              {isCorrect&&sel!==null?"😂 ":""}{o}
            </button>
          );
        })}
      </div>
      {/* Funny reveal */}
      {revealed&&(
        <div style={{background:"linear-gradient(135deg,rgba(255,111,200,0.15),rgba(255,211,61,0.1))",
          border:"1px solid rgba(255,111,200,0.35)",borderRadius:"14px",padding:"0.85rem 1rem",
          marginBottom:"0.75rem",animation:"slideUp 0.4s",fontFamily:"'Nunito',sans-serif",
          fontSize:"0.88rem",color:"rgba(255,255,255,0.85)",lineHeight:1.7,textAlign:"left"}}>
          <strong style={{color:"#FF6FC8"}}>😂 The Funny Truth: </strong>{q.funny}
        </div>
      )}
      <Btn onClick={next} g="linear-gradient(135deg,#FF6FC8,#FFD93D)" style={{fontSize:"0.9rem",marginTop:"0.2rem"}}>
        Next Scene 🖼️ →
      </Btn>
    </div>
  );
}

function FakeJumpScare(){
  const [phase,setPhase]=useState("idle");const [count,setCount]=useState(3);
  const iRef=useRef(null);const sRef=useRef({e:"🤡",t:"HONK HONK!!"});
  const scares=[{e:"🤡",t:"HONK HONK!!"},{e:"😱",t:"BOO!!"},{e:"🎃",t:"HALLOWEEN!!"},{e:"👾",t:"ALIEN INVASION!!"},{e:"💀",t:"SPOOKY SCARY!!"},{e:"🕷️",t:"SPIDER!!"}];
  const trigger=()=>{sRef.current=scares[Math.floor(Math.random()*scares.length)];let c=3;setCount(c);setPhase("cd");iRef.current=setInterval(()=>{c--;setCount(c);if(c<=0){clearInterval(iRef.current);setPhase("scare");setTimeout(()=>setPhase("laugh"),1300);}},1000);}
  useEffect(()=>()=>clearInterval(iRef.current),[]);
  return(
    <div style={{textAlign:"center",padding:"0.5rem"}}>
      <GText g="linear-gradient(135deg,#FF6B6B,#A855F7)" style={{marginBottom:"0.4rem"}}>😱 Fake Jump Scare</GText>
      {phase==="idle"&&<Btn onClick={trigger} g="linear-gradient(135deg,#FF6B6B,#A855F7)" style={{animation:"pulse 1.5s infinite",fontSize:"1.1rem"}}>Click if you DARE... 😈</Btn>}
      {phase==="cd"&&<div style={{fontSize:"5rem",fontFamily:"'Fredoka One',cursive",color:"#FF6B6B",animation:"bounce 0.5s infinite"}}>{count}</div>}
      {phase==="scare"&&<div style={{fontSize:"5rem",animation:"wiggle 0.18s infinite"}}>{sRef.current.e}<div style={{fontFamily:"'Fredoka One',cursive",fontSize:"1.8rem",color:"#FF6B6B",animation:"shake 0.25s infinite"}}>{sRef.current.t}</div></div>}
      {phase==="laugh"&&<div><div style={{fontSize:"3rem"}}>😂🤣😂</div><div style={{fontFamily:"'Fredoka One',cursive",color:"#6BCB77",fontSize:"1.1rem",marginBottom:"0.75rem"}}>Ha! It was fake! 😄</div><Btn onClick={()=>setPhase("idle")} g="linear-gradient(135deg,#FF6B6B,#FF9A3C)" style={{fontSize:"0.9rem",padding:"0.45rem 1.1rem"}}>Scare again! 😈</Btn></div>}
    </div>
  );
}

function ComedySection({user,onBack}){
  const [tab,setTab]=useState(()=>{try{return sessionStorage.getItem("mda_comedy_tab")||"jokes";}catch{return "jokes";}});
  const setTabP=t=>{setTab(t);try{sessionStorage.setItem("mda_comedy_tab",t);}catch{};};
  const [ji,setJi]=useState(0);const [showP,setShowP]=useState(false);const [laugh,setLaugh]=useState(false);
  const randJoke=()=>{setJi(Math.floor(Math.random()*JOKES.length));setShowP(false);}
  const reveal=()=>{setShowP(true);setLaugh(true);setTimeout(()=>setLaugh(false),900);}
  const j=JOKES[ji];
  const tabs2=[{id:"jokes",label:"😂 Jokes"},{id:"tongue",label:"👅 Twisters"},{id:"scare",label:"😱 Scare"},{id:"story",label:"📖 Stories"},{id:"imgquiz",label:"🖼️ Funny Images"}];
  return(
    <div style={{maxWidth:"680px",margin:"0 auto",position:"relative",zIndex:1}}>
      <BackBar onBack={onBack} label="Home" color="#FFD93D"/>
      <GText g="linear-gradient(135deg,#FFD93D,#FF9A3C,#FF6B6B)" size="2rem" style={{textAlign:"center",marginBottom:"0.75rem"}}>😂 Comedy Zone</GText>
      <div style={{display:"flex",justifyContent:"center",gap:"5px",marginBottom:"1rem",flexWrap:"wrap"}}>
        {tabs2.map(t=><button key={t.id} onClick={()=>setTabP(t.id)} style={{background:tab===t.id?"linear-gradient(135deg,#FFD93D,#FF9A3C)":"rgba(255,255,255,0.07)",color:"#fff",border:tab===t.id?"none":"1px solid rgba(255,255,255,0.18)",padding:"0.38rem 0.8rem",borderRadius:"30px",fontFamily:"'Fredoka One',cursive",cursor:"pointer",fontSize:"0.76rem",transition:"all 0.2s"}}>{t.label}</button>)}
      </div>
      <Card>
        {tab==="jokes"&&<div style={{textAlign:"center"}}>
          <div style={{fontSize:laugh?"5.5rem":"3.5rem",transition:"font-size 0.3s",marginBottom:"0.5rem"}}>🤣</div>
          <p style={{fontFamily:"'Fredoka One',cursive",fontSize:"1.12rem",color:"#fff",marginBottom:"0.75rem",lineHeight:1.45}}>{j.s}</p>
          {showP?<div style={{background:"rgba(255,211,61,0.1)",border:"1px solid rgba(255,211,61,0.28)",borderRadius:"14px",padding:"0.8rem",fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:"1rem",color:"#FFD93D",marginBottom:"0.75rem",animation:"slideUp 0.3s"}}>{j.p}</div>
          :<Btn onClick={reveal} g="linear-gradient(135deg,#FFD93D,#FF9A3C)" style={{marginBottom:"0.75rem",fontSize:"0.95rem"}}>Show Punchline 👀</Btn>}
          <Btn onClick={randJoke} g="linear-gradient(135deg,#FF6B6B,#A855F7)" style={{fontSize:"0.85rem",padding:"0.4rem 1rem"}}>Random Joke 🎲</Btn>
        </div>}
        {tab==="tongue"&&<TongueTwister/>}
        {tab==="scare"&&<FakeJumpScare/>}
        {tab==="story"&&<AIStoryGenerator name="MD ANAS" userName={user}/>}
        {tab==="imgquiz"&&<FunnyImageMCQ/>}
      </Card>
    </div>
  );
}
// ══════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════
// ── CODING SKILLS ────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// ── CODING SKILLS — with AI-powered live code runner ─────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

const CODING_LESSONS=[
  {id:"what",title:"What is Coding?",icon:"🌐",color:"#00D2FF",
    explanation:"Coding is giving step-by-step instructions to a computer. Just like a recipe tells you how to bake a cake, code tells the computer exactly what to do — in order!",
    analogy:"You are the chef and the computer is your kitchen helper. You write the recipe (code) and the helper follows it exactly, every single time.",
    lines:['print("Hello, World!")','print("My name is MD ANAS")','print("I love coding!")'],
    outLines:["Hello, World!","My name is MD ANAS","I love coding!"],
    challenge:"Change the message to say your own name!",
    tip:"Every programmer in the world started by printing Hello World!"},
  {id:"vars",title:"Variables",icon:"📦",color:"#A855F7",
    explanation:"A variable is like a labelled box where you store information. You give it a name, put something inside, and use it whenever you need it later.",
    analogy:"Imagine a box labelled 'name'. You put MD ANAS inside. Whenever you open that box, the answer is MD ANAS!",
    lines:['name = "MD ANAS"','age = 12','favourite = "Pizza"','','print(name)','print(age)','print(favourite)'],
    outLines:["MD ANAS","12","Pizza"],
    challenge:"Try changing name and favourite to your own values!",
    tip:"Variable names should describe what they hold. 'age' is much better than 'x'!"},
  {id:"ifelse",title:"If / Else — Decisions",icon:"🤔",color:"#FF9A3C",
    explanation:"Computers make decisions using IF and ELSE. If a condition is true, do one thing. Otherwise (else), do something different. This is how computers seem smart!",
    analogy:"It is like a fork in the road. IF it is raining, take an umbrella. ELSE (sunny), wear sunglasses!",
    lines:['weather = "rainy"','','if weather == "rainy":','    print("Take an umbrella!")','else:','    print("Wear sunglasses!")'],
    outLines:["Take an umbrella!"],
    challenge:"Change weather to 'sunny' and run again. What changes?",
    tip:"== (double equals) CHECKS if values match. = (single) SETS a value. Very different!"},
  {id:"loops",title:"Loops — Repetition",icon:"🔄",color:"#6BCB77",
    explanation:"A loop repeats an action many times automatically. Instead of writing the same line 100 times, you write it once and say how many times to repeat!",
    analogy:"Imagine clapping 5 times. Instead of writing 'clap' 5 times, a loop does it automatically. Computers never get tired!",
    lines:['for i in range(5):','    print("I love coding!")','','print("Loop done!")'],
    outLines:["I love coding!","I love coding!","I love coding!","I love coding!","I love coding!","Loop done!"],
    challenge:"Change range(5) to range(3) and see what happens!",
    tip:"range(5) gives 0,1,2,3,4 — that is 5 numbers, starting from ZERO!"},
  {id:"functions",title:"Functions — Reusable Code",icon:"⚡",color:"#FFD93D",
    explanation:"A function is a named block of code that does one specific job. Write it once and call it as many times as you want — like pressing a button!",
    analogy:"Think of a vending machine button. Press A1 and you always get a Coke without explaining it every time!",
    lines:['def greet(name):','    print("Hello, " + name + "!")','','greet("ANAS")','greet("Alexa")','greet("World")'],
    outLines:["Hello, ANAS!","Hello, Alexa!","Hello, World!"],
    challenge:"Add greet('your name') at the bottom and run it!",
    tip:"def is short for define. You are creating a brand new reusable command!"},
  {id:"lists",title:"Lists — Collections",icon:"📋",color:"#FF6FC8",
    explanation:"A list stores multiple items in one variable — like a shopping list. You can access items by their position number (index), starting from 0.",
    analogy:"A list is like a train. Carriage 0 is first, carriage 1 is second. Lists always count from 0, not 1!",
    lines:['fruits = ["Apple", "Banana", "Mango"]','','print(fruits[0])','print(fruits[2])','','fruits.append("Grape")','print(fruits)'],
    outLines:["Apple","Mango","['Apple', 'Banana', 'Mango', 'Grape']"],
    challenge:"Add your own fruit with append() and print the full list!",
    tip:"Position [0] is FIRST. If you have 3 items, the last one is at position [2]!"},
];

const CODE_QUIZ=[
  {q:"What does print() do in Python?",opts:["Prints on paper","Shows text on screen","Deletes code","Saves a file"],ans:1,exp:"print() displays text on the screen — it is how the computer shows you output!"},
  {q:"Which symbol checks if two values are EQUAL?",opts:["= one equals","== two equals","!= not equal",">= greater"],ans:1,exp:"== checks equality. A single = sets a value. They work very differently!"},
  {q:"What does a variable do?",opts:["Runs a loop","Stores information","Makes a decision","Creates a function"],ans:1,exp:"A variable stores information — like a labelled box you can open whenever needed!"},
  {q:"What does print(2 + 3) display?",opts:["2 + 3","23","5","Error"],ans:2,exp:"Python calculates 2+3=5 and displays the result. It does the maths for you!"},
  {q:"Which keyword creates a function?",opts:["function","func","def","create"],ans:2,exp:"def is short for define. Write: def my_function(): to create a new function!"},
  {q:"What numbers does range(4) produce?",opts:["1,2,3,4","0,1,2,3,4","0,1,2,3","4,3,2,1"],ans:2,exp:"range(4) gives 0,1,2,3 — starts at 0, goes up to but NOT including 4!"},
  {q:"How do you add to the END of a list?",opts:["list.add()","list.push()","list.append()","list.insert()"],ans:2,exp:".append() adds an item to the end of a list — the simplest way to grow it!"},
  {q:"What does an if statement do?",opts:["Repeats code","Stores a value","Checks a condition","Creates a function"],ans:2,exp:"if checks a condition. If True, it runs the code below it — making decisions!"},
];

// Syntax highlighter
function CodeLine({line}){
  if(line===undefined||line==="")return(<div style={{height:"1.6em"}}>&nbsp;</div>);
  const isComment=line.trimStart().startsWith("#");
  if(isComment)return(<div style={{color:"#8b949e",fontFamily:"'Courier New',monospace",fontSize:"0.9rem",lineHeight:1.8,whiteSpace:"pre"}}>{line}</div>);
  const KEYWORDS=["def ","for ","if ","else:","elif ","else","print","return","range","append","len","in ","import","from","class","while","True","False","None"];
  const parts=[];let pos=0,ki=0;
  const strRe=/(["'])(.*?)\1/g;let m;
  while((m=strRe.exec(line))!==null){
    const before=line.slice(pos,m.index);
    if(before){
      const hasKw=KEYWORDS.some(k=>before.includes(k));
      parts.push(<span key={ki++} style={{color:hasKw?"#79c0ff":"#e6edf3"}}>{before}</span>);
    }
    parts.push(<span key={ki++} style={{color:"#a5d6ff"}}>{m[0]}</span>);
    pos=m.index+m[0].length;
  }
  const tail=line.slice(pos);
  if(tail){
    const hasKw=KEYWORDS.some(k=>tail.includes(k));
    parts.push(<span key={ki++} style={{color:hasKw?"#79c0ff":"#e6edf3"}}>{tail}</span>);
  }
  return(<div style={{fontFamily:"'Courier New',monospace",fontSize:"0.9rem",lineHeight:1.8,whiteSpace:"pre"}}>{parts.length?parts:line}</div>);
}

// AI-powered Python runner using Claude API
function PythonRunner({lesson}){
  const [code,setCode]=useState(()=>lesson.lines.join("\n"));
  const [output,setOutput]=useState("");
  const [running,setRunning]=useState(false);
  const [error,setError]=useState("");
  const [ran,setRan]=useState(false);

  // Reset when lesson changes
  useEffect(()=>{
    setCode(lesson.lines.join("\n"));
    setOutput("");setError("");setRan(false);
  },[lesson.id]);

  const runCode=async()=>{
    if(running)return;
    setRunning(true);setOutput("");setError("");
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-6",
          max_tokens:500,
          messages:[{role:"user",content:
            `You are a Python interpreter for kids. Execute this Python code and show ONLY the output, exactly as Python would print it. Do not explain, do not add any extra text, just the raw output lines. If there is an error, start your response with ERROR: and explain it simply in one line.\n\nCode:\n\`\`\`python\n${code}\n\`\`\``
          }]
        })
      });
      const data=await res.json();
      const text=(data.content&&data.content[0]&&data.content[0].text)||"";
      if(text.startsWith("ERROR:")){setError(text.slice(6).trim());}
      else{setOutput(text.trim());}
      setRan(true);
    }catch(e){
      setError("Could not connect. Check your internet connection.");
    }
    setRunning(false);
  };

  const reset=()=>{setCode(lesson.lines.join("\n"));setOutput("");setError("");setRan(false);}

  const lineNums=code.split("\n");

  return(
    <div>
      <div style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.5)",
        fontSize:"0.78rem",marginBottom:"0.5rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span>📝 Edit and run Python code live:</span>
        <div style={{display:"flex",gap:"6px"}}>
          <button onClick={reset} style={{background:"rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.6)",
            border:"1px solid rgba(255,255,255,0.15)",borderRadius:"8px",padding:"2px 8px",
            fontFamily:"'Nunito',sans-serif",fontSize:"0.72rem",cursor:"pointer"}}>Reset</button>
        </div>
      </div>

      {/* Code editor */}
      <div style={{background:"#0d1117",borderRadius:"14px",border:"1px solid rgba(255,255,255,0.1)",
        marginBottom:"0.6rem",position:"relative",overflow:"hidden"}}>
        {/* Line numbers */}
        <div style={{display:"flex"}}>
          <div style={{padding:"1rem 0.5rem 1rem 0.75rem",background:"rgba(255,255,255,0.03)",
            borderRight:"1px solid rgba(255,255,255,0.06)",userSelect:"none",minWidth:"2rem",
            fontFamily:"'Courier New',monospace",fontSize:"0.85rem",lineHeight:1.8,
            color:"rgba(255,255,255,0.2)",textAlign:"right"}}>
            {lineNums.map((_,i)=><div key={i}>{i+1}</div>)}
          </div>
          <textarea
            value={code}
            onChange={e=>setCode(e.target.value)}
            spellCheck={false}
            style={{flex:1,padding:"1rem 1rem",background:"transparent",border:"none",
              color:"#e6edf3",fontFamily:"'Courier New',monospace",fontSize:"0.9rem",
              lineHeight:1.8,resize:"none",outline:"none",minHeight:"130px",
              overflowX:"auto",whiteSpace:"pre"}}
            rows={Math.max(4,lineNums.length)}
          />
        </div>
      </div>

      {/* Challenge hint */}
      <div style={{background:"rgba(255,211,61,0.08)",border:"1px solid rgba(255,211,61,0.22)",
        borderRadius:"10px",padding:"0.5rem 0.85rem",marginBottom:"0.6rem",
        fontFamily:"'Nunito',sans-serif",fontSize:"0.8rem",color:"rgba(255,255,255,0.6)"}}>
        🎯 <strong style={{color:"#FFD93D"}}>Challenge:</strong> {lesson.challenge}
      </div>

      {/* Run button */}
      <Btn onClick={runCode} disabled={running}
        g="linear-gradient(135deg,#6BCB77,#00D2FF)"
        style={{width:"100%",padding:"0.68rem",fontSize:"1rem",marginBottom:"0.75rem",
          animation:running?"none":"pulse 2s infinite"}}>
        {running?"⏳ Running your code...":"▶ Run Code"}
      </Btn>

      {/* Output */}
      {(output||error)&&(
        <div style={{background:error?"rgba(255,107,107,0.08)":"#161b22",
          border:`1px solid ${error?"rgba(255,107,107,0.3)":"rgba(107,203,119,0.3)"}`,
          borderRadius:"12px",padding:"0.8rem 1rem"}}>
          <div style={{fontFamily:"'Nunito',sans-serif",fontSize:"0.75rem",
            color:error?"#FF6B6B":"#6BCB77",marginBottom:"0.35rem",fontWeight:700}}>
            {error?"❌ Error:":"▶ Output:"}
          </div>
          <div style={{fontFamily:"'Courier New',monospace",fontSize:"0.88rem",
            color:error?"#FF6B6B":"#ffffff",lineHeight:1.85,whiteSpace:"pre-wrap"}}>
            {error||output}
          </div>
        </div>
      )}
      {ran&&!error&&(
        <div style={{marginTop:"0.5rem",fontFamily:"'Fredoka One',cursive",
          color:"#6BCB77",fontSize:"0.88rem",textAlign:"center",animation:"slideUp 0.3s"}}>
          🎉 Code ran successfully! Try editing and running again!
        </div>
      )}
    </div>
  );
}

function CodingLesson({lesson}){
  const [tab,setTab]=useState("explain");
  useEffect(()=>setTab("explain"),[lesson.id]);
  return(
    <div>
      <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"1rem"}}>
        <div style={{fontSize:"2.2rem"}}>{lesson.icon}</div>
        <div>
          <GText g={`linear-gradient(135deg,${lesson.color},#ffffffaa)`} size="1.3rem">{lesson.title}</GText>
          <div style={{fontFamily:"'Nunito',sans-serif",fontSize:"0.73rem",color:"rgba(255,255,255,0.35)",marginTop:"1px"}}>Python 🐍 — Beginner</div>
        </div>
      </div>

      <div style={{display:"flex",gap:"6px",marginBottom:"1rem",flexWrap:"wrap"}}>
        {[["explain","📖 Learn"],["run","▶ Run Code"],["practice","💡 Tips"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setTab(id)}
            style={{background:tab===id?`linear-gradient(135deg,${lesson.color},${lesson.color}88)`:"rgba(255,255,255,0.07)",
              color:"#fff",border:tab===id?"none":"1px solid rgba(255,255,255,0.15)",
              padding:"0.38rem 0.9rem",borderRadius:"20px",
              fontFamily:"'Fredoka One',cursive",cursor:"pointer",fontSize:"0.82rem",transition:"all 0.2s"}}>
            {lbl}
          </button>
        ))}
      </div>

      {tab==="explain"&&(
        <div>
          <div style={{background:`${lesson.color}18`,border:`1px solid ${lesson.color}44`,
            borderRadius:"14px",padding:"0.9rem 1rem",marginBottom:"0.75rem",
            fontFamily:"'Nunito',sans-serif",fontSize:"0.92rem",color:"rgba(255,255,255,0.88)",lineHeight:1.75}}>
            {lesson.explanation}
          </div>
          <div style={{background:"rgba(255,211,61,0.08)",border:"1px solid rgba(255,211,61,0.25)",
            borderRadius:"14px",padding:"0.8rem 1rem",marginBottom:"0.75rem",
            fontFamily:"'Nunito',sans-serif",fontSize:"0.88rem",color:"rgba(255,255,255,0.75)",lineHeight:1.7}}>
            <strong style={{color:"#FFD93D"}}>🎯 Analogy: </strong>{lesson.analogy}
          </div>
          {/* Read-only code preview */}
          <div style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.38)",
            fontSize:"0.75rem",marginBottom:"0.35rem"}}>👀 Code preview (go to Run Code to try it live):</div>
          <div style={{background:"#0d1117",border:"1px solid rgba(255,255,255,0.08)",
            borderRadius:"12px",padding:"0.85rem 1rem",marginBottom:"0.6rem",overflowX:"auto"}}>
            {lesson.lines.map((ln,i)=><CodeLine key={i} line={ln}/>)}
          </div>
          <div style={{background:"#161b22",border:"1px solid rgba(107,203,119,0.28)",
            borderRadius:"10px",padding:"0.7rem 1rem"}}>
            <div style={{fontFamily:"'Nunito',sans-serif",color:"#6BCB77",fontSize:"0.73rem",marginBottom:"0.3rem",fontWeight:700}}>▶ Expected output:</div>
            <div style={{fontFamily:"'Courier New',monospace",fontSize:"0.87rem",color:"#fff",lineHeight:1.85}}>
              {lesson.outLines.map((l,i)=><div key={i}>{l}</div>)}
            </div>
          </div>
        </div>
      )}

      {tab==="run"&&(
        <PythonRunner lesson={lesson}/>
      )}

      {tab==="practice"&&(
        <div>
          <div style={{background:`${lesson.color}18`,border:`1px solid ${lesson.color}44`,
            borderRadius:"14px",padding:"0.9rem 1rem",marginBottom:"0.75rem",
            fontFamily:"'Nunito',sans-serif",fontSize:"0.9rem",color:"rgba(255,255,255,0.82)",lineHeight:1.75}}>
            <strong style={{color:lesson.color}}>💡 Key Tip: </strong>{lesson.tip}
          </div>
          <div style={{background:"rgba(0,210,255,0.07)",border:"1px solid rgba(0,210,255,0.2)",
            borderRadius:"14px",padding:"1rem",fontFamily:"'Nunito',sans-serif",
            fontSize:"0.88rem",color:"rgba(255,255,255,0.7)",lineHeight:1.85}}>
            <strong style={{color:"#00D2FF",fontSize:"0.93rem"}}>🚀 Next steps:</strong><br/>
            Use the <strong style={{color:"#6BCB77"}}>Run Code tab</strong> to edit and run the example live!<br/>
            Try the challenge hint and experiment with different values.<br/><br/>
            <strong style={{color:"#FFD93D"}}>More practice (free sites):</strong><br/>
            <span style={{color:"#00D2FF"}}>trinket.io/python</span> — run Python instantly in browser<br/>
            <span style={{color:"#00D2FF"}}>replit.com</span> — full Python projects<br/>
            <span style={{color:"#00D2FF"}}>python.org/shell</span> — official Python shell
          </div>
        </div>
      )}
    </div>
  );
}

function CodeQuiz({onScore}){
  const S=useRef({cur:0,correct:0,sel:null,done:false,scored:false});
  const [disp,setDisp]=useState({cur:0,sel:null,correct:0,exp:null,done:false,pct:0});
  const reset=()=>{S.current={cur:0,correct:0,sel:null,done:false,scored:false};setDisp({cur:0,sel:null,correct:0,exp:null,done:false,pct:0});}
  const pick=useCallback((i)=>{
    if(S.current.sel!==null||S.current.done)return;
    S.current.sel=i;
    if(i===CODE_QUIZ[S.current.cur].ans)S.current.correct++;
    const expText=CODE_QUIZ[S.current.cur].exp;
    setDisp(d=>({...d,sel:i,correct:S.current.correct,exp:expText}));
    setTimeout(()=>{
      const nc=S.current.cur+1;
      if(nc>=CODE_QUIZ.length){
        const p=Math.round((S.current.correct/CODE_QUIZ.length)*100);
        S.current.done=true;
        if(!S.current.scored){S.current.scored=true;onScore("Coding",S.current.correct*12);}
        setDisp(d=>({...d,done:true,pct:p,exp:null}));
      }else{S.current.cur=nc;S.current.sel=null;setDisp(d=>({...d,cur:nc,sel:null,exp:null}));}
    },1700);
  },[onScore]);
  const q=CODE_QUIZ[disp.cur];
  const rLabel=disp.pct>=80?"🏆 Future Developer!":disp.pct>=60?"💻 Code Learner!":disp.pct>=40?"👍 Good start!":"😄 Keep learning!";
  return(
    <div>
      <GText g="linear-gradient(135deg,#00D2FF,#4D96FF)" style={{marginBottom:"0.75rem",textAlign:"center"}}>🧠 Coding Quiz</GText>
      {!disp.done?(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.45)",fontSize:"0.82rem",marginBottom:"0.6rem"}}>
            <span>Q {disp.cur+1}/{CODE_QUIZ.length}</span><span>✅ {disp.correct} correct</span>
          </div>
          <div style={{height:"5px",background:"rgba(255,255,255,0.08)",borderRadius:"3px",marginBottom:"0.85rem"}}>
            <div style={{height:"5px",background:"linear-gradient(90deg,#00D2FF,#4D96FF)",borderRadius:"3px",width:`${(disp.cur/CODE_QUIZ.length)*100}%`,transition:"width 0.5s"}}/>
          </div>
          <p style={{fontFamily:"'Fredoka One',cursive",fontSize:"1rem",color:"#fff",textAlign:"center",lineHeight:1.5,marginBottom:"1rem"}}>{q.q}</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"0.75rem"}}>
            {q.opts.map((o,i)=>{
              let bg="rgba(255,255,255,0.07)",bdr="1px solid rgba(255,255,255,0.14)",col="#fff";
              if(disp.sel!==null){if(i===q.ans){bg="rgba(107,203,119,0.28)";bdr="2px solid #6BCB77";col="#6BCB77";}else if(i===disp.sel&&i!==q.ans){bg="rgba(255,107,107,0.28)";bdr="2px solid #FF6B6B";col="#FF6B6B";}}
              return(<button key={i} onClick={()=>pick(i)} disabled={disp.sel!==null}
                style={{background:bg,border:bdr,borderRadius:"13px",padding:"0.65rem 0.4rem",
                  fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:"0.82rem",
                  cursor:disp.sel!==null?"default":"pointer",color:col,transition:"all 0.3s",lineHeight:1.4}}>{o}</button>);
            })}
          </div>
          {disp.exp&&(<div style={{background:"rgba(0,210,255,0.1)",border:"1px solid rgba(0,210,255,0.3)",borderRadius:"12px",padding:"0.65rem 1rem",fontFamily:"'Nunito',sans-serif",fontSize:"0.85rem",color:"#B2EEFF",animation:"slideUp 0.3s",lineHeight:1.6}}>💡 {disp.exp}</div>)}
        </div>
      ):(
        <div style={{textAlign:"center",padding:"1rem 0"}}>
          <div style={{fontSize:"3.5rem",marginBottom:"0.5rem",animation:"bounce 0.6s"}}>{disp.pct>=80?"🏆":disp.pct>=60?"💻":disp.pct>=40?"👍":"😄"}</div>
          <GText g="linear-gradient(135deg,#00D2FF,#4D96FF)" size="1.5rem" style={{marginBottom:"0.3rem"}}>{disp.correct}/{CODE_QUIZ.length} Correct!</GText>
          <div style={{fontFamily:"'Fredoka One',cursive",color:"#FFD93D",marginBottom:"0.75rem"}}>{disp.pct}% — {rLabel}</div>
          <div style={{background:"rgba(0,210,255,0.1)",border:"1px solid rgba(0,210,255,0.28)",borderRadius:"14px",padding:"0.7rem",margin:"0.5rem 0 1rem"}}>
            <span style={{color:"rgba(255,255,255,0.5)",fontSize:"0.88rem",fontFamily:"'Nunito',sans-serif"}}>Points: </span>
            <span style={{fontFamily:"'Fredoka One',cursive",color:"#00D2FF",fontSize:"1.3rem"}}>{disp.correct*12} ✨</span>
          </div>
          <Btn onClick={reset} g="linear-gradient(135deg,#00D2FF,#4D96FF)" style={{animation:"pulse 1.5s infinite"}}>Try Again! 🔄</Btn>
        </div>
      )}
    </div>
  );
}

function CodingSkills({onScore,onBack}){
  const [tab,setTab]=useState(()=>{try{return sessionStorage.getItem("mda_coding_tab")||"lessons";}catch{return "lessons";}});
  const setTabP=t=>{setTab(t);try{sessionStorage.setItem("mda_coding_tab",t);}catch{};};
  const [lessonIdx,setLessonIdx]=useState(()=>{try{return parseInt(sessionStorage.getItem("mda_coding_lesson")||"0");}catch{return 0;}});
  const setLessonIdxP=i=>{setLessonIdx(i);try{sessionStorage.setItem("mda_coding_lesson",String(i));}catch{};};
  const [completed,setCompleted]=useState(new Set());
  const lesson=CODING_LESSONS[lessonIdx];
  const markDone=()=>{
    setCompleted(prev=>{const s=new Set(prev);s.add(lessonIdx);return s;});
    if(lessonIdx<CODING_LESSONS.length-1)setLessonIdxP(lessonIdx+1);
  };
  return(
    <div style={{position:"relative",zIndex:1}}>
      <BackBar onBack={onBack} label="Home" color="#00D2FF"/>
      <GText g="linear-gradient(135deg,#00D2FF,#4D96FF,#A855F7)" size="2rem" style={{textAlign:"center",marginBottom:"0.4rem"}}>💻 Coding Skills</GText>
      <p style={{textAlign:"center",fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.45)",fontSize:"0.82rem",marginBottom:"1rem"}}>
        Learn Python step by step and run code live! 🐍 Zero experience needed.
      </p>
      <div style={{display:"flex",justifyContent:"center",gap:"8px",marginBottom:"1.25rem"}}>
        {[["lessons","📖 Lessons"],["quiz","🧠 Quiz"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setTabP(id)}
            style={{background:tab===id?"linear-gradient(135deg,#00D2FF,#4D96FF)":"rgba(255,255,255,0.07)",color:"#fff",
              border:tab===id?"none":"1px solid rgba(255,255,255,0.18)",padding:"0.45rem 1.3rem",
              borderRadius:"30px",fontFamily:"'Fredoka One',cursive",cursor:"pointer",fontSize:"0.9rem",transition:"all 0.2s"}}>
            {lbl}
          </button>
        ))}
      </div>
      {tab==="lessons"&&(
        <div style={{maxWidth:"640px",margin:"0 auto"}}>
          <div style={{display:"flex",gap:"6px",flexWrap:"wrap",justifyContent:"center",marginBottom:"1rem"}}>
            {CODING_LESSONS.map((l,i)=>(
              <button key={i} onClick={()=>setLessonIdxP(i)}
                style={{background:lessonIdx===i?`linear-gradient(135deg,${l.color},${l.color}88)`:completed.has(i)?"rgba(107,203,119,0.2)":"rgba(255,255,255,0.06)",
                  color:"#fff",border:`1px solid ${lessonIdx===i?l.color:completed.has(i)?"rgba(107,203,119,0.45)":"rgba(255,255,255,0.13)"}`,
                  borderRadius:"20px",padding:"0.38rem 0.8rem",fontFamily:"'Fredoka One',cursive",
                  cursor:"pointer",fontSize:"0.75rem",transition:"all 0.2s",whiteSpace:"nowrap"}}>
                {completed.has(i)?"✅":l.icon} {l.title}
              </button>
            ))}
          </div>
          <Card key={lesson.id} style={{background:`linear-gradient(135deg,${lesson.color}0d,rgba(255,255,255,0.03))`,border:`1px solid ${lesson.color}33`}}>
            <CodingLesson lesson={lesson}/>
            <div style={{marginTop:"1.25rem",textAlign:"center",borderTop:"1px solid rgba(255,255,255,0.08)",paddingTop:"1rem"}}>
              <Btn onClick={markDone} g={`linear-gradient(135deg,${lesson.color},#FFD93D)`}>
                {completed.has(lessonIdx)?"✅ Done — Next Lesson ▶":"Mark Complete & Continue →"}
              </Btn>
            </div>
          </Card>
          <div style={{textAlign:"center",marginTop:"0.75rem",fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.3)",fontSize:"0.77rem"}}>
            {completed.size}/{CODING_LESSONS.length} lessons done{completed.size===CODING_LESSONS.length?" 🎓 Python Beginner Complete!":""}
          </div>
        </div>
      )}
      {tab==="quiz"&&(
        <Card style={{maxWidth:"560px",margin:"0 auto"}}><CodeQuiz onScore={onScore}/></Card>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// ── ENGLISH LEARNING SECTION ─────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

const ENG={
  class1:{label:"Class 1",emoji:"🌱",color:"#6BCB77",desc:"🎈 Letters, sounds & silly words — the funnest start ever!",
    topics:{
      alphabet:{title:"Alphabet Party",icon:"🔤",
        lessons:[
          {title:"Big & Small Letter Twins",expl:"Every letter has a BIG cousin and a small cousin! Like A and a — they're the same letter wearing different sized hats! 🎩 Big letters love to start sentences and names.",
           examples:["A → a (Awesome Apple 🍎)","B → b (Bouncy Ball 🏀)","C → c (Cool Cat 😎🐱)","D → d (Dancing Dog 💃🐶)","E → e (Eggcellent Egg 🥚)"],
           tip:"Trace each letter in the air like a superhero drawing in the sky! ✨",
           funFact:"The letter 'E' is the superstar of English — it shows up more than any other letter! 🌟"},
          {title:"Vowel Squad & Consonant Crew",expl:"Meet the VOWEL SQUAD: A, E, I, O, U — only 5 of them but they're in almost every word! The other 21 letters are the CONSONANT CREW. Vowels are the singers, consonants are the dancers! 🎤",
           examples:["Vowel Squad: A E I O U 🎵","Apple = A is a vowel! ✅","Ball = B is a consonant 🕺","Igloo = I is a vowel! ❄️","Umbrella = U is a vowel! ☂️"],
           tip:"Remember the squad with: All Elephants Improve Our Underpants! 🐘😂",
           funFact:"Some words have NO vowels at all, like 'shh' and 'brr'! Sneaky! 🤫"},
          {title:"The ABC Race",expl:"The alphabet always lines up in the same order — A is the leader, Z is the last one in line! Knowing the order helps you find words in dictionaries super fast. 🏁",
           examples:["A B C D E F G 🎶","H I J K L-M-N-O-P (sing it fast!)","Q R S T U V","W X Y and Z!","Apple races BEFORE Banana 🍎💨🍌"],
           tip:"Sing the ABC song in a silly voice — robot, monster, or squeaky mouse! 🤖",
           funFact:"The word 'alphabet' comes from the first two Greek letters: alpha + beta! 🇬🇷"},
        ],
        quiz:[
          {q:"Which of these is a VOWEL?",opts:["B","C","A","D"],ans:2,exp:"🎉 YES! A is part of the Vowel Squad: A E I O U!"},
          {q:"How many letters dance in the alphabet?",opts:["24","25","26","27"],ans:2,exp:"🎯 26 letters — a whole alphabet party!"},
          {q:"Which letter zooms in AFTER D?",opts:["C","F","E","G"],ans:2,exp:"⚡ A-B-C-D-E! E comes zooming right after D!"},
          {q:"How many vowels are in the squad?",opts:["3","4","5","6"],ans:2,exp:"🌟 5 vowels: A, E, I, O, U — the famous five!"},
          {q:"Which one is a CONSONANT?",opts:["A","E","I","B"],ans:3,exp:"🕺 B is a consonant! Only A E I O U are vowels!"},
        ]
      },
      phonics:{title:"Sound Safari",icon:"🔊",
        lessons:[
          {title:"Letter Sounds Adventure A–M",expl:"Every letter makes its own funny noise! 🎺 When you squish the sounds together, BOOM — you can read a word! This magic trick is called phonics. Let's go on a sound safari! 🦁",
           examples:["A growls /æ/ — Apple 🍎","B pops /b/ — Ball 🏀","C clicks /k/ — Cat 🐱","D drums /d/ — Dog 🥁🐶","M hums /m/ — Moon 🌙"],
           tip:"Make each sound LOUD and silly — be a sound monster! 👹",
           funFact:"Babies start copying letter sounds before they can even say words! 👶"},
          {title:"Letter Sounds Adventure N–Z",expl:"More sound creatures to catch! 🦋 Once you know all 26 sounds, you have a superpower — you can read almost ANY word by blending the sounds together!",
           examples:["N taps /n/ — Nest 🪺","P puffs /p/ — Pig 🐷","S hisses /s/ — Snake 🐍","T ticks /t/ — Tree 🌳","Z buzzes /z/ — Zebra 🦓"],
           tip:"Blend like a smoothie! /c/ + /a/ + /t/ = CAT 🥤 Yum, you read it!",
           funFact:"'Z' is called 'zed' in Britain but 'zee' in America — same letter, two names! 🌍"},
          {title:"Short Vowel Silliness",expl:"Short vowels make quick little sounds — like a hiccup! 😆 They're hiding in tons of fun words. Most short words go consonant-vowel-consonant, like c-a-t!",
           examples:["Short A: c-A-t, b-A-t, h-A-t 🎩","Short E: b-E-d, r-E-d, w-E-t 💦","Short I: b-I-g, p-I-g, d-I-g 🐷","Short O: d-O-g, h-O-t, p-O-t 🍲","Short U: b-U-s, c-U-p, m-U-d 🚌"],
           tip:"Say 'cat, pin, hot, bug' really fast 5 times — tongue twister fun! 👅",
           funFact:"The shortest complete sentence in English is 'I am.' — tiny but mighty! 💪"},
        ],
        quiz:[
          {q:"What silly sound does 'B' make?",opts:["/d/","/b/","/p/","/m/"],ans:1,exp:"💥 /b/! Bouncy Ball, Big Bear — pop pop pop!"},
          {q:"Which word has a SHORT A hiccup?",opts:["cake","rain","cat","play"],ans:2,exp:"🐱 CAT! c-A-t — quick and short!"},
          {q:"What sound does the snake 'S' make?",opts:["/sh/","/z/","/s/","/t/"],ans:2,exp:"🐍 /s/ — sssssuper hissy!"},
          {q:"Which word has a SHORT U?",opts:["cute","mule","cup","blue"],ans:2,exp:"☕ CUP! c-U-p — short and sweet!"},
          {q:"Which letter HUMS the /m/ sound?",opts:["N","W","M","R"],ans:2,exp:"🌙 M! Mmmmoon, Mmmmilk — hummy yummy!"},
        ]
      },
      sightwords:{title:"Word Superstars",icon:"⭐",
        lessons:[
          {title:"Words You Just KNOW",expl:"Some words pop up SO much that your brain learns them by heart — no sounding out needed! 🧠✨ They're like best friends you spot instantly in a crowd!",
           examples:["the, a, is, it, in 👋","I, he, she, we, you","and, but, or, so","can, go, see, get","here, there, what, when"],
           tip:"Turn them into flashcards and play 'snap' with a friend! 🃏",
           funFact:"The word 'the' is the MOST used word in all of English! 👑"},
          {title:"Doing-Word Superstars",expl:"Lots of superstar words are ACTION words! 🏃 They tell you what's happening — running, jumping, giggling! You'll see them everywhere.",
           examples:["run, jump, hop, skip 🦘","eat, drink, sleep, play 😴","read, write, sing, dance 💃","give, take, make, help","like, want, need, love ❤️"],
           tip:"Act out each word like you're in a game of charades! 🎭",
           funFact:"'Jump' and 'bump' rhyme AND both make you giggle when you do them! 😂"},
          {title:"Rainbow & Counting Words",expl:"Colours and numbers are everywhere — in your crayon box, on your fingers, in the sky! 🌈 Learn these and you can describe the whole wide world!",
           examples:["red, blue, green, yellow 🟡","pink, purple, orange 🟠","one, two, three 🖐️","four, five, six...","seven, eight, nine, TEN! 🔟"],
           tip:"Count everything you see today in English — toes, snacks, stars! ⭐",
           funFact:"A rainbow always has its colours in the same order — red is always on top! 🌈"},
        ],
        quiz:[
          {q:"Which is a superstar sight word?",opts:["xylophone","the","chrysanthemum","unfortunately"],ans:1,exp:"👑 'the' — the #1 word champion of English!"},
          {q:"What colour is 'red'?",opts:["🟦","🟩","🔴","🟨"],ans:2,exp:"🔴 RED — like apples, fire trucks, and superheroes!"},
          {q:"Which word means zooming on your feet?",opts:["sleep","sit","run","eat"],ans:2,exp:"🏃 RUN! Zoom zoom, off you go!"},
          {q:"How do you write the number 5?",opts:["four","six","five","three"],ans:2,exp:"🖐️ FIVE — like the fingers on your hand!"},
          {q:"What's the OPPOSITE of 'black'?",opts:["dark","grey","white","blue"],ans:2,exp:"⚪ WHITE — like snow, clouds, and marshmallows!"},
        ]
      },
      sentences:{title:"Sentence Builders",icon:"🧱",
        lessons:[
          {title:"What Makes a Sentence?",expl:"A sentence is a complete idea — like a tiny finished LEGO build! 🧱 It starts with a BIG capital letter and ends with a dot, a question mark, or an excited mark!",
           examples:["The cat is fluffy. 🐱","I love pizza! 🍕","Do you like dinosaurs? 🦕","we play (oops! no capital, no dot ❌)","the dog (oops! not a full idea ❌)"],
           tip:"Check: BIG start? Ending mark? Full idea? Then high-five, it's a sentence! 🙌",
           funFact:"The longest sentence ever printed has over 13,000 words — yikes! 😵"},
          {title:"Who + Does What",expl:"Every sentence needs a WHO (the star) and a DOING word (the action)! 🌟 'The dog runs' — dog is the star, runs is the action. Easy peasy!",
           examples:["The dog RUNS 🐶💨","Birds FLY 🐦","I EAT cake 🍰","She SINGS 🎤","Frogs JUMP 🐸"],
           tip:"Point at the action word and shout it — find the DOING word! 📣",
           funFact:"'Go' is one of the tiniest action words but one of the most used! 🏃"},
          {title:"Asking Questions",expl:"Questions are sentences that want an ANSWER! ❓ They love to start with words like Who, What, Where, When, Why, and How — the curious question crew!",
           examples:["What is your name? 🙋","Where is my toy? 🧸","Can you jump high? 🦘","Why is the sky blue? 🌤️","How do birds fly? 🐦"],
           tip:"If your sentence is curious and wants an answer — give it a ? hat! 🎩",
           funFact:"'Why' is the favourite question of kids everywhere — ask it 100 times a day! 😆"},
        ],
        quiz:[
          {q:"Which is a COMPLETE sentence?",opts:["runs fast","The dog runs fast.","the dog","fast dog"],ans:1,exp:"🙌 'The dog runs fast.' — big start, full idea, dot at the end!"},
          {q:"Every sentence ends with...?",opts:["a comma","a capital","a . ! or ?","a space"],ans:2,exp:"🎯 An ending mark: . ! or ? — every time!"},
          {q:"In 'The cat sleeps.' what's the DOING word?",opts:["The","cat","sleeps","(none)"],ans:2,exp:"😴 SLEEPS — that's the action the cat is doing!"},
          {q:"Which word starts a QUESTION?",opts:["The","Because","What","Very"],ans:2,exp:"❓ WHAT — a curious question word!"},
          {q:"Which has the CAPITAL in the right spot?",opts:["the bird sings.","The bird sings.","the Bird sings.","THE bird sings."],ans:1,exp:"✅ 'The bird sings.' — capital only at the start!"},
        ]
      },
      stories:{title:"Story Time Fun",icon:"📖",
        lessons:[
          {title:"Diving Into Stories",expl:"Stories take you on adventures without leaving your chair! 🚀 Read them out loud with funny voices to make them extra fun. Every story is a mini movie in your head! 🎬",
           examples:["Tom has a red ball. 🔴","He plays in the sunny park. ☀️","The ball bounces super high! ⬆️","Tom giggles and runs after it. 😄","What a fun day! 🎉"],
           tip:"Give every character a silly voice when you read — be a one-kid show! 🎭",
           funFact:"Reading just 20 minutes a day means you'll meet over 1 million words a year! 📚"},
          {title:"Story Stars & Places",expl:"Every story has CHARACTERS (the stars!) and a SETTING (where it all happens). 🌟 Spotting them is like being a story detective! 🕵️",
           examples:["Star: Tom (the hero!) 🦸","Sidekick: Spot the dog 🐶","Setting: the bouncy park 🏞️","When: a sunny afternoon ☀️","Action: chasing the ball! 🏃"],
           tip:"Ask: WHO is in the story? WHERE are they? You're a detective now! 🔍",
           funFact:"The most famous story character ever might be Mickey Mouse — known worldwide! 🐭"},
          {title:"Being a Story Detective",expl:"Great readers don't just read — they THINK! 🤔 Ask yourself questions while you read to become a super-reader detective who understands everything!",
           examples:["What happened FIRST? 1️⃣","What happened NEXT? ➡️","How does the hero FEEL? 😊😢","What's the lesson? 💡","What might happen next? 🔮"],
           tip:"Draw your favourite story scene — if you can draw it, you GET it! 🎨",
           funFact:"Your brain makes pictures while you read — it's like having a built-in cinema! 🎥"},
        ],
        quiz:[
          {q:"What is a story CHARACTER?",opts:["The place it happens","A person or animal in the story","A full stop","The book title"],ans:1,exp:"🌟 A character is a story star — a person or animal in the tale!"},
          {q:"Where a story happens is the...?",opts:["character","plot","setting","title"],ans:2,exp:"🏞️ The SETTING — like a park, castle, or jungle!"},
          {q:"Every sentence starts with a...?",opts:["full stop","comma","capital letter","question mark"],ans:2,exp:"🔠 A big CAPITAL letter — standing tall and proud!"},
          {q:"Questions end with a...?",opts:[".","!","?",","],ans:2,exp:"❓ A question mark — the curious squiggle!"},
          {q:"Reading aloud helps you...?",opts:["write faster","understand and hear words better","draw pictures","run faster"],ans:1,exp:"🗣️ It helps you HEAR and understand the words — super power!"},
        ]
      },
      grammar1:{title:"Grammar Goodies",icon:"🍬",
        lessons:[
          {title:"Naming Words (Nouns)",expl:"NOUNS are naming words — they name people, places, animals, and things! 🏷️ Look around: everything you can see has a noun name. It's like everything wears a name tag!",
           examples:["People: mum, friend, teacher 👩","Places: park, school, beach 🏖️","Animals: cat, lion, penguin 🐧","Things: ball, cake, robot 🤖","Even feelings: love, joy ❤️"],
           tip:"Play 'I Spy' — everything you spy is a noun! 👀",
           funFact:"There are more nouns in English than any other type of word — name overload! 🏷️"},
          {title:"Action Words (Verbs)",expl:"VERBS are doing words — they show ACTION! 💥 Run, jump, giggle, sneeze! Every sentence needs a verb or it just sits there doing nothing. Verbs make sentences ALIVE!",
           examples:["run, jump, fly ✈️","eat, gulp, munch 🍔","giggle, laugh, grin 😄","splash, jump, dive 🏊","zoom, race, dash 🏎️"],
           tip:"Ask 'What's happening?' — the answer is your verb! ⚡",
           funFact:"The verb 'set' has over 400 different meanings — the busiest verb ever! 😲"},
          {title:"Describing Words (Adjectives)",expl:"ADJECTIVES are describing words — they make nouns more EXCITING! 🎨 Not just a dog, a FLUFFY GIANT dog! They sprinkle colour and detail everywhere.",
           examples:["big dog, tiny ant 🐜","red apple, blue whale 🐋","happy clown, grumpy cat 😾","fast rocket, slow snail 🐌","yummy, smelly, sparkly ✨"],
           tip:"Describe your lunch with 3 adjectives — yummy, crunchy, gigantic! 🥪",
           funFact:"You could describe a pizza with 100 adjectives and still want more — cheesy, gooey, hot! 🍕"},
        ],
        quiz:[
          {q:"Which word is a NOUN (naming word)?",opts:["run","happy","quickly","dog"],ans:3,exp:"🐶 DOG — it names an animal! That's a noun!"},
          {q:"Which word is a VERB (action word)?",opts:["beautiful","apple","jump","slowly"],ans:2,exp:"🦘 JUMP — boing boing, that's an action!"},
          {q:"In 'the BIG elephant', the describing word is...?",opts:["the","big","elephant","(none)"],ans:1,exp:"🐘 BIG — it describes the elephant!"},
          {q:"Which word names a PLACE?",opts:["bird","school","green","sing"],ans:1,exp:"🏫 SCHOOL — a place you can go to!"},
          {q:"Adjectives are used to...?",opts:["name things","show action","describe things","ask questions"],ans:2,exp:"🎨 DESCRIBE things — making them colourful and fun!"},
        ]
      }
    }
  },
  class2:{label:"Class 2",emoji:"🌿",color:"#00D2FF",desc:"🚀 Word wizardry, story detective skills & writing magic!",
    topics:{
      vocabulary:{title:"Word Wizardry",icon:"🧙",
        lessons:[
          {title:"Same-Meaning Twins (Synonyms)",expl:"SYNONYMS are words that mean almost the SAME thing — like word twins! 👯 Instead of saying 'big' every time, you can say huge, giant, enormous! It makes your talking way more exciting!",
           examples:["happy = glad, joyful, cheerful 😄","big = huge, giant, massive 🦣","fast = quick, speedy, zippy ⚡","sad = gloomy, blue, down 😢","scared = afraid, spooked 👻"],
           tip:"Next time you say 'good', try 'awesome' or 'fantastic' instead! 🌟",
           funFact:"English has more synonyms than almost any language — over 1 million words to pick from! 🤯"},
          {title:"Opposite Buddies (Antonyms)",expl:"ANTONYMS are opposite words — total opposites that battle each other! ⚔️ Hot vs cold, day vs night! Learn one and you secretly learn two words at once!",
           examples:["hot ↔ cold 🔥❄️","day ↔ night ☀️🌙","big ↔ small 🐘🐜","happy ↔ sad 😄😢","fast ↔ slow 🐆🐢"],
           tip:"Play opposite day — say the opposite of everything! Up means down! 🙃",
           funFact:"Adding 'un' flips a word to its opposite: happy → unhappy! Magic switch! 🪄"},
          {title:"Word Families",expl:"Word FAMILIES all share the same root — like a family sharing a last name! 👨‍👩‍👧 'Play' has cousins: player, playing, playground! Spot the root and you know the whole family!",
           examples:["play → player, playing, playground 🎮","run → runner, running, runway 🏃","jump → jumper, jumping, jumped 🦘","help → helper, helpful, helping 🤝","teach → teacher, teaching 👩‍🏫"],
           tip:"Find the hidden root word inside each big word — like a word X-ray! 🩻",
           funFact:"The root 'play' can make over 20 different words — what a big family! 👨‍👩‍👧‍👦"},
        ],
        quiz:[
          {q:"Which is a SYNONYM (twin) of 'happy'?",opts:["sad","angry","joyful","tired"],ans:2,exp:"😄 JOYFUL — a happy twin word!"},
          {q:"What's the OPPOSITE buddy of 'hot'?",opts:["warm","mild","cold","boiling"],ans:2,exp:"❄️ COLD — the total opposite of hot!"},
          {q:"Which word is in the 'run' family?",opts:["writing","runner","player","jumper"],ans:1,exp:"🏃 RUNNER — run + ner = a person who runs!"},
          {q:"'Huge' and 'enormous' are...?",opts:["antonyms","rhymes","synonyms","verbs"],ans:2,exp:"🦣 SYNONYMS — both mean super big!"},
          {q:"The opposite of 'always' is...?",opts:["sometimes","often","usually","never"],ans:3,exp:"🚫 NEVER — the total opposite of always!"},
        ]
      },
      comprehension:{title:"Story Detective",icon:"🕵️",
        lessons:[
          {title:"Sniffing Out the Big Idea",expl:"The MAIN IDEA is what a story is MOSTLY about — the big juicy point! 🍔 It's like the title of a movie. If you can say it in one sentence, you've cracked the case, detective! 🔍",
           examples:["Story about lions → Big idea: lions are powerful! 🦁","Story about sharing → Big idea: sharing is caring! 🤝","Story about rain → Big idea: how rain works 🌧️","Ask: what's this MOSTLY about?","The big idea is bigger than one tiny detail!"],
           tip:"Pretend you're telling a friend the story in ONE sentence — that's the big idea! 💬",
           funFact:"Detectives and readers use the same skill — looking for the most important clue! 🔎"},
          {title:"Hunting for Clues (Details)",expl:"DETAILS are the little clues that back up the big idea! 🔬 They answer Who, What, Where, When, Why and How. Good detectives circle every clue they find!",
           examples:["Big idea: Dogs are loyal. Clue: they wait by the door 🐶","Big idea: Exercise is great. Clue: it makes you strong 💪","Numbers and names are usually clues 🔢","Clues SUPPORT the big idea","Underline clues like a real detective! ✏️"],
           tip:"Grab a pencil and circle the juicy clues — names, numbers, facts! 🖍️",
           funFact:"Your eyes jump around the page in tiny hops called 'saccades' while reading — boing! 👀"},
          {title:"Reading Between the Lines",expl:"Sometimes stories don't TELL you everything — you have to be clever and GUESS using clues! 🧠 This smart guessing is called inferring. It's like reading a character's mind!",
           examples:["'Maria grabbed her umbrella.' → It's raining! ☔","'Tom smiled at his test.' → He did great! 😁","'The dog hid under the bed.' → It's scared! 😨","Clues + your brain = smart guess! 🧠","You're reading the SECRET message!"],
           tip:"Be a mind-reader — use clues to guess what's REALLY going on! 🔮",
           funFact:"Your brain fills in missing info automatically — that's why you can read msng vwls! 😉"},
        ],
        quiz:[
          {q:"The MAIN IDEA is...?",opts:["the longest sentence","what it's mostly about","the first word","a tiny detail"],ans:1,exp:"🍔 What the story is MOSTLY about — the big juicy point!"},
          {q:"Details (clues) help to...?",opts:["replace the big idea","confuse you","support the big idea","change the topic"],ans:2,exp:"🔬 They SUPPORT the big idea with juicy clues!"},
          {q:"'She put on sunscreen.' What can you GUESS?",opts:["It's raining","It's sunny and hot","It's cold","It's night"],ans:1,exp:"☀️ It's SUNNY! Smart detective work!"},
          {q:"The clue-finding question words are...?",opts:["Why What How Much","Who What Where When Why","Big Small Fast","Red Blue Green"],ans:1,exp:"🔍 Who What Where When Why — the clue crew!"},
          {q:"Reading 'between the lines' means...?",opts:["reading slowly","guessing using clues","reading twice","skipping words"],ans:1,exp:"🔮 GUESSING smartly using clues — mind-reader mode!"},
        ]
      },
      grammar2:{title:"Grammar Power-Ups",icon:"💪",
        lessons:[
          {title:"One vs Many (Plurals)",expl:"ONE is singular, MANY is plural! 🎈 Add -s to make most words plural: one cat, two cats! But watch out — some words are sneaky shapeshifters! 🦎",
           examples:["cat → cats, dog → dogs 🐶🐶","box → boxes, fox → foxes 🦊","Sneaky! child → children 👶","Sneaky! foot → feet 🦶","Sneaky! mouse → mice 🐭"],
           tip:"Most words just need an -s, but learn the sneaky shapeshifters! 🦎",
           funFact:"'Sheep' stays 'sheep' even when there are 100 of them — lazy plural! 🐑"},
          {title:"Replacing Words (Pronouns)",expl:"PRONOUNS are stand-in words so you don't repeat names a zillion times! 🎬 Instead of 'Tom likes Tom's toy', say 'He likes HIS toy.' Pronouns save the day!",
           examples:["Ram is tall. HE plays cricket. 🏏","Sara sings. SHE is amazing. 🎤","The toy is fun. IT is mine! 🧸","Friends came. THEY played. 👫","I, you, we, they, he, she, it"],
           tip:"Pronouns are word-superheroes that rescue you from repeating! 🦸",
           funFact:"'I' is the only word that's always written as a CAPITAL, anywhere in a sentence! 👑"},
          {title:"Now vs Before (Tenses)",expl:"TENSE tells you WHEN something happens! ⏰ NOW = present (I play). BEFORE = past (I played). Most past words add -ed, but some are time-travelling rebels! 🕰️",
           examples:["Now: I eat 🍽️ → Before: I ate","Now: I run 🏃 → Before: I ran","Now: I jump → Before: I jumped","Rebel! go → went 🚶","Rebel! see → saw 👀"],
           tip:"Add -ed for past... unless it's a rebel word! Learn the rebels! 😎",
           funFact:"English has no real 'future tense' — we cheat and use 'will'! Sneaky language! 😏"},
        ],
        quiz:[
          {q:"The plural of 'child' is...?",opts:["childs","childes","childen","children"],ans:3,exp:"👶 CHILDREN — a sneaky shapeshifter plural!"},
          {q:"'Sara is kind. ___ helps everyone.'",opts:["He","They","She","It"],ans:2,exp:"🎤 SHE — the stand-in word for Sara!"},
          {q:"'I eat.' is which time?",opts:["past","future","present (now)","never"],ans:2,exp:"⏰ PRESENT — happening right now!"},
          {q:"The past tense of 'run' is...?",opts:["runned","runs","running","ran"],ans:3,exp:"🏃 RAN — a time-travelling rebel word!"},
          {q:"Which uses a pronoun correctly?",opts:["Tom he is tall.","Tom is tall. He plays well.","He Tom runs.","Is he Tom?"],ans:1,exp:"🦸 'Tom is tall. He plays well.' — He rescues us from repeating!"},
        ]
      },
      writing2:{title:"Writing Magic",icon:"✨",
        lessons:[
          {title:"Building a Paragraph Sandwich",expl:"A PARAGRAPH is a group of sentences about ONE idea — like a tasty sandwich! 🥪 Top bread = topic sentence, fillings = details, bottom bread = the wrap-up. Yum!",
           examples:["🍞 Top: Dogs are the best pets!","🥬 Filling: They are loyal.","🧀 Filling: They protect your home.","🍅 Filling: They love to play!","🍞 Bottom: That's why dogs rule!"],
           tip:"Build your paragraph like a sandwich — don't forget both slices of bread! 🥪",
           funFact:"The word 'sandwich' is named after a guy — the Earl of Sandwich! True story! 🎩"},
          {title:"Painting With Words",expl:"Descriptive writing paints PICTURES in the reader's mind using the 5 senses! 🎨 What do you see, hear, smell, taste, and touch? Sprinkle these in to make writing POP!",
           examples:["👀 See: the shiny red rose","👂 Hear: leaves go rustle-rustle","👃 Smell: warm yummy bread 🍞","✋ Touch: soft fluffy kitten 🐱","👅 Taste: sweet juicy mango 🥭"],
           tip:"Describe your snack using 2 senses — crunchy AND salty! 🥨",
           funFact:"Your nose can smell over 1 trillion different scents — super sniffer! 👃"},
          {title:"Writing Awesome Stories",expl:"A great story has a BEGINNING (meet the heroes), MIDDLE (uh oh, a problem!), and END (problem solved, hooray!). 🎬 Plan these three parts and your story will rock!",
           examples:["🎬 Begin: Lily finds a lost puppy 🐶","😮 Middle: She searches the whole town","🎉 End: She finds the owner — yay!","Give heroes fun names! 🦸","Add feelings and funny bits! 😂"],
           tip:"Plan beginning-middle-end FIRST, like a treasure map for your story! 🗺️",
           funFact:"J.K. Rowling planned Harry Potter for 5 years before writing it! Big plan! ⚡"},
        ],
        quiz:[
          {q:"What's the 'top bread' of a paragraph sandwich?",opts:["a detail","the topic sentence","the ending","a question"],ans:1,exp:"🍞 The TOPIC SENTENCE — it tells the main idea!"},
          {q:"Descriptive writing uses...?",opts:["only numbers","the 5 senses","grammar only","just dots"],ans:1,exp:"🎨 The 5 SENSES — see, hear, smell, taste, touch!"},
          {q:"A story needs...?",opts:["only a start","beginning, middle and end","just heroes","only talking"],ans:1,exp:"🎬 Beginning, middle, AND end — the full adventure!"},
          {q:"Which is a TOPIC SENTENCE?",opts:["He ran.","The dog barked.","Dogs make the best pets!","She smiled."],ans:2,exp:"🍞 'Dogs make the best pets!' — it's the big main idea!"},
          {q:"'The icy wind stung her cheeks.' Which sense?",opts:["smell","taste","sight","touch"],ans:3,exp:"✋ TOUCH — you can FEEL that icy wind!"},
        ]
      },
      punctuation:{title:"Punctuation Party",icon:"🎉",
        lessons:[
          {title:"The Punctuation Crew",expl:"Punctuation marks are like traffic signals for reading! 🚦 The dot says STOP, the question mark asks, the exclamation mark SHOUTS, and the comma says 'take a breath'!",
           examples:["Dot . = full stop. The end. 🛑","Question ? = Huh? What? ❓","Exclaim ! = Wow! Yay! 🎉","Comma , = pause... breathe 😮‍💨","Apostrophe ' = Tom's, it's 🔗"],
           tip:"Read a sentence and ACT the punctuation — stop, shout, gasp! 🎭",
           funFact:"The exclamation mark was once called the 'note of admiration'! Fancy! 🎩"},
          {title:"Spelling Tricks",expl:"English spelling has secret rules to help you! 🔐 'i before e', double letters before -ing, and more. Learn the tricks and become a spelling wizard! 🧙",
           examples:["i before e: believe, piece 🥧","Double up: run → running 🏃","Drop the e: make → making","Add -es: bus → buses 🚌","leaf → leaves 🍃"],
           tip:"Spelling rules are like cheat codes — learn them and win! 🎮",
           funFact:"'Bookkeeper' has three double letters in a row: oo-kk-ee! Whoa! 📚"},
          {title:"Tricky Twin Words",expl:"Some words SOUND the same but mean different things — sneaky sound-alikes called homophones! 🃏 Like there/their/they're. Slow down and pick the right one!",
           examples:["there / their / they're 📍","to / too / two ✌️","your / you're 🫵","its / it's 🐶","hear / here 👂"],
           tip:"When you spot a tricky twin, pause and think which one fits! 🤔",
           funFact:"'Buffalo' can be a real sentence 8 times in a row and still make sense! 🐃 Wild!"},
        ],
        quiz:[
          {q:"Which mark ends a question?",opts:[".","!","?",","],ans:2,exp:"❓ The question mark — for curious sentences!"},
          {q:"'I believe in magic.' follows which rule?",opts:["e before i","i before e","always ie","no rule"],ans:1,exp:"🥧 'i before e' — bel-IE-ve!"},
          {q:"'___ going to the park!' Which fits?",opts:["Their","There","They're","Thier"],ans:2,exp:"✅ THEY'RE = they are going to the park!"},
          {q:"A COMMA tells you to...?",opts:["stop fully","pause and breathe","shout","own something"],ans:1,exp:"😮‍💨 PAUSE — take a little breath!"},
          {q:"'Run' + 'ing' = ?",opts:["runing","running","run-ing","runneing"],ans:1,exp:"🏃 RUNNING — double the n before -ing!"},
        ]
      },
      poetry2:{title:"Rhyme Time",icon:"🎵",
        lessons:[
          {title:"Words That Rhyme",expl:"Words RHYME when they end with the same sound — like a musical match! 🎶 Cat, hat, bat, splat! Rhyming makes poems bouncy and SO fun to say out loud!",
           examples:["cat — hat — bat — splat! 🦇","sun — fun — run — bun ☀️","star — car — far — jar ⭐","cake — bake — lake — snake 🐍","boom — zoom — room 🚀"],
           tip:"Make a silly rhyme chain — start with your name and keep going! 🎤",
           funFact:"Some words like 'orange' have almost NO perfect rhymes — poor lonely orange! 🍊"},
          {title:"Types of Poems",expl:"Poems come in all shapes! 🎨 Some rhyme, some don't! A Haiku counts syllables (5-7-5), an Acrostic spells a word down the side, free verse breaks all the rules!",
           examples:["Rhyming: cat/hat poems 😺","Haiku: 5-7-5 syllables 🌸","Acrostic: spells a word down ⬇️","Free verse: NO rules! 🤸","Nursery rhymes: super fun! 👶"],
           tip:"Write an acrostic with YOUR name — first letter of each line! 🔤",
           funFact:"The shortest poem ever is just one word long — 'Lighght'! Weird but true! 😄"},
          {title:"Classic Nursery Rhymes",expl:"Nursery rhymes are the OG fun poems — passed down for hundreds of years! 👵 They're bouncy, silly, and stick in your head forever (sometimes too much)! 🎵",
           examples:["Twinkle twinkle little star ⭐","Jack and Jill went up the hill 🪣","Baa baa black sheep 🐑","Humpty Dumpty sat on a wall 🥚","Hickory dickory dock 🕰️"],
           tip:"Make up a NEW silly verse for an old nursery rhyme! 🎶",
           funFact:"'Twinkle Twinkle' uses the same tune as the ABC song — try it! 🎵"},
        ],
        quiz:[
          {q:"Which pair RHYMES?",opts:["cat/dog","sun/moon","hat/bat","run/jump"],ans:2,exp:"🦇 HAT and BAT — same /at/ ending, ka-pow!"},
          {q:"A Haiku's first line has how many syllables?",opts:["3","5","7","10"],ans:1,exp:"🌸 5 syllables — it goes 5-7-5!"},
          {q:"'Star' and 'far' rhyme because they...?",opts:["start the same","end the same sound","are short","mean the same"],ans:1,exp:"⭐ Same ENDING sound: st-AR, f-AR!"},
          {q:"Which poem has NO rules?",opts:["haiku","acrostic","free verse","nursery rhyme"],ans:2,exp:"🤸 FREE VERSE — wild and rule-free!"},
          {q:"In an ACROSTIC, what's special?",opts:["it rhymes","first letters spell a word","5 syllables","it's a question"],ans:1,exp:"⬇️ First letter of each line spells a word!"},
        ]
      }
    }
  },
  class3:{label:"Class 3",emoji:"🌳",color:"#FFD93D",desc:"🎯 Grammar ninja moves, epic essays & word-art tricks!",
    topics:{
      grammar3:{title:"Grammar Ninja",icon:"🥷",
        lessons:[
          {title:"Four Sentence Superpowers",expl:"Sentences come in 4 awesome flavours! 🍦 Telling (declarative), Asking (question), Bossing (command), and Excited (exclamation)! Mix them up to keep your writing zingy!",
           examples:["Telling: The sky is blue. 🌤️","Asking: Is the sky blue? ❓","Bossing: Look up now! 👆","Excited: What a sky! 😲","Mix them for ZING! ⚡"],
           tip:"Write all 4 types about pizza — telling, asking, bossing, exciting! 🍕",
           funFact:"A sentence with just an exclamation can be ONE word: 'Help!' or 'Wow!' 😱"},
          {title:"Comparing Things (Degrees)",expl:"Adjectives can LEVEL UP! 🎮 Tall → taller → tallest! Use -er to compare two things and -est for the champion of all! Big words use 'more' and 'most' instead.",
           examples:["tall → taller → tallest 📏","fast → faster → fastest 🏎️","big → bigger → biggest 🦣","Comparing 2: taller","The champ of all: tallest 🏆"],
           tip:"Compare your family — who's tallest? Who runs fastest? 🏃",
           funFact:"'Good' breaks the rules: good → better → best, not 'gooder'! Rebel word! 😎"},
          {title:"Position Words (Prepositions)",expl:"PREPOSITIONS tell you WHERE or WHEN things are! 📍 On, under, beside, behind! They're like a GPS for your sentences, showing exactly where stuff is hiding!",
           examples:["The cat is ON the mat 🐱","Ball UNDER the bed ⚽","Sit BESIDE me 👫","We eat AT noon 🕛","Hiding BEHIND the door 🚪"],
           tip:"Hide a toy and describe where it is using position words! 🧸",
           funFact:"You can stack prepositions: the cat came 'out from under behind' the sofa! 😹"},
        ],
        quiz:[
          {q:"'Close the door!' is which type?",opts:["Telling","Asking","Bossing (command)","none"],ans:2,exp:"👆 BOSSING — it's a command telling you to do something!"},
          {q:"The champion form of 'good' is...?",opts:["gooder","goodest","better","best"],ans:3,exp:"🏆 BEST — good breaks the rules!"},
          {q:"'She sat BESIDE the window.' The position word is...?",opts:["she","sat","beside","window"],ans:2,exp:"📍 BESIDE — it tells WHERE she sat!"},
          {q:"Comparing form of 'beautiful' is...?",opts:["beautifuler","more beautiful","most beautiful","beautifulest"],ans:1,exp:"✨ MORE BEAUTIFUL — big words use 'more'!"},
          {q:"Which is an EXCITED sentence?",opts:["Is it hot?","It is hot.","What a hot day!","Make it cool."],ans:2,exp:"😲 'What a hot day!' — full of excitement!"},
        ]
      },
      essay3:{title:"Epic Essays",icon:"📜",
        lessons:[
          {title:"The Essay Burger",expl:"An essay is like a yummy burger! 🍔 The INTRO bun on top, BODY paragraphs as the tasty fillings, and the CONCLUSION bun on the bottom. Stack them right and it's delicious!",
           examples:["🍞 Intro: tell your topic","🥩 Body 1: first point + proof","🥬 Body 2: second point + proof","🧀 Body 3: third point + proof","🍞 Conclusion: wrap it up!"],
           tip:"Say your topic, prove it 3 ways, then sum up — burger built! 🍔",
           funFact:"The word 'essay' means 'to try' in French — so every essay is a brave try! 🇫🇷"},
          {title:"Sharing Your Opinion",expl:"Opinion writing is where YOU say what you think — and back it up! 💭 Use phrases like 'I believe' and 'I think', then give reasons and examples. Your voice matters!",
           examples:["'I believe that...' 💭","'In my opinion...' 🗣️","'For example...' 👉","'This shows that...' ✅","'To sum up...' 🎁"],
           tip:"Pick a fun topic (best pizza topping?) and defend it with reasons! 🍕",
           funFact:"The best opinion writers always give at least 3 reasons — three is the magic number! 3️⃣"},
          {title:"Describe It Like a Movie",expl:"Descriptive essays make readers SEE the scene like a movie! 🎬 Don't just say 'the man was tired' — SHOW it: 'the old man shuffled slowly, yawning.' Show, don't tell!",
           examples:["Use all 5 senses 🌈","Show: 'she shivered' not 'she was cold' 🥶","Use fancy words: 'crimson' not 'red' 🔴","Add similes: 'white as snow' ❄️","Make it a movie in their mind! 🎥"],
           tip:"Read your writing out loud — does it paint a picture? 🖼️",
           funFact:"Authors call boring 'telling' writing 'info-dumping' — nobody likes a dump! 😅"},
        ],
        quiz:[
          {q:"The 3 parts of an essay burger are...?",opts:["start, story, end","intro, body, conclusion","topic, detail, rhyme","title, page, end"],ans:1,exp:"🍔 Intro, Body, Conclusion — the perfect burger!"},
          {q:"Which phrase shares an OPINION?",opts:["First of all","For example","I believe that","However"],ans:2,exp:"💭 'I believe that' — that's your opinion!"},
          {q:"'Show don't tell' means...?",opts:["use more words","describe vividly instead of just stating","write longer","add dots"],ans:1,exp:"🎬 Paint a movie scene instead of just telling facts!"},
          {q:"A CONCLUSION does what?",opts:["adds new points","wraps up the main points","asks questions","adds examples"],ans:1,exp:"🎁 Wraps everything up — the bottom bun!"},
          {q:"A simile compares using...?",opts:["and or but","like or as","because","which"],ans:1,exp:"❄️ 'like' or 'as' — brave as a lion!"},
        ]
      },
      literature3:{title:"Story Wizardry",icon:"🪄",
        lessons:[
          {title:"Real or Make-Believe?",expl:"FICTION is made-up fun (dragons, wizards!) 🐉 and NON-FICTION is real facts (true stuff!). 📚 Knowing which is which helps you read the right way — believe it or enjoy the fantasy!",
           examples:["Fiction: fairy tales, novels 🧚","Non-fiction: facts, true books 📖","Fiction clue: 'Once upon a time...' 🏰","Non-fiction clue: real dates & names","Ask: could this REALLY happen? 🤔"],
           tip:"Sort your books into 'real' and 'make-believe' piles! 📚",
           funFact:"Some fiction predicted real inventions — Jules Verne wrote about submarines first! 🚢"},
          {title:"The 5 Story Ingredients",expl:"Every story needs 5 magic ingredients! ✨ Characters (the stars), Setting (where), Plot (what happens), Conflict (the problem!), and Theme (the lesson). Mix them for story magic!",
           examples:["👥 Characters: the heroes","🏔️ Setting: where & when","📜 Plot: the events","💥 Conflict: the big problem","💡 Theme: the lesson learned"],
           tip:"Pick your fave movie and name all 5 ingredients! 🎬",
           funFact:"Every story ever told has some kind of conflict — even calm ones have a tiny problem! 😮"},
          {title:"Word-Art Tricks (Figurative Language)",expl:"Writers use cool word tricks to make writing sparkle! ✨ Similes ('brave AS a lion'), metaphors ('she IS a star'), and personification ('the wind whispered'). Word art!",
           examples:["Simile: strong as an ox 🐂","Metaphor: she's a shining star ⭐","Personification: wind whispered 🌬️","Alliteration: Peter Piper picked 🌶️","Idiom: raining cats and dogs! 🐱🐶"],
           tip:"Invent your own silly simile — 'as wiggly as a worm in a disco'! 🪱",
           funFact:"'Raining cats and dogs' might come from old roofs where animals hid — funny history! 🏠"},
        ],
        quiz:[
          {q:"A fairy tale is...?",opts:["non-fiction","fiction","a fact book","a report"],ans:1,exp:"🧚 FICTION — magical make-believe!"},
          {q:"The CONFLICT in a story is...?",opts:["the setting","the hero","the main problem","the lesson"],ans:2,exp:"💥 The big PROBLEM the hero must solve!"},
          {q:"'The moon smiled at us.' is...?",opts:["simile","alliteration","metaphor","personification"],ans:3,exp:"🌙 PERSONIFICATION — the moon acts human!"},
          {q:"'Life is a journey.' is a...?",opts:["simile","metaphor","idiom","alliteration"],ans:1,exp:"🛤️ METAPHOR — says life IS a journey directly!"},
          {q:"The THEME of a story is...?",opts:["where it happens","the hero's name","the lesson or message","the events"],ans:2,exp:"💡 The big LESSON — like 'kindness wins'!"},
        ]
      },
      speech3:{title:"Chatter Champions",icon:"🎤",
        lessons:[
          {title:"Posh Talk vs Buddy Talk",expl:"There are two ways to talk! 🎩 FORMAL (posh talk) for teachers and important people, and INFORMAL (buddy talk) for friends! Knowing when to use each makes you a chatter champion!",
           examples:["Posh: 'Good morning, may I help?' 🎩","Buddy: 'Hey! Need a hand?' 😎","Posh: 'I am unable to attend.'","Buddy: 'Can't make it, sorry!'","Match your talk to who you're with! 👥"],
           tip:"Practice posh talk with a fancy accent, buddy talk with your pals! 🎭",
           funFact:"The Queen of England spoke super formal English — they call it 'the Queen's English'! 👑"},
          {title:"Speaking to a Crowd",expl:"Talking to a group can feel scary, but it's a superpower you can learn! 🦸 Plan it, speak clearly, look at people, and use your hands. Soon you'll be a stage star! 🌟",
           examples:["Plan: start, middle, end 📋","Speak clearly — not too fast! 🗣️","Look at the audience 👀","Use your hands to point 👐","Practice in the mirror! 🪞"],
           tip:"Give a 30-second speech about your favourite animal to your family! 🐧",
           funFact:"Many famous actors were SHY kids — practice turned them into stars! 🌟"},
          {title:"Characters Talking (Dialogue)",expl:"DIALOGUE is when characters speak in a story! 💬 Their exact words go inside quotation marks like little ears \"...\". Every new speaker gets a brand new line!",
           examples:["'I'm hungry,' said Tom. 🍔","'Where's my hat?' asked Mia. 🎩","'Watch out!' yelled the coach. 📣","She whispered, 'It's a secret.' 🤫","New speaker = new line! ↩️"],
           tip:"Write a funny chat between a cat and a dog using quotation marks! 🐱🐶",
           funFact:"Quotation marks are called 'inverted commas' in Britain — same little ears! 👂"},
        ],
        quiz:[
          {q:"'I am unable to attend.' is...?",opts:["buddy talk","text talk","posh (formal) talk","slang"],ans:2,exp:"🎩 POSH talk — formal and polite!"},
          {q:"When speaking to a crowd, you should...?",opts:["look at the floor","look at people & speak clearly","mumble fast","whisper"],ans:1,exp:"👀 Look at people and speak clearly — stage star!"},
          {q:"Dialogue uses...?",opts:["brackets","quotation marks","dashes","bold"],ans:1,exp:"💬 Quotation marks — the little ears around speech!"},
          {q:"'Hey bro, wat u doin?' is...?",opts:["posh talk","academic talk","buddy/text talk","poetry"],ans:2,exp:"😎 BUDDY talk — casual, for friends only!"},
          {q:"Each new speaker in dialogue starts...?",opts:["same line","a new line","with a number","with a dash"],ans:1,exp:"↩️ A NEW line — so we know who's talking!"},
        ]
      },
      spelling3:{title:"Spelling Wizards",icon:"🧙",
        lessons:[
          {title:"Word Beginnings (Prefixes)",expl:"A PREFIX is a little word-part you glue to the FRONT to change its meaning! 🔮 'un' means not (unhappy), 're' means again (redo)! It's like a magic word-starter!",
           examples:["un = not: unhappy, unkind 🙅","re = again: redo, replay 🔁","pre = before: preview 👀","mis = wrongly: mistake ❌","dis = opposite: disagree 🚫"],
           tip:"Add 'un' to words and watch them flip — unzip, untie, unwrap! 🎁",
           funFact:"The prefix 'pre' is in 'prehistoric' — meaning before history was written! 🦕"},
          {title:"Word Endings (Suffixes)",expl:"A SUFFIX glues to the END of a word to change it! 🔚 '-ful' means full of (joyful), '-less' means without (fearless)! Suffixes are magic word-finishers!",
           examples:["-ful = full of: joyful 😊","-less = without: fearless 🦁","-er = person who: teacher 👩‍🏫","-ing = action: running 🏃","-ed = past: jumped 🦘"],
           tip:"Add '-ful' and '-less' to 'care' — careful AND careless! 🔄",
           funFact:"'-ology' means 'study of' — that's why zoology is the study of animals! 🦁"},
          {title:"Silent Sneaky Letters",expl:"Some letters are SNEAKY ninjas — written but totally silent! 🥷 The 'k' in 'knee', the 'b' in 'lamb'! They hide there quietly. Spot the sneaky silent letters!",
           examples:["Silent K: know, knee, knight 🤺","Silent W: write, wrong ✍️","Silent B: lamb, thumb 👍","Silent H: hour, honest ⏰","Silent G: sign, gnome 🧙"],
           tip:"Hunt for silent letter ninjas in your reading today! 🥷",
           funFact:"The word 'queue' has 4 silent letters in a row — q-UEUE, just say 'cue'! 😆"},
        ],
        quiz:[
          {q:"The prefix 'un' means...?",opts:["again","before","not/opposite","badly"],ans:2,exp:"🙅 NOT — unhappy means not happy!"},
          {q:"'Teacher' uses which suffix for 'person who'?",opts:["-ful","-less","-er","-tion"],ans:2,exp:"👩‍🏫 -ER — a person who teaches!"},
          {q:"Which word has a SILENT K ninja?",opts:["king","kind","know","kite"],ans:2,exp:"🥷 KNOW — the k is a silent ninja!"},
          {q:"'Careless' — '-less' means...?",opts:["full of","without","again","person who"],ans:1,exp:"🚫 WITHOUT — careless = without care!"},
          {q:"'Rewrite' — 're' means...?",opts:["before","again","not","wrongly"],ans:1,exp:"🔁 AGAIN — rewrite = write again!"},
        ]
      },
      creative3:{title:"Creative Sparks",icon:"🎆",
        lessons:[
          {title:"Simile & Metaphor Magic",expl:"Spice up writing with comparison magic! ✨ Similes use 'like' or 'as' (laugh like thunder), metaphors say something IS another (his words were daggers). Make your own — be original!",
           examples:["Simile: laugh like church bells 🔔","Metaphor: words were daggers 🗡️","Simile: stars like diamonds 💎","Metaphor: life is a rollercoaster 🎢","Invent YOUR own — be wild! 🌪️"],
           tip:"Compare your messy room to something funny — 'a tornado hit it'! 🌪️",
           funFact:"Shakespeare invented over 1,700 words AND tons of famous metaphors! 🎭"},
          {title:"Building Spooky Suspense",expl:"Suspense keeps readers on the EDGE of their seats! 😨 Use short. Punchy. Sentences. Dark settings, creaky sounds, and DON'T reveal everything! Let imaginations run wild!",
           examples:["Short sentences. Build. Tension. 😰","'A candle flickered...' 🕯️","'A cold hand touched her.' ❄️","Cliffhanger: 'Then she saw IT.' 👁️","The unknown is the scariest! 👻"],
           tip:"Write a spooky scene but NEVER say what the monster is — let them imagine! 👻",
           funFact:"The scariest stories often show LESS — your imagination fills in the rest! 🧠"},
          {title:"Snappy Story Dialogue",expl:"Good dialogue makes characters feel ALIVE! 💬 It shows personality and pushes the story forward. Use fun speech words — whispered, snapped, gasped — not just 'said'!",
           examples:["Show feelings: 'I HATE peas!' 😤","Reveal drama: 'You lied!' 😱","Fun tags: whispered, gasped, yelled","Make it sound real! 🗣️","Read it aloud to test it 🎭"],
           tip:"Write characters arguing about the best ice cream flavour — make it snappy! 🍦",
           funFact:"Some authors act out their dialogue out loud while writing — talking to themselves! 😄"},
        ],
        quiz:[
          {q:"'The classroom was a zoo!' is a...?",opts:["simile","metaphor","personification","rhyme"],ans:1,exp:"🦁 METAPHOR — it says the room WAS a zoo!"},
          {q:"Short punchy sentences create...?",opts:["humour","confusion","suspense","boredom"],ans:2,exp:"😰 SUSPENSE — keeps readers on edge!"},
          {q:"Good dialogue should...?",opts:["be super long","use 'said' every time","sound real & show personality","skip quotation marks"],ans:2,exp:"💬 Sound REAL and show who the character is!"},
          {q:"'Her voice was like honey.' is a...?",opts:["metaphor","simile","idiom","rhyme"],ans:1,exp:"🍯 SIMILE — uses 'like' to compare!"},
          {q:"Hiding info from the reader creates...?",opts:["confusion","boredom","suspense","rhyme"],ans:2,exp:"👻 SUSPENSE — the unknown is exciting!"},
        ]
      }
    }
  },
  class4:{label:"Class 4",emoji:"🌲",color:"#FF9A3C",desc:"🔥 Grammar black-belt, detective-level analysis & debate battles!",
    topics:{
      adv_grammar:{title:"Grammar Black-Belt",icon:"🥋",
        lessons:[
          {title:"Clause Combos",expl:"A CLAUSE is a word-team with a subject and a verb! 🤜🤛 An INDEPENDENT clause can stand alone like a hero. A DEPENDENT clause is the sidekick — it needs the hero to make sense!",
           examples:["Hero (independent): 'She sings.' ✅","Sidekick (dependent): 'Because she's happy,' 🦸","Sidekick needs a hero! ❌ alone","Combo: 'Because she's happy, she sings.' ✅","Test: can it stand alone? 🦵"],
           tip:"Cover part of a sentence — can the rest stand alone? Hero or sidekick? 🦸",
           funFact:"The longest sentence in English literature has 13,955 words — clause overload! 😵"},
          {title:"Active vs Passive Power",expl:"ACTIVE voice is strong and direct: 'The dog chased the cat!' 💪 PASSIVE flips it: 'The cat was chased by the dog.' Active usually packs more punch — heroes do the action!",
           examples:["💪 Active: Tom kicked the ball","😴 Passive: The ball was kicked by Tom","💪 Active: Maria wrote it","😴 Passive: It was written by Maria","Spot passive: was/were + verb"],
           tip:"Make boring passive sentences ACTIVE and feel the power boost! ⚡",
           funFact:"Superhero comics LOVE active voice — 'POW! Spidey saves the day!' 🕷️"},
          {title:"Joining Words (Conjunctions)",expl:"CONJUNCTIONS glue sentence parts together! 🔗 Remember FANBOYS: For, And, Nor, But, Or, Yet, So! Plus joiners like 'because' and 'although' connect ideas smoothly!",
           examples:["FANBOYS: For And Nor But Or Yet So 🤖","'I ran, BUT I tripped.' 🏃","'I stayed home BECAUSE it rained.' 🌧️","'Either pizza OR pasta!' 🍕","Glue your ideas together! 🔗"],
           tip:"Memorise FANBOYS — say it like a robot name: Fan-Boys! 🤖",
           funFact:"FANBOYS is a memory trick teachers invented — there are exactly 7 of them! 7️⃣"},
        ],
        quiz:[
          {q:"'Although it was raining,' is a...?",opts:["hero (independent)","full sentence","sidekick (dependent)","question"],ans:2,exp:"🦸 SIDEKICK (dependent) — it can't stand alone!"},
          {q:"'The ball was kicked by Tom.' is...?",opts:["active","past only","passive","future"],ans:2,exp:"😴 PASSIVE — the ball receives the action!"},
          {q:"FANBOYS are which joining words?",opts:["sidekicks","describers","conjunctions","questions"],ans:2,exp:"🔗 CONJUNCTIONS — For And Nor But Or Yet So!"},
          {q:"'She won because she trained.' 'Because' is a...?",opts:["FANBOYS","preposition","joining word (conjunction)","adjective"],ans:2,exp:"🔗 A joining conjunction — it connects ideas!"},
          {q:"Make ACTIVE: 'The pizza was eaten by Tom.'",opts:["Pizza ate Tom.","Tom ate the pizza.","Tom is eating.","Pizza eaten."],ans:1,exp:"💪 'Tom ate the pizza.' — strong and active!"},
        ]
      },
      lit_analysis:{title:"Literature Detective",icon:"🔎",
        lessons:[
          {title:"Hunting for Themes",expl:"A THEME is the big LIFE LESSON hiding in a story! 🕵️ It's not just what happens — it's what it MEANS. A story about a lost dog might really be about love and loss. Deep!",
           examples:["Story: boy loses dog → Theme: love & loss 💔","Story: princess escapes → Theme: freedom 🕊️","Common themes: friendship, courage 🦁","Theme = the deeper message 💡","Ask: what does this teach about life?"],
           tip:"After any movie, ask 'what was the REAL lesson?' — that's the theme! 🎬",
           funFact:"The same theme (like 'good vs evil') appears in stories from every country on Earth! 🌍"},
          {title:"Who's Telling the Story? (POV)",expl:"POINT OF VIEW is WHO narrates! 🎥 First person ('I did it') is like a diary. Third person ('she did it') is like a camera watching. It changes how you feel the story!",
           examples:["First person: 'I walked in...' 📔","Third limited: 'She felt scared' (one mind)","Third omniscient: knows ALL minds 🧠","Second person: 'You open the door' (rare!)","POV shapes what you know! 👀"],
           tip:"Rewrite a story moment from 'I' to 'she' — feel the difference! 🔄",
           funFact:"Some books switch POV every chapter — you see the story from many eyes! 👁️👁️"},
          {title:"Why & How Writers Write (Purpose & Tone)",expl:"Authors write for a PURPOSE: to persuade, inform, or entertain! 🎯 And TONE is their attitude — funny, serious, spooky! Spotting both makes you a true literature detective!",
           examples:["Persuade: ads, opinion pieces 📢","Inform: textbooks, news 📰","Entertain: stories, jokes 😂","Tone: funny, serious, spooky 🎭","Tone hides in word choices! 🔍"],
           tip:"Read something and guess: is the author funny, serious, or spooky? 🕵️",
           funFact:"The same news can be written in a happy OR scary tone — words have power! ⚡"},
        ],
        quiz:[
          {q:"THEME of a story about learning to share?",opts:["a kid has toys","it's at school","kindness & generosity","the kid is small"],ans:2,exp:"💡 Kindness & generosity — the deeper LESSON!"},
          {q:"'I woke up and yawned.' is which POV?",opts:["second person","third omniscient","first person","third limited"],ans:2,exp:"📔 FIRST person — the 'I' gives it away!"},
          {q:"An encyclopedia's purpose is to...?",opts:["entertain","persuade","inform","scare"],ans:2,exp:"📰 INFORM — facts, facts, facts!"},
          {q:"Short urgent sentences create which tone?",opts:["funny","relaxed","tense/urgent","romantic"],ans:2,exp:"😰 TENSE and urgent — quick and punchy!"},
          {q:"Third person OMNISCIENT narrator knows...?",opts:["only their own thoughts","one person's mind","ALL characters' thoughts","nothing"],ans:2,exp:"🧠 ALL minds — omniscient means all-knowing!"},
        ]
      },
      research:{title:"Fact Hunters",icon:"🔬",
        lessons:[
          {title:"Finding Trusty Facts",expl:"Research means hunting for TRUE, reliable facts! 🔍 Not everything online is true! Check trusty sources (.edu, .gov), and always ask: who made this and why? Be a fact detective!",
           examples:["Trusty: .edu .gov .org sites ✅","Primary: real interviews, diaries 📜","Secondary: books about events 📚","Always check: who? when? why? 🤔","Take notes in YOUR words! ✍️"],
           tip:"Before believing a 'fact', check it on 2 different trusty sites! 🔍",
           funFact:"Scientists check each other's work — it's called 'peer review', like fact buddies! 🤝"},
          {title:"Building a Report",expl:"A REPORT organises facts neatly! 🗂️ Title page, intro, sections with subheadings, facts, and a conclusion. Subheadings are like signposts guiding your reader on a journey!",
           examples:["📋 Title page: topic + name","🎬 Intro: what & why","🪧 Subheadings: signposts","📊 Body: facts + sources","🎁 Conclusion: wrap up!"],
           tip:"Use subheadings — they're like chapter signs guiding your reader! 🪧",
           funFact:"NASA writes reports SO detailed that some are thousands of pages long! 🚀"},
          {title:"Be a Copy-Cat Catcher (No Plagiarism!)",expl:"PLAGIARISM is copying someone's work and pretending it's yours — a big no-no! 🚫 Always use YOUR own words (paraphrase) or give credit. Honest work is awesome work! ⭐",
           examples:["Paraphrase: say it your way ✅","Quote + credit: 'NASA says...' ✅","Copy without credit: ❌ NO!","Give credit to be honest 🌟","Common facts don't need credit"],
           tip:"Read a fact, close the book, then write it in YOUR own words! ✍️",
           funFact:"Schools use special software to catch copied work — the copy-cat catcher! 🐱"},
        ],
        quiz:[
          {q:"Which is a PRIMARY source?",opts:["an encyclopedia","a summary","an eye-witness diary","a textbook"],ans:2,exp:"📜 An eye-witness diary — a real first-hand source!"},
          {q:"Plagiarism means...?",opts:["your own ideas","copying without credit","careful research","citing sources"],ans:1,exp:"🚫 Copying someone's work and pretending it's yours!"},
          {q:"Subheadings in a report are like...?",opts:["word count","signposts for sections","the intro","extra fluff"],ans:1,exp:"🪧 SIGNPOSTS — guiding the reader through!"},
          {q:"A trusty website often ends in...?",opts:[".fun",".edu or .gov",".lol",".maybe"],ans:1,exp:"✅ .edu and .gov — trusty fact sources!"},
          {q:"Paraphrasing means...?",opts:["copying exactly","leaving stuff out","saying it in your own words","making facts up"],ans:2,exp:"✍️ Saying it in YOUR own words — honest and smart!"},
        ]
      },
      adv_vocab:{title:"Vocab Treasure Hunt",icon:"💎",
        lessons:[
          {title:"Word Roots Treasure",expl:"Many words come from ancient LATIN and GREEK roots — like buried treasure! 💎 'bio' means life, 'port' means carry! Learn a root and you unlock TONS of words at once!",
           examples:["bio = life: biology, biography 🌍","port = carry: transport, portable 📦","dict = say: dictionary, predict 🗣️","vis = see: vision, visible 👁️","aqua = water: aquarium 🐠"],
           tip:"Find the hidden root treasure inside big words — instant meaning! 💎",
           funFact:"Over 60% of English words come from Latin or Greek roots — ancient treasure! 🏛️"},
          {title:"Word Feelings (Connotation)",expl:"Words have DICTIONARY meanings AND secret FEELINGS! 💭 'Slim' and 'skinny' both mean thin, but 'slim' feels nice and 'skinny' feels mean! Pick words for their vibes!",
           examples:["slim (nice) vs skinny (mean) 😊😟","home (cozy) vs house (plain) 🏠","curious (good) vs nosy (bad) 👀","Same meaning, different vibe!","Words have feelings too! 💭"],
           tip:"Notice how 'determined' and 'stubborn' feel different — same idea, diff vibe! 🎭",
           funFact:"Advertisers pick 'feeling' words carefully — 'affordable' sounds better than 'cheap'! 💰"},
          {title:"Funny Sayings (Idioms)",expl:"IDIOMS are silly sayings that don't mean what they say! 😂 'Break a leg' means good luck (not actually break it!). 'Piece of cake' means easy. English is full of these jokes!",
           examples:["'Break a leg!' = good luck 🎭","'Piece of cake' = super easy 🍰","'Cost an arm and a leg' = pricey 💸","'Raining cats and dogs' = pouring 🌧️","Proverb: 'Actions speak louder!' 📢"],
           tip:"Collect funny idioms like stickers — start an idiom journal! 📔",
           funFact:"Every language has its own idioms — in Germany 'I think a pig is whistling' means 'no way!' 🐷"},
        ],
        quiz:[
          {q:"The root 'bio' means...?",opts:["death","write","life","earth"],ans:2,exp:"🌍 LIFE — biology is the study of life!"},
          {q:"CONNOTATION means a word's...?",opts:["dictionary meaning","secret feeling/vibe","spelling","length"],ans:1,exp:"💭 Its secret FEELING — like 'slim' feels nicer than 'skinny'!"},
          {q:"'Break a leg!' is a...?",opts:["proverb","simile","idiom","rhyme"],ans:2,exp:"😂 IDIOM — means good luck, not literally!"},
          {q:"'Actions speak louder than words' is a...?",opts:["idiom","simile","metaphor","proverb"],ans:3,exp:"📢 PROVERB — a wise little saying!"},
          {q:"'Slim' and 'skinny' have different...?",opts:["meanings","feelings (vibes)","spellings","lengths"],ans:1,exp:"💭 Different FEELINGS — slim is nice, skinny is mean!"},
        ]
      },
      debate4:{title:"Debate Battles",icon:"⚔️",
        lessons:[
          {title:"Building an Argument",expl:"An argument isn't a fight — it's making your case with brains! 🧠 Use CER: Claim (your point), Evidence (proof), Reasoning (why it matters). Win with facts, not shouting!",
           examples:["📣 Claim: 'Recess should be longer!'","📊 Evidence: 'Studies show kids focus better'","🧠 Reasoning: 'So longer recess = better grades'","Acknowledge the other side too! 🤝","Win with brains, not volume! 🧠"],
           tip:"Pick a fun topic and build a CER: claim, evidence, reasoning! ⚔️",
           funFact:"The word 'debate' comes from an old word meaning 'to battle' — but with words! ⚔️"},
          {title:"Persuasion Power-Ups",expl:"Want to convince people? Use the 3 power-ups! 💥 ETHOS (trust me, I'm an expert), PATHOS (feel the emotion!), LOGOS (here's the logic). The greatest speakers use all three!",
           examples:["🎓 Ethos: 'As a doctor, I say...'","❤️ Pathos: 'Imagine their sadness...'","🧮 Logos: 'Research proves...'","Repetition: 'We can. We will. We must!'","Rhetorical Q: 'Isn't that unfair?'"],
           tip:"Convince someone to get a pet using ethos, pathos, AND logos! 🐶",
           funFact:"These 3 power-ups were invented by Aristotle over 2,000 years ago — still work today! 🏛️"},
          {title:"How a Debate Works",expl:"A DEBATE is a word-battle with rules! ⚔️ State your side, give 3 strong points with proof, knock down the other side's points (rebuttal!), then sum up why you win. May the best brain win!",
           examples:["📣 Opening: state your side","💪 3 strong points + proof","🛡️ Rebuttal: counter their points","🎁 Closing: why you win!","Confidence + evidence = victory! 🏆"],
           tip:"Debate a sibling about the best superhero — use 3 points each! 🦸",
           funFact:"Famous leaders trained in debate as kids — it builds super confidence! 💪"},
        ],
        quiz:[
          {q:"CER stands for...?",opts:["Clear Easy Right","Claim Evidence Reasoning","Check Edit Review","Cool Epic Rad"],ans:1,exp:"🧠 Claim, Evidence, Reasoning — the winning combo!"},
          {q:"Using emotion to persuade is...?",opts:["Ethos","Logos","Pathos","Rhythm"],ans:2,exp:"❤️ PATHOS — pulling on heartstrings!"},
          {q:"Knocking down the other side's point is a...?",opts:["opening","conclusion","rebuttal","claim"],ans:2,exp:"🛡️ REBUTTAL — countering their argument!"},
          {q:"'As a doctor, I recommend...' is...?",opts:["pathos","logos","ethos","idiom"],ans:2,exp:"🎓 ETHOS — using expert trust!"},
          {q:"A debate is won with...?",opts:["the loudest voice","confidence + evidence","the most words","funny jokes"],ans:1,exp:"🏆 Confidence + evidence — brains beat volume!"},
        ]
      },
      media4:{title:"Media Detectives",icon:"📱",
        lessons:[
          {title:"Fact or Opinion?",expl:"A FACT can be proven true (the sky is blue). An OPINION is what someone thinks (blue is the best colour). Detectives must tell them apart — don't get fooled! 🕵️",
           examples:["Fact: 'Water is wet.' ✅ provable","Opinion: 'Water is boring.' 💭 a view","Fact: 'The book has 200 pages.'","Opinion: 'Best book ever!' 💭","Clue words: I think, best, worst"],
           tip:"Read a sentence and shout 'FACT!' or 'OPINION!' like a game show! 📺",
           funFact:"Adverts mix facts and opinions to trick you — 'best taste' is just an opinion! 🍔"},
          {title:"Reading Media Tricks",expl:"Ads, news, and posts all use word TRICKS to grab you! 🎣 Bold claims, catchy slogans, emotional words! A media detective asks: who made this and what do they WANT?",
           examples:["Ads: 'Buy now! Best ever!' 📢","News: facts + catchy headlines 📰","Social: hashtags & emojis 📱","Always ask: who? why? 🤔","Don't believe everything! 🕵️"],
           tip:"Look at an advert and spot the trick — what are they really after? 🎣",
           funFact:"The average kid sees thousands of ads a day — detective skills are a superpower! 🦸"},
          {title:"Word Power & Bias",expl:"Words are POWERFUL — they can sneakily push opinions! ⚡ Calling people 'a mob' vs 'a crowd' changes how you feel! Spotting this 'loaded language' makes you a sharp thinker!",
           examples:["'reckless mob' vs 'determined crowd' 👥","Same people, different feelings!","Euphemism: 'passed away' = died 🕊️","Watch for one-sided stories ⚖️","Ask: who benefits? 🤔"],
           tip:"Notice when words try to push your feelings — stay sharp! ⚡",
           funFact:"Newspapers can describe the same event in totally opposite ways — word power! 📰"},
        ],
        quiz:[
          {q:"'The school has 500 students.' is a...?",opts:["opinion","claim","fact","trick"],ans:2,exp:"✅ FACT — you can count and prove it!"},
          {q:"'This is the best film ever!' is a...?",opts:["fact","number","opinion","proof"],ans:2,exp:"💭 OPINION — 'best' is just what someone thinks!"},
          {q:"'Reckless mob' vs 'determined crowd' shows...?",opts:["synonyms","fact vs fiction","loaded language/bias","rhyme"],ans:2,exp:"⚡ LOADED LANGUAGE — words pushing feelings!"},
          {q:"Ethos, Pathos, Logos are tools of...?",opts:["story elements","persuasion","grammar","spelling"],ans:1,exp:"💥 PERSUASION power-ups!"},
          {q:"A euphemism is...?",opts:["a harsh word","a gentle word for something hard","a poem","an opinion"],ans:1,exp:"🕊️ A gentle word — like 'passed away' for died!"},
        ]
      }
    }
  },
  class5:{label:"Class 5",emoji:"🏆",color:"#A855F7",desc:"👑 Wordsmith legend mode — epic analysis, rhetoric & writing mastery!",
    topics:{
      analytical:{title:"Essay Mastermind",icon:"🧠",
        lessons:[
          {title:"The Analytical Essay",expl:"An analytical essay DIGS DEEP — it doesn't just retell, it explores HOW and WHY! 🔍 Make a thesis (your big claim), then prove it with evidence and smart explanation. Be the mastermind!",
           examples:["🎯 Thesis: a specific, arguable claim","Analyse HOW the author did it 🔍","Use quotes as evidence 📋","Explain how proof backs your point","Formal voice — no 'I think'! 🎩"],
           tip:"Use PEE: Point, Evidence, Explanation — for every paragraph! 🧠",
           funFact:"Top universities LOVE analytical essays — it's the #1 skill they look for! 🎓"},
          {title:"Crafting a Killer Thesis",expl:"A THESIS is your essay's BIG BOLD claim! 💥 Weak: 'The story has themes.' (boring, obvious). Strong: 'The author argues courage means kindness.' Make it specific and arguable!",
           examples:["❌ Weak: 'Stories have ideas.'","⚠️ Better: 'It's about courage.'","✅ Strong: specific + arguable! 💪","Could someone DISAGREE? Good!","Every paragraph proves the thesis"],
           tip:"Test your thesis: 'Could someone argue against this?' If yes — nailed it! 💪",
           funFact:"The word 'thesis' is Greek for 'a position' — you're taking a stand! 🏛️"},
          {title:"Weaving In Evidence",expl:"Evidence makes your essay BULLETPROOF! 🛡️ But never just drop a quote and run — introduce it, show it, then EXPLAIN what it proves. Make a quote sandwich, just like writing!",
           examples:["Introduce: 'The author writes...' 👋","Quote: '\"Heroes feel fear too.\"'","Explain: 'This shows bravery isn't fearless'","Never drop a quote alone! 🙅","Analysis is the MOST important bit! 🧠"],
           tip:"Every quote needs a 'why it matters' explanation right after it! 🥪",
           funFact:"Lawyers use the exact same skill in court — evidence + explanation wins cases! ⚖️"},
        ],
        quiz:[
          {q:"A strong THESIS is...?",opts:["a story summary","an obvious fact","a specific arguable claim","the title"],ans:2,exp:"💪 A specific, arguable claim — bold and debatable!"},
          {q:"PEE stands for...?",opts:["Point Evidence Explanation","Plan Edit Erase","Pretty Easy Essay","Practice Every Exam"],ans:0,exp:"🧠 Point, Evidence, Explanation!"},
          {q:"After a quote, you must...?",opts:["start a new para","add another quote","explain what it proves","stop writing"],ans:2,exp:"🥪 EXPLAIN what it proves — finish the sandwich!"},
          {q:"'This novel has themes of identity.' This thesis is...?",opts:["super strong","perfect","too broad/obvious","too wild"],ans:2,exp:"⚠️ Too broad! A strong thesis says HOW and WHY!"},
          {q:"Analytical essays use which voice?",opts:["super casual","'I think' a lot","formal academic","slang"],ans:2,exp:"🎩 FORMAL academic voice — professional and precise!"},
        ]
      },
      adv_literature:{title:"Lit Legend",icon:"📚",
        lessons:[
          {title:"Storytelling Tricks",expl:"Master authors use clever NARRATIVE TRICKS! 🎬 Flashbacks (jump to the past), foreshadowing (sneaky hints), and unreliable narrators (can you trust them?). Spot these like a legend!",
           examples:["⏪ Flashback: jump to the past","🔮 Foreshadowing: sneaky hints","🤔 Unreliable narrator: don't trust!","🎬 In medias res: start mid-action","💭 Stream of consciousness: raw thoughts"],
           tip:"Spot a flashback or hint in your next book — be a trick-detective! 🕵️",
           funFact:"Movies use foreshadowing too — that creepy music warns you something's coming! 🎵"},
          {title:"Hidden Symbols",expl:"SYMBOLISM is when objects secretly MEAN more! 🕊️ A dove = peace, darkness = danger. ALLEGORY is a whole story that secretly means something else. Crack the hidden code!",
           examples:["🕊️ Dove = peace","🌑 Darkness = evil or fear","🛤️ A journey = growing up","Allegory: whole story = secret meaning","Colours symbolise: red=danger ❤️"],
           tip:"Spot a symbol in a story — what does it REALLY stand for? 🔍",
           funFact:"'Animal Farm' looks like a tale about pigs but is secretly about real history! 🐷"},
          {title:"Genre & Backstory (Context)",expl:"GENRE is the story type (mystery, fantasy). CONTEXT is the real-world backstory — when and why it was written! 📅 A war story written DURING a war hits differently. Context unlocks meaning!",
           examples:["📚 Genre: mystery, fantasy, sci-fi","📅 Historical context: when written","🌍 Social context: the world then","✍️ Author's life shapes the story","Context unlocks deeper meaning! 🔓"],
           tip:"Look up WHEN a famous book was written — it changes how you read it! 📅",
           funFact:"Many spooky stories were written during hard times — fear on the page! 👻"},
        ],
        quiz:[
          {q:"FORESHADOWING is...?",opts:["a jump to the past","sneaky hints about the future","two stories at once","an ending"],ans:1,exp:"🔮 Sneaky HINTS about what's coming!"},
          {q:"A dove usually symbolises...?",opts:["danger","war","peace","money"],ans:2,exp:"🕊️ PEACE — a classic hidden symbol!"},
          {q:"An ALLEGORY is...?",opts:["a poem","a story with a secret deeper meaning","a simile","a rhyme"],ans:1,exp:"🐷 A story that secretly means something bigger!"},
          {q:"An UNRELIABLE narrator is one who...?",opts:["talks a lot","might be lying or mistaken","knows everything","never speaks"],ans:1,exp:"🤔 Can't be trusted — maybe lying or wrong!"},
          {q:"CONTEXT helps you understand...?",opts:["spelling","why & when a story was written","grammar","rhyme"],ans:1,exp:"📅 The backstory — when and why it was made!"},
        ]
      },
      adv_essay:{title:"Writing Wizard",icon:"🧙",
        lessons:[
          {title:"Comparing Two Things",expl:"A COMPARATIVE essay explores TWO things side by side! ⚖️ Find their similarities AND differences, then explain what those reveal. Use words like 'whereas', 'similarly', 'in contrast'!",
           examples:["⚖️ Compare 2 stories/ideas","Similarities AND differences","'Whereas X is..., Y is...' 🔄","'Similarly, both...' 🤝","Explain what differences MEAN! 💡"],
           tip:"Compare two movies — what's similar, different, and what does it show? 🎬",
           funFact:"Comparing things is how scientists make discoveries — spot the difference! 🔬"},
          {title:"Seeing Both Sides",expl:"DISCURSIVE writing fairly shows BOTH sides of a debate, then reaches a balanced view! ⚖️ Unlike persuasive writing, you don't pick a team — you explore fairly like a wise judge!",
           examples:["'Some argue... However, others...' 🤔","'On one hand... on the other...' ✋🤚","Show BOTH sides fairly ⚖️","Reach a balanced conclusion","Be a wise judge, not a fan! 👨‍⚖️"],
           tip:"Argue BOTH sides of 'should homework exist?' — be totally fair! ⚖️",
           funFact:"Judges and scientists must see all sides before deciding — wisdom in action! 🦉"},
          {title:"Writing for Effect",expl:"Word wizards make EVERY choice on purpose! ✨ Short sentences = punch. Long ones = flow. Repetition = power. Where you END matters most. Control the magic!",
           examples:["Short = punch. Boom. 💥","Long flowing lines = calm 🌊","Repetition = power, power, POWER! ⚡","Rhetorical questions grab attention ❓","End on something memorable! 🎆"],
           tip:"Read great authors and ask: 'Why THIS word? Why THIS length?' 🧙",
           funFact:"Famous speeches are studied word-by-word — every choice was on purpose! 🎤"},
        ],
        quiz:[
          {q:"A COMPARATIVE essay looks at...?",opts:["one thing","two things side by side","just grammar","an author's life"],ans:1,exp:"⚖️ TWO things — comparing them for insight!"},
          {q:"DISCURSIVE writing...?",opts:["picks one side hard","tells a story","fairly shows both sides","rhymes"],ans:2,exp:"⚖️ Shows BOTH sides fairly — wise judge mode!"},
          {q:"'We can. We will. We must!' uses...?",opts:["simile","repetition for power","passive voice","a question"],ans:1,exp:"⚡ REPETITION — for powerful punch!"},
          {q:"Ending at a tense moment is a...?",opts:["conclusion","metaphor","cliffhanger","thesis"],ans:2,exp:"🎬 CLIFFHANGER — keeps them hooked!"},
          {q:"'Whereas' shows...?",opts:["agreement","adding on","contrast/difference","cause"],ans:2,exp:"🔄 CONTRAST — pointing out a difference!"},
        ]
      },
      grammar5:{title:"Grammar Grandmaster",icon:"♟️",
        lessons:[
          {title:"Sentence Combos",expl:"Grandmasters mix sentence types like chess moves! ♟️ Simple (one idea), Compound (two ideas joined), Complex (idea + sidekick), and Compound-Complex (all of it!). Variety = victory!",
           examples:["Simple: 'The dog barked.' 🐶","Compound: 'It barked, and ran.'","Complex: 'Because it saw a cat, it barked.'","Compound-complex: all combined! 🎯","Mix them for amazing writing! ✨"],
           tip:"Write one of each sentence type — simple, compound, complex! ♟️",
           funFact:"Mixing sentence lengths is what makes writing sound like music! 🎵"},
          {title:"Maybe-Words (Modals)",expl:"MODAL verbs show how SURE or ABLE you are! 🎚️ 'Will' = definite, 'might' = maybe, 'can' = able, 'must' = required! They fine-tune your meaning like a volume dial!",
           examples:["Definite: 'It WILL rain.' ☔","Maybe: 'It MIGHT rain.' 🤷","Able: 'I CAN swim.' 🏊","Allowed: 'You MAY go.' 👍","Required: 'You MUST stop.' 🛑"],
           tip:"Change 'might' to 'will' and feel how much more certain it sounds! 🎚️",
           funFact:"Modals never change form — you never say 'musts' or 'canned' (for can)! 😄"},
          {title:"Fancy Punctuation",expl:"Grandmasters wield fancy punctuation! ✨ Semicolons (;) link close ideas, colons (:) introduce, em dashes (—) add drama, and ellipses (...) build suspense. Punctuation power!",
           examples:["Semicolon: 'It's late; let's go.' 🔗","Colon: 'She needed one thing: courage.' 🎯","Em dash: 'He saw it—the truth.' 💥","Ellipsis: 'And then...' 😶","Each adds a different flavour! 🌈"],
           tip:"Try a dramatic em dash—like this—for extra punch! 💥",
           funFact:"The semicolon is 500+ years old and still confuses adults — but not you! 😎"},
        ],
        quiz:[
          {q:"'She sang, but nobody listened.' is...?",opts:["simple","compound","complex","none"],ans:1,exp:"🔗 COMPOUND — two ideas joined by 'but'!"},
          {q:"'You MUST stop.' — 'must' shows...?",opts:["ability","permission","maybe","requirement"],ans:3,exp:"🛑 REQUIREMENT — it's a must-do!"},
          {q:"A SEMICOLON links...?",opts:["a list","two close ideas","a quote","nothing"],ans:1,exp:"🔗 Two closely-related ideas: 'It's late; let's go.'"},
          {q:"'And then...' — the ellipsis creates...?",opts:["a list","ownership","suspense","a question"],ans:2,exp:"😶 SUSPENSE — ooh, what happens next?!"},
          {q:"'Because he was tired' alone is a...?",opts:["compound sentence","full sentence","sidekick (dependent) clause","question"],ans:2,exp:"🦸 A dependent sidekick — it needs a hero clause!"},
        ]
      },
      rhetoric5:{title:"Speech Superstar",icon:"🎙️",
        lessons:[
          {title:"Famous Speech Tricks",expl:"The greatest speeches use cool RHETORIC tricks! 🎙️ Anaphora (repeat the start: 'I have a dream...'), tricolon (the magic 3: 'of the people, by the people, for the people'). Speak like a legend!",
           examples:["🔁 Anaphora: 'I have a dream...' x3","3️⃣ Tricolon: 'life, liberty, happiness'","⚖️ Antithesis: 'Ask not what...'","👋 Direct address: 'My friends...'","❓ Rhetorical Q: 'If not now, when?'"],
           tip:"Write a mini-speech using the magic rule of 3! 3️⃣",
           funFact:"Martin Luther King's 'I Have a Dream' repeated that phrase 8 times — pure power! ✊"},
          {title:"Presenting Like a Pro",expl:"Great presenters command the room! 🎤 Vary your voice (loud, soft, fast, slow), use body language, hook them at the start, and answer questions like a champ. You've got this!",
           examples:["🎚️ Vary pitch, pace, volume","🙆 Open posture, eye contact","🪝 Hook: start with a question/story","📋 Structure: tell-tell-tell","💬 Handle questions calmly"],
           tip:"Practice a 1-minute talk in the mirror — vary your voice! 🪞",
           funFact:"Pro speakers practice the SAME speech 50+ times — that's the secret! 🤫"},
          {title:"Super Listening",expl:"Listening is a SUPERPOWER too! 👂 Active listeners evaluate evidence, spot persuasion tricks, notice bias, and ask smart questions. Listen to UNDERSTAND, not just to reply!",
           examples:["🔍 Evaluate the evidence","🎯 Spot ethos/pathos/logos","⚖️ Notice bias & one-sidedness","🤔 Ask smart questions","Listen to understand, not just reply! 👂"],
           tip:"Next chat, listen fully before replying — true superpower! 👂",
           funFact:"We remember only about 25% of what we hear — active listening boosts that a LOT! 🧠"},
        ],
        quiz:[
          {q:"ANAPHORA is...?",opts:["the magic 3","repeating the start of lines","contrasting ideas","a question"],ans:1,exp:"🔁 Repeating the start: 'I have a dream...'!"},
          {q:"A tricolon groups ideas in...?",opts:["twos","threes","fours","fives"],ans:1,exp:"3️⃣ THREES — the magic rule of three!"},
          {q:"Active listening means...?",opts:["nodding blankly","really evaluating & engaging","just hearing words","writing everything"],ans:1,exp:"👂 Truly evaluating and engaging with what you hear!"},
          {q:"Vocal variety means changing...?",opts:["the same volume","pitch, pace & volume","just speed","nothing"],ans:1,exp:"🎚️ Pitch, pace, AND volume — keep it lively!"},
          {q:"'Ask not what your country can do for you...' uses...?",opts:["anaphora","simile","antithesis","rhyme"],ans:2,exp:"⚖️ ANTITHESIS — contrasting two ideas!"},
        ]
      },
      language_arts5:{title:"Word Artist",icon:"🎨",
        lessons:[
          {title:"Word Choice & Style",expl:"Word artists pick DICTION (word choice) and SYNTAX (sentence shape) on purpose! 🎨 Short punchy words feel urgent. Long fancy ones feel formal. Your style is YOUR signature!",
           examples:["Short words: 'He ran. Fast. Now.' 💨","Fancy words: 'He sprinted rapidly.' 🎩","Diction = your word choices 🎨","Syntax = your sentence shapes 📐","Style = your unique signature! ✍️"],
           tip:"Rewrite a boring sentence in a fancy way, then a punchy way! 🎨",
           funFact:"You can often guess an author just from their style — like a fingerprint! 🔍"},
          {title:"Finding Your Voice",expl:"Every writer has a VOICE — their one-of-a-kind personality on the page! 🎤 It grows from reading tons and writing honestly. Don't copy others — be authentically YOU!",
           examples:["🎤 Voice = your writing personality","Write what YOU know & feel ❤️","Read widely to grow your palette 📚","Imitate, then innovate! 🚀","Be honestly, boldly YOU! 🌟"],
           tip:"Write a paragraph that sounds totally like YOU — your voice! 🎤",
           funFact:"Roald Dahl's voice is so unique you can spot his writing in one sentence! 🍫"},
          {title:"Editing Like a Pro",expl:"First drafts are SUPPOSED to be messy — that's normal! 🗑️➡️✨ Real magic happens in editing: restructure big stuff, fix sentences, then hunt typos. Great writing is REWRITING!",
           examples:["✍️ Draft 1: just get it down (messy ok!)","🔧 Revise: restructure big ideas","✂️ Edit: fix flow & word choice","🔍 Proofread: catch typos","Cut anything that doesn't help! ✂️"],
           tip:"Write messy first, then make it shiny — drafts are meant to be rough! ✨",
           funFact:"Famous authors rewrite some pages 20+ times — even the pros edit like crazy! 🔄"},
        ],
        quiz:[
          {q:"DICTION means...?",opts:["sentence shape","word choice","punctuation","page count"],ans:1,exp:"🎨 WORD CHOICE — the words you pick!"},
          {q:"A writer's VOICE is...?",opts:["their volume","their handwriting","their unique writing personality","their grammar"],ans:2,exp:"🎤 Their one-of-a-kind personality on the page!"},
          {q:"PROOFREADING is about...?",opts:["restructuring","big ideas","catching typos & errors","cutting paragraphs"],ans:2,exp:"🔍 Hunting typos and small errors — the final polish!"},
          {q:"'Write what you know' means...?",opts:["only your town","draw on real experience & feeling","avoid imagination","copy others"],ans:1,exp:"❤️ Use your real experiences and feelings — authentic!"},
          {q:"SYNTAX means...?",opts:["word choice","punctuation","sentence shape & structure","spelling"],ans:2,exp:"📐 SENTENCE SHAPE — how you arrange words!"},
        ]
      }
    }
  }
};


// ── EnglishSection component ─────────────────────────────────────────────────
function EnglishSection({onScore,onBack}){
  // Three-level navigation: classes → topics → learn/quiz
  const [view,setView]=useState(()=>{try{return sessionStorage.getItem("mda_eng_view")||"classes";}catch{return"classes";}});
  const [classKey,setClassKey]=useState(()=>{try{return sessionStorage.getItem("mda_eng_class")||"";}catch{return"";}});
  const [topicKey,setTopicKey]=useState(()=>{try{return sessionStorage.getItem("mda_eng_topic")||"";}catch{return"";}});
  const [subView,setSubView]=useState(()=>{try{return sessionStorage.getItem("mda_eng_sub")||"lessons";}catch{return"lessons";}});
  const [lessonIdx,setLessonIdx]=useState(()=>{try{return parseInt(sessionStorage.getItem("mda_eng_lesson")||"0");}catch{return 0;}});
  const [completed,setCompleted]=useState(()=>{try{return JSON.parse(localStorage.getItem("mda_eng_done")||"{}");}catch{return{};}});

  // Fun feedback box state
  const [fbRating,setFbRating]=useState(()=>{try{return localStorage.getItem("mda_eng_fb_rating")||"";}catch{return"";}});
  const [fbText,setFbText]=useState("");
  const [fbSent,setFbSent]=useState(false);
  const FB_EMOJIS=[
    {e:"🤩",label:"Loved it!"},
    {e:"😀",label:"Fun!"},
    {e:"🙂",label:"Okay"},
    {e:"😐",label:"Meh"},
    {e:"😴",label:"Boring"},
  ];
  const submitFeedback=()=>{
    let firstTime=false;
    try{
      firstTime=!localStorage.getItem("mda_eng_fb_awarded");
      localStorage.setItem("mda_eng_fb_rating",fbRating);
      const log=JSON.parse(localStorage.getItem("mda_eng_fb_log")||"[]");
      log.unshift({rating:fbRating,text:fbText,ts:Date.now()});
      localStorage.setItem("mda_eng_fb_log",JSON.stringify(log.slice(0,50)));
      if(firstTime)localStorage.setItem("mda_eng_fb_awarded","1");
    }catch{}
    setFbSent(true);
    if(firstTime&&fbRating&&onScore)onScore("English_Feedback",5);
    setTimeout(()=>setFbSent(false),4000);
  };

  // Persist helpers
  const gotoView=v=>{setView(v);try{sessionStorage.setItem("mda_eng_view",v);}catch{}};
  const gotoCls=k=>{setClassKey(k);try{sessionStorage.setItem("mda_eng_class",k);}catch{}};
  const gotoTopic=k=>{setTopicKey(k);try{sessionStorage.setItem("mda_eng_topic",k);}catch{}};
  const gotoSub=v=>{setSubView(v);try{sessionStorage.setItem("mda_eng_sub",v);}catch{}};
  const gotoLesson=i=>{setLessonIdx(i);try{sessionStorage.setItem("mda_eng_lesson",String(i));}catch{}};

  const markDone=(cKey,tKey)=>{
    const key=`${cKey}_${tKey}`;
    const nc={...completed,[key]:true};
    setCompleted(nc);
    try{localStorage.setItem("mda_eng_done",JSON.stringify(nc));}catch{}
  };

  // Quiz state — single-ref pattern (no stale closures)
  const QRef=useRef({cur:0,correct:0,sel:null,done:false,scored:false});
  const [qDisp,setQDisp]=useState({cur:0,sel:null,correct:0,exp:null,done:false,pct:0});

  const startQuiz=()=>{
    QRef.current={cur:0,correct:0,sel:null,done:false,scored:false};
    setQDisp({cur:0,sel:null,correct:0,exp:null,done:false,pct:0});
    gotoSub("quiz");
  };

  const pickAnswer=useCallback((i)=>{
    const cl=ENG[classKey];
    const tp=cl&&cl.topics[topicKey];
    if(!tp||QRef.current.sel!==null||QRef.current.done)return;
    QRef.current.sel=i;
    if(i===tp.quiz[QRef.current.cur].ans)QRef.current.correct++;
    const expText=tp.quiz[QRef.current.cur].exp;
    setQDisp(d=>({...d,sel:i,correct:QRef.current.correct,exp:expText}));
    setTimeout(()=>{
      const nc=QRef.current.cur+1;
      if(nc>=tp.quiz.length){
        const p=Math.round((QRef.current.correct/tp.quiz.length)*100);
        QRef.current.done=true;
        if(!QRef.current.scored){
          QRef.current.scored=true;
          onScore(`English_${topicKey}`,QRef.current.correct*15);
        }
        if(p>=60)markDone(classKey,topicKey);
        setQDisp(d=>({...d,done:true,pct:p,exp:null}));
      } else {
        QRef.current.cur=nc;QRef.current.sel=null;
        setQDisp(d=>({...d,cur:nc,sel:null,exp:null}));
      }
    },1600);
  },[classKey,topicKey,onScore]);

  const cls=ENG[classKey];
  const topic=cls&&cls.topics[topicKey];

  // ── VIEW: classes ──────────────────────────────────────────────────────────
  if(view==="classes"){
    return(
      <div style={{position:"relative",zIndex:1,maxWidth:"920px",margin:"0 auto"}}>
        <BackBar onBack={onBack} label="Home" color="#00D2FF"/>
        {/* Header */}
        <div style={{textAlign:"center",marginBottom:"2rem",animation:"slideDown 0.4s"}}>
          <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:"0.7rem",letterSpacing:"0.22em",color:"rgba(0,210,255,0.6)",textTransform:"uppercase",marginBottom:"0.5rem"}}>MD ANAS</div>
          <GText g="linear-gradient(135deg,#00D2FF,#4D96FF,#A855F7)" size="2.2rem" style={{marginBottom:"0.4rem"}}>📚 English Fun Zone!</GText>
          <p style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.45)",fontSize:"0.88rem",marginBottom:"1rem"}}>🎈 Learn English the FUN way — silly examples, mind-blowing fun facts & quiz challenges! Pick your level! 🚀</p>
          <div style={{display:"flex",justifyContent:"center",gap:"8px",flexWrap:"wrap"}}>
            {Object.values(ENG).map((cl,i)=>(
              <span key={i} style={{fontFamily:"'Nunito',sans-serif",fontSize:"0.7rem",color:cl.color,background:`${cl.color}14`,border:`1px solid ${cl.color}33`,padding:"3px 10px",borderRadius:"20px"}}>
                {cl.emoji} {cl.label}
              </span>
            ))}
          </div>
        </div>
        {/* Class cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:"1rem"}}>
          {Object.entries(ENG).map(([key,cl],i)=>{
            const topicKeys=Object.keys(cl.topics);
            const doneCount=topicKeys.filter(tk=>completed[`${key}_${tk}`]).length;
            const pct=Math.round((doneCount/topicKeys.length)*100);
            return(
              <div key={key}
                onClick={()=>{gotoCls(key);gotoView("topics");}}
                style={{background:`linear-gradient(135deg,${cl.color}18,${cl.color}08)`,border:`1px solid ${cl.color}33`,borderRadius:"22px",padding:"1.6rem 1.3rem",cursor:"pointer",transition:"all 0.28s cubic-bezier(0.34,1.56,0.64,1)",animation:`cardEntrance 0.5s ${i*0.08}s both`}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-6px) scale(1.03)";e.currentTarget.style.boxShadow=`0 16px 36px ${cl.color}33`;e.currentTarget.style.borderColor=`${cl.color}66`;}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor=`${cl.color}33`;}}>
                {/* Header row */}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.75rem"}}>
                  <div style={{fontSize:"2.6rem",lineHeight:1}}>{cl.emoji}</div>
                  <div style={{fontFamily:"'Fredoka One',cursive",fontSize:"0.8rem",color:pct===100?"#6BCB77":cl.color,background:pct===100?"rgba(107,203,119,0.15)":`${cl.color}15`,border:`1px solid ${pct===100?"rgba(107,203,119,0.3)":cl.color+"33"}`,padding:"3px 10px",borderRadius:"20px"}}>
                    {pct===100?"🎓 Done!":pct>0?`${pct}% done`:"Start →"}
                  </div>
                </div>
                <div style={{fontFamily:"'Fredoka One',cursive",color:cl.color,fontSize:"1.35rem",marginBottom:"0.2rem"}}>{cl.label}</div>
                <div style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.55)",fontSize:"0.78rem",lineHeight:1.5,marginBottom:"0.9rem"}}>{cl.desc}</div>
                {/* Topic pills */}
                <div style={{display:"flex",gap:"4px",flexWrap:"wrap",marginBottom:"0.85rem"}}>
                  {topicKeys.map(tk=>(
                    <span key={tk} style={{fontSize:"0.65rem",fontFamily:"'Nunito',sans-serif",
                      background:completed[`${key}_${tk}`]?"rgba(107,203,119,0.2)":"rgba(255,255,255,0.06)",
                      color:completed[`${key}_${tk}`]?"#6BCB77":"rgba(255,255,255,0.4)",
                      border:`1px solid ${completed[`${key}_${tk}`]?"rgba(107,203,119,0.4)":"rgba(255,255,255,0.1)"}`,
                      padding:"2px 7px",borderRadius:"10px"}}>
                      {completed[`${key}_${tk}`]?"✅ ":""}{cl.topics[tk].title.split(" ")[0]}
                    </span>
                  ))}
                </div>
                {/* Progress bar */}
                <div style={{height:"5px",background:"rgba(255,255,255,0.07)",borderRadius:"3px",overflow:"hidden"}}>
                  <div style={{height:"5px",width:`${pct}%`,background:`linear-gradient(90deg,${cl.color},${cl.color}88)`,borderRadius:"3px",transition:"width 0.6s"}}/>
                </div>
                <div style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.3)",fontSize:"0.68rem",marginTop:"0.35rem"}}>
                  {doneCount}/{topicKeys.length} topics complete
                </div>
              </div>
            );
          })}
        </div>
        {/* Tips footer */}
        <div style={{marginTop:"1.5rem",background:"rgba(0,210,255,0.06)",border:"1px solid rgba(0,210,255,0.15)",borderRadius:"16px",padding:"1rem 1.25rem",fontFamily:"'Nunito',sans-serif",fontSize:"0.82rem",color:"rgba(255,255,255,0.5)",lineHeight:1.7,textAlign:"center"}}>
          🎯 Score 60%+ on a quiz to earn your badge · 🏆 Points zoom to your leaderboard · 💾 Your progress saves all by itself!
        </div>

        {/* ── Fun Feedback Box ── */}
        <div style={{marginTop:"1.25rem",background:"linear-gradient(135deg,rgba(255,111,200,0.1),rgba(168,85,247,0.08),rgba(0,210,255,0.08))",border:"1px solid rgba(255,111,200,0.25)",borderRadius:"20px",padding:"1.5rem 1.5rem 1.6rem",textAlign:"center",animation:"cardEntrance 0.5s 0.3s both"}}>
          <div style={{fontSize:"1.8rem",marginBottom:"0.3rem"}}>💬✨</div>
          <GText g="linear-gradient(135deg,#FF6FC8,#FFD93D,#00D2FF)" size="1.3rem" style={{marginBottom:"0.25rem"}}>How fun was English today?</GText>
          <p style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.5)",fontSize:"0.8rem",marginBottom:"1rem"}}>Tap an emoji to tell us — we love your feedback! 🥳</p>

          {/* Emoji rating row */}
          <div style={{display:"flex",gap:"8px",justifyContent:"center",flexWrap:"wrap",marginBottom:"1rem"}}>
            {FB_EMOJIS.map(opt=>(
              <button key={opt.e} onClick={()=>setFbRating(opt.e)}
                style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"3px",
                  background:fbRating===opt.e?"rgba(255,111,200,0.22)":"rgba(255,255,255,0.05)",
                  border:`2px solid ${fbRating===opt.e?"#FF6FC8":"rgba(255,255,255,0.12)"}`,
                  borderRadius:"16px",padding:"0.55rem 0.7rem",cursor:"pointer",transition:"all 0.2s",
                  transform:fbRating===opt.e?"scale(1.12) translateY(-3px)":"scale(1)",
                  minWidth:"62px"}}
                onMouseEnter={e=>{if(fbRating!==opt.e){e.currentTarget.style.background="rgba(255,255,255,0.1)";e.currentTarget.style.transform="scale(1.06)";}}}
                onMouseLeave={e=>{if(fbRating!==opt.e){e.currentTarget.style.background="rgba(255,255,255,0.05)";e.currentTarget.style.transform="scale(1)";}}}>
                <span style={{fontSize:"1.7rem",lineHeight:1,animation:fbRating===opt.e?"bounce 0.5s":"none"}}>{opt.e}</span>
                <span style={{fontFamily:"'Nunito',sans-serif",fontSize:"0.62rem",fontWeight:700,color:fbRating===opt.e?"#FF6FC8":"rgba(255,255,255,0.45)"}}>{opt.label}</span>
              </button>
            ))}
          </div>

          {/* Comment box */}
          <textarea value={fbText} onChange={e=>setFbText(e.target.value)} maxLength={200}
            placeholder="✏️ Tell us what was the funnest part... (optional)"
            style={{width:"100%",maxWidth:"440px",minHeight:"60px",resize:"vertical",
              background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.14)",
              borderRadius:"14px",padding:"0.7rem 0.9rem",color:"#fff",fontFamily:"'Nunito',sans-serif",
              fontSize:"0.85rem",outline:"none",marginBottom:"0.75rem",lineHeight:1.5}}
            onFocus={e=>e.currentTarget.style.borderColor="#FF6FC8"}
            onBlur={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.14)"}/>

          <div>
            <Btn onClick={submitFeedback} disabled={!fbRating}
              g={fbRating?"linear-gradient(135deg,#FF6FC8,#A855F7)":"rgba(255,255,255,0.08)"}
              style={{fontSize:"0.88rem",padding:"0.55rem 1.6rem",border:fbRating?"none":"1px solid rgba(255,255,255,0.14)"}}>
              {fbSent?"Thank you! 🎉":"Send Feedback 💌"}
            </Btn>
          </div>

          {/* Thank-you message */}
          {fbSent&&(
            <div style={{marginTop:"0.9rem",background:"rgba(107,203,119,0.12)",border:"1px solid rgba(107,203,119,0.3)",borderRadius:"14px",padding:"0.7rem 1rem",fontFamily:"'Fredoka One',cursive",color:"#6BCB77",fontSize:"0.95rem",animation:"affirmIn 0.4s"}}>
              🌟 Woohoo! Thanks for your feedback {fbRating} You're awesome! 🎁
            </div>
          )}
          {!fbSent&&!fbRating&&(
            <div style={{marginTop:"0.6rem",fontFamily:"'Nunito',sans-serif",fontSize:"0.72rem",color:"rgba(255,255,255,0.3)"}}>
              👆 Pick an emoji first to send your feedback!
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── VIEW: topics ───────────────────────────────────────────────────────────
  if(view==="topics"&&cls){
    return(
      <div style={{position:"relative",zIndex:1,maxWidth:"860px",margin:"0 auto"}}>
        <BackBar onBack={()=>gotoView("classes")} label="Classes" color={cls.color}/>
        <div style={{textAlign:"center",marginBottom:"1.5rem",animation:"slideDown 0.35s"}}>
          <div style={{fontSize:"3rem",marginBottom:"0.35rem"}}>{cls.emoji}</div>
          <GText g={`linear-gradient(135deg,${cls.color},#ffffffaa)`} size="1.9rem" style={{marginBottom:"0.2rem"}}>{cls.label} — English</GText>
          <p style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.45)",fontSize:"0.82rem"}}>{cls.desc}</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(195px,1fr))",gap:"1rem"}}>
          {Object.entries(cls.topics).map(([tk,tp],i)=>{
            const isDone=!!completed[`${classKey}_${tk}`];
            return(
              <div key={tk}
                onClick={()=>{
                  gotoTopic(tk);gotoLesson(0);gotoSub("lessons");
                  QRef.current={cur:0,correct:0,sel:null,done:false,scored:false};
                  setQDisp({cur:0,sel:null,correct:0,exp:null,done:false,pct:0});
                  gotoView("learn");
                }}
                style={{background:isDone?"rgba(107,203,119,0.1)":"rgba(255,255,255,0.045)",border:`1px solid ${isDone?"rgba(107,203,119,0.35)":cls.color+"28"}`,borderRadius:"18px",padding:"1.25rem 1rem",cursor:"pointer",transition:"all 0.25s",animation:`cardEntrance 0.45s ${i*0.06}s both`,position:"relative"}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.background=isDone?"rgba(107,203,119,0.18)":`${cls.color}12`;e.currentTarget.style.boxShadow=`0 12px 28px ${cls.color}22`;}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.background=isDone?"rgba(107,203,119,0.1)":"rgba(255,255,255,0.045)";e.currentTarget.style.boxShadow="none";}}>
                {isDone&&<div style={{position:"absolute",top:"9px",right:"9px",fontSize:"1.1rem"}}>✅</div>}
                <div style={{fontSize:"2rem",marginBottom:"0.4rem"}}>{tp.icon}</div>
                <div style={{fontFamily:"'Fredoka One',cursive",color:isDone?"#6BCB77":cls.color,fontSize:"1.05rem",marginBottom:"0.2rem"}}>{tp.title}</div>
                <div style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.4)",fontSize:"0.72rem",marginBottom:"0.5rem"}}>{tp.lessons.length} lessons · {tp.quiz.length} quiz questions</div>
                <div style={{fontFamily:"'Nunito',sans-serif",fontSize:"0.68rem",color:isDone?"#6BCB77":"rgba(255,255,255,0.3)",background:isDone?"rgba(107,203,119,0.12)":"rgba(255,255,255,0.05)",borderRadius:"10px",padding:"3px 8px",display:"inline-block"}}>
                  {isDone?"Completed ✓":"Click to start →"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── VIEW: learn (lessons + quiz) ───────────────────────────────────────────
  if(view==="learn"&&cls&&topic){
    const lesson=topic.lessons[lessonIdx];
    const isDone=!!completed[`${classKey}_${topicKey}`];
    const q=qDisp.cur<topic.quiz.length?topic.quiz[qDisp.cur]:null;

    return(
      <div style={{position:"relative",zIndex:1,maxWidth:"680px",margin:"0 auto"}}>
        <BackBar onBack={()=>gotoView("topics")} label={`${cls.label} Topics`} color={cls.color}/>

        {/* Topic header */}
        <div style={{textAlign:"center",marginBottom:"1.25rem",animation:"slideDown 0.35s"}}>
          <div style={{fontSize:"2.4rem",marginBottom:"0.25rem"}}>{topic.icon}</div>
          <GText g={`linear-gradient(135deg,${cls.color},#ffffffaa)`} size="1.5rem" style={{marginBottom:"0.15rem"}}>{topic.title}</GText>
          <p style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.4)",fontSize:"0.77rem"}}>
            {cls.label} · {topic.lessons.length} lessons · {topic.quiz.length} quiz Qs {isDone?"· ✅ Completed":""}
          </p>
        </div>

        {/* Sub-nav tabs */}
        <div style={{display:"flex",gap:"6px",justifyContent:"center",marginBottom:"1.25rem"}}>
          {[["lessons","📖 Learn & Giggle"],["quiz","🧠 Quiz Time!"]].map(([id,lbl])=>(
            <button key={id} onClick={()=>id==="quiz"?startQuiz():gotoSub(id)}
              style={{background:subView===id?`linear-gradient(135deg,${cls.color},${cls.color}99)`:"rgba(255,255,255,0.06)",
                color:"#fff",border:`1px solid ${subView===id?cls.color:"rgba(255,255,255,0.14)"}`,
                padding:"0.42rem 1.3rem",borderRadius:"30px",fontFamily:"'Fredoka One',cursive",
                cursor:"pointer",fontSize:"0.85rem",transition:"all 0.2s",
                boxShadow:subView===id?`0 4px 14px ${cls.color}44`:"none"}}>
              {lbl}
            </button>
          ))}
        </div>

        {/* ── Lessons ── */}
        {subView==="lessons"&&(
          <div style={{animation:"affirmIn 0.35s"}}>
            {/* Lesson pills */}
            <div style={{display:"flex",gap:"5px",justifyContent:"center",marginBottom:"0.9rem",flexWrap:"wrap"}}>
              {topic.lessons.map((l,i)=>(
                <button key={i} onClick={()=>gotoLesson(i)}
                  style={{background:lessonIdx===i?`linear-gradient(135deg,${cls.color},${cls.color}99)`:"rgba(255,255,255,0.05)",
                    color:"#fff",border:`1px solid ${lessonIdx===i?cls.color:"rgba(255,255,255,0.12)"}`,
                    padding:"0.35rem 0.85rem",borderRadius:"20px",fontFamily:"'Fredoka One',cursive",
                    cursor:"pointer",fontSize:"0.74rem",transition:"all 0.2s",whiteSpace:"nowrap"}}>
                  {i+1}. {l.title}
                </button>
              ))}
            </div>
            {/* Lesson card */}
            <Card key={`${topicKey}_${lessonIdx}`} style={{background:`linear-gradient(135deg,${cls.color}0c,rgba(255,255,255,0.03))`,border:`1px solid ${cls.color}2a`}}>
              <GText g={`linear-gradient(135deg,${cls.color},#ffffff99)`} size="1.15rem" style={{marginBottom:"0.8rem"}}>{lesson.title}</GText>
              {/* Explanation */}
              <div style={{background:`${cls.color}12`,border:`1px solid ${cls.color}30`,borderRadius:"14px",padding:"0.9rem 1rem",marginBottom:"0.75rem",fontFamily:"'Nunito',sans-serif",fontSize:"0.9rem",color:"rgba(255,255,255,0.88)",lineHeight:1.75}}>
                {lesson.expl}
              </div>
              {/* Examples */}
              <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:"14px",padding:"0.85rem 1rem",marginBottom:"0.75rem"}}>
                <div style={{fontFamily:"'Fredoka One',cursive",color:cls.color,fontSize:"0.8rem",marginBottom:"0.5rem"}}>✏️ Check These Out:</div>
                {lesson.examples.map((ex,ei)=>(
                  <div key={ei} style={{fontFamily:"'Nunito',sans-serif",fontSize:"0.85rem",color:"rgba(255,255,255,0.75)",padding:"0.3rem 0",borderBottom:ei<lesson.examples.length-1?"1px solid rgba(255,255,255,0.06)":"none",lineHeight:1.6,display:"flex",gap:"8px",alignItems:"flex-start"}}>
                    <span style={{color:cls.color,flexShrink:0}}>→</span><span>{ex}</span>
                  </div>
                ))}
              </div>
              {/* Tip */}
              <div style={{background:"rgba(255,211,61,0.07)",border:"1px solid rgba(255,211,61,0.18)",borderRadius:"12px",padding:"0.7rem 1rem",fontFamily:"'Nunito',sans-serif",fontSize:"0.83rem",color:"rgba(255,255,255,0.7)",lineHeight:1.65}}>
                <strong style={{color:"#FFD93D"}}>💡 Tip: </strong>{lesson.tip}
              </div>
              {/* Fun Fact */}
              {lesson.funFact&&(
                <div style={{marginTop:"0.65rem",background:"linear-gradient(135deg,rgba(255,111,200,0.1),rgba(168,85,247,0.08))",border:"1px solid rgba(255,111,200,0.25)",borderRadius:"12px",padding:"0.7rem 1rem",fontFamily:"'Nunito',sans-serif",fontSize:"0.83rem",color:"rgba(255,255,255,0.72)",lineHeight:1.65}}>
                  <strong style={{color:"#FF6FC8"}}>🤯 Fun Fact: </strong>{lesson.funFact}
                </div>
              )}
              {/* Navigation */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"1.2rem",borderTop:"1px solid rgba(255,255,255,0.07)",paddingTop:"1rem"}}>
                <Btn onClick={()=>gotoLesson(Math.max(0,lessonIdx-1))} g="rgba(255,255,255,0.07)" disabled={lessonIdx===0}
                  style={{border:"1px solid rgba(255,255,255,0.14)",fontSize:"0.82rem",padding:"0.45rem 1rem"}}>← Prev</Btn>
                <span style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.28)",fontSize:"0.72rem"}}>{lessonIdx+1} / {topic.lessons.length}</span>
                {lessonIdx<topic.lessons.length-1
                  ?<Btn onClick={()=>gotoLesson(lessonIdx+1)} g={`linear-gradient(135deg,${cls.color},${cls.color}88)`} style={{fontSize:"0.82rem",padding:"0.45rem 1rem"}}>Next →</Btn>
                  :<Btn onClick={startQuiz} g={`linear-gradient(135deg,${cls.color},#FFD93D)`} style={{fontSize:"0.82rem",padding:"0.45rem 1rem",animation:"pulse 1.5s infinite"}}>Take Quiz 🧠</Btn>
                }
              </div>
            </Card>
          </div>
        )}

        {/* ── Quiz ── */}
        {subView==="quiz"&&(
          <Card style={{background:`linear-gradient(135deg,${cls.color}0c,rgba(255,255,255,0.03))`,border:`1px solid ${cls.color}2a`,animation:"affirmIn 0.35s"}}>
            <GText g={`linear-gradient(135deg,${cls.color},#ffffff88)`} size="1.1rem" style={{marginBottom:"0.75rem",textAlign:"center"}}>🧠 {topic.title} Quiz</GText>
            {!qDisp.done&&q?(
              <div>
                <div style={{display:"flex",justifyContent:"space-between",fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.4)",fontSize:"0.8rem",marginBottom:"0.5rem"}}>
                  <span>Q {qDisp.cur+1} / {topic.quiz.length}</span>
                  <span>✅ {qDisp.correct} correct</span>
                </div>
                <div style={{height:"5px",background:"rgba(255,255,255,0.07)",borderRadius:"3px",marginBottom:"1rem"}}>
                  <div style={{height:"5px",background:`linear-gradient(90deg,${cls.color},${cls.color}88)`,borderRadius:"3px",width:`${(qDisp.cur/topic.quiz.length)*100}%`,transition:"width 0.5s"}}/>
                </div>
                <p style={{fontFamily:"'Fredoka One',cursive",fontSize:"1.05rem",color:"#fff",textAlign:"center",lineHeight:1.55,marginBottom:"1rem"}}>{q.q}</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"0.75rem"}}>
                  {q.opts.map((o,i)=>{
                    let bg="rgba(255,255,255,0.06)",bdr="1px solid rgba(255,255,255,0.12)",col="#fff";
                    if(qDisp.sel!==null){
                      if(i===q.ans){bg="rgba(107,203,119,0.25)";bdr="2px solid #6BCB77";col="#6BCB77";}
                      else if(i===qDisp.sel){bg="rgba(255,107,107,0.25)";bdr="2px solid #FF6B6B";col="#FF6B6B";}
                    }
                    return(
                      <button key={i} onClick={()=>pickAnswer(i)} disabled={qDisp.sel!==null}
                        style={{background:bg,border:bdr,borderRadius:"13px",padding:"0.7rem 0.5rem",fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:"0.85rem",cursor:qDisp.sel!==null?"default":"pointer",color:col,transition:"all 0.3s",lineHeight:1.4,textAlign:"left"}}
                        onMouseEnter={e=>{if(qDisp.sel===null)e.currentTarget.style.background=`${cls.color}1a`;}}
                        onMouseLeave={e=>{if(qDisp.sel===null)e.currentTarget.style.background="rgba(255,255,255,0.06)";}}>
                        {o}
                      </button>
                    );
                  })}
                </div>
                {qDisp.exp&&(
                  <div style={{background:`${cls.color}12`,border:`1px solid ${cls.color}30`,borderRadius:"12px",padding:"0.65rem 1rem",fontFamily:"'Nunito',sans-serif",fontSize:"0.85rem",color:"rgba(255,255,255,0.82)",animation:"slideUp 0.3s",lineHeight:1.6}}>
                    💡 {qDisp.exp}
                  </div>
                )}
              </div>
            ):(
              <div style={{textAlign:"center",padding:"0.75rem 0"}}>
                <div style={{fontSize:"3.5rem",marginBottom:"0.4rem",animation:"bounce 0.6s"}}>
                  {qDisp.pct>=80?"🏆":qDisp.pct>=60?"⭐":"📚"}
                </div>
                <GText g={`linear-gradient(135deg,${cls.color},#FFD93D)`} size="1.5rem" style={{marginBottom:"0.3rem"}}>
                  {qDisp.correct}/{topic.quiz.length} Correct!
                </GText>
                <div style={{fontFamily:"'Fredoka One',cursive",color:"#FFD93D",marginBottom:"0.6rem"}}>
                  {qDisp.pct}% — {qDisp.pct>=80?"🏆 Excellent!":qDisp.pct>=60?"⭐ Good work!":qDisp.pct>=40?"📚 Keep studying!":"Try again!"}
                </div>
                {qDisp.pct>=60&&(
                  <div style={{background:"rgba(107,203,119,0.1)",border:"1px solid rgba(107,203,119,0.28)",borderRadius:"12px",padding:"0.55rem 0.9rem",marginBottom:"0.65rem",fontFamily:"'Nunito',sans-serif",fontSize:"0.8rem",color:"#6BCB77"}}>
                    ✅ Topic marked complete! Great job!
                  </div>
                )}
                <div style={{background:`${cls.color}12`,border:`1px solid ${cls.color}30`,borderRadius:"14px",padding:"0.65rem",margin:"0.4rem 0 0.9rem",fontFamily:"'Nunito',sans-serif"}}>
                  <span style={{color:"rgba(255,255,255,0.45)",fontSize:"0.85rem"}}>Points earned: </span>
                  <span style={{fontFamily:"'Fredoka One',cursive",color:cls.color,fontSize:"1.25rem"}}>{qDisp.correct*15} ✨</span>
                </div>
                <div style={{display:"flex",gap:"8px",justifyContent:"center",flexWrap:"wrap"}}>
                  <Btn onClick={startQuiz} g="rgba(255,255,255,0.08)" style={{border:"1px solid rgba(255,255,255,0.18)",fontSize:"0.82rem"}}>Retry Quiz 🔄</Btn>
                  <Btn onClick={()=>{gotoSub("lessons");gotoLesson(0);}} g={`linear-gradient(135deg,${cls.color},${cls.color}88)`} style={{fontSize:"0.82rem"}}>Review Lessons 📖</Btn>
                  <Btn onClick={()=>gotoView("topics")} g={`linear-gradient(135deg,${cls.color},#FFD93D)`} style={{fontSize:"0.82rem"}}>Next Topic →</Btn>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    );
  }

  // Fallback — should not happen
  return(
    <div style={{textAlign:"center",padding:"2rem"}}>
      <Btn onClick={()=>gotoView("classes")} g="linear-gradient(135deg,#00D2FF,#A855F7)">📚 Go to English</Btn>
    </div>
  );
}


function DrawSection({onBack}){
  const cRef=useRef(null);
  const [drawing,setDrawing]=useState(false);
  const [color,setColor]=useState("#FF6B6B");
  const [size,setSize]=useState(8);
  const [tool,setTool]=useState("draw");
  const last=useRef(null);
  const getP=(e,c)=>{const r=c.getBoundingClientRect();if(e.touches)return{x:e.touches[0].clientX-r.left,y:e.touches[0].clientY-r.top};return{x:e.clientX-r.left,y:e.clientY-r.top};}
  const sd=e=>{e.preventDefault();setDrawing(true);last.current=getP(e,cRef.current);}
  const dr=e=>{e.preventDefault();if(!drawing)return;const cv=cRef.current,ctx=cv.getContext("2d"),pos=getP(e,cv);ctx.beginPath();ctx.moveTo(last.current.x,last.current.y);ctx.lineTo(pos.x,pos.y);ctx.strokeStyle=tool==="erase"?"#1a1a2e":color;ctx.lineWidth=tool==="erase"?30:size;ctx.lineCap="round";ctx.lineJoin="round";ctx.stroke();last.current=pos;}
  const clear=()=>{const ctx=cRef.current.getContext("2d");ctx.clearRect(0,0,cRef.current.width,cRef.current.height);}
  const palette=["#FF6B6B","#FF9A3C","#FFD93D","#6BCB77","#4D96FF","#A855F7","#FF6FC8","#00D2FF","#fff","#aaa"];
  return(
    <div style={{maxWidth:"620px",margin:"0 auto",textAlign:"center",position:"relative",zIndex:1}}>
      <BackBar onBack={onBack} label="Home" color="#6BCB77"/>
      <GText g="linear-gradient(135deg,#6BCB77,#00D2FF)" size="2rem" style={{marginBottom:"1rem"}}>🎨 Art Studio</GText>
      <Card>
        <div style={{display:"flex",gap:"7px",justifyContent:"center",flexWrap:"wrap",marginBottom:"0.75rem"}}>
          {palette.map(c=><div key={c} onClick={()=>{setColor(c);setTool("draw");}} style={{width:"32px",height:"32px",borderRadius:"50%",background:c,cursor:"pointer",border:color===c&&tool==="draw"?"3px solid #fff":"3px solid rgba(255,255,255,0.15)",boxShadow:color===c&&tool==="draw"?`0 0 12px ${c}88`:"none",transition:"all 0.15s"}}/>)}
        </div>
        <div style={{display:"flex",gap:"8px",justifyContent:"center",flexWrap:"wrap",marginBottom:"0.75rem",alignItems:"center"}}>
          <label style={{fontFamily:"'Nunito',sans-serif",fontSize:"0.8rem",color:"rgba(255,255,255,0.5)",display:"flex",alignItems:"center",gap:"5px"}}>Size:<input type="range" min="2" max="30" value={size} onChange={e=>setSize(+e.target.value)} style={{width:"70px"}}/></label>
          {[{id:"draw",label:"✏️ Draw"},{id:"erase",label:"🧹 Erase"}].map(t=><Btn key={t.id} onClick={()=>setTool(t.id)} g={tool===t.id?"linear-gradient(135deg,#6BCB77,#00D2FF)":"rgba(255,255,255,0.1)"} style={{padding:"0.3rem 0.8rem",fontSize:"0.8rem"}}>{t.label}</Btn>)}
          <Btn onClick={clear} g="linear-gradient(135deg,#FF6B6B,#FF9A3C)" style={{padding:"0.3rem 0.8rem",fontSize:"0.8rem"}}>🗑 Clear</Btn>
        </div>
        <canvas ref={cRef} width={540} height={300} style={{borderRadius:"14px",background:"#1a1a2e",touchAction:"none",cursor:"crosshair",maxWidth:"100%",display:"block",margin:"0 auto",border:"1px solid rgba(255,255,255,0.08)"}} onMouseDown={sd} onMouseMove={dr} onMouseUp={()=>setDrawing(false)} onMouseLeave={()=>setDrawing(false)} onTouchStart={sd} onTouchMove={dr} onTouchEnd={()=>setDrawing(false)}/>
        <p style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.25)",fontSize:"0.78rem",marginTop:"0.5rem"}}>Draw anything you imagine! 🌈</p>
      </Card>
    </div>
  );
}

// ── Leaderboard ───────────────────────────────────────────────────────────────
function Leaderboard({currentUser,onBack}){
  const [board,setBoard]=useState([]);
  const [myData,setMyData]=useState(null);
  const [view,setView]=useState("global"); // global | me
  useEffect(()=>{
    setBoard(getBoard());
    if(currentUser){const u=dbGetUser(currentUser);setMyData(u);}
  },[currentUser]);
  const refresh=()=>{setBoard(getBoard());if(currentUser){const u=dbGetUser(currentUser);setMyData(u);}};
  const medals=["🥇","🥈","🥉"];
  const gKeys=["ClickStar","Memory","DarkRoom","GhostChase","CarRace","SlidePuzzle","WordUnscramble","NumSequence","MindMap","PatternGame","SpeedMath","IQTest","VisualIQ","Coding"];
  const gLabels={ClickStar:"🎯",Memory:"🃏",DarkRoom:"🌑",GhostChase:"👻",CarRace:"🚗",SlidePuzzle:"🔢",WordUnscramble:"📝",NumSequence:"🔢",MindMap:"🗺️",PatternGame:"🔍",SpeedMath:"⚡",IQTest:"🧩",VisualIQ:"🖼️",Coding:"💻"};
  const myRank=board.findIndex(p=>p.name===currentUser)+1;

  return(
    <div style={{maxWidth:"760px",margin:"0 auto",position:"relative",zIndex:1}}>
      <BackBar onBack={onBack} label="Home" color="#FFD93D"/>
      <GText g="linear-gradient(135deg,#FFD93D,#FF9A3C,#A855F7)" size="2rem" style={{textAlign:"center",marginBottom:"0.4rem"}}>🏆 Global Leaderboard</GText>
      <p style={{textAlign:"center",fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.35)",fontSize:"0.82rem",marginBottom:"1rem"}}>All players saved forever • Top 50 ranked • Updates in real-time</p>

      {/* Tabs */}
      <div style={{display:"flex",justifyContent:"center",gap:"8px",marginBottom:"1.25rem"}}>
        {[["global","🏆 Global Top 50"],["me","👤 My Profile"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setView(id)}
            style={{background:view===id?"linear-gradient(135deg,#FFD93D,#FF9A3C)":"rgba(255,255,255,0.07)",
              color:"#fff",border:view===id?"none":"1px solid rgba(255,255,255,0.18)",padding:"0.45rem 1.2rem",
              borderRadius:"30px",fontFamily:"'Fredoka One',cursive",cursor:"pointer",fontSize:"0.88rem",transition:"all 0.2s"}}>
            {lbl}
          </button>
        ))}
      </div>

      {view==="global"&&(
        <>
          {board.length===0&&<Card style={{textAlign:"center"}}><div style={{fontSize:"3rem"}}>🎮</div><div style={{fontFamily:"'Fredoka One',cursive",color:"rgba(255,255,255,0.3)",fontSize:"1.1rem",marginTop:"0.5rem"}}>No players yet — be the first!</div></Card>}
          {board.length>0&&(
            <div style={{textAlign:"center",fontFamily:"'Nunito',sans-serif",fontSize:"0.78rem",color:"rgba(255,255,255,0.4)",marginBottom:"0.85rem"}}>
              🌍 {board.length} player{board.length!==1?"s":""} registered · showing top {Math.min(board.length,50)}
            </div>
          )}
          <div style={{display:"flex",flexDirection:"column",gap:"9px",maxHeight:"70vh",overflowY:"auto",paddingRight:"4px"}}>
            {board.slice(0,50).map((p,i)=>(
              <div key={p.name}
                style={{background:p.name===currentUser?"rgba(255,211,61,0.09)":"rgba(255,255,255,0.04)",
                  border:p.name===currentUser?"2px solid rgba(255,211,61,0.45)":"1px solid rgba(255,255,255,0.09)",
                  borderRadius:"18px",padding:"0.9rem 1.2rem",display:"flex",alignItems:"center",gap:"12px",
                  backdropFilter:"blur(8px)",animation:`slideIn 0.3s ${Math.min(i,15)*0.04}s both`}}>
                <div style={{fontSize:i<3?"1.7rem":"1rem",minWidth:"34px",textAlign:"center",fontFamily:"'Fredoka One',cursive",color:i<3?"#fff":"rgba(255,255,255,0.5)"}}>{medals[i]||`#${i+1}`}</div>
                <div style={{width:"42px",height:"42px",borderRadius:"50%",
                  background:`linear-gradient(135deg,${COLORS[i%COLORS.length]},${COLORS[(i+3)%COLORS.length]})`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontFamily:"'Fredoka One',cursive",fontSize:"0.88rem",color:"#fff",flexShrink:0}}>
                  {p.avatar||p.name.slice(0,2).toUpperCase()}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:"'Fredoka One',cursive",fontSize:"0.95rem",color:"#fff",
                    display:"flex",alignItems:"center",gap:"6px",flexWrap:"wrap"}}>
                    {p.name}
                    {p.name===currentUser&&<span style={{fontSize:"0.62rem",background:"rgba(255,211,61,0.25)",color:"#FFD93D",padding:"1px 8px",borderRadius:"10px",border:"1px solid rgba(255,211,61,0.35)"}}>YOU</span>}
                    {p.provider==="guest"&&<span style={{fontSize:"0.6rem",background:"rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.4)",padding:"1px 7px",borderRadius:"10px"}}>👤 Guest</span>}
                  </div>
                  <div style={{display:"flex",gap:"5px",flexWrap:"wrap",marginTop:"3px"}}>
                    {p.total>0?gKeys.map(g=>p.scores&&p.scores[g]?<span key={g} style={{fontFamily:"'Nunito',sans-serif",fontSize:"0.68rem",color:"rgba(255,255,255,0.4)"}}>{gLabels[g]}{p.scores[g]}</span>:null):<span style={{fontFamily:"'Nunito',sans-serif",fontSize:"0.68rem",color:"rgba(255,255,255,0.28)"}}>Hasn't played yet — total 0</span>}
                  </div>
                </div>
                <div style={{fontFamily:"'Fredoka One',cursive",fontSize:"1.4rem",color:"#FFD93D",minWidth:"58px",textAlign:"right"}}>
                  {p.total||0}
                  <div style={{fontSize:"0.6rem",color:"rgba(255,255,255,0.28)",fontFamily:"'Nunito',sans-serif"}}>pts</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{textAlign:"center",marginTop:"1rem"}}>
            <Btn onClick={refresh} g="linear-gradient(135deg,#4D96FF,#A855F7)" style={{fontSize:"0.9rem"}}>🔄 Refresh</Btn>
          </div>
        </>
      )}

      {view==="me"&&(
        <div>
          {/* Profile card */}
          <Card style={{marginBottom:"1rem",textAlign:"center"}}>
            <div style={{width:"72px",height:"72px",borderRadius:"50%",
              background:"linear-gradient(135deg,#FF6B6B,#A855F7)",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontFamily:"'Fredoka One',cursive",fontSize:"1.6rem",color:"#fff",margin:"0 auto 0.75rem"}}>
              {currentUser.slice(0,2).toUpperCase()}
            </div>
            <GText g="linear-gradient(135deg,#FFD93D,#FF9A3C)" size="1.4rem" style={{marginBottom:"0.2rem"}}>{currentUser}</GText>
            <div style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.45)",fontSize:"0.8rem",marginBottom:"0.75rem"}}>
              {myRank>0?`Ranked #${myRank} globally`:"Play games to get ranked!"} &nbsp;|&nbsp; {myData?.provider||"email"} account
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px",maxWidth:"380px",margin:"0 auto"}}>
              {[{label:"Total Points",val:myData?.total||0,icon:"⭐"},{label:"Games Played",val:Object.keys(myData?.scores||{}).length,icon:"🎮"},{label:"Best Game",val:Object.entries(myData?.scores||{}).sort((a,b)=>b[1]-a[1])[0]?.[0]||"-",icon:"🏆"}].map(s=>(
                <div key={s.label} style={{background:"rgba(255,255,255,0.06)",borderRadius:"14px",padding:"0.75rem 0.5rem",border:"1px solid rgba(255,255,255,0.1)"}}>
                  <div style={{fontSize:"1.4rem"}}>{s.icon}</div>
                  <div style={{fontFamily:"'Fredoka One',cursive",color:"#FFD93D",fontSize:"1.1rem"}}>{s.val}</div>
                  <div style={{fontFamily:"'Nunito',sans-serif",color:"rgba(255,255,255,0.4)",fontSize:"0.68rem"}}>{s.label}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Score breakdown */}
          {myData&&Object.keys(myData.scores||{}).length>0&&(
            <Card style={{marginBottom:"1rem"}}>
              <div style={{fontFamily:"'Fredoka One',cursive",color:"#fff",fontSize:"1rem",marginBottom:"0.75rem"}}>📊 Score Breakdown</div>
              <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
                {Object.entries(myData.scores||{}).sort((a,b)=>b[1]-a[1]).map(([game,pts])=>(
                  <div key={game} style={{display:"flex",alignItems:"center",gap:"8px"}}>
                    <span style={{fontFamily:"'Nunito',sans-serif",fontSize:"0.8rem",color:"rgba(255,255,255,0.6)",minWidth:"100px"}}>{gLabels[game]||"🎮"} {game}</span>
                    <div style={{flex:1,height:"6px",background:"rgba(255,255,255,0.07)",borderRadius:"3px"}}>
                      <div style={{height:"6px",borderRadius:"3px",width:`${Math.min(100,(pts/Math.max(...Object.values(myData.scores)))*100)}%`,background:"linear-gradient(90deg,#4D96FF,#A855F7)",transition:"width 0.5s"}}/>
                    </div>
                    <span style={{fontFamily:"'Fredoka One',cursive",color:"#FFD93D",fontSize:"0.85rem",minWidth:"40px",textAlign:"right"}}>{pts}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Activity log */}
          {myData?.activities?.length>0&&(
            <Card>
              <div style={{fontFamily:"'Fredoka One',cursive",color:"#fff",fontSize:"1rem",marginBottom:"0.75rem"}}>📋 Recent Activity</div>
              <div style={{display:"flex",flexDirection:"column",gap:"6px",maxHeight:"200px",overflowY:"auto"}}>
                {myData.activities.slice(0,15).map((a,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                    padding:"0.4rem 0.6rem",background:"rgba(255,255,255,0.04)",borderRadius:"8px"}}>
                    <span style={{fontFamily:"'Nunito',sans-serif",fontSize:"0.78rem",color:"rgba(255,255,255,0.6)"}}>
                      {gLabels[a.game]||"🎮"} {a.game}
                    </span>
                    <span style={{fontFamily:"'Fredoka One',cursive",color:"#6BCB77",fontSize:"0.82rem"}}>+{a.pts} pts</span>
                    <span style={{fontFamily:"'Nunito',sans-serif",fontSize:"0.68rem",color:"rgba(255,255,255,0.3)"}}>{a.ts}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App(){
  const [user,setUser]=useState(null);
  const [confetti,setConfetti]=useState(false);
  const [toast,setToast]=useState(null);

  // ── Navigation history for back-button support ─────────────────────────────
  // Restore last section from sessionStorage so returning to the tab brings user back
  const [active,setActiveRaw]=useState(()=>{
    try{return sessionStorage.getItem("mda_active")||"home";}catch{return "home";}
  });
  const [history,setHistory]=useState(["home"]);

  const setActive=(next)=>{
    if(next===active)return;
    setHistory(h=>[...h.slice(-9),next]); // keep last 10 entries
    setActiveRaw(next);
    try{sessionStorage.setItem("mda_active",next);}catch{}
    window.scrollTo({top:0,behavior:"smooth"});
  };

  const goBack=()=>{
    const prev=history.length>=2?history[history.length-2]:"home";
    const newH=history.slice(0,-1);
    setHistory(newH.length?newH:["home"]);
    setActiveRaw(prev);
    try{sessionStorage.setItem("mda_active",prev);}catch{}
    window.scrollTo({top:0,behavior:"smooth"});
  };

  const goHome=()=>{
    setHistory(["home"]);
    setActiveRaw("home");
    try{sessionStorage.setItem("mda_active","home");}catch{}
    window.scrollTo({top:0,behavior:"smooth"});
  };

  // Ensure mobile devices scale the layout correctly (inject viewport meta once)
  useEffect(()=>{
    try{
      let m=document.querySelector('meta[name="viewport"]');
      if(!m){m=document.createElement("meta");m.name="viewport";document.head.appendChild(m);}
      m.content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover";
    }catch{}
  },[]);

  // One-time sync: make sure every registered user appears on the leaderboard
  // (so names persist long-term and nobody vanishes after logging in)
  useEffect(()=>{
    try{
      const db=loadDB();
      Object.values(db.users||{}).forEach(u=>{
        dbEnsureBoard(u.name,u.avatar,u.provider);
        // keep board total in sync with the user's real total
        const b=getBoard();const row=b.find(r=>r.name===u.name);
        if(row&&(u.total||0)>(row.total||0)){row.total=u.total;row.scores=u.scores||row.scores;b.sort((a,c)=>c.total-a.total);saveBoard(b);}
      });
    }catch{}
  },[]);

  useEffect(()=>{if(user){setConfetti(true);setTimeout(()=>setConfetti(false),4500);}},[user]);

  const handleScore=(game,pts)=>{
    if(!user||pts<=0)return;
    dbAddScore(user,game,pts);
    setToast(`+${pts} pts — ${game}! 🎉`);
    setTimeout(()=>setToast(null),2800);
  };

  if(!user)return(<><style>{G_CSS}</style><Background/><AuthModal onLogin={n=>{setUser(n);try{sessionStorage.removeItem("mda_active");}catch{}setActiveRaw("home");}}/></>);

  const nav={setActive,goBack,goHome};

  const sections={
    home:<HomePage setActive={setActive} user={user}/>,
    affirm:<Affirmations onBack={goBack}/>,
    games:<GamesSection onScore={handleScore} onBack={goBack}/>,
    cars:<CarGame onScore={handleScore} onBack={goBack}/>,
    puzzle:<PuzzleSection onScore={handleScore} onBack={goBack}/>,
    brain:<BrainSection onScore={handleScore} onBack={goBack}/>,
    iq:<IQSection onScore={handleScore} onBack={goBack}/>,
    football:<FootballZone onScore={handleScore} onBack={goBack}/>,
    coding:<CodingSkills onScore={handleScore} onBack={goBack}/>,
    comedy:<ComedySection user={user} onBack={goBack}/>,
    english:<EnglishSection onScore={handleScore} onBack={goBack}/>,
    draw:<DrawSection onBack={goBack}/>,
    leaderboard:<Leaderboard currentUser={user} onBack={goBack}/>,
  };

  const isHome=active==="home";

  return(
    <>
      <style>{G_CSS}</style>
      <Background/>
      {confetti&&<Confetti/>}
      <Navbar active={active} setActive={setActive} user={user} onLogout={()=>{setUser(null);setActiveRaw("home");try{sessionStorage.clear();}catch{}}}/>
      <div style={{maxWidth:"1100px",margin:"0 auto",padding:"clamp(1rem,4vw,1.5rem) clamp(0.6rem,3vw,1rem) 4rem",position:"relative",zIndex:1}}>
        {sections[active]||sections.home}
      </div>
      {/* Floating back button — shown on all non-home sections */}
      {!isHome&&<FloatBack onBack={goBack}/>}
      {toast&&<div style={{position:"fixed",bottom:"80px",right:"20px",background:"linear-gradient(135deg,#6BCB77,#00D2FF)",color:"#fff",padding:"0.65rem 1.3rem",borderRadius:"30px",fontFamily:"'Fredoka One',cursive",fontSize:"1rem",zIndex:900,boxShadow:"0 6px 24px rgba(0,0,0,0.45)",animation:"slideUp 0.3s"}}>{toast}</div>}
      <button style={{position:"fixed",bottom:"22px",right:"22px",background:"linear-gradient(135deg,#A855F7,#FF6FC8)",color:"#fff",border:"none",width:"46px",height:"46px",borderRadius:"50%",fontSize:"1.2rem",cursor:"pointer",boxShadow:"0 4px 20px rgba(168,85,247,0.55)",zIndex:500,animation:"glow 2s infinite"}}>🎵</button>
    </>
  );
}
