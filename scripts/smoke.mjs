// End-to-end API smoke test against a running HMS instance (synthetic data only).
const B=process.env.BASE_URL||'http://localhost:3000'; const jar={};
async function call(method,path,body,who){ const r=await fetch(B+path,{method,headers:{'Content-Type':'application/json',...(jar[who]?{Cookie:jar[who]}:{})},body:body?JSON.stringify(body):undefined}); const set=r.headers.get('set-cookie'); if(set)jar[who]=set.split(';')[0]; const d=await r.json().catch(()=>({})); return {r,d}; }
const ok=(name,cond)=>{ console.log((cond?'PASS':'FAIL')+' '+name); if(!cond)process.exitCode=1; };
const login=async(who,email)=>{ const {r}=await call('POST','/api/auth/login',{email,password:'Chemin@2026'},who); ok('login '+who,r.ok); };
const stamp=Date.now().toString().slice(-6);
await login('rec','reception@cheminmedicalclinic.co.ke'); await login('doc','doctor@cheminmedicalclinic.co.ke'); await login('lab','lab@cheminmedicalclinic.co.ke'); await login('pharm','pharmacy@cheminmedicalclinic.co.ke'); await login('nur','nurse@cheminmedicalclinic.co.ke'); await login('acc','accounts@cheminmedicalclinic.co.ke'); await login('adm','admin@cheminmedicalclinic.co.ke');
let {d}=await call('POST','/api/patients',{firstName:'Smoke'+stamp,surname:'Journey',dob:'1990-01-01',sex:'Female',phone:'+254799'+stamp},'rec'); const pid=d.patient?.id; ok('register patient',!!pid);
({d}=await call('POST','/api/patients',{firstName:'Smoke'+stamp,surname:'Journey',dob:'1990-01-01',sex:'Female',phone:'+254799'+stamp},'rec')); ok('duplicate blocked',(d.warning||'').includes('duplicate')||!!d.duplicates);
({d}=await call('POST','/api/visits',{patientId:pid},'rec')); const vid=d.visit?.id; ok('check-in queue',!!vid&&!!d.visit.queueNo&&!!d.visit.checkInAt);
({d}=await call('POST','/api/vitals',{visitId:vid,patientId:pid,systolic:118,diastolic:76,pulse:70,tempC:36.8,spo2:99,heightCm:165,weightKg:60},'nur')); ok('vitals + BMI',d.vital?.bmi>0);
({d}=await call('POST','/api/encounters',{action:'create',visitId:vid,patientId:pid,chiefComplaint:'Test',diagnoses:'J06.9 URTI',plan:'Review 3d'},'doc')); const enc=d.encounter?.id; ok('encounter draft',!!enc);
({d}=await call('POST','/api/encounters',{action:'prescribe',patientId:pid,encounterId:enc,medicineId:'med-paracetamol',dose:'1 tab',frequency:'TDS',duration:'3d',quantity:6},'doc')); ok('prescribe',!!d.prescription);
({d}=await call('POST','/api/encounters',{action:'sign',id:enc},'doc')); ok('sign',d.encounter?.status==='SIGNED');
const dupSign=await call('POST','/api/encounters',{action:'sign',id:enc},'doc'); ok('re-sign blocked',dupSign.r.status===409);
({d}=await call('POST','/api/lab',{action:'order',patientId:pid,testId:(await call('GET','/api/lab',null,'lab')).d.tests[0].id},'lab')); const oid=d.order?.id; ok('lab order+specimen',!!d.order?.specimenId);
await call('POST','/api/lab',{action:'result',id:oid,resultValue:5},'lab'); ({d}=await call('POST','/api/lab',{action:'verify',id:oid},'lab')); ok('lab verify',d.order?.status==='VERIFIED');
({d}=await call('POST','/api/billing',{action:'invoice',patientId:pid,items:[{description:'Consultation',quantity:1,unitPrice:500}]},'acc')); const inv=d.invoice?.id; ok('invoice',d.invoice?.total===500);
({d}=await call('POST','/api/billing',{action:'pay',invoiceId:inv,method:'CASH',amount:500,reference:'SMK-'+stamp},'acc')); ok('payment',d.payment?.status==='VERIFIED');
const rx=(await call('GET','/api/pharmacy',null,'pharm')).d.prescriptions.find(x=>x.status==='PENDING'); ({d}=await call('POST','/api/pharmacy',{action:'dispense',prescriptionId:rx.id},'pharm')); ok('FEFO dispense',d.status==='DISPENSED');
({d}=await call('GET','/api/reports',null,'acc')); ok('reports revenue>=500',d.revenue>=500);
({d}=await call('POST','/api/backup',null,'adm')); ok('backup created',!!d.sha256);
({d}=await call('POST','/api/sync',{entity:'Encounter',entityId:enc,operation:'UPDATE',payload:{status:'SIGNED'},clientEventId:'smk-'+stamp},'doc')); ok('sync signed conflict',d.event?.status==='CONFLICT');
const forbidden=await call('POST','/api/encounters',{action:'sign',id:enc},'rec'); ok('receptionist cannot sign (403)',forbidden.r.status===403);
console.log('Smoke journey complete.');
