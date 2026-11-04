export function invoiceTotal(items:{quantity:number;unitPrice:number}[]){return Math.round(items.reduce((s:any,i:any)=>s+i.quantity*i.unitPrice,0)*100)/100;}
export function balance(total:number,paid:number){return Math.round((total-paid)*100)/100;}
