import test from 'node:test';
import assert from 'node:assert/strict';
import {demo} from './model.mjs';
import {mailRecord,fingerprint,readyError,configured,sendReport} from './mail.mjs';
function sample(){const r=demo();r.confirmations=['giver','receiver'].map(role=>({role,name:'Fiktive Testperson',time:'2026-10-30T12:00:00Z',image:'data:image/png;base64,iVBORw0KGgo='}));return r;}
test('Konfigurierte Web-App: Versandprüfung ausschließlich mit simuliertem Netz',async()=>{
 assert.equal(configured(),true);const original=globalThis.fetch,r=sample(),hash=await fingerprint(r);let calls=0;
 globalThis.fetch=async(url,options)=>{calls++;assert.equal(options.method,'POST');assert.equal(options.body.get('token'),'test-only');return {ok:true,text:async()=>JSON.stringify({ok:true,hash,recipient:'pilot@example.com',sentAt:'2026-10-30T12:00:00Z'})}};
 try{const receipt=await sendReport(r,'test-only');assert.equal(receipt.hash,hash);assert.equal(calls,1);
 globalThis.fetch=async()=>({ok:true,text:async()=>'<html>Login</html>'});await assert.rejects(()=>sendReport(r,'test-only'),/Keine eindeutige/);
 globalThis.fetch=async()=>({ok:true,text:async()=>JSON.stringify({ok:true,hash:'wrong',recipient:'pilot@example.com',sentAt:'2026-10-30T12:00:00Z'})});await assert.rejects(()=>sendReport(r,'test-only'),/passt nicht/);
 }finally{globalThis.fetch=original}
});
test('Vollständige Checkliste und zwei Unterschriften erforderlich',()=>{const r=demo();assert.match(readyError(r),/bestätigungen/);r.checks[0].answer='';assert.match(readyError(r),/zehn/);assert.equal(readyError(sample()),'')});
test('Inhaltskennung ignoriert Speicherzeit, berücksichtigt Änderungen',async()=>{const r=sample(),hash=await fingerprint(r);r.updated='new';r.mail={sentAt:'x'};assert.equal(await fingerprint(r),hash);r.points[0].done=true;assert.notEqual(await fingerprint(r),hash)});
