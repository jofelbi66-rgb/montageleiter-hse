import test from 'node:test';
import assert from 'node:assert/strict';
import {demo} from './model.mjs';
import {mailRecord,fingerprint,readyError,configured,sendReport} from './mail.mjs';
function sample(){const r=demo();r.confirmations=['giver','receiver'].map(role=>({role,name:'Fiktive Testperson',time:'2026-10-30T12:00:00Z',image:'data:image/png;base64,iVBORw0KGgo='}));return r;}
test('Versand ohne neue Web-App bleibt deaktiviert',async()=>{assert.equal(configured(),false);await assert.rejects(()=>sendReport(sample(),'test'),/noch nicht eingerichtet/)});
test('Vollständige Checkliste und zwei Unterschriften erforderlich',()=>{const r=demo();assert.match(readyError(r),/bestätigungen/);r.checks[0].answer='';assert.match(readyError(r),/zehn/);assert.equal(readyError(sample()),'')});
test('Inhaltskennung ignoriert Speicherzeit, berücksichtigt Änderungen',async()=>{const r=sample(),hash=await fingerprint(r);r.updated='new';r.mail={sentAt:'x'};assert.equal(await fingerprint(r),hash);r.points[0].done=true;assert.notEqual(await fingerprint(r),hash)});
