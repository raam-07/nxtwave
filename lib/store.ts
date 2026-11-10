export type Outcome = 'pass' | 'fail' | 'retake';
export type Slot = { id:string; interviewer:string; startAt:string; active:boolean };
export type Student = { id:string; name:string; email:string; eligible:boolean; badgeActive:boolean; attempts:number };
export type Booking = { id:string; studentId:string; slotId:string; status:'booked'|'completed'; outcome?:Outcome; notes?:string; createdAt:string };
const future = (day:number, hour:number) => { const d=new Date(); d.setDate(d.getDate()+day); d.setHours(hour,0,0,0); return d.toISOString() };
const seed = () => ({
 students: [
  {id:'s1',name:'Aarav Mehta',email:'aarav@student.grit.edu',eligible:true,badgeActive:true,attempts:0},
  {id:'s2',name:'Nisha Rao',email:'nisha@student.grit.edu',eligible:true,badgeActive:true,attempts:1},
  {id:'s3',name:'Kabir Shah',email:'kabir@student.grit.edu',eligible:false,badgeActive:true,attempts:0},
  {id:'s4',name:'Zoya Khan',email:'zoya@student.grit.edu',eligible:true,badgeActive:false,attempts:1},
 ],
 slots: [
  {id:'slot-1',interviewer:'Priya Nair',startAt:future(1,10),active:true},{id:'slot-2',interviewer:'Priya Nair',startAt:future(1,11),active:true},{id:'slot-3',interviewer:'Rohan Das',startAt:future(1,14),active:true},{id:'slot-4',interviewer:'Rohan Das',startAt:future(2,10),active:true},{id:'slot-5',interviewer:'Meera Iyer',startAt:future(2,15),active:true}
 ], bookings: [] as Booking[] });
type Store = ReturnType<typeof seed>;
declare global { var gritStore: Store | undefined }
export const store = global.gritStore ?? seed(); global.gritStore = store;
export const student = (id='s1') => store.students.find(s=>s.id===id)!;
export function book(studentId:string,slotId:string) { const s=student(studentId); const slot=store.slots.find(x=>x.id===slotId); if(!s.eligible) throw Error('You are not currently eligible to book an interview.'); if(!s.badgeActive) throw Error('Your GRIT badge has been revoked. Contact an administrator.'); if(!slot?.active) throw Error('This time is no longer available.'); if(store.bookings.some(b=>b.slotId===slotId&&b.status==='booked')) throw Error('Another student just booked this time. Please choose another.'); if(store.bookings.some(b=>b.studentId===studentId&&b.status==='booked')) throw Error('You already have an active interview booking.'); const b={id:crypto.randomUUID(),studentId,slotId,status:'booked' as const,createdAt:new Date().toISOString()}; store.bookings.push(b); return b; }
export function outcome(id:string,outcome:Outcome,notes:string) { const b=store.bookings.find(x=>x.id===id); if(!b) throw Error('Booking not found'); b.status='completed'; b.outcome=outcome; b.notes=notes; const s=student(b.studentId); s.attempts++; if(outcome==='fail') s.eligible=false; if(outcome==='retake') s.eligible=true; return b; }
export function revoke(studentId:string) { const s=student(studentId); s.badgeActive=false; return s; }
