import 'server-only';
import {rpc,uuid,HttpError} from './api';
import {LOGO_MAX_BYTES} from './constants';
export async function logoTarget(db,body) {
 const id=uuid(body.id), entity=body.entity, side=body.side;
 if(!['teams','leagues','fixtures'].includes(entity) || (entity==='fixtures'&&!['home','away'].includes(side))) throw new HttpError('Choose a team, league or match side.');
 const data=await rpc(db,'admin_snapshot');
 const record=data[entity].find(r=>r.id===id);
 if(!record) throw new HttpError('Team, league or match not found.',404);
 if(entity!=='fixtures'&&record.status!=='active') throw new HttpError('Archived records cannot be edited.',409);
 return {id,entity,side:entity==='fixtures'?side:null,prefix:entity==='fixtures'?`fixtures/${id}/${side}/`:`${entity}/${id}/`,oldPath:entity==='fixtures'?record[`${side}_logo_path`]:record.logo_path};
}
export async function validateLogo(db,path,target) {
 if(typeof path!=='string'||!new RegExp(`^${target.prefix}[0-9a-f-]{36}\\.(png|jpg|webp)$`).test(path)) throw new HttpError('Invalid logo path.');
 const {data:file,error}=await db.storage.from('team-logos').download(path);
 if(error||!file) throw new HttpError('The logo did not finish uploading. Please try again.');
 if(file.size<1||file.size>LOGO_MAX_BYTES) throw new HttpError('Choose a logo up to 2 MB.');
 const b=new Uint8Array(await file.arrayBuffer());
 const text=(start,end)=>String.fromCharCode(...b.slice(start,end));
 const valid=path.endsWith('.png')?[137,80,78,71,13,10,26,10].every((n,i)=>b[i]===n):path.endsWith('.jpg')?b[0]===255&&b[1]===216&&b[2]===255:text(0,4)==='RIFF'&&text(8,12)==='WEBP';
 if(!valid) throw new HttpError('The file contents do not match a PNG, JPG or WebP image.');
}
export async function saveLogo(db,target,path) {
 await rpc(db,'admin_set_logo',{p_entity:target.entity,p_id:target.id,p_path:path,p_side:target.side});
 if(target.oldPath&&target.oldPath!==path&&target.oldPath.startsWith(target.prefix)) {
  const {error}=await db.storage.from('team-logos').remove([target.oldPath]);
  if(error) console.warn('Superseded logo cleanup failed.');
 }
 return {ok:true};
}
