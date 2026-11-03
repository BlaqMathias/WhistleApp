// Explicit local demo: isolated in-memory SQL and fictional accounts. Never production.
import {spawn} from 'node:child_process';
if(process.env.NODE_ENV==='production')throw new Error('The local demo cannot run in production.');
const env={...process.env,WHISTLE_TEST_SERVICE:'1',NEXT_PUBLIC_WHISTLE_DEMO:'1',NEXT_PUBLIC_SUPABASE_URL:'http://127.0.0.1:4318',NEXT_PUBLIC_SUPABASE_ANON_KEY:'whistle-local-anon',SUPABASE_SERVICE_ROLE_KEY:'whistle-local-service',NEXT_TELEMETRY_DISABLED:'1'};
const child=spawn(process.execPath,['scripts/dev.mjs',...process.argv.slice(2)],{env,stdio:'inherit'});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));child.on('exit',code=>process.exit(code||0));
