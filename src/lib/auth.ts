import {SignJWT,jwtVerify} from 'jose'; import {cookies} from 'next/headers'; import {db} from './db';
const secret=new TextEncoder().encode(process.env.JWT_SECRET||'dev-only-change-me-32-chars-long!!');
export async function signSession(u:{id:string;role:string;name:string;email:string}){ return new SignJWT({...u}).setProtectedHeader({alg:'HS256'}).setSubject(u.id).setIssuedAt().setExpirationTime('8h').sign(secret); }
export async function currentUser(){ try{ const t=cookies().get('chemin_session')?.value; if(!t)return null; const {payload}=await jwtVerify(t,secret); return payload as any; }catch{return null;} }
export async function requireUser(perms:string[]=[]){ const u=await currentUser(); if(!u) return {error:Response.json({error:'Unauthenticated'},{status:401})}; const {can}=await import('./rbac'); if(perms.length&&!perms.some((p:any)=>can(u.role,p))) return {error:Response.json({error:'Forbidden',required:perms},{status:403})}; return {user:u}; }
export async function audit(actorId:string|null,action:string,target:string,targetId?:string,details?:string){ await db.auditLog.create({data:{actorId:actorId||undefined,action,target,targetId,details}}).catch(()=>{}); }
