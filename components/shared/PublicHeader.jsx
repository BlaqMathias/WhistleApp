'use client';
import {useEffect, useId, useRef, useState} from 'react';
import Link from 'next/link';
import Logo from './Logo';
import Icon from './Icon';
import ThemeToggle from './ThemeToggle';
import {accountHome} from '@/lib/account';
import {HeaderSearchToggle,HeaderSearchPanel} from './HeaderSearch';

export default function PublicHeader({account}) {
 const dialog=useRef(null),[open,setOpen]=useState(false);
 const [searchOpen,setSearchOpen]=useState(false),searchId=useId();
 const close=()=>dialog.current?.close();
 useEffect(()=>{
  if(!open)return;
  const previous=document.body.style.overflow;
  document.body.style.overflow='hidden';
  const wide=window.matchMedia('(min-width: 720px)');
  const resize=()=>{if(wide.matches)close();};
  wide.addEventListener('change',resize);
  return()=>{document.body.style.overflow=previous;wide.removeEventListener('change',resize);};
 },[open]);
 const links=<><Link href={account?.is_admin?'/dashboard':'/student/live'} onClick={close}>Scores</Link><Link href={account?.is_admin?'/friendlies':'/student/fixtures'} onClick={close}>Fixtures</Link><Link href={account?.is_admin?'/leagues':'/student/standings'} onClick={close}>Standings</Link></>;
 const accountLinks=account?<Link href={accountHome(account)} className="button" onClick={close}>Open your overview</Link>:<><Link href="/login" className="quiet-link" onClick={close}>Log in</Link><Link href="/signup" className="button" onClick={close}>Join Whistle</Link></>;
 return <header className="public-header">
  <Link className="brand" href={account?accountHome(account):'/login'} aria-label="Whistle home"><Logo/><span className="public-campus">TU sports platform</span></Link>
  <nav className="public-nav" aria-label="Homepage navigation">{links}</nav>
  <div className="actions public-header-actions"><span className="actions public-desktop-actions"><ThemeToggle/></span>{account&&!account.is_admin&&<><HeaderSearchToggle open={searchOpen} onClick={()=>setSearchOpen(v=>!v)} id={searchId}/><Link className="icon-button" href="/student/notifications" aria-label="Notifications"><Icon name="bell"/></Link></>}<span className="actions public-desktop-actions">{accountLinks}</span>
  <button className="icon-button public-menu-button" type="button" aria-label="Open menu" aria-haspopup="dialog" aria-controls="mobile-menu" aria-expanded={open} onClick={()=>{dialog.current.showModal();setOpen(true);}}><Icon name="menu"/></button></div>
  {account&&!account.is_admin&&searchOpen&&<HeaderSearchPanel id={searchId} onNavigate={()=>setSearchOpen(false)}/>}
  <dialog id="mobile-menu" className="mobile-menu" ref={dialog} aria-labelledby="mobile-menu-title" onClose={()=>setOpen(false)} onClick={e=>{if(e.target===e.currentTarget)close();}}>
   <div className="mobile-menu-content"><div className="section-header"><h2 id="mobile-menu-title">Menu</h2><button className="icon-button" type="button" aria-label="Close menu" onClick={close}><Icon name="close"/></button></div>
    <nav aria-label="Mobile navigation">{links}</nav><section className="mobile-menu-theme"><h3>Theme</h3><ThemeToggle segmented/></section>
    <div className="mobile-menu-account">{accountLinks}{account&&<form action="/api/auth/logout" method="post"><button className="sign-out" type="submit">Sign out</button></form>}</div>
   </div>
  </dialog>
 </header>;
}
