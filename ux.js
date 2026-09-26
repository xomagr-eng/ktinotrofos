/* ================= ΚΤΗΝΟΤΡΟΦΟΣ ΤΝ — ΚΑΘΗΜΕΡΙΝΗ ΧΡΗΣΗ (v1.8) =================
   Φορτώνει μετά τον κύριο κώδικα & χρησιμοποιεί τα ίδια globals (DB, save, SP, $, modal, printDoc…).
   1 Οδηγός πρώτης χρήσης · 2 Κάτω μπάρα κινητού · 3 Γρήγορη καταγραφή (+ φωνή)
   4 Οθόνη «Σήμερα» με λίστα ✓ · 5 Υπενθυμίσεις (ειδοποιήσεις + .ics) · 6 Αντίγραφα ασφαλείας
   7 Στατιστικά/γραφήματα · 8 Μεγάλα γράμματα & υψηλή αντίθεση · 9 Καρτέλα ζώου, βιβλίο φαρμάκων, νεογέννητα */
(function(){
'use strict';
DB.settings=DB.settings||{};
const ST=DB.settings;
ST.snooze=ST.snooze||{}; ST.notified=ST.notified||{};

/* ---------------- CSS ---------------- */
const css=`
:root{--c-in:#0880a8;--c-out:#b3261e;--c-prev:#8f8384}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--c-in:#1a9cc0;--c-out:#e4222f;--c-prev:#7d7072}}
:root[data-theme="dark"]{--c-in:#1a9cc0;--c-out:#e4222f;--c-prev:#7d7072}
html.big body{zoom:1.16}
html.hc{--muted:var(--ink)!important;--line:#7a6b6d!important}
html.hc .card,html.hc .listitem,html.hc .prog{border-width:2px}
html.hc .small,html.hc .hint{color:var(--ink)!important}
.bnav{display:none}
.fab{position:fixed;right:18px;bottom:22px;z-index:60;width:62px;height:62px;border-radius:50%;border:none;background:var(--accent);color:#fff;font-size:34px;line-height:1;box-shadow:0 6px 18px rgba(0,0,0,.35);cursor:pointer}
.fab:active{transform:scale(.94)}
@media(max-width:760px) and (orientation:portrait){
  #tabs{display:none!important}
  body{padding-bottom:82px}
  .fab{display:none}
  .bnav{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:60;background:var(--panel);border-top:1px solid var(--line);padding:4px 4px calc(4px + env(safe-area-inset-bottom));justify-content:space-around;align-items:flex-end;box-shadow:0 -4px 14px rgba(0,0,0,.18)}
  .bnav button{flex:1;background:none;border:none;color:var(--muted);font-size:11px;font-weight:700;padding:6px 2px;display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer}
  .bnav button .i{font-size:22px;line-height:1}
  .bnav button.on{color:var(--accent)}
  .bnav .plus{flex:0 0 auto}
  .bnav .plus .i{width:58px;height:58px;border-radius:50%;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-size:32px;margin-top:-26px;box-shadow:0 6px 16px rgba(0,0,0,.35)}
}
/* ---- ΟΡΙΖΟΝΤΙΑ: κινητό → κάθετη μπάρα αριστερά, συμπαγής κεφαλίδα ---- */
@media (orientation:landscape) and (max-height:540px){
  #tabs{display:none!important}
  .fab{display:none}
  body{padding-left:calc(78px + env(safe-area-inset-left));padding-bottom:0}
  header{position:static;padding:6px 12px;gap:8px} header .logo{font-size:20px} header h1{font-size:15px} header .sub{display:none}
  .bnav{display:flex;flex-direction:column;justify-content:space-around;align-items:center;position:fixed;left:0;top:0;bottom:0;width:calc(76px + env(safe-area-inset-left));padding:6px 2px 6px env(safe-area-inset-left);z-index:60;background:var(--panel);border-right:1px solid var(--line);box-shadow:4px 0 14px rgba(0,0,0,.18)}
  .bnav button{background:none;border:none;color:var(--muted);font-size:10.5px;font-weight:700;padding:4px 2px;display:flex;flex-direction:column;align-items:center;gap:1px;cursor:pointer;width:100%}
  .bnav button .i{font-size:21px;line-height:1}
  .bnav button.on{color:var(--accent)}
  .bnav .plus .i{width:50px;height:50px;border-radius:50%;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-size:28px;box-shadow:0 4px 12px rgba(0,0,0,.3)}
  .wrap{padding:8px 10px}
  .pmodal{padding:6px}
  .pmodal .pbox{max-width:96vw}
  .toast{bottom:16px}
}
/* ---- ΟΡΙΖΟΝΤΙΑ / ΦΑΡΔΙΕΣ ΟΘΟΝΕΣ: αξιοποίηση του πλάτους με 2 στήλες ---- */
@media (orientation:landscape) and (min-width:700px){
  .grid{grid-template-columns:minmax(300px,380px) 1fr!important}
  .grid2{grid-template-columns:1fr 1fr!important}
  .tgrid{display:grid;grid-template-columns:1.35fr 1fr;gap:12px;align-items:start}
  .kpi{grid-template-columns:repeat(auto-fit,minmax(110px,1fr))}
  .pmodal .pbox{max-width:min(1000px,96vw)}
  .pmodal .pgrid{grid-template-columns:repeat(auto-fit,minmax(170px,1fr))}
  .vidgrid{grid-template-columns:repeat(auto-fill,minmax(300px,1fr))}
}
@media (min-width:1300px){ .wrap{max-width:1600px} .enc-grid{grid-template-columns:repeat(auto-fill,minmax(180px,1fr))} }
/* βίντεο: να χωράει πάντα στο ύψος της οθόνης */
.ytbox iframe,.ytph{max-height:78vh;width:min(100%,calc(78vh*16/9));margin-left:auto;margin-right:auto}
/* κουμπί πλήρους οθόνης */
:fullscreen body{overscroll-behavior:none}
.qgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:8px}
.qbtn{background:var(--bg);border:1px solid var(--line);border-radius:14px;padding:12px 6px;display:flex;flex-direction:column;align-items:center;gap:4px;font-weight:700;font-size:13px;color:var(--ink);cursor:pointer;min-height:84px;justify-content:center;text-align:center}
.qbtn .i{font-size:30px;line-height:1}
.qbtn:hover,.qbtn.on{border-color:var(--accent);background:rgba(228,34,47,.08)}
.bignum{font-size:30px!important;font-weight:800;text-align:center;padding:10px!important}
.chips{display:flex;gap:6px;flex-wrap:wrap;margin:4px 0 8px}
.chips button{background:var(--bg);border:1px solid var(--line);color:var(--ink);border-radius:18px;padding:6px 12px;font-weight:700;cursor:pointer}
.chips button.on{background:var(--accent);color:#fff;border-color:transparent}
.hello{font-size:22px;font-weight:800;margin:0}
.task{display:flex;gap:10px;align-items:flex-start;border:1px solid var(--line);border-left:4px solid var(--accent2);border-radius:12px;padding:10px;margin-bottom:8px;background:var(--bg)}
.task.p0{border-left-color:var(--bad)} .task.p1{border-left-color:var(--warn)} .task.info{border-left-color:var(--ok)}
.task .tick{flex:0 0 auto;width:40px;height:40px;border-radius:50%;border:2px solid var(--line);background:var(--panel);font-size:20px;cursor:pointer;color:var(--ink)}
.task .tick:hover{border-color:var(--accent);background:rgba(228,34,47,.1)}
.task .tb{flex:1;min-width:0} .task .tt{font-weight:700} .task .td{font-size:12.5px;color:var(--muted);margin-top:2px}
.task .ta{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}
.streak{display:inline-flex;align-items:center;gap:6px;background:rgba(201,149,27,.15);color:var(--gold);border-radius:20px;padding:4px 12px;font-weight:800;font-size:13px}
.toast{position:fixed;left:50%;bottom:96px;transform:translateX(-50%);background:var(--ink);color:var(--bg);padding:10px 16px;border-radius:12px;z-index:200;font-weight:700;display:flex;gap:12px;align-items:center;box-shadow:0 6px 20px rgba(0,0,0,.35);max-width:92vw}
.toast button{background:none;border:1px solid currentColor;color:inherit;border-radius:8px;padding:4px 10px;font-weight:800;cursor:pointer}
.wiz-step{font-size:12px;color:var(--muted);font-weight:700;margin-bottom:6px}
.spgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(118px,1fr));gap:6px;max-height:46vh;overflow:auto;padding:2px}
.spgrid button{background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:8px 4px;color:var(--ink);font-weight:600;font-size:12.5px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:2px}
.spgrid button .i{font-size:26px}
.spgrid button.on{border-color:var(--accent);background:rgba(228,34,47,.12);outline:2px solid var(--accent)}
.chart{width:100%;height:auto;display:block;overflow:visible}
.chart .ax{stroke:var(--line);stroke-width:1}
.chart .gl{stroke:var(--line);stroke-width:1;opacity:.55}
.chart text{fill:var(--muted);font-size:11px;font-family:inherit}
.chart .hit{fill:transparent;cursor:pointer}
.chart .hit:hover{fill:rgba(128,128,128,.10)}
.legend{display:flex;gap:14px;flex-wrap:wrap;font-size:12.5px;color:var(--ink);margin:2px 0 6px}
.legend i{display:inline-block;width:12px;height:12px;border-radius:3px;margin-right:5px;vertical-align:-1px}
.ctip{position:fixed;z-index:300;background:var(--panel);color:var(--ink);border:1px solid var(--line);border-radius:10px;padding:8px 10px;font-size:12.5px;box-shadow:var(--shadow);pointer-events:none;display:none;min-width:130px}
.sheetlist{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.sheetlist button{background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:14px 8px;color:var(--ink);font-weight:700;font-size:14px;cursor:pointer;text-align:left}
`;
const st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

/* ---------------- helpers ---------------- */
const MONTHS_S=['Ιαν','Φεβ','Μαρ','Απρ','Μάι','Ιούν','Ιούλ','Αύγ','Σεπ','Οκτ','Νοε','Δεκ'];
const DAYS=['Κυριακή','Δευτέρα','Τρίτη','Τετάρτη','Πέμπτη','Παρασκευή','Σάββατο'];
function toast(msg,undo){ document.querySelectorAll('.toast').forEach(t=>t.remove());
  const t=document.createElement('div'); t.className='toast'; t.innerHTML=`<span>${msg}</span>`+(undo?'<button>Αναίρεση</button>':'');
  document.body.appendChild(t); if(undo) t.querySelector('button').onclick=()=>{undo();t.remove();};
  setTimeout(()=>t.remove(),undo?6000:3000); }
// Αριθμός από ελληνικό κείμενο: «4.200 kg» → 4200, «12,5» → 12.5
function gnum(v){ if(typeof v==='number') return v; const m=String(v||'').match(/-?\d[\d.,]*/); if(!m) return 0; let s=m[0];
  if(s.includes(',')) s=s.replace(/\./g,'').replace(',','.'); else if(/^\d{1,3}(\.\d{3})+$/.test(s)) s=s.replace(/\./g,''); return parseFloat(s)||0; }
const logNum=l=>l.num!=null?l.num:gnum(l.qty);
const herdOfTarget=t=>{ if(!t) return null; const [k,id]=t.split(':'); if(k==='herd') return getH(id); if(k==='animal'){const a=getA(id); return a?getH(a.herdId):null;} return null; };
const activeTabKey=()=>{ const b=document.querySelector('#tabs button.active'); return b?b.dataset.tab:'today'; };

/* ---------------- νέες καρτέλες ---------------- */
const NEW_TABS={today:{label:'🏠 Σήμερα',render:renderToday},stats:{label:'📊 Στατιστικά',render:renderStats}};
function addTab(key,before){
  const b=document.createElement('button'); b.dataset.tab=key; b.textContent=NEW_TABS[key].label;
  const ref=before?document.querySelector(`#tabs button[data-tab=${before}]`):null;
  $('tabs').insertBefore(b,ref); b.onclick=()=>activate(key);
  const p=document.createElement('div'); p.className='tabpane'; p.id='tab-'+key; document.querySelector('.wrap').prepend(p);
}
function activate(key){
  document.querySelectorAll('#tabs button').forEach(x=>x.classList.toggle('active',x.dataset.tab===key));
  document.querySelectorAll('.tabpane').forEach(x=>x.classList.remove('active'));
  $('tab-'+key).classList.add('active'); NEW_TABS[key].render(); updBnav(key); window.scrollTo(0,0);
}
function go(key){ if(NEW_TABS[key]) return activate(key); const b=document.querySelector(`#tabs button[data-tab=${key}]`); if(b){ b.click(); window.scrollTo(0,0); } updBnav(key); }
window.ktGo=go;
addTab('today','dash'); addTab('stats','data');
// Η «Σήμερα» γίνεται η αρχική οθόνη
document.querySelectorAll('#tabs button[data-tab="dash"]').forEach(b=>b.textContent='🧭 Σύμβουλος');
// ενημέρωση κάτω μπάρας όταν πατιούνται οι παλιές καρτέλες
document.querySelectorAll('#tabs button').forEach(b=>{ if(!NEW_TABS[b.dataset.tab]) b.addEventListener('click',()=>updBnav(b.dataset.tab)); });

/* ---------------- 2. κάτω μπάρα (κινητό) + FAB ---------------- */
const GUIDE_TABS=[['encyclopedia','📚 Εγκυκλοπαίδεια'],['tools','🧰 Εργαλεία'],['videos','🎬 Βίντεο'],['health','🩺 Υγεία & διατροφή'],['vision','📷 FAMACHA & BCS'],['program','🗓️ Πρόγραμμα ΤΝ']];
const bnav=document.createElement('nav'); bnav.className='bnav no-print';
bnav.innerHTML=`<button data-k="today"><span class="i">🏠</span>Σήμερα</button><button data-k="units"><span class="i">🐑</span>Κοπάδια</button>
  <button class="plus" data-k="plus" aria-label="Γρήγορη καταγραφή"><span class="i">＋</span>Καταγραφή</button>
  <button data-k="guide"><span class="i">📚</span>Οδηγός</button><button data-k="all"><span class="i">☰</span>Όλα</button>`;
document.body.appendChild(bnav);
bnav.querySelectorAll('button').forEach(b=>b.onclick=()=>{ const k=b.dataset.k;
  if(k==='plus') return quickLog();
  if(k==='guide') return tabSheet('📚 Οδηγός & γνώση',GUIDE_TABS);
  if(k==='all') return tabSheet('☰ Όλες οι ενότητες',[...document.querySelectorAll('#tabs button')].map(x=>[x.dataset.tab,x.textContent]));
  go(k); });
function updBnav(key){ const map={today:'today',units:'units'}; const g=GUIDE_TABS.some(t=>t[0]===key);
  bnav.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.k===(map[key]||(g?'guide':key==='today'?'today':'all')))); }
