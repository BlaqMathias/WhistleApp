const paths = {
  more: "M6 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z",
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "m6 6 12 12M18 6 6 18",
  football: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 8l4 3-1.5 4h-5L8 11Zm0-5v5m9 4-5-1m2.5 4 3 4m-8-4-3 4M3 12l5-1",
  basketball: "M4 3h16v7H4Zm5 3h6v4M6 11h12l-2 9H8Zm0 0 10 9m2-9L8 20m0-5h8m-9 2h10",
  volleyball: "M3 4v17M21 4v17M3 7h18M3 16h18M7 7v9m5-9v9m5-9v9M3 11h18",
  home: "m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z",
  calendar: "M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM7 3v4m10-4v4M3 11h18m-14 4h2m6 0h2m-10 3h2",
  live: "M4 10v4m4-7v10m4-13v16m4-13v10m4-7v4",
  trophy: "M8 3h8v7a4 4 0 0 1-8 0ZM8 5H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4m-4 2v6m-4 1h8",
  user: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2",
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Zm-8 12a2 2 0 0 0 4 0",
  sun: "M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1",
  moon: "M21 13A9 9 0 0 1 11 3a9 9 0 1 0 10 10Z",
  'chevron-left': "m15 5-7 7 7 7",
  'chevron-right': "m9 5 7 7-7 7",
  filter: "M4 7h16M7 12h10m-7 5h4",
  plus: "M12 4v16M4 12h16",
  check: "m5 12 4 4L19 6",
  users: "M14 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM2 21v-2a7 7 0 0 1 14 0v2m1-17a4 4 0 0 1 0 8m2 4a6 6 0 0 1 3 5",
  whistle: "M4 9h10l3-5h4l-3 8h-4a6 6 0 1 1-10-3Zm5 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z",
};
export default function Icon({name, className = ""}) {
  return <svg className={`icon ${className}`} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.whistle}/></svg>;
}
