/** Development/acceptance transport only. SQL is real; Auth/Storage HTTP is fictional. */
import http from 'node:http';
import {randomUUID} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {makeDatabase,call} from './database.mjs';
const db=await makeDatabase(),accounts=new Map(),sessions=new Map(),tokens=new Map(),files=new Map();
const anonKey='whistle-local-anon',serviceKey='whistle-local-service',password='demo-whistle-2026';
function sessionFor(user){
 const token=[Buffer.from(JSON.stringify({alg:'HS256',typ:'JWT'})).toString('base64url'),Buffer.from(JSON.stringify({sub:user.id,email:user.email,role:'authenticated',exp:Math.floor(Date.now()/1000)+86400})).toString('base64url'),Buffer.from(randomUUID()).toString('base64url')].join('.');
 sessions.set(token,user);return {access_token:token,refresh_token:randomUUID(),token_type:'bearer',expires_in:86400,expires_at:Math.floor(Date.now()/1000)+86400,user};
}
async function createAccount(email,name,faculty,admin=false){
 const user={id:randomUUID(),email,aud:'authenticated',role:'authenticated',app_metadata:{provider:'email'},user_metadata:{name,faculty},created_at:new Date().toISOString()};
 await db.query('insert into auth.users(id,email,raw_user_meta_data,email_confirmed_at) values($1,$2,$3,now())',[user.id,email,JSON.stringify(user.user_metadata)]);
 await db.query('update students set is_demo=true where auth_user_id=$1',[user.id]);
 if(admin)await call(db,'admin_bootstrap',{p_auth_user_id:user.id});
 const account={user,session:sessionFor(user),password};accounts.set(email,account);return account;
}
const admin=await createAccount('admin-test@topfaith.edu.ng','Test Administrator','COMPASS',true);
for(let i=1;i<=4;i++)await createAccount(`student${i}@topfaith.edu.ng`,`Demo Student ${i}`,['Engineering','COMPASS','MASS','RAPHA'][i-1]);
await db.exec(await readFile(new URL('../../supabase/seed.sql',import.meta.url),'utf8'));
function json(res,value,status=200){res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(value??null));}
async function bytes(req){const parts=[];for await(const p of req)parts.push(p);return Buffer.concat(parts);}
const bearer=req=>req.headers.authorization?.replace('Bearer ','');
const isService=req=>bearer(req)===serviceKey;
const who=req=>sessions.get(bearer(req));
const server=http.createServer(async(req,res)=>{
 const url=new URL(req.url,'http://localhost'),path=url.pathname;
 try{
  if(path==='/health')return json(res,{ok:true});
  if(path==='/session'&&req.method==='GET'){
   const account=url.searchParams.get('as')==='student'?accounts.get('student1@topfaith.edu.ng'):admin;
   const cookie='base64-'+Buffer.from(JSON.stringify(account.session)).toString('base64url');
   const host=new URL(process.env.NEXT_PUBLIC_SUPABASE_URL||'http://127.0.0.1:4318').hostname.split('.')[0];
   res.writeHead(302,{'Set-Cookie':`sb-${host}-auth-token=${cookie}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`,Location:account===admin?'/dashboard':'/student'});res.end();return;
  }
  if(path==='/auth/v1/token'&&req.method==='POST'){
   const b=JSON.parse(await bytes(req)),a=accounts.get(b.email);
   if(!a||a.password!==b.password||!a.session)return json(res,{error:'invalid_grant',error_description:'Invalid or unconfirmed login'},400);
   sessions.set(a.session.access_token,a.user);return json(res,a.session);
  }
  if(path==='/auth/v1/signup'&&req.method==='POST'){
   const b=JSON.parse(await bytes(req));if(accounts.has(b.email))return json(res,accounts.get(b.email).user);
   const user={...admin.user,id:randomUUID(),email:b.email,user_metadata:b.data};
   await db.query('insert into auth.users(id,email,raw_user_meta_data) values($1,$2,$3)',[user.id,b.email,JSON.stringify(b.data)]);
   accounts.set(b.email,{user,password:b.password});return json(res,user);
  }
  if(path==='/auth/v1/verify'&&req.method==='POST'){
   const b=JSON.parse(await bytes(req)),a=accounts.get(b.token_hash);if(!a)return json(res,{message:'Invalid confirmation'},400);
   await db.query('update auth.users set email_confirmed_at=now() where id=$1',[a.user.id]);a.session=sessionFor(a.user);return json(res,a.session);
  }
  if(path==='/auth/v1/user'){if(!who(req))return json(res,{message:'Invalid session'},401);return json(res,who(req));}
  if(path==='/auth/v1/logout'){sessions.delete(bearer(req));return json(res,{});}
  if(path==='/auth/v1/settings')return json(res,{external:{email:true},disable_signup:false,mailer_autoconfirm:false});
  if(path==='/rest/v1/students'&&req.method==='GET'){
   const account=who(req),id=url.searchParams.get('auth_user_id')?.replace('eq.','');
   const rows=isService(req)||account?.id===id?(await db.query('select * from students where auth_user_id=$1',[id])).rows:[];
   return json(res,req.headers.accept?.includes('vnd.pgrst.object')?rows[0]||null:rows);
  }
  if(path.startsWith('/rest/v1/rpc/')&&req.method==='POST'){
   if(!isService(req))return json(res,{code:'42501',message:'Permission denied'},403);
   const name=path.split('/').pop();if(!/^(admin_[a-z_]+|student_[a-z_]+|public_home|public_fixture|whistle_poll_snapshot)$/.test(name))throw new Error('Unknown RPC');
   return json(res,await call(db,name,JSON.parse(await bytes(req))));
  }
  const sign='/storage/v1/object/upload/sign/team-logos/';
  if(path.startsWith(sign)&&req.method==='POST'){
   if(!isService(req))return json(res,{message:'Denied'},403);const object=decodeURIComponent(path.slice(sign.length)),token=randomUUID();tokens.set(token,object);
   return json(res,{url:`/object/upload/sign/team-logos/${object}?token=${token}`});
  }
  if(path.startsWith(sign)&&req.method==='PUT'){
   const object=decodeURIComponent(path.slice(sign.length));if(tokens.get(url.searchParams.get('token'))!==object)return json(res,{message:'Invalid upload token'},403);
   const body=await bytes(req),request=new Request('http://localhost/upload',{method:'POST',headers:req.headers,body});
   const form=await request.formData(),file=[...form.values()].find(v=>typeof v!=='string');
   if(!file||file.size>2097152||!['image/png','image/jpeg','image/webp'].includes(file.type))return json(res,{message:'Invalid logo'},400);
   files.set(object,{bytes:Buffer.from(await file.arrayBuffer()),type:file.type});await db.query("insert into storage.objects(bucket_id,name) values('team-logos',$1) on conflict do nothing",[object]);
   return json(res,{Key:`team-logos/${object}`,Id:randomUUID()});
  }
  for(const prefix of ['/storage/v1/object/team-logos/','/storage/v1/object/public/team-logos/']){
   if(path.startsWith(prefix)&&req.method==='GET'){
    if(!prefix.includes('/public/')&&!isService(req))return json(res,{message:'Denied'},403);
    const f=files.get(decodeURIComponent(path.slice(prefix.length)));if(!f)return json(res,{message:'Not found'},404);
    res.writeHead(200,{'Content-Type':f.type});res.end(f.bytes);return;
   }
  }
  if(path==='/storage/v1/object/team-logos'&&req.method==='DELETE'){
   if(!isService(req))return json(res,{message:'Denied'},403);const b=JSON.parse(await bytes(req));for(const object of b.prefixes){files.delete(object);await db.query("delete from storage.objects where bucket_id='team-logos' and name=$1",[object]);}return json(res,b.prefixes.map(name=>({name})));
  }
  return json(res,{message:'Unknown local transport route',path},404);
 }catch(e){json(res,{code:e.code||'P0001',message:e.message},400);}
});
server.on('error',async error=>{if(error.code==='EADDRINUSE'){await db.close();process.exit(0);}throw error;});
server.listen(4318,'0.0.0.0',()=>console.log('Whistle fictional local transport ready on 4318.'));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{server.close();db.close().then(()=>process.exit(0));});
