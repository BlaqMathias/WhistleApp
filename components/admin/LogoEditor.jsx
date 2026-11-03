'use client';
import Button from '@/components/shared/Button';
import {useMutation,send,FormStatus} from '@/components/shared/FormState';
import {uploadLogo} from '@/lib/logoUpload';
export default function LogoEditor({entity,id,side,path,label='Team logo'}){
 const m=useMutation();
 async function submit(e){e.preventDefault();const form=e.currentTarget,file=new FormData(form).get('logo');await m.run(async()=>{await uploadLogo(file,entity,id,side);form.reset();},'Logo updated.');}
 return <form className="form-panel form-stack" onSubmit={submit}><h3>{label}</h3><label>Logo image<input type="file" name="logo" accept="image/png,image/jpeg,image/webp" required/></label><p className="help">PNG, JPG or WebP up to 2 MB. Initials appear when no logo is set.</p><div className="actions"><Button disabled={m.pending}>Upload logo</Button>{path&&<Button type="button" variant="secondary" disabled={m.pending} onClick={()=>m.run(()=>send('/api/logos',{entity,id,side},'DELETE'),'Logo removed. Initials restored.')}>Use initials</Button>}</div><FormStatus {...m}/></form>;
}