function tabSheet(title,list){ const md=modal(`<span class="pe">☰</span><div><h3>${esc(title)}</h3></div>`,`<div class="sheetlist">${list.map(([k,l])=>`<button data-go="${k}">${esc(l)}</button>`).join('')}</div>`);
  md.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{ md.remove(); go(b.dataset.go); }); }
const fab=document.createElement('button'); fab.className='fab no-print'; fab.title='Γρήγορη καταγραφή'; fab.textContent='＋'; fab.onclick=()=>quickLog(); document.body.appendChild(fab);

/* ---------------- 8. μεγάλα γράμματα / αντίθεση ---------------- */
function applyText(){ const v=ST.text||0; document.documentElement.classList.toggle('big',v>=1); document.documentElement.classList.toggle('hc',v>=2); $('textBtn').textContent=['Aα','A+','A+◐'][v]; }
const tb=document.createElement('button'); tb.id='textBtn'; tb.className='status'; tb.style.cssText='cursor:pointer;border:none;font-weight:800'; tb.title='Μέγεθος γραμμάτων & αντίθεση (για χρήση έξω στον ήλιο)';
$('themeBtn').before(tb); tb.onclick=()=>{ ST.text=((ST.text||0)+1)%3; save(); applyText(); toast(['Κανονικά γράμματα','🔠 Μεγάλα γράμματα','🔠 Μεγάλα γράμματα + ◐ υψηλή αντίθεση'][ST.text]); };
applyText();

/* ---------------- Πλήρης οθόνη & αλλαγή προσανατολισμού ---------------- */
const fsEl=document.documentElement, canFs=!!(fsEl.requestFullscreen||fsEl.webkitRequestFullscreen);
if(canFs){ const fb=document.createElement('button'); fb.id='fsBtn'; fb.className='status'; fb.style.cssText='cursor:pointer;border:none;font-weight:800'; fb.title='Πλήρης οθόνη';
  const isFs=()=>!!(document.fullscreenElement||document.webkitFullscreenElement);
  const upd=()=>{ fb.textContent=isFs()?'🗗':'⛶'; fb.title=isFs()?'Έξοδος από πλήρη οθόνη':'Πλήρης οθόνη'; };
  fb.onclick=async()=>{ try{ if(isFs()) await (document.exitFullscreen||document.webkitExitFullscreen).call(document);
    else { await (fsEl.requestFullscreen||fsEl.webkitRequestFullscreen).call(fsEl,{navigationUI:'hide'}); } }catch(e){ toast('Η πλήρης οθόνη δεν υποστηρίζεται εδώ'); } };
  document.addEventListener('fullscreenchange',upd); document.addEventListener('webkitfullscreenchange',upd); upd();
  $('themeBtn').before(fb); }
let rsT=null;
function onReshape(){ clearTimeout(rsT); rsT=setTimeout(()=>{ try{ if(typeof map!=='undefined'&&map&&map.invalidateSize) map.invalidateSize(); }catch(e){}
  const k=activeTabKey(); if(k==='stats') renderStats(); updBnav(k); },250); }
window.addEventListener('resize',onReshape); window.addEventListener('orientationchange',onReshape);
if(screen.orientation&&screen.orientation.addEventListener) screen.orientation.addEventListener('change',onReshape);

