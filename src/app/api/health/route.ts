import {db} from '@/lib/db';
export async function GET(){ try{ const users=await db.user.count(); return Response.json({status:'ok',service:'chemin-hms',db:'connected',users,aiEnabled:process.env.AI_ENABLED==='true',time:new Date().toISOString()}); }catch(e:any){ return Response.json({status:'error',error:e.message},{status:503}); } }
