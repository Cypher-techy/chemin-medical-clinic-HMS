import './globals.css';
export const metadata={title:'Chemin Medical Clinic HMS',description:'Hospital Management System — Nyamasibi, Kisii',manifest:'/manifest.webmanifest'};
export default function R({children}:{children:React.ReactNode}){ return <html lang="en"><body>{children}<script dangerouslySetInnerHTML={{__html:"if('serviceWorker' in navigator)navigator.serviceWorker.register('/sw.js').catch(()=>{})"}}/></body></html>; }
