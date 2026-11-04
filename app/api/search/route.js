import {api,rpc} from '@/lib/api';
import {sportsSearchOptions} from '@/lib/fixtures';
export const GET=api(async(request,{db})=>{
 const data=await rpc(db,'public_home'),tables=new URL(request.url).searchParams.get('scope')==='tables';
 return {options:sportsSearchOptions(data,{tables}),leagues:data.leagues.map(l=>({id:l.id,name:l.name,sport:l.sport}))};
},{access:'student'});
