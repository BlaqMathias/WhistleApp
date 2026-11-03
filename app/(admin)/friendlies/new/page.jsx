import Link from 'next/link';
import {getData} from '@/lib/data';
import FriendlyForm from '@/components/admin/FriendlyForm';
export default async function NewFriendly(){const d=await getData();return <><Link href="/friendlies" className="back-link">Back to Friendlies</Link><div className="page-heading"><div><h1>Create Friendly</h1><p>Choose teams or type the club names. Save a typed team when you want to reuse it.</p></div></div><FriendlyForm teams={d.teams} students={d.students}/></>;}
