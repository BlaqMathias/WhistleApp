import {api} from '@/lib/api';
import {logoTarget,validateLogo,saveLogo} from '@/lib/logoServer';
export const POST=api(async(request,{db})=>{
 const b=await request.json(),target=await logoTarget(db,b);
 await validateLogo(db,b.path,target);return saveLogo(db,target,b.path);
});
export const DELETE=api(async(request,{db})=>saveLogo(db,await logoTarget(db,await request.json()),null));
