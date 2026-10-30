export const STORE='montageleitung-hse-v1';
export const CHECKS=[['Arbeitsumfang und Ablauf','Arbeiten, Reihenfolge und Zeitplan sind bekannt.'],['Kunden-HSE-Anforderungen','Besondere Regeln, Unterweisungen und Zutritt sind geklärt.'],['Baustellenbedingungen','Zufahrt, Lagerflächen, Verkehrswege und Umgebung sind bekannt.'],['Fremdgewerke und Koordination','Parallel arbeitende Gewerke und Koordination sind geklärt.'],['Gefährdungsbeurteilung','Aktuell, tätigkeitsbezogen und für die Baustelle verfügbar.'],['Montage-, Hebe- und Transportplanung','Hebezeuge, Anschlagmittel und Transportwege sind geplant.'],['Personal und Qualifikationen','Personalbedarf, Unterweisungen und Nachweise sind geklärt.'],['Arbeitsmittel','Werkzeuge und Geräte sind vorhanden und geprüft.'],['Freigaben','Erforderliche Freigabescheine sind geklärt.'],['Notfallorganisation','Ersthelfer, Notruf, Sammelplatz und Rettungswege sind bekannt.']];
export const LMRA=['Ist die Tätigkeit klar und sind alle Beteiligten unterwiesen?','Sind aktuelle Gefährdungen und Wechselwirkungen geprüft?','Sind Schutzmaßnahmen, Arbeitsmittel und PSA geeignet?','Sind notwendige Freigaben und Absperrungen vorhanden?','Sind Notfallwege und Kommunikation geklärt?'];
export function id(){return crypto.randomUUID()}
export function today(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
export function blank(kind){return {id:id(),kind,site:'Dresden',project:'',customer:'',place:'',date:today(),leader:'',title:'',notes:'',checks:CHECKS.map(()=>({answer:'',note:''})),points:[],confirmations:[],participants:[],lmra:LMRA.map(()=>''),decision:'stop',created:new Date().toISOString(),updated:new Date().toISOString()}}
export function empty(){return {schema:1,records:[],savedAt:null}}
export function status(r){if(r.kind==='lmra')return r.decision==='ready'&&r.lmra.every(x=>x==='ja')?'Geprüft':'Stopp / Klärung';if(r.kind==='toolbox')return r.participants.length?'Dokumentiert':'Entwurf';if(r.points.some(x=>!x.done))return 'Offene Punkte';return r.confirmations.length===2?'Bestätigt':'Entwurf'}
export function overdue(p){return !p.done&&!!p.due&&p.due<today()}
export function invalidate(before,after){if(before.kind!=='handover')return after;const fields=['site','project','customer','place','date','leader','projectLead','operations','notes','checks'];if(fields.some(k=>JSON.stringify(before[k])!==JSON.stringify(after[k])))after.confirmations=[];return after}
export function validate(data){
 if(!data||data.schema!==1||!Array.isArray(data.records)||data.records.length>10000)throw Error('Unbekanntes oder zu großes Sicherungsformat.');
 const ids=new Set();const text=(v,max=100000)=>typeof v==='string'&&v.length<=max;const date=v=>text(v,10)&&(!v||(/^\d{4}-\d{2}-\d{2}$/.test(v)&&!Number.isNaN(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v));
 for(const r of data.records){if(!r||!text(r.id,100)||!/^[a-zA-Z0-9-]+$/.test(r.id)||ids.has(r.id)||!['handover','toolbox','lmra'].includes(r.kind))throw Error('Ungültige oder doppelte Datensatzkennung.');ids.add(r.id);
 for(const k of ['site','project','customer','place','leader','title','notes'])if(!text(r[k]))throw Error('Ungültiges Textfeld.');
 if(!date(r.date)||!Array.isArray(r.checks)||r.checks.length!==10||!r.checks.every(c=>c&&['','ja','nein','nz'].includes(c.answer)&&text(c.note)))throw Error('Ungültige Checkliste.');
 if(!Array.isArray(r.points)||!r.points.every(p=>p&&text(p.id,100)&&/^[a-zA-Z0-9-]+$/.test(p.id)&&text(p.title)&&text(p.owner)&&date(p.due)&&typeof p.done==='boolean'))throw Error('Ungültige offene Punkte.');
 const sig=s=>s&&text(s.name,200)&&text(s.time,60)&&text(s.image,1500000)&&/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(s.image);
 if(!Array.isArray(r.confirmations)||r.confirmations.length>2||!r.confirmations.every(s=>sig(s)&&['giver','receiver'].includes(s.role))||new Set(r.confirmations.map(s=>s.role)).size!==r.confirmations.length)throw Error('Ungültige Bestätigung.');
 if(!Array.isArray(r.participants)||!r.participants.every(sig))throw Error('Ungültige Teilnehmer.');
 if(!Array.isArray(r.lmra)||r.lmra.length!==5||!r.lmra.every(x=>['','ja','nein'].includes(x))||!['stop','ready'].includes(r.decision))throw Error('Ungültige LMRA.');
 if(r.decision==='ready'&&r.kind==='lmra'&&!r.lmra.every(x=>x==='ja'))throw Error('LMRA enthält widersprüchliche Freigabeangaben.');
 }return data;
}
export function demo(){const a=blank('handover');Object.assign(a,{project:'DEMO-D-017',customer:'Beispiel Anlagenbau',place:'Dresden · Montagehalle',leader:'M. Muster',notes:'Montage einer Rohrleitungsstrecke. Ausschließlich fiktive Beispieldaten.',title:'Beispielübergabe'});a.checks=a.checks.map((x,i)=>({answer:i===5?'nein':'ja',note:i===5?'Hebeplan vor Montagebeginn abstimmen.':''}));a.points=[{id:id(),title:'Hebeplan abstimmen und bereitstellen',owner:'Projektleitung',due:today(),done:false}];return a;}
