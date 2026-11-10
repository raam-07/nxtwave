import type { Metadata } from 'next'; import './globals.css';
export const metadata:Metadata={title:'GRIT | Interview Scheduler',description:'Fair, reliable interview scheduling'};
export default function Layout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html> }
