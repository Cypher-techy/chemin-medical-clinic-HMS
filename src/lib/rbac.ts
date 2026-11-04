export const ROLES=['SUPER_ADMIN','CLINIC_ADMIN','DOCTOR','NURSE','RECEPTIONIST','PHARMACIST','LAB_TECH','ACCOUNTANT','RECORDS_OFFICER','INVENTORY_OFFICER','HR_OFFICER','PATIENT'] as const;
export type Role=typeof ROLES[number];
const P:Record<string,string[]>={
 SUPER_ADMIN:['admin','users','audit','settings','reports'],
 CLINIC_ADMIN:['admin','users','patients','reports','settings','hr'],
 DOCTOR:['patients','encounter','prescribe','lab','referral','reports'],
 NURSE:['patients','vitals','triage','encounter'],
 RECEPTIONIST:['patients','appointments','queue','billing'],
 PHARMACIST:['pharmacy','prescribe','patients','inventory'],
 LAB_TECH:['lab','patients'],
 ACCOUNTANT:['billing','reports','patients'],
 RECORDS_OFFICER:['patients','reports'],
 INVENTORY_OFFICER:['inventory','pharmacy'],
 HR_OFFICER:['hr','users'],
 PATIENT:['portal'],
};
// Super Admin intentionally has NO clinical sign/prescribe authority (spec §5)
export function can(role:string,perm:string){ const list=P[role]||[]; const area=perm.split(':')[0]; if(role==='SUPER_ADMIN'&&['encounter:sign','prescribe'].includes(perm))return false; return list.includes(perm)||list.includes(area); }
