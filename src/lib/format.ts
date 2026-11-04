export const kes=(n:number)=>'KES '+n.toLocaleString('en-KE',{minimumFractionDigits:2});
export function age(dob:Date|string){ const d=new Date(dob); const now=new Date(); let a=now.getFullYear()-d.getFullYear(); if(now.getMonth()<d.getMonth()||(now.getMonth()===d.getMonth()&&now.getDate()<d.getDate()))a--; return a; }