/* ---------------- 3. γρήγορη καταγραφή ---------------- */
const QA=[
  {k:'milk',i:'🥛',t:'Γάλα',cat:'Άμελξη / Γάλα',unit:'kg',prod:'Γάλα',q:'Πόσα κιλά γάλα;',money:'in',need:h=>SP[h.sp].prod.type==='milk'},
  {k:'eggs',i:'🥚',t:'Αυγά',cat:'Αυγά',unit:'αυγά',prod:'Αυγά',q:'Πόσα αυγά μαζέψατε;',money:'in',need:h=>SP[h.sp].prod.type==='eggs'},
  {k:'honey',i:'🍯',t:'Μέλι',cat:'Μέλι / Τρύγος',unit:'kg',prod:'Μέλι',q:'Πόσα κιλά μέλι;',money:'in',need:h=>h.sp==='bees'},
  {k:'birth',i:'🍼',t:'Γέννα',cat:'Τοκετός / Εκκόλαψη',unit:'νεογέννητα',prod:'Τοκετός',q:'Πόσα νεογέννητα (ζωντανά);',animal:true},
  {k:'vacc',i:'💉',t:'Εμβόλιο',cat:'Εμβολιασμός',unit:'ζώα',q:'Σε πόσα ζώα;',askProd:'Ποιο εμβόλιο;',wd:true,money:'out'},
  {k:'med',i:'💊',t:'Φάρμακο',cat:'Φαρμακευτική αγωγή',unit:'ζώα',q:'Σε πόσα ζώα;',askProd:'Ποιο φάρμακο;',wd:true,money:'out',animal:true},
  {k:'deworm',i:'🪱',t:'Αποπαρασίτωση',cat:'Αποπαρασίτωση',unit:'ζώα',q:'Σε πόσα ζώα;',askProd:'Ποιο σκεύασμα;',wd:true,money:'out'},
  {k:'feed',i:'🌾',t:'Ζωοτροφή',cat:'Ζωοτροφές',unit:'kg',q:'Πόσα κιλά αγοράστηκαν;',askFeed:true,money:'out',unitTarget:true},
  {k:'sale',i:'💶',t:'Πώληση',cat:'Πώληση ζώων',unit:'ζώα',q:'Πόσα ζώα πουλήθηκαν;',money:'in',askProd:'Τι πουλήθηκε;'},
  {k:'cost',i:'🧾',t:'Έξοδο',cat:'Άλλο',unit:'',q:null,money:'out',askProd:'Για τι ήταν;',unitTarget:true},
  {k:'death',i:'🕊️',t:'Απώλεια',cat:'Θάνατος / Απώλεια',unit:'ζώα',q:'Πόσα ζώα χάθηκαν;',animal:true,askProd:'Αιτία (αν ξέρεις)'},
  {k:'note',i:'📝',t:'Σημείωση',cat:'Παρατήρηση',unit:'',q:null,askProd:'Τι παρατήρησες;',unitTarget:true}
];
function quickLog(preset){
  if(!DB.herds.length && !DB.units.length){ toast('Πρόσθεσε πρώτα το κοπάδι σου'); return wizard(); }
  const md=modal(`<span class="pe">➕</span><div><h3>Γρήγορη καταγραφή</h3><div class="small">Διάλεξε τι έγινε — 2 αγγίγματα & ένας αριθμός</div></div>`,
    `<div class="qgrid">${QA.map(a=>`<button class="qbtn" data-q="${a.k}"><span class="i">${a.i}</span>${a.t}</button>`).join('')}</div>`);
  md.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{ md.remove(); quickForm(QA.find(a=>a.k===b.dataset.q)); });
  if(preset){ md.remove(); quickForm(QA.find(a=>a.k===preset)); }
}
window.ktQuick=quickLog;
function quickForm(a){
  const herds=DB.herds.filter(h=>!a.need||a.need(h)); const hs=herds.length?herds:DB.herds;
  const last=ST.lastHerd&&hs.some(h=>h.id===ST.lastHerd)?ST.lastHerd:(hs[0]&&hs[0].id);
  const targets=(a.unitTarget?DB.units.map(u=>[`unit:${u.id}`,'🏡 '+u.name]):[]).concat(hs.map(h=>[`herd:${h.id}`,herdLabel(h)]));
  const defT=last?`herd:${last}`:(targets[0]&&targets[0][0]);
  const voice=!!(window.SpeechRecognition||window.webkitSpeechRecognition);
  const md=modal(`<span class="pe">${a.i}</span><div><h3>${a.t}</h3><div class="small">${fd(todayISO())}</div></div>`,`
    <label>Κοπάδι / μονάδα</label><select id="qT">${targets.map(([v,l])=>`<option value="${v}" ${v===defT?'selected':''}>${esc(l)}</option>`).join('')}</select>
    ${a.animal?`<label style="margin-top:8px">Συγκεκριμένο ζώο (προαιρετικό)</label><select id="qA"><option value="">— όλο το κοπάδι —</option></select>`:''}
    ${a.askFeed?`<label style="margin-top:8px">Ζωοτροφή</label><select id="qP">${FEEDS.map(f=>`<option>${esc(f.n)}</option>`).join('')}</select>`:''}
    ${a.askProd?`<label style="margin-top:8px">${a.askProd}</label><input id="qP" placeholder="${a.k==='vacc'?'π.χ. κλωστηρίδια':a.k==='med'?'π.χ. αντιβιοτικό μαστίτιδας':''}">`:''}
    ${a.q?`<label style="margin-top:8px">${a.q}</label><div class="inline"><input id="qN" type="number" inputmode="decimal" step="any" class="bignum" placeholder="0"><span style="font-weight:700">${a.unit}</span></div>`:''}
    ${a.money?`<label style="margin-top:8px">${a.money==='in'?'Έσοδο / αξία (€) — προαιρετικό':'Κόστος (€) — προαιρετικό'}</label><input id="qM" type="number" inputmode="decimal" step="0.01" placeholder="0"><div class="small" id="qEst"></div>`:''}
    ${a.wd?`<label style="margin-top:8px">Χρόνος αναμονής γάλακτος/αυγών (ημέρες)</label><div class="chips" id="qWm">${[0,3,5,7,14,28].map(d=>`<button data-v="${d}" class="${d===0?'on':''}">${d}</button>`).join('')}</div>
      <label>Χρόνος αναμονής κρέατος (ημέρες)</label><div class="chips" id="qWt">${[0,7,14,28,35,60].map(d=>`<button data-v="${d}" class="${d===0?'on':''}">${d}</button>`).join('')}</div>`:''}
    <label style="margin-top:8px">Σημειώσεις ${voice?'(ή πάτα 🎤 και μίλα)':''}</label>
    <div class="inline"><input id="qNote" placeholder="προαιρετικό">${voice?'<button class="btn sec" id="qMic" title="Υπαγόρευση" style="flex:0 0 auto">🎤</button>':''}</div>
    ${a.k==='birth'?'<label class="inline" style="margin-top:8px;cursor:pointer;color:var(--ink)"><input type="checkbox" id="qNew" style="width:auto;flex:0"> Πρόσθεσε τα νεογέννητα στο Μητρώο ζώων</label>':''}
    <div class="btnrow"><button class="btn" id="qSave" style="flex:1;font-size:17px;padding:14px">✅ Καταχώρηση</button></div>`);
  const fillAnimals=()=>{ if(!a.animal) return; const h=herdOfTarget(md.querySelector('#qT').value); const as=h?DB.animals.filter(x=>x.herdId===h.id&&!GONE.includes(x.status)&&(a.k!=='birth'||x.sex==='F')):[];
    md.querySelector('#qA').innerHTML='<option value="">— όλο το κοπάδι —</option>'+as.map(x=>`<option value="${x.id}">🏷️ ${esc(x.tag)}${x.name?' «'+esc(x.name)+'»':''}</option>`).join(''); };
  const est=()=>{ const e=md.querySelector('#qEst'); if(!e) return; const h=herdOfTarget(md.querySelector('#qT').value); const n=parseFloat((md.querySelector('#qN')||{}).value)||0;
    e.textContent=(a.money==='in'&&h&&h.price&&n&&['milk','eggs','honey'].includes(a.k))?`Εκτιμώμενη αξία με ${fmt(h.price,2)} €/μον.: ${fmt(n*h.price,2)} €`:''; };
  md.querySelector('#qT').onchange=()=>{fillAnimals();est();}; fillAnimals();
  const qn=md.querySelector('#qN'); if(qn){ qn.oninput=est; setTimeout(()=>qn.focus(),50); }
  md.querySelectorAll('.chips').forEach(c=>c.querySelectorAll('button').forEach(b=>b.onclick=()=>{c.querySelectorAll('button').forEach(x=>x.classList.remove('on'));b.classList.add('on');}));
  const mic=md.querySelector('#qMic'); if(mic) mic.onclick=()=>listen(txt=>{ const n=md.querySelector('#qNote'); n.value=(n.value?n.value+' ':'')+txt;
    if(qn&&!qn.value){ const num=gnum(txt); if(num) qn.value=num; } est(); },mic);
  md.querySelector('#qSave').onclick=()=>{
    const target=md.querySelector('#qT').value; if(!target){ toast('Διάλεξε κοπάδι'); return; }
    const aid=a.animal?md.querySelector('#qA').value:''; const n=qn?parseFloat(qn.value):NaN;
    if(a.q&&!(n>0)&&a.k!=='death'){ qn.focus(); toast('Γράψε τον αριθμό'); return; }
    const prod=(md.querySelector('#qP')||{}).value||a.prod||''; const money=parseFloat((md.querySelector('#qM')||{}).value)||0;
    const wm=a.wd?+md.querySelector('#qWm .on').dataset.v:0, wt=a.wd?+md.querySelector('#qWt .on').dataset.v:0;
    const note=md.querySelector('#qNote').value.trim();
    const rec={id:uid(),target:aid?'animal:'+aid:target,date:todayISO(),cat:a.cat,product:prod.trim(),qty:a.q&&n>0?fmt(n,2)+(a.unit?' '+a.unit:''):'',num:a.q&&n>0?n:null,unit:a.unit,
      cost:a.money==='out'?money:0,income:a.money==='in'?money:0,wMilk:wm,wMeat:wt,notes:note||('Γρήγορη καταγραφή: '+a.t)};
    DB.logs.push(rec);
    const extra=[];
    if(a.k==='feed'&&n>0){ const f=DB.feeds.find(x=>x.name===prod); if(f){ f.kg=(f.kg||0)+n; if(money) f.price=money/n; } else DB.feeds.push({id:uid(),name:prod,kg:n,price:money?money/n:null}); extra.push('απόθεμα +'+fmt(n,0)+' kg'); }
    if(a.k==='death'&&aid){ const x=getA(aid); if(x){ x.status='Νεκρό'; extra.push(x.tag+' → Νεκρό'); } }
    if(a.k==='death'&&!aid&&n>0){ const h=herdOfTarget(target); if(h){ h.count=Math.max(0,(h.count||0)-n); extra.push('κοπάδι: '+h.count+' ζώα'); } }
    if(a.k==='sale'&&n>0){ const h=herdOfTarget(target); if(h){ h.count=Math.max(0,(h.count||0)-n); extra.push('κοπάδι: '+h.count+' ζώα'); } }
    let created=[];
    if(a.k==='birth'&&aid){ const mom=getA(aid); if(mom){ mom.status=SP[getH(mom.herdId).sp].prod.type==='milk'?'Σε γαλακτοπαραγωγή':'Ενεργό';
      const r=DB.repro.find(x=>x.animalId===aid&&!x.done); if(r){ r.done=true; r.born=n; } } }
    if(a.k==='birth'&&md.querySelector('#qNew').checked&&n>0) created=addNewborns(herdOfTarget(target),aid?getA(aid):null,Math.round(n));
    const h=herdOfTarget(target); if(h) ST.lastHerd=h.id;
    save(); md.remove(); refreshAfterChange();
    toast(`✅ ${a.t} καταγράφηκε${extra.length?' · '+extra.join(' · '):''}${created.length?' · '+created.length+' νέα ζώα στο Μητρώο':''}`,()=>{ DB.logs=DB.logs.filter(x=>x.id!==rec.id); DB.animals=DB.animals.filter(x=>!created.includes(x.id)); save(); refreshAfterChange(); toast('Αναιρέθηκε'); });
  };
}
function refreshAfterChange(){ try{ renderLogs(); refreshTargets(); renderUnits(); }catch(e){} const k=activeTabKey(); if(NEW_TABS[k]) NEW_TABS[k].render(); else if(k==='dash') renderDash(); }
// Φωνητική υπαγόρευση (Web Speech API, ελληνικά)
function listen(cb,btn){ const SR=window.SpeechRecognition||window.webkitSpeechRecognition; if(!SR) return;
  const r=new SR(); r.lang='el-GR'; r.interimResults=false; r.maxAlternatives=1;
  btn.textContent='⏺️'; btn.disabled=true; r.onresult=e=>cb(e.results[0][0].transcript); r.onend=()=>{btn.textContent='🎤';btn.disabled=false;}; r.onerror=()=>toast('Δεν ακούστηκε — δοκίμασε ξανά');
  try{ r.start(); }catch(e){ btn.textContent='🎤'; btn.disabled=false; } }

