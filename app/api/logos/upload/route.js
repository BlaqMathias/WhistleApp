import {api,HttpError} from '@/lib/api';
import {LOGO_TYPES,LOGO_MAX_BYTES} from '@/lib/constants';
import {logoTarget} from '@/lib/logoServer';
export const POST=api(async(request,{db})=>{
 const b=await request.json(),target=await logoTarget(db,b);
 if(!Object.hasOwn(LOGO_TYPES,b.type)||!Number.isInteger(b.size)||b.size<1||b.size>LOGO_MAX_BYTES) throw new HttpError('Choose a PNG, JPG or WebP logo up to 2 MB.');
 const path=`${target.prefix}${crypto.randomUUID()}.${LOGO_TYPES[b.type]}`;
 const {data,error}=await db.storage.from('team-logos').createSignedUploadUrl(path);
 if(error) throw new HttpError('The logo upload could not be prepared. Check the team-logos bucket.',503);
 return {path,token:data.token};
});
