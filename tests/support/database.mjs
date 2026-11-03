import {PGlite} from '@electric-sql/pglite';
import {readFile} from 'node:fs/promises';
export async function makeDatabase(){
 const db=new PGlite();
 await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;
  create schema auth;create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb default '{}',email_confirmed_at timestamptz);
  create function auth.uid() returns uuid language sql as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
  create schema storage;create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text,name text,unique(bucket_id,name));
  grant usage on schema auth,storage to service_role;grant select on storage.objects to service_role;`);
 await db.exec(await readFile(new URL('../../supabase/schema.sql',import.meta.url),'utf8'));
 return db;
}
export async function call(db,name,args={}){
 const keys=Object.keys(args);
 if(!/^[a-z_]+$/.test(name))throw new Error('Invalid RPC name.');
 const result=await db.query(`select public.${name}(${keys.map((k,i)=>`${k} => $${i+1}`).join(',')}) value`,Object.values(args));
 return result.rows[0].value;
}