/* ---------------- 9. νεογέννητα στο μητρώο ---------------- */
function addNewborns(h,mom,n){ if(!h||!n) return []; const ids=[]; const yy=String(new Date().getFullYear()).slice(2);
  const base=mom?mom.tag:'ΝΕΟ'+yy; const cnt=DB.animals.filter(a=>a.tag.startsWith(base+'-')).length;
  for(let i=1;i<=n;i++){ const a={id:uid(),herdId:h.id,tag:`${base}-${cnt+i}`,name:'',sex:'F',birth:todayISO(),breed:mom?mom.breed:(h.breed||''),mother:mom?mom.tag:'',weight:null,status:'Ενεργό',notes:'Νεογέννητο — συμπλήρωσε ενώτιο & φύλο',weights:[]};
    DB.animals.push(a); ids.push(a.id); }
  return ids; }
// Ολοκλήρωση τοκετού από την καρτέλα Αναπαραγωγή: + προσθήκη νεογέννητων
const _renderBirths=renderBirths;
renderBirths=function(){ _renderBirths(); $('birthList').querySelectorAll('[data-bd]').forEach(b=>b.onclick=()=>completeBirth(b.dataset.bd)); };
function completeBirth(rid){ const r=DB.repro.find(x=>x.id===rid); if(!r) return; const h=getH(r.herdId); const bird=isBird(h.sp);
  const n=prompt(bird?'Πόσοι νεοσσοί εκκολάφθηκαν;':'Πόσα νεογέννητα γεννήθηκαν ζωντανά;', bird?Math.round(r.count*0.8):(SP[h.sp].prod.young?Math.round(r.count*SP[h.sp].prod.young):r.count));
  if(n===null) return; r.done=true; r.born=parseInt(n)||0;
  DB.logs.push({id:uid(),target:r.animalId?'animal:'+r.animalId:'herd:'+h.id,date:todayISO(),cat:'Τοκετός / Εκκόλαψη',product:bird?'Εκκόλαψη':'Τοκετός',qty:String(r.born),num:r.born,cost:0,income:0,notes:'Από '+(bird?'επώαση ':'οχεία ')+fd(r.date)+' ('+r.count+')'});
  const mom=r.animalId?getA(r.animalId):null; if(mom) mom.status=SP[h.sp].prod.type==='milk'?'Σε γαλακτοπαραγωγή':'Ενεργό';
  let made=[]; if(r.born>0 && !bird && r.born<=20 && confirm(`Να προστεθούν τα ${r.born} νεογέννητα στο Μητρώο ζώων;`)) made=addNewborns(h,mom,r.born);
  save(); renderBirths(); try{renderReproKpi();}catch(e){} toast(`✅ Καταγράφηκε${made.length?' · '+made.length+' νέα ζώα στο Μητρώο':''}`); }

/* ---------------- 4. ΣΗΜΕΡΑ ---------------- */
function todayTasks(){
  const t=todayISO(), out=[]; const snoozed=k=>ST.snooze[k]&&ST.snooze[k]>t;
  birthsUpcoming().filter(o=>o.dd<=3).forEach(o=>{ const a=o.r.animalId?getA(o.r.animalId):null; const k='birth:'+o.r.id; if(snoozed(k)) return;
    out.push({k,p:o.dd<=0?0:1,i:isBird(o.h.sp)?'🐣':'🍼',t:(isBird(o.h.sp)?'Εκκόλαψη':'Τοκετός')+' — '+(a?a.tag+(a.name?' «'+a.name+'»':''):(o.h.name||o.m.name)),
      d:(o.dd<0?'Καθυστέρηση '+(-o.dd)+' ημ.':o.dd===0?'Αναμένεται ΣΗΜΕΡΑ':'σε '+o.dd+' ημ.')+' · '+fd(o.due)+(isBird(o.h.sp)?' · lockdown & υγρασία':' · καθαρό γεννητήριο, ιώδιο ομφαλού, πρωτόγαλα'),
      done:()=>completeBirth(o.r.id),doneLbl:'✓ Έγινε'}); });
  activeWithdrawals().forEach(w=>{ const dl=diffDays(t,w.until); if(dl>1) return; out.push({k:'wd:'+w.log.id+w.kind,p:1,info:1,i:'⛔',t:'Χρόνος αναμονής '+w.kind+' — '+targetLabel(w.target),d:dl<=0?'Λήγει ΣΗΜΕΡΑ ('+fd(w.until)+') — από αύριο επιτρέπεται η διάθεση':'Λήγει αύριο '+fd(w.until)}); });
  DB.herds.forEach(h=>{ const m=SP[h.sp]; const days=weatherOfHerd(h); if(!days||!m.heat) return;
    const two=days.filter(d=>d.date>=t).slice(0,2); const worst=two.map(d=>({d,s:dayStress(h.sp,d)})).sort((a,b)=>b.s.lvl-a.s.lvl)[0];
    if(worst&&worst.s.lvl>=2){ const k='heat:'+h.id+':'+worst.d.date; if(snoozed(k)) return;
      out.push({k,p:worst.s.lvl>=3?0:1,i:'🌡️',t:'Καύσωνας '+(worst.d.date===t?'σήμερα':'αύριο')+' — '+(h.name||m.name),d:(m.heat.mode==='thi'?'THI ':'')+Math.round(worst.s.v)+(m.heat.mode==='thi'?'':'°C')+' · '+heatTips(m.grp),
        done:()=>logTask(h,'Διαχείριση','Μέτρα κατά του θερμικού στρες')}); }
    const cold=two.find(d=>d.tmin<=0); if(cold){ const k='cold:'+h.id+':'+cold.date; if(!snoozed(k)) out.push({k,p:1,i:'❄️',t:'Παγετός '+(cold.date===t?'απόψε':'αύριο')+' — '+(h.name||m.name),d:fmt(cold.tmin,0)+'°C · προστασία νεογέννητων & ποτιστρών',done:()=>logTask(h,'Διαχείριση','Μέτρα κατά του παγετού')}); }
  });
  DB.herds.forEach(h=>{ autoProgram(h).filter(o=>o.p<=1&&!o.done&&!/Θερμικό|Παγετός|απόθεμα/i.test(o.it.t)).forEach(o=>{ const k='prog:'+h.id+':'+o.it.t; if(snoozed(k)) return;
    out.push({k,p:o.p,i:({'Εμβολιασμός':'💉','Αποπαρασίτωση':'🪱','Διατροφή':'🌾','Αναπαραγωγή':'🤰','Υγιεινή':'🧼','Διοικητικά':'📄'}[o.it.cat]||'🗓️'),t:o.it.t+' — '+(h.name||SP[h.sp].name),d:o.when+' · '+o.it.d,
      done:()=>logTask(h,o.logCat,o.it.t),tools:toolsFor(o.it.cat+' '+o.it.t,SP[h.sp].grp).slice(0,3),vids:videosFor(o.it.cat+' '+o.it.t,SP[h.sp].grp).slice(0,4),title:o.it.t}); }); });
  const cov=feedCoverage(); if(cov&&cov.days<14&&!snoozed('feed')) out.push({k:'feed',p:cov.days<7?0:1,i:'🌾',t:'Απόθεμα ζωοτροφών για ~'+fmt(cov.days,0)+' ημέρες',d:'Ανάγκη ~'+fmt(cov.daily,0)+' kg/ημέρα — παράγγειλε έγκαιρα.',action:['🌾 Καταγραφή αγοράς',()=>quickLog('feed')]});
  if((DB.herds.length||DB.logs.length)&&!snoozed('backup')){ const lb=ST.lastBackup; const age=lb?diffDays(lb,t):999;
    if(age>30) out.push({k:'backup',p:age>90?1:2,i:'🛟',t:lb?'Κράτα αντίγραφο ασφαλείας (τελευταίο πριν '+age+' ημ.)':'Κράτα το πρώτο σου αντίγραφο ασφαλείας',d:'Τα δεδομένα ζουν μόνο σε αυτή τη συσκευή. Στείλ\' τα στον εαυτό σου με Viber/email.',action:['📤 Αποστολή τώρα',shareBackup]}); }
  return out.sort((a,b)=>a.p-b.p);
}
function logTask(h,cat,title){ const rec={id:uid(),target:'herd:'+h.id,date:todayISO(),cat,product:title,qty:'',cost:0,income:0,wMilk:0,wMeat:0,notes:'Από Σήμερα: '+title};
  DB.logs.push(rec); save(); refreshAfterChange(); toast('✅ Σημειώθηκε ως έγινε',()=>{ DB.logs=DB.logs.filter(x=>x.id!==rec.id); save(); refreshAfterChange(); }); }
