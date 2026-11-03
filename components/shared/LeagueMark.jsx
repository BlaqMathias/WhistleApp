import TeamMark from './TeamMark';
export default function LeagueMark({league}){
 const initials=league.name.trim().split(/\s+/).slice(0,3).map(word=>word[0]).join('').toUpperCase();
 return <TeamMark name={league.name} initials={initials} path={league.logo_path} className="league-mark"/>;
}
