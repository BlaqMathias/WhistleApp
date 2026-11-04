// Tabler Icons 3.50.0 (MIT), with the retained Whistle hoop/net symbols. See public/icons/UI_SOURCES.md.
const names=new Set(["search", "prediction", "arrow-up-right", "more", "menu", "close", "football", "assist", "basketball", "volleyball", "home", "calendar", "live", "trophy", "user", "bell", "sun", "moon", "chevron-left", "chevron-right", "filter", "download", "plus", "check", "users", "whistle", "empty", "help"]);
export default function Icon({name,className=''}){
 const symbol=names.has(name)?name:'help';
 return <svg className={`icon ${className}`} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><use href={`/icons/ui-icons.svg#${symbol}`}/></svg>;
}