function streak(){ const days=new Set(DB.logs.map(l=>l.date)); let d=todayISO(), n=0; if(!days.has(d)) d=addDays(d,-1); while(days.has(d)){ n++; d=addDays(d,-1); } return n; }
function sumLogs(cat,from,to,f){ return DB.logs.filter(l=>l.cat===cat&&l.date>=from&&l.date<=to&&(!f||f(l))).reduce((s,l)=>s+logNum(l),0); }
let TASKS=[];
function renderToday(){
  const p=$('tab-today'); const t=todayISO(), now=new Date(), hr=now.getHours();
  const hello=hr<5?'Καλό βράδυ':hr<12?'Καλημέρα':hr<18?'Καλησπέρα':'Καλό βράδυ';
  if(!DB.herds.length){ p.innerHTML=`<div class="card" style="text-align:center;padding:28px 16px">
      <div style="font-size:56px">🐄🐑🐐🐔</div><p class="hello">${hello}! Καλώς ήρθες στον Κτηνοτρόφο ΤΝ</p>
      <p class="small" style="max-width:520px;margin:8px auto 16px">Σε 3 απλά βήματα φτιάχνουμε τη φάρμα σου — και ο Σύμβουλος σου λέει κάθε μέρα τι έχεις να κάνεις: εμβόλια, γέννες, καύσωνες, χρόνους αναμονής, αποθέματα.</p>
      <div class="btnrow" style="justify-content:center"><button class="btn" id="tWiz" style="font-size:17px;padding:14px 22px">🚀 Ξεκίνα (3 βήματα)</button><button class="btn sec" id="tDemo">🧪 Δες ένα παράδειγμα</button></div></div>`;
    $('tWiz').onclick=wizard; $('tDemo').onclick=()=>{ const oc=window.confirm; window.confirm=()=>true; $('demoBtn').click(); window.confirm=oc; ST.onboarded=true; save(); setTimeout(()=>activate('today'),300); };
    return; }
  // καιρός σήμερα
  const u=DB.units.find(x=>DB.weather[x.id]); let wx='';
  if(u){ const d=DB.weather[u.id].days.find(x=>x.date===t); if(d) wx=`${Math.round(d.tmax)}° / ${Math.round(d.tmin)}°${d.prcp>0?' · 💧'+fmt(d.prcp,0)+' mm':''} · ${esc(u.name)}`; }
  TASKS=todayTasks(); const s=streak();
  const y0=t.slice(0,4)+'-01-01', m0=t.slice(0,7)+'-01', w0=addDays(t,-6);
  const milk7=sumLogs('Άμελξη / Γάλα',w0,t), eggs7=sumLogs('Αυγά',w0,t);
  const ml=DB.logs.filter(l=>l.date>=m0); const inc=ml.reduce((a,l)=>a+(l.income||0),0), cost=ml.reduce((a,l)=>a+(l.cost||0),0);
  const heads=DB.herds.reduce((a,h)=>a+(h.sp==='bees'?0:(h.count||0)),0);
  p.innerHTML=`<div class="card"><div class="inline" style="justify-content:space-between;flex-wrap:wrap">
      <div><p class="hello">${hello}! 👋</p><div class="small">${DAYS[now.getDay()]} ${now.getDate()} ${MONTHS[now.getMonth()]}${wx?' · 🌦️ '+wx:''}</div></div>
      ${s?`<span class="streak" title="Συνεχόμενες ημέρες με καταγραφή">🔥 ${s} ${s===1?'μέρα':'μέρες'} στη σειρά</span>`:''}</div>
    <div class="kpi" style="margin-top:12px">
      <div class="box"><div class="v">${fmt(heads,0)}</div><div class="l">Ζώα</div></div>
      ${milk7?`<div class="box"><div class="v">${fmt(milk7,0)} kg</div><div class="l">Γάλα 7 ημερών</div></div>`:''}
      ${eggs7?`<div class="box"><div class="v">${fmt(eggs7,0)}</div><div class="l">Αυγά 7 ημερών</div></div>`:''}
      <div class="box"><div class="v">${birthsUpcoming().filter(o=>o.dd<=30).length}</div><div class="l">Τοκετοί ≤30 ημ.</div></div>
      <div class="box"><div class="v" style="color:${inc-cost>=0?'var(--ok)':'var(--bad)'}">${inc-cost>=0?'+':''}${fmt(inc-cost,0)} €</div><div class="l">Καθαρό μήνα</div></div>
    </div></div>
  <div class="tgrid"><div><div class="card"><h2>📋 Τι έχω να κάνω σήμερα <span class="r"><span class="small">${TASKS.length?TASKS.length+' εργασίες':''}</span></span></h2>
    <div id="taskList">${TASKS.length?TASKS.map((o,i)=>`<div class="task ${o.info?'info':'p'+o.p}">
      ${o.done?`<button class="tick" data-done="${i}" title="Έγινε">✓</button>`:`<span style="font-size:26px;width:40px;text-align:center">${o.i}</span>`}
      <div class="tb"><div class="tt">${o.done?o.i+' ':''}${esc(o.t)}</div><div class="td">${esc(o.d)}</div>
      <div class="ta">${o.action?`<button class="btn mini" data-act="${i}">${o.action[0]}</button>`:''}${o.vids&&o.vids.length?vidBtn(o.vids,o.title):''}${o.tools?toolChips(o.tools):''}
      ${o.info?'':`<button class="btn sec mini" data-snz="${i}">⏰ Αύριο</button>`}</div></div></div>`).join(''):'<div class="empty">🎉 Όλα εντάξει για σήμερα! Δεν υπάρχει κάτι επείγον.<br><span class="small">Πάτα ➕ για να καταγράψεις γάλα, γέννες, φάρμακα…</span></div>'}</div>
    <div class="btnrow"><button class="btn sec mini" onclick="ktGo('dash')">🧭 Όλες οι συστάσεις</button><button class="btn sec mini" onclick="ktGo('program')">🗓️ Πρόγραμμα ΤΝ</button></div></div></div>
  <div><div class="card"><h2>➕ Γρήγορη καταγραφή</h2><div class="qgrid">${QA.map(a=>`<button class="qbtn" data-qq="${a.k}"><span class="i">${a.i}</span>${a.t}</button>`).join('')}</div></div>
  <div class="card"><h2>🔔 Υπενθυμίσεις</h2>
    <div class="small">Οι ειδοποιήσεις εμφανίζονται όταν η εφαρμογή είναι ανοιχτή ή μόλις την ανοίξεις. Για <b>σίγουρες</b> υπενθυμίσεις, πρόσθεσε τις επόμενες γέννες & εργασίες στο ημερολόγιο του κινητού σου.</div>
    <div class="btnrow"><button class="btn sec" id="tNotif">${ST.notif&&window.Notification&&Notification.permission==='granted'?'🔔 Ειδοποιήσεις: ενεργές':'🔔 Ενεργοποίηση ειδοποιήσεων'}</button><button class="btn sec" id="tIcs">📅 Στο ημερολόγιο του κινητού (.ics)</button></div></div></div></div>`;
  p.querySelectorAll('[data-done]').forEach(b=>b.onclick=()=>TASKS[+b.dataset.done].done());
  p.querySelectorAll('[data-act]').forEach(b=>b.onclick=()=>TASKS[+b.dataset.act].action[1]());
  p.querySelectorAll('[data-snz]').forEach(b=>b.onclick=()=>{ const o=TASKS[+b.dataset.snz]; ST.snooze[o.k]=addDays(todayISO(),1); save(); renderToday(); toast('⏰ Θα το ξαναδείς αύριο',()=>{delete ST.snooze[o.k]; save(); renderToday();}); });
  p.querySelectorAll('[data-qq]').forEach(b=>b.onclick=()=>quickForm(QA.find(a=>a.k===b.dataset.qq)));
  bindToolChips(p);
  $('tNotif').onclick=enableNotif; $('tIcs').onclick=exportIcs;
}

