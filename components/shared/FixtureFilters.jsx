"use client";
import {useState} from "react";
import Link from "next/link";
import {SPORTS, SPORT_NAMES} from "@/lib/constants";
import Button from "./Button";
import Icon from "./Icon";
export default function FixtureFilters({selection, action = '/student/fixtures', friendlyOnly = false, tableOnly = false, statuses = ['', 'scheduled', 'unscheduled', 'live', 'completed', 'walkover', 'cancelled'], searchContext = {}}) {
  const [sport, setSport] = useState(selection.sport||''), [league, setLeague] = useState(selection.league||''), [type, setType] = useState(selection.type||'');
  return <form action={action} className="fixture-filters" method="get">
    {['q','team','team_name'].map(key=>searchContext[key]?<input key={key} type="hidden" name={key} value={searchContext[key]}/>:null)}
    <fieldset className="filter-chips"><legend>Sport</legend><div className="chip-row">{[['', 'All sports'], ...SPORTS.map(s => [s, SPORT_NAMES[s]])].map(([value, label]) => <label className="chip" key={value}><input className="sr-only" type="radio" name="sport" value={value} checked={sport === value} onChange={() => {setSport(value); setLeague('');}}/><span>{label}</span></label>)}</div></fieldset>
    {!friendlyOnly && <>{!tableOnly&&<label>Competition type<select name="type" value={type} onChange={e => {setType(e.target.value); setLeague('');}}><option value="">All competitions</option><option value="league">Leagues</option><option value="friendly">Friendlies</option></select></label>}<label>League<select name="league" value={league} disabled={!tableOnly&&type === 'friendly'} onChange={e => setLeague(e.target.value)}><option value="">All leagues</option>{selection.leagues.filter(l => !sport || l.sport === sport).map(l => <option value={l.id} key={l.id}>{l.name}</option>)}</select></label></>}
    {!tableOnly&&<fieldset className="filter-chips"><legend>Status</legend><div className="chip-row">{statuses.map(s => <label className="chip" key={s}><input className="sr-only" type="radio" name="status" value={s} defaultChecked={(selection.status||'') === s}/><span>{!s ? 'All statuses' : s === 'unscheduled' ? 'Without a date' : s[0].toUpperCase() + s.slice(1)}</span></label>)}</div></fieldset>}
    <div className="actions"><Button><Icon name="search"/>Search</Button><Link className="quiet-link" href={action}>Clear filters</Link></div>
  </form>;
}
