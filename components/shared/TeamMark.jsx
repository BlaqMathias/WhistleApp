'use client';
import {useState,useEffect} from 'react';
import {logoUrl} from '@/lib/sports';
export default function TeamMark({name,initials,path,className=''}) {
 const [failed,setFailed]=useState(false);
 useEffect(()=>setFailed(false),[path]);
 return <span className={`team-mark${className?' '+className:''}`} aria-label={`${name} logo`}>{path&&!failed?<img src={logoUrl(path)} alt="" onError={()=>setFailed(true)} width="48" height="48"/>:initials}</span>;
}