/* ---------------- 1. οδηγός πρώτης χρήσης ---------------- */
function wizard(){
  const sel=new Set(); let step=1, unit={name:'Η φάρμα μου',type:'Στάνη / Μαντρί',lat:null,lon:null}; const cnt={}, bm={};
  const md=modal(`<span class="pe">🚀</span><div><h3>Ας στήσουμε τη φάρμα σου</h3><div class="small">3 βήματα · αλλάζουν όλα αργότερα</div></div>`,'<div id="wz"></div>');
  const box=md.querySelector('#wz');
  const byG={}; Object.entries(SP).forEach(([k,m])=>(byG[m.grp]=byG[m.grp]||[]).push(k));
  function draw(){
    if(step===1){ box.innerHTML=`<div class="wiz-step">ΒΗΜΑ 1 / 3</div><p style="margin:0 0 8px;font-weight:700;font-size:17px">Τι ζώα έχεις; <span class="small">(διάλεξε όσα θες)</span></p>
      <div class="spgrid">${Object.entries(byG).map(([g,ks])=>ks.map(k=>`<button data-sp="${k}" class="${sel.has(k)?'on':''}"><span class="i">${SP[k].e}</span>${esc(SP[k].name)}</button>`).join('')).join('')}</div>
      <div class="btnrow"><button class="btn" id="wN" ${sel.size?'':'disabled'} style="flex:1">Επόμενο →</button><button class="btn sec" id="wX">Όχι τώρα</button></div>`;
      box.querySelectorAll('[data-sp]').forEach(b=>b.onclick=()=>{ const k=b.dataset.sp; sel.has(k)?sel.delete(k):sel.add(k); draw(); });
      box.querySelector('#wN').onclick=()=>{step=2;draw();}; box.querySelector('#wX').onclick=()=>{ ST.onboarded=true; save(); md.remove(); };
    } else if(step===2){ box.innerHTML=`<div class="wiz-step">ΒΗΜΑ 2 / 3</div><p style="margin:0 0 8px;font-weight:700;font-size:17px">Πού είναι η μονάδα σου;</p>
      <label>Όνομα</label><input id="wUn" value="${esc(unit.name)}">
      <label style="margin-top:8px">Τύπος</label><select id="wUt">${['Στάνη / Μαντρί','Στάβλος / Σταβλισμός','Βοσκότοπος','Πτηνοτροφείο / Κοτέτσι','Χοιροστάσιο','Κουνελοτροφείο','Μελισσοκομείο','Άλλο'].map(x=>`<option ${x===unit.type?'selected':''}>${x}</option>`).join('')}</select>
      <div class="btnrow"><button class="btn sec" id="wGps" style="flex:1">📍 Χρησιμοποίησε τη θέση μου (για καιρό & καύσωνα)</button></div>
      <div class="small" id="wGpsS">${unit.lat!=null?'✅ Θέση: '+unit.lat.toFixed(3)+', '+unit.lon.toFixed(3):'Προαιρετικό — χωρίς θέση δεν έρχεται αυτόματα ο καιρός.'}</div>
      <div class="btnrow"><button class="btn sec" id="wB">← Πίσω</button><button class="btn" id="wN" style="flex:1">Επόμενο →</button></div>`;
      const keep=()=>{ unit.name=box.querySelector('#wUn').value.trim()||'Η φάρμα μου'; unit.type=box.querySelector('#wUt').value; };
      box.querySelector('#wGps').onclick=()=>{ keep(); if(!navigator.geolocation) return toast('Δεν υποστηρίζεται GPS'); box.querySelector('#wGpsS').textContent='⏳ Εντοπισμός…';
        navigator.geolocation.getCurrentPosition(p=>{ unit.lat=+p.coords.latitude.toFixed(5); unit.lon=+p.coords.longitude.toFixed(5); draw(); },e=>{ box.querySelector('#wGpsS').textContent='Δεν βρέθηκε θέση ('+e.message+') — συνέχισε χωρίς.'; },{enableHighAccuracy:true,timeout:15000}); };
      box.querySelector('#wB').onclick=()=>{keep();step=1;draw();}; box.querySelector('#wN').onclick=()=>{keep();step=3;draw();};
    } else { box.innerHTML=`<div class="wiz-step">ΒΗΜΑ 3 / 3</div><p style="margin:0 0 8px;font-weight:700;font-size:17px">Πόσα είναι;</p>
      ${[...sel].map(k=>{ const m=SP[k]; return `<div class="listitem"><div class="nm">${m.e} ${esc(m.name)}</div>
        <div class="row" style="margin-top:6px"><div><label>${m.unit==='κεφαλές'?'Αριθμός ζώων':'Αριθμός ('+m.unit+')'}</label><input type="number" inputmode="numeric" class="bignum" data-c="${k}" value="${cnt[k]||''}" placeholder="0"></div>
        ${isMammal(k)?`<div><label>Κύριος μήνας γεννών</label><select data-bm="${k}"><option value="">— δεν ξέρω —</option>${MONTHS.map((x,i)=>`<option value="${i+1}" ${bm[k]==i+1?'selected':''}>${x}</option>`).join('')}</select></div>`:''}</div></div>`; }).join('')}
      <div class="btnrow"><button class="btn sec" id="wB">← Πίσω</button><button class="btn" id="wF" style="flex:1;font-size:17px">✅ Έτοιμο!</button></div>`;
      const keep=()=>{ box.querySelectorAll('[data-c]').forEach(i=>cnt[i.dataset.c]=parseInt(i.value)||0); box.querySelectorAll('[data-bm]').forEach(s=>bm[s.dataset.bm]=parseInt(s.value)||null); };
      box.querySelector('#wB').onclick=()=>{keep();step=2;draw();};
      box.querySelector('#wF').onclick=()=>{ keep(); const miss=[...sel].filter(k=>!cnt[k]); if(miss.length) return toast('Γράψε πόσα '+SP[miss[0]].name.toLowerCase()+' έχεις');
        const U={id:uid(),name:unit.name,type:unit.type,area:0,code:'',alt:null,lat:unit.lat,lon:unit.lon,poly:null,notes:''}; DB.units.push(U);
        [...sel].forEach(k=>{ const m=SP[k]; DB.herds.push({id:uid(),unitId:U.id,sp:k,breed:m.breeds[0]||'Διασταύρωση / Άλλη',name:'',count:cnt[k],females:(k==='bees'?null:(isMammal(k)||m.prod.type==='eggs')?Math.round(cnt[k]*0.9):null),males:null,
          sys:'Ημιεντατικό',bw:null,birthMonth:bm[k]||null,hatch:null,yieldPer:null,price:null}); });
        ST.onboarded=true; save(); md.remove(); initAll(); activate('today');
        if(U.lat!=null) ensureWeather(U,true).then(()=>{ if(activeTabKey()==='today') renderToday(); });
        toast('🎉 Η φάρμα σου είναι έτοιμη! Δες τι έχεις να κάνεις σήμερα.'); };
    }
  }
  draw();
}
window.ktWizard=wizard;

/* ---------------- 5. υπενθυμίσεις ---------------- */
async function enableNotif(){ if(!('Notification' in window)) return toast('Ο browser δεν υποστηρίζει ειδοποιήσεις');
  const p=await Notification.requestPermission(); ST.notif=p==='granted'; save(); renderToday(); if(ST.notif){ toast('🔔 Ενεργές'); checkNotify(true); } else toast('Οι ειδοποιήσεις δεν επιτράπηκαν'); }
async function notify(title,body,tag){ try{ const reg=navigator.serviceWorker&&await navigator.serviceWorker.getRegistration(); const o={body,tag,icon:'icon-192.png',badge:'icon-192.png'};
  if(reg&&reg.showNotification) await reg.showNotification(title,o); else new Notification(title,o); }catch(e){} }
function checkNotify(force){ if(!ST.notif||!window.Notification||Notification.permission!=='granted') return; const t=todayISO();
  const urgent=todayTasks().filter(o=>o.p===0||(o.k.startsWith('birth:'))||o.k.startsWith('wd:')); let n=0;
  urgent.forEach(o=>{ if(ST.notified[o.k]===t) return; ST.notified[o.k]=t; n++; if(n<=4) notify('Κτηνοτρόφος ΤΝ — '+o.t,o.d,o.k); });
  if(n) save(); }
setTimeout(()=>checkNotify(),4000); setInterval(()=>checkNotify(),3600e3);
// Εξαγωγή ημερολογίου (.ics) — επόμενες 120 ημέρες
function icsEvents(){ const t=todayISO(), lim=addDays(t,120), ev=[];
  DB.repro.filter(r=>!r.done&&getH(r.herdId)).forEach(r=>{ const h=getH(r.herdId); const a=r.animalId?getA(r.animalId):null; const who=a?a.tag:(h.name||SP[h.sp].name);
    reproDates(h.sp,r.date).forEach(o=>{ if(o.d>=t&&o.d<=lim) ev.push({d:o.d,t:o.t.replace(/^[^\wΑ-Ωα-ω]+/,'')+' — '+who,desc:'Από οχεία/επώαση '+fd(r.date)}); }); });
  DB.logs.forEach(l=>{ [['wMilk','Λήξη αναμονής γάλακτος'],['wMeat','Λήξη αναμονής κρέατος']].forEach(([f,lab])=>{ if(l[f]){ const d=addDays(l.date,l[f]); if(d>=t&&d<=lim) ev.push({d,t:lab+' — '+targetLabel(l.target),desc:(l.product||l.cat)+' ('+fd(l.date)+')'}); } }); });
  DB.herds.forEach(h=>autoProgram(h).forEach(o=>{ if(o.date&&o.date>=t&&o.date<=lim&&!o.done) ev.push({d:o.date,t:o.it.t+' — '+(h.name||SP[h.sp].name),desc:o.it.d}); }));
  const seen=new Set(); return ev.filter(e=>{ const k=e.d+e.t; if(seen.has(k)) return false; seen.add(k); return true; }).sort((a,b)=>a.d<b.d?-1:1); }
function exportIcs(){ const ev=icsEvents(); if(!ev.length) return toast('Δεν υπάρχουν προγραμματισμένα γεγονότα για τους επόμενους 4 μήνες');
  const e=s=>String(s).replace(/[\\;,]/g,m=>'\\'+m).replace(/\n/g,'\\n'); const stamp=new Date().toISOString().replace(/[-:]/g,'').slice(0,15)+'Z';
  const body=ev.map((x,i)=>{ const d=x.d.replace(/-/g,''), d2=addDays(x.d,1).replace(/-/g,'');
    return ['BEGIN:VEVENT','UID:ktino-'+d+'-'+i+'@ktinotrofos','DTSTAMP:'+stamp,'DTSTART;VALUE=DATE:'+d,'DTEND;VALUE=DATE:'+d2,'SUMMARY:'+e('🐄 '+x.t),'DESCRIPTION:'+e(x.desc||''),
      'BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:'+e(x.t),'TRIGGER:-PT15H','END:VALARM','END:VEVENT'].join('\r\n'); }).join('\r\n');
  const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Ktinotrofos TN//EL','CALSCALE:GREGORIAN',body,'END:VCALENDAR'].join('\r\n');
  shareOrDownload('ktinotrofos_ypenthymiseis.ics',ics,'text/calendar'); toast('📅 '+ev.length+' υπενθυμίσεις — άνοιξε το αρχείο για να μπουν στο ημερολόγιο'); }

/* ---------------- 6. αντίγραφα ασφαλείας ---------------- */
async function shareOrDownload(name,content,type){ try{ const f=new File([content],name,{type}); if(navigator.canShare&&navigator.canShare({files:[f]})){ await navigator.share({files:[f],title:name}); return true; } }catch(e){ if(e&&e.name==='AbortError') return false; }
  download(name,content,type); return true; }
async function shareBackup(){ const ok=await shareOrDownload('ktinotrofos_'+todayISO()+'.json',JSON.stringify(DB),'application/json');
  if(ok){ ST.lastBackup=todayISO(); save(); toast('🛟 Το αντίγραφο στάλθηκε/αποθηκεύτηκε'); if(activeTabKey()==='today') renderToday(); } }
