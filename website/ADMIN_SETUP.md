# CAREERLIFT Admin + Automatic Job Updates

This version uses **Supabase** for authentication and the job database.

## How it works

Admin signs in at:

`/admin.html`

Admin fills in the job details and clicks **Publish Job**.

The job is stored in Supabase and the public `index.html` automatically loads the latest jobs.

No manual editing of `script.js` is required after setup.

## 1. Create a free Supabase project

Go to https://supabase.com and create a project.

## 2. Create the database

Open Supabase → SQL Editor and run everything in:

`supabase.sql`

## 3. Create your admin account

In Supabase:

Authentication → Users → Add user

Create your admin email and password.

Copy the user's UUID.

Then run:

```sql
insert into public.profiles (id, is_admin)
values ('PASTE-USER-UUID-HERE', true)
on conflict (id) do update set is_admin = true;
```

Do not put the password anywhere in the website source code.

## 4. Add Supabase keys

Open:

`supabase-config.js`

Replace:

```js
window.SUPABASE_URL = "https://YOUR-PROJECT.supabase.co";
window.SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
```

with your project's URL and public anon key.

You can find these under:

Supabase → Project Settings → API.

Only use the `anon` / publishable key in browser code.

NEVER use the `service_role` key in this project.

## 5. Test

Open the site and visit:

`/admin.html`

Sign in with the admin account.

Publish a job.

Go back to the homepage. The job will appear there automatically.

## Free hosting

This project can be deployed on GitHub Pages, Cloudflare Pages, or Vercel.

Supabase supplies the backend/database/authentication.

## Recommended next features

- Edit existing jobs
- Job detail pages
- Image/thumbnail upload
- Expired-job automatic hiding
- Admin categories
- Multiple admin users
- Telegram bot automation
- WhatsApp workflow automation
- Analytics
