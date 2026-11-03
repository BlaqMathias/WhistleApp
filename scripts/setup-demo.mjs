// Creates five explicit DEMO Auth accounts using the supported Admin API.
// No confirmation email is sent. These fictional identities are test accounts,
// not a replacement for campus inbox verification for real student signups.
import {client, check} from './supabase-client.mjs';
try {
  const password = process.env.WHISTLE_DEMO_PASSWORD || '';
  if (password.length < 12 || /REPLACE_|YOUR_/i.test(password)) throw new Error('Choose a new demo-only password of at least 12 characters in .env.local.');
  const db = client();
  const accounts = [
    {email: process.env.WHISTLE_ADMIN_EMAIL || 'whistle.demo.admin@topfaith.edu.ng', name: process.env.WHISTLE_ADMIN_NAME || 'Whistle Demo Administrator', faculty: 'COMPASS', admin: true},
    {email: 'whistle.demo.student1@topfaith.edu.ng', name: 'Demo Student One', faculty: 'Engineering'},
    {email: 'whistle.demo.student2@topfaith.edu.ng', name: 'Demo Student Two', faculty: 'COMPASS'},
    {email: 'whistle.demo.student3@topfaith.edu.ng', name: 'Demo Student Three', faculty: 'MASS'},
    {email: 'whistle.demo.student4@topfaith.edu.ng', name: 'Demo Student Four', faculty: 'RAPHA'}
  ];
  for (const account of accounts) {
    if (!/^[^@\s]+@topfaith\.edu\.ng$/i.test(account.email)) throw new Error('Use a @topfaith.edu.ng administrator email.');
    const existing = check(await db.from('students').select('id,is_demo,auth_user_id').eq('email', account.email.toLowerCase()).maybeSingle());
    if (existing) {
      if (!existing.is_demo) throw new Error('An existing non-demo account uses ' + account.email + '; it was not modified.');
      if (account.admin) check(await db.rpc('admin_bootstrap', {p_auth_user_id: existing.auth_user_id}));
      console.log('Demo account already exists:', account.email); continue;
    }
    const {user} = check(await db.auth.admin.createUser({email: account.email, password, email_confirm: true, user_metadata: {name: account.name, faculty: account.faculty}}));
    check(await db.from('students').update({is_demo: true}).eq('auth_user_id', user.id));
    if (account.admin) check(await db.rpc('admin_bootstrap', {p_auth_user_id: user.id}));
    console.log('Created demo account:', account.email);
  }
  const bucket = await db.storage.getBucket('team-logos');
  const options = {public: true, fileSizeLimit: 2097152, allowedMimeTypes: ['image/png','image/jpeg','image/webp']};
  if (bucket.error) {
    if (!['404','400'].includes(String(bucket.error.status || bucket.error.statusCode)) || !/not found/i.test(bucket.error.message)) throw new Error(bucket.error.message);
    check(await db.storage.createBucket('team-logos', options));
  } else check(await db.storage.updateBucket('team-logos', options));
  console.log('Demo accounts and logo bucket are ready. Run supabase/seed.sql next. Passwords were not printed.');
} catch (error) {console.error('Demo setup stopped:', error.message); process.exitCode = 1;}