window.ktShareBackup=shareBackup;
$('expJson').addEventListener('click',()=>{ ST.lastBackup=todayISO(); save(); });
// Αυτόματα ημερήσια στιγμιότυπα (τα 3 τελευταία) — προστασία από λάθος διαγραφή
const SNAP='ktino_snaps';
function snapshots(){ try{ return JSON.parse(localStorage.getItem(SNAP)||'[]'); }catch(e){ return []; } }
function takeSnap(){ if(!DB.herds.length&&!DB.logs.length) return; const t=todayISO(); let s=snapshots(); if(s[0]&&s[0].d===t) return;
  const copy=Object.assign({},DB,{weather:{}}); s.unshift({d:t,n:DB.logs.length,h:DB.herds.length,data:copy}); s=s.slice(0,3);
  try{ localStorage.setItem(SNAP,JSON.stringify(s)); }catch(e){ try{ localStorage.setItem(SNAP,JSON.stringify(s.slice(0,1))); }catch(_){} } }
takeSnap();
const dataCard=$('expJson').closest('.card');
const bk=document.createElement('div');
dataCard.querySelector('hr').before(bk);
function renderBackupBox(){ const s=snapshots(); const lb=ST.lastBackup;
  bk.innerHTML=`<hr style="border:none;border-top:1px solid var(--line);margin:14px 0"><h2>🛟 Ασφάλεια δεδομένων</h2>
    <div class="small">Τελευταίο αντίγραφο: <b>${lb?fd(lb)+' (πριν '+diffDays(lb,todayISO())+' ημ.)':'ποτέ'}</b></div>
    <div class="btnrow"><button class="btn" id="bkShare">📤 Αποστολή αντιγράφου (Viber / email / Drive)</button></div>
    <div class="small" style="margin-top:10px">Αυτόματα ημερήσια στιγμιότυπα σε αυτή τη συσκευή (για επαναφορά μετά από λάθος):</div>
    ${s.length?`<table style="margin-top:4px">${s.map((x,i)=>`<tr><td>${fd(x.d)}</td><td class="small">${x.h} κοπάδια · ${x.n} καταγραφές</td><td class="num"><button class="btn sec mini" data-rs="${i}">↩️ Επαναφορά</button></td></tr>`).join('')}</table>`:'<div class="small">— κανένα ακόμη —</div>'}
    <div class="btnrow"><button class="btn sec" id="medBook">📘 Βιβλίο φαρμάκων (PDF)</button><button class="btn sec" id="medCsv">📘 Βιβλίο φαρμάκων (CSV/Excel)</button></div>`;
  $('bkShare').onclick=shareBackup; $('medBook').onclick=()=>medBook('pdf'); $('medCsv').onclick=()=>medBook('csv');
  bk.querySelectorAll('[data-rs]').forEach(b=>b.onclick=()=>{ const x=snapshots()[+b.dataset.rs]; if(!x||!confirm('Επαναφορά των δεδομένων της '+fd(x.d)+'; Ό,τι καταχώρησες μετά θα χαθεί.')) return;
    const w=DB.weather; DB=Object.assign({units:[],herds:[],animals:[],logs:[],repro:[],feeds:[],weather:{},settings:{}},x.data,{weather:w}); save(); location.reload(); }); }
renderBackupBox();

