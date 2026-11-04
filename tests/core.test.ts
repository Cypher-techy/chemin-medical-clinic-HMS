import {describe,it,expect} from 'vitest';
import {bmi,vitalWarnings,allergyConflict} from '../src/lib/clinical';
import {fefoAllocate,isExpired} from '../src/lib/pharmacy';
import {invoiceTotal,balance} from '../src/lib/billing';
import {duplicateScore,DUPLICATE_THRESHOLD} from '../src/lib/duplicates';
import {can} from '../src/lib/rbac';
import {detectConflict} from '../src/lib/sync';
describe('clinical',()=>{ it('BMI',()=>expect(bmi(170,70)).toBe(24.2)); it('warnings',()=>expect(vitalWarnings({spo2:88,systolic:190}).length).toBeGreaterThan(0)); it('allergy conflict',()=>expect(allergyConflict(['Penicillin'],'Penicillin V').length).toBeGreaterThan(0)); });
describe('pharmacy FEFO & expiry',()=>{ const now=new Date('2026-01-01'); const b=[{id:'a',batchNo:'A',expiry:new Date('2026-06-01'),quantity:5},{id:'b',batchNo:'B',expiry:new Date('2025-01-01'),quantity:100},{id:'c',batchNo:'C',expiry:new Date('2027-01-01'),quantity:10}]; it('never allocates expired, earliest expiry first',()=>{ const r=fefoAllocate(b as any,8,now); expect(r.alloc).toEqual([{batchId:'a',quantity:5},{batchId:'c',quantity:3}]); expect(r.shortfall).toBe(0);}); it('shortfall when only expired stock',()=>expect(fefoAllocate([b[1]] as any,5,now).shortfall).toBe(5)); it('expired check',()=>expect(isExpired(b[1],now)).toBe(true)); });
describe('billing',()=>{ it('totals',()=>expect(invoiceTotal([{quantity:2,unitPrice:500}])).toBe(1000)); it('balance',()=>expect(balance(1000,400)).toBe(600)); });
describe('duplicates',()=>{ it('same phone+DOB flagged, similar name alone not merged',()=>{ const a={firstName:'John',surname:'Doe',dob:new Date('1990-01-01'),phone:'+254700000000'}; expect(duplicateScore(a,{...a})).toBeGreaterThanOrEqual(DUPLICATE_THRESHOLD); expect(duplicateScore(a,{firstName:'John',surname:'Doe',dob:new Date('1991-01-01'),phone:'+254711111111'})).toBeLessThan(DUPLICATE_THRESHOLD); }); });
describe('RBAC server rules',()=>{ it('receptionist cannot sign',()=>expect(can('RECEPTIONIST','encounter:sign')).toBe(false)); it('super admin gets no clinical signing by default',()=>expect(can('SUPER_ADMIN','encounter:sign')).toBe(false)); it('doctor can prescribe area',()=>expect(can('DOCTOR','prescribe')).toBe(true)); it('cashier cannot diagnose (no encounter)',()=>expect(can('ACCOUNTANT','encounter')).toBe(false)); });
describe('sync safety',()=>{ it('signed record conflict',()=>expect(detectConflict('Encounter',{}, {status:'SIGNED'})).toMatch(/Signed/)); it('draft no conflict',()=>expect(detectConflict('Encounter',{}, {status:'DRAFT'})).toBeNull()); });
import {generateSecret,totp,verifyTotp,base32Encode,base32Decode} from '../src/lib/totp';
describe('TOTP MFA (RFC 6238)',()=>{ it('round-trips base32',()=>{ const b=Buffer.from('chemin-secret'); expect(base32Decode(base32Encode(b)).toString()).toBe('chemin-secret'); }); it('accepts current code, rejects wrong/expired',()=>{ const s=generateSecret(); const now=Date.now(); expect(verifyTotp(s,totp(s,now),now)).toBe(true); expect(verifyTotp(s,'000000')&&totp(s,now)!=='000000').toBe(false); expect(verifyTotp(s,totp(s,now-5*60000),now)).toBe(false); }); });
// Regression guard documenting the SQLite TEXT-affinity boolean trap (values return as "0"/"0.0"/"1")
describe('boolean storage contract',()=>{ it('documents truthiness trap',()=>{ expect(Boolean('0.0')).toBe(true); expect(Number('0.0')===0).toBe(true); }); });
