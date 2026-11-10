import { NextRequest, NextResponse } from 'next/server';
import { book, outcome, revoke, store } from '@/lib/store';
export const dynamic = 'force-dynamic';
export async function GET() { return NextResponse.json(store); }
export async function POST(request:NextRequest) { try { const body=await request.json(); let result; if(body.action==='book') result=book(body.studentId,body.slotId); else if(body.action==='outcome') result=outcome(body.bookingId,body.outcome,body.notes||''); else if(body.action==='revoke') result=revoke(body.studentId); else throw Error('Unknown action'); return NextResponse.json({ok:true,result,store}); } catch(error) { return NextResponse.json({ok:false,error:error instanceof Error?error.message:'Something went wrong'}, {status:409}); } }
