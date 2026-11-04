import {currentUser} from '@/lib/auth'; export async function GET(){ const u=await currentUser(); return u?Response.json({user:u}):Response.json({error:'Unauthenticated'},{status:401}); }
