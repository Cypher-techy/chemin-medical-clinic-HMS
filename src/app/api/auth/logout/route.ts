import {cookies} from 'next/headers'; export async function POST(){ cookies().delete('chemin_session'); return Response.json({ok:true}); }