/* ---------------- 9. βιβλίο φαρμάκων & καρτέλα ζώου ---------------- */
function medRows(){ return DB.logs.filter(l=>WD_CATS.includes(l.cat)).sort((a,b)=>a.date<b.date?-1:1).map(l=>({l,um:l.wMilk?addDays(l.date,l.wMilk):'',ut:l.wMeat?addDays(l.date,l.wMeat):''})); }
function medBook(kind){ const rows=medRows(); if(!rows.length) return toast('Δεν υπάρχουν καταγραφές φαρμάκων/εμβολίων');
  if(kind==='csv'){ const q=v=>'"'+String(v==null?'':v).replace(/"/g,'""')+'"';
    const csv=[['Ημερομηνία','Ζώο/Κοπάδι','Κατηγορία','Σκεύασμα','Ποσότητα/ζώα','Αναμονή γάλακτος έως','Αναμονή κρέατος έως','Κόστος €','Σημειώσεις']].concat(rows.map(r=>[fd(r.l.date),targetLabel(r.l.target),r.l.cat,r.l.product,r.l.qty,r.um?fd(r.um):'',r.ut?fd(r.ut):'',r.l.cost,r.l.notes]));
    return download('vivlio_farmakon_'+todayISO()+'.csv','﻿'+csv.map(r=>r.map(q).join(';')).join('\r\n'),'text/csv;charset=utf-8'); }
  const u=DB.units.map(x=>esc(x.name)+(x.code?' (ΚΕ '+esc(x.code)+')':'')).join(', ');
  printDoc('Βιβλίο φαρμάκων',`<h1>📘 Βιβλίο κτηνιατρικών φαρμάκων</h1><div class="sub">${u} · εκτύπωση ${fd(todayISO())} · Καν. (ΕΕ) 2019/6</div>
    <table style="margin-top:10px;font-size:9pt"><tr style="background:#f5efec"><td><b>Ημ/νία</b></td><td><b>Ζώο / Κοπάδι</b></td><td><b>Σκεύασμα</b></td><td><b>Ποσότητα</b></td><td><b>Αναμονή γάλα έως</b></td><td><b>Αναμονή κρέας έως</b></td><td><b>Σημειώσεις</b></td></tr>
    ${rows.map(r=>`<tr><td>${fd(r.l.date)}</td><td>${esc(targetLabel(r.l.target))}</td><td>${esc(r.l.cat)}: ${esc(r.l.product)}</td><td>${esc(r.l.qty)}</td><td>${r.um?fd(r.um):'—'}</td><td>${r.ut?fd(r.ut):'—'}</td><td>${esc(r.l.notes)}</td></tr>`).join('')}</table>
    <p class="sub" style="margin-top:14px">Υπογραφή κτηνοτρόφου: ______________________ &nbsp;&nbsp; Υπογραφή κτηνιάτρου: ______________________</p>`); }
function printAnimal(id){ const a=getA(id); if(!a) return; const h=getH(a.herdId); const m=h?SP[h.sp]:{e:'',name:''};
  const logs=DB.logs.filter(l=>l.target==='animal:'+a.id||(h&&l.target==='herd:'+h.id&&WD_CATS.includes(l.cat))).sort((x,y)=>x.date<y.date?1:-1);
  const rep=DB.repro.filter(r=>r.animalId===a.id).sort((x,y)=>x.date<y.date?1:-1);
  const kids=DB.animals.filter(x=>x.mother===a.tag);
  printDoc('Καρτέλα ζώου '+a.tag,`<h1>${m.e} ${esc(a.tag)}${a.name?' «'+esc(a.name)+'»':''}</h1><div class="sub">${esc(m.name)} · ${esc(h?(h.name||''):'')} · εκτύπωση ${fd(todayISO())}</div>
    <div class="facts" style="margin-top:8px"><div><b>Φύλο</b>${a.sex==='F'?'Θηλυκό':a.sex==='M'?'Αρσενικό':'Ευνουχισμένο'}</div><div><b>Γέννηση</b>${a.birth?fd(a.birth):'—'}</div><div><b>Φυλή</b>${esc(a.breed||'—')}</div>
      <div><b>Μητέρα</b>${esc(a.mother||'—')}</div><div><b>Βάρος</b>${a.weight?fmt(a.weight,1)+' kg':'—'}</div><div><b>Κατάσταση</b>${esc(a.status)}</div></div>
    ${a.notes?`<p>${esc(a.notes)}</p>`:''}
    <h4>🤰 Αναπαραγωγή</h4>${rep.length?`<table>${rep.map(r=>`<tr><td>${fd(r.date)}</td><td>Οχεία/σπερματέγχυση ${esc(r.notes||'')}</td><td>${r.done?'Τοκετός: '+(r.born??'—')+' νεογέννητα':'σε εξέλιξη'}</td></tr>`).join('')}</table>`:'<div class="sub">—</div>'}
    ${kids.length?`<h4>🍼 Απόγονοι</h4><div>${kids.map(k=>esc(k.tag)).join(', ')}</div>`:''}
    <h4>📒 Ιστορικό (ζώο + φάρμακα κοπαδιού)</h4>${logs.length?`<table>${logs.map(l=>`<tr><td style="width:18%">${fd(l.date)}</td><td><b>${esc(l.cat)}</b> ${esc(l.product||'')} ${esc(l.qty||'')}${l.wMilk||l.wMeat?' · αναμονή '+(l.wMilk?'γάλα '+l.wMilk+'ημ. ':'')+(l.wMeat?'κρέας '+l.wMeat+'ημ.':''):''}<br><span class="sub">${esc(l.notes||'')}</span></td></tr>`).join('')}</table>`:'<div class="sub">—</div>'}`); }
const _renderAnimals=renderAnimals;
renderAnimals=function(){ _renderAnimals(); $('animalList').querySelectorAll('[data-ea]').forEach(b=>{ if(b.parentElement.querySelector('[data-pa]')) return;
  const p=document.createElement('button'); p.className='btn sec mini'; p.dataset.pa=b.dataset.ea; p.title='Καρτέλα για τον κτηνίατρο (PDF)'; p.textContent='🖨️'; p.onclick=()=>printAnimal(p.dataset.pa); b.after(p); }); };
// κουμπί βιβλίου φαρμάκων και στο Ημερολόγιο
(function(){ const h=$('tab-agenda').querySelector('#logSum'); if(!h) return; const d=document.createElement('div'); d.className='btnrow no-print'; d.style.margin='0 0 8px';
  d.innerHTML='<button class="btn sec mini">📘 Βιβλίο φαρμάκων (PDF)</button><button class="btn sec mini">📊 Στατιστικά</button>'; h.before(d);
  d.children[0].onclick=()=>medBook('pdf'); d.children[1].onclick=()=>activate('stats'); })();

/* ---------------- 7. στατιστικά & γραφήματα ---------------- */
let tip=null; function ctip(){ if(!tip){ tip=document.createElement('div'); tip.className='ctip'; document.body.appendChild(tip); } return tip; }
// Ομαδοποιημένο ραβδόγραμμα: series=[{name,color,values[12]}]
function barChart(labels,series,unit){ const W=640,H=230,L=48,R=8,T=12,B=26; const n=labels.length, k=series.length;
  const max=Math.max(1,...series.flatMap(s=>s.values)); const nice=niceMax(max); const pw=(W-L-R)/n, bw=Math.max(4,Math.min(26,(pw-10)/k-2));
  const y=v=>T+(H-T-B)*(1-v/nice); let g='';
  for(let i=0;i<=4;i++){ const v=nice*i/4, yy=y(v); g+=`<line class="gl" x1="${L}" x2="${W-R}" y1="${yy}" y2="${yy}"/><text x="${L-6}" y="${yy+4}" text-anchor="end">${fmt(v,v<10?1:0)}</text>`; }
  let bars='', hits='';
  labels.forEach((lb,i)=>{ const x0=L+i*pw+(pw-(bw+2)*k)/2;
    series.forEach((s,j)=>{ const v=s.values[i]||0; if(v<=0) return; const x=x0+j*(bw+2), yy=y(v), h=H-B-yy; const r=Math.min(4,h,bw/2);
      bars+=`<path d="M${x},${H-B} V${yy+r} Q${x},${yy} ${x+r},${yy} H${x+bw-r} Q${x+bw},${yy} ${x+bw},${yy+r} V${H-B} Z" fill="${s.color}"/>`; });
    hits+=`<rect class="hit" data-i="${i}" x="${L+i*pw}" y="${T}" width="${pw}" height="${H-T-B}"/><text x="${L+i*pw+pw/2}" y="${H-8}" text-anchor="middle">${lb}</text>`; });
  const svg=`<svg class="chart" viewBox="0 0 ${W} ${H}" role="img">${g}<line class="ax" x1="${L}" x2="${W-R}" y1="${H-B}" y2="${H-B}"/>${bars}${hits}</svg>`;
  const legend=series.length>1?`<div class="legend">${series.map(s=>`<span><i style="background:${s.color}"></i>${esc(s.name)}</span>`).join('')}</div>`:'';
  const table=`<details><summary class="small" style="cursor:pointer">📋 Πίνακας τιμών</summary><div class="tblwrap"><table><tr><th>Μήνας</th>${series.map(s=>`<th class="num">${esc(s.name)}</th>`).join('')}</tr>${labels.map((lb,i)=>`<tr><td>${lb}</td>${series.map(s=>`<td class="num">${fmt(s.values[i]||0,1)}</td>`).join('')}</tr>`).join('')}</table></div></details>`;
  return {html:legend+svg+table,bind:box=>{ box.querySelectorAll('.hit').forEach(r=>{ r.onmousemove=e=>{ const i=+r.dataset.i, t=ctip(); t.style.display='block';
      t.innerHTML=`<b>${labels[i]}</b>`+series.map(s=>`<div><i style="display:inline-block;width:9px;height:9px;border-radius:2px;background:${s.color};margin-right:5px"></i>${esc(s.name)}: <b>${fmt(s.values[i]||0,1)}${unit?' '+unit:''}</b></div>`).join('');
      t.style.left=Math.min(e.clientX+14,innerWidth-190)+'px'; t.style.top=(e.clientY-10)+'px'; }; r.onmouseleave=()=>{ ctip().style.display='none'; }; r.onclick=r.onmousemove; }); }}; }
function niceMax(v){ const p=Math.pow(10,Math.floor(Math.log10(v))); const f=v/p; return (f<=1?1:f<=2?2:f<=2.5?2.5:f<=5?5:10)*p; }
const css2=v=>getComputedStyle(document.documentElement).getPropertyValue(v).trim();
function monthly(year,fn){ const a=new Array(12).fill(0); DB.logs.forEach(l=>{ if(l.date.slice(0,4)!==String(year)) return; const v=fn(l); if(v) a[+l.date.slice(5,7)-1]+=v; }); return a; }
function renderStats(){
  const p=$('tab-stats'); const years=[...new Set(DB.logs.map(l=>+l.date.slice(0,4)).concat([new Date().getFullYear()]))].sort((a,b)=>b-a);
  const Y=+(ST.statsYear||years[0]); const hf=ST.statsHerd||'';
  const inHerd=l=>!hf||logMatches(l,'herd:'+hf);
  const cIn=css2('--c-in'), cOut=css2('--c-out'), cPrev=css2('--c-prev');
  const milk=monthly(Y,l=>l.cat==='Άμελξη / Γάλα'&&inHerd(l)?logNum(l):0), milkP=monthly(Y-1,l=>l.cat==='Άμελξη / Γάλα'&&inHerd(l)?logNum(l):0);
  const eggs=monthly(Y,l=>l.cat==='Αυγά'&&inHerd(l)?logNum(l):0);
  const inc=monthly(Y,l=>inHerd(l)?l.income||0:0), cost=monthly(Y,l=>inHerd(l)?l.cost||0:0);
  const births=monthly(Y,l=>l.cat==='Τοκετός / Εκκόλαψη'&&inHerd(l)?logNum(l):0), deaths=monthly(Y,l=>l.cat==='Θάνατος / Απώλεια'&&inHerd(l)?(logNum(l)||1):0);
  const sum=a=>a.reduce((x,y)=>x+y,0);
  const incP=sum(monthly(Y-1,l=>inHerd(l)?l.income||0:0)), costP=sum(monthly(Y-1,l=>inHerd(l)?l.cost||0:0));
  const hs=hf?DB.herds.filter(h=>h.id===hf):DB.herds; const heads=hs.reduce((a,h)=>a+(h.sp==='bees'?0:(h.count||0)),0);
  const net=sum(inc)-sum(cost), netP=incP-costP; const dNet=netP?((net-netP)/Math.abs(netP)*100):null;
  const fem=hs.filter(h=>SP[h.sp].prod.type==='milk').reduce((a,h)=>a+(h.females||h.count||0),0);
  const charts=[];
  const add=(title,labels,series,unit,note)=>{ if(!series.some(s=>sum(s.values)>0)) return ''; const c=barChart(labels,series,unit); charts.push(c); return `<div class="card"><h2>${title}</h2>${note?`<div class="hint">${note}</div>`:''}<div data-ch="${charts.length-1}">${c.html}</div></div>`; };
  const any=DB.logs.some(l=>l.date.slice(0,4)===String(Y));
  p.innerHTML=`<div class="card"><h2>📊 Στατιστικά φάρμας <span class="r"><select id="stY" style="width:auto">${years.map(y=>`<option ${y===Y?'selected':''}>${y}</option>`).join('')}</select>
      <select id="stH" style="width:auto"><option value="">Όλα τα κοπάδια</option>${DB.herds.map(h=>`<option value="${h.id}" ${h.id===hf?'selected':''}>${esc(herdLabel(h))}</option>`).join('')}</select></span></h2>
    <div class="kpi">
      <div class="box"><div class="v" style="color:${net>=0?'var(--ok)':'var(--bad)'}">${net>=0?'+':''}${fmt(net,0)} €</div><div class="l">Καθαρό ${Y}${dNet!=null?` · ${dNet>=0?'▲':'▼'} ${fmt(Math.abs(dNet),0)}% vs ${Y-1}`:''}</div></div>
      <div class="box"><div class="v">${fmt(sum(inc),0)} €</div><div class="l">Έσοδα</div></div>
      <div class="box"><div class="v">${fmt(sum(cost),0)} €</div><div class="l">Έξοδα</div></div>
      ${heads?`<div class="box"><div class="v">${fmt(sum(cost)/heads,2)} €</div><div class="l">Κόστος / ζώο</div></div>`:''}
      ${sum(milk)?`<div class="box"><div class="v">${fmt(sum(milk),0)} kg</div><div class="l">Γάλα ${Y}${fem?' · '+fmt(sum(milk)/fem,0)+' kg/θηλ.':''}</div></div>`:''}
      ${sum(births)?`<div class="box"><div class="v">${fmt(sum(births),0)}</div><div class="l">Γεννήσεις</div></div>`:''}
      ${sum(deaths)?`<div class="box"><div class="v">${fmt(sum(deaths),0)}</div><div class="l">Απώλειες${sum(births)?' · '+fmt(sum(deaths)/Math.max(1,sum(births))*100,0)+'%':''}</div></div>`:''}
    </div>${any?'':'<div class="note info">Δεν υπάρχουν ακόμη καταγραφές για το '+Y+'. Πάτα ➕ και κατέγραφε γάλα, αυγά, πωλήσεις & έξοδα — τα γραφήματα φτιάχνονται αυτόματα.</div>'}</div>
  ${add('💶 Έσοδα & έξοδα ανά μήνα',MONTHS_S,[{name:'Έσοδα',color:cIn,values:inc},{name:'Έξοδα',color:cOut,values:cost}],'€')}
  ${add('🥛 Γάλα ανά μήνα (kg)',MONTHS_S,[{name:String(Y),color:cIn,values:milk}].concat(sum(milkP)?[{name:String(Y-1),color:cPrev,values:milkP}]:[]),'kg',sum(milkP)?'Σύγκριση με την ίδια περίοδο πέρσι.':'')}
  ${add('🥚 Αυγά ανά μήνα',MONTHS_S,[{name:'Αυγά',color:cIn,values:eggs}],'')}
  ${add('🍼 Γεννήσεις & απώλειες ανά μήνα',MONTHS_S,[{name:'Γεννήσεις',color:cIn,values:births},{name:'Απώλειες',color:cOut,values:deaths}],'')}`;
  p.querySelectorAll('[data-ch]').forEach(b=>charts[+b.dataset.ch].bind(b));
  $('stY').onchange=e=>{ ST.statsYear=e.target.value; save(); renderStats(); }; $('stH').onchange=e=>{ ST.statsHerd=e.target.value; save(); renderStats(); };
}

/* ---------------- εκκίνηση ---------------- */
activate('today');
if(!DB.herds.length && !ST.onboarded) setTimeout(wizard,600);
// όταν πατιέται το «Παράδειγμα» από τα Δεδομένα
$('demoBtn').addEventListener('click',()=>{ ST.onboarded=true; setTimeout(()=>{ save(); },500); });
})();
