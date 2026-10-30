import test from 'node:test';import assert from 'node:assert/strict';
import {blank,empty,validate,invalidate,status,demo} from './model.mjs';
test('Sicherung für alle Dokumenttypen wird akzeptiert',()=>{const d=empty();d.records=['handover','toolbox','lmra'].map(blank);assert.equal(validate(JSON.parse(JSON.stringify(d))).records.length,3)});
test('Geänderte Checkliste setzt Bestätigungen zurück',()=>{const a=blank('handover');a.confirmations=[{role:'giver'}];const b=structuredClone(a);b.checks[0].answer='nein';assert.equal(invalidate(a,b).confirmations.length,0);assert.equal(a.confirmations.length,1)});
test('Unveränderte Inhalte behalten Bestätigungen',()=>{const a=blank('handover');a.confirmations=[{role:'giver'}];assert.equal(invalidate(a,structuredClone(a)).confirmations.length,1)});
test('Offene Maßnahmen haben Vorrang vor Bestätigungsstatus',()=>{const a=demo();a.confirmations=[{},{}];assert.equal(status(a),'Offene Punkte');a.points[0].done=true;assert.equal(status(a),'Bestätigt')});
test('Widersprüchliche LMRA wird beim Import abgelehnt',()=>{const d=empty(),a=blank('lmra');a.decision='ready';d.records=[a];assert.throws(()=>validate(d),/LMRA/);a.lmra.fill('ja');assert.equal(validate(d),d)});
test('Duplikate und ungültige Signaturquellen abweisen',()=>{const d=empty(),a=blank('handover');d.records=[a,a];assert.throws(()=>validate(d),/doppelte/);d.records=[a];a.confirmations=[{role:'giver',name:'Test',time:'2026-10-30',image:'javascript:alert(1)'}];assert.throws(()=>validate(d),/Bestätigung/)});
test('Beschädigte Checklisten abweisen',()=>{const d=empty();d.records=[blank('handover')];d.records[0].checks=[];assert.throws(()=>validate(d),/Checkliste/)});
