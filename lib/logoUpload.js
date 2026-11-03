'use client';
import {send} from '@/components/shared/FormState';
import {uploadClient} from './supabase/client';
import {LOGO_TYPES,LOGO_MAX_BYTES} from './constants';
export async function uploadLogo(file,entity,id,side) {
  if(!file?.size || file.size>LOGO_MAX_BYTES || !Object.hasOwn(LOGO_TYPES,file.type)) throw new Error('Choose a PNG, JPG or WebP image up to 2 MB.');
  const target={entity,id,...(side?{side}:{})};
  const prep=await send('/api/logos/upload',{...target,type:file.type,size:file.size});
  const {error}=await uploadClient().storage.from('team-logos').uploadToSignedUrl(prep.path,prep.token,file,{contentType:file.type});
  if(error) throw new Error('The logo upload failed. Please try again.');
  return send('/api/logos',{...target,path:prep.path});
}
