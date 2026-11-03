import Link from 'next/link';
import {getData} from '@/lib/data';
import {selectFixtures} from '@/lib/fixtures';
import FixtureList from '@/components/shared/FixtureList';
import FixtureFilters from '@/components/shared/FixtureFilters';
import Refresh from '@/components/shared/Refresh';
export default async function Friendlies({searchParams}){const d=await getData(),selection=selectFixtures({...d,fixtures:d.fixtures.filter(f=>!f.league_id)},await searchParams);return <><Refresh/><div className="page-heading"><div><h1>Friendlies</h1><p>One-off matchups, with existing teams or typed club names.</p></div><Link className="button" href="/friendlies/new">Create Friendly</Link></div><FixtureFilters selection={selection} action="/friendlies" friendlyOnly/><section className="section"><FixtureList fixtures={selection.fixtures} teams={d.teams} admin/></section></>;}
