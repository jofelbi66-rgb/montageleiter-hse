import {MAIL_ENDPOINT,MAIL_RECIPIENT} from './mail-config.mjs?v=mail2';
export {MAIL_RECIPIENT};
export function configured(){return /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(MAIL_ENDPOINT)}
export function mailRecord(r){
 return {id:r.id,kind:r.kind,site:r.site,project:r.project,customer:r.customer,place:r.place,date:r.date,leader:r.leader,projectLead:r.projectLead||'',operations:r.operations||'',notes:r.notes,checks:r.checks.map(c=>({answer:c.answer,note:c.note})),points:r.points.map(p=>({title:p.title,owner:p.owner,due:p.due,done:p.done})),confirmations:r.confirmations.map(s=>({role:s.role,name:s.name,time:s.time,image:s.image}))};
}
export async function fingerprint(r){const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(mailRecord(r))));return Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('')}
export function readyError(r){if(r.kind!=='handover'||r.site!=='Dresden')return 'Der Mailversand ist für Projektübergaben im Piloten Dresden vorgesehen.';if(!r.checks.every(c=>['ja','nein','nz'].includes(c.answer)))return 'Bitte zuerst alle zehn Checklistenbereiche bewerten.';if(r.confirmations.length!==2||!['giver','receiver'].every(role=>r.confirmations.some(s=>s.role===role)))return 'Bitte zuerst beide Übergabebestätigungen erfassen.';return ''}
export async function sendReport(r,token){
 if(!configured())throw Error('Der Mailversand ist noch nicht eingerichtet.');
 const error=readyError(r);if(error)throw Error(error);
 const hash=await fingerprint(r),controller=new AbortController(),timer=setTimeout(()=>controller.abort(),60000);
 try{
  const response=await fetch(MAIL_ENDPOINT,{method:'POST',body:new URLSearchParams({token,record:JSON.stringify(mailRecord(r))}),signal:controller.signal,redirect:'follow'});
  let result;try{result=JSON.parse(await response.text())}catch{throw Error('Keine eindeutige Versandbestätigung erhalten. Bitte Posteingang prüfen; nicht mit veränderten Angaben erneut senden.')}
  if(!response.ok||result.ok!==true)throw Error(result?.message||'Versand nicht bestätigt. Bitte Posteingang prüfen.');
  if(result.hash!==hash||!/^\S+@\S+\.\S+$/.test(result.recipient||'')||!Number.isFinite(Date.parse(result.sentAt)))throw Error('Versandantwort passt nicht zu dieser Übergabe. Bitte Posteingang prüfen.');
  return {hash,sentAt:result.sentAt,recipient:result.recipient};
 }catch(e){if(e.name==='AbortError'||e instanceof TypeError)throw Error('Verbindung unterbrochen: Versandstatus unklar. Bitte Posteingang prüfen. Eine unveränderte Wiederholung wird vom Script gegen Doppelversand geprüft.');throw e}finally{clearTimeout(timer)}
}
