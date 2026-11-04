export type BatchLike={id:string;batchNo:string;expiry:Date;quantity:number};
export function isExpired(b:BatchLike,now=new Date()){return b.expiry<=now;}
export function fefoAllocate(batches:BatchLike[],qty:number,now=new Date()){ const usable=batches.filter((b:any)=>!isExpired(b,now)&&b.quantity>0).sort((a:any,b:any)=>a.expiry.getTime()-b.expiry.getTime()); let rem=qty; const alloc:{batchId:string;quantity:number}[]=[]; for(const b of usable){ if(rem<=0)break; const take=Math.min(b.quantity,rem); alloc.push({batchId:b.id,quantity:take}); rem-=take; } return {alloc,shortfall:rem}; }
