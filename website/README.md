# CAREERLIFT 🎓

**Your Daily Dose of Job Opportunities.**

CAREERLIFT shares job opportunities, career updates, internships, free courses, skill resources and useful employment information.

**Founder / Manager:** SHAIK ALTHAF  
**Email:** careerliftupdates@gmail.com  
**Telegram:** https://t.me/CareerLift360  
**WhatsApp:** https://whatsapp.com/channel/0029VbDtgeEDJ6GripCIW82V

## Run locally

### Easiest method

You can use VS Code with the Live Server extension:

1. Extract the ZIP.
2. Open the folder in VS Code.
3. Install the **Live Server** extension.
4. Right-click `index.html`.
5. Choose **Open with Live Server**.
6. The website opens in your browser.

Do not open the HTML directly with `file://` if you want the Supabase admin/database features to work reliably.

### Alternative

If Python is installed:

```bash
cd job_updates_website
python -m http.server 5500
```

Then open:

`http://localhost:5500`

## Connect the admin system

The website includes an admin dashboard at:

`/admin.html`

The database/authentication is designed for Supabase.

1. Create a free Supabase project.
2. Open Supabase → SQL Editor.
3. Run all SQL from `supabase.sql`.
4. Go to Authentication → Users and create your admin email/password.
5. Copy the user's UUID.
6. Run the admin profile INSERT shown at the bottom of `supabase.sql`.
7. Open `supabase-config.js`.
8. Add your Supabase project URL and public anon/publishable key.
9. Start the website.
10. Open `/admin.html`.
11. Sign in.
12. Add a job and click **Publish Job**.
13. The public homepage reads the jobs from the database automatically.

### Security

Never put a Supabase `service_role`/secret key in browser code.

Only use the public client/publishable/anon key in `supabase-config.js`.

The SQL file enables Row Level Security so public visitors can read published jobs while only the admin account can insert/update/delete them.

## Free hosting — recommended: Cloudflare Pages

This is a static HTML/CSS/JavaScript website, so it can be hosted without paying for a traditional web server.

### Method A — GitHub + Cloudflare Pages

1. Create a GitHub account if you don't have one.
2. Create a new repository, for example:
   `careerlift-website`
3. Extract this ZIP.
4. Upload all website files to the repository.
5. Go to Cloudflare and create/login to your account.
6. Open **Workers & Pages**.
7. Create an application / Pages project.
8. Choose **Import an existing Git repository**.
9. Select your CAREERLIFT GitHub repository.
10. Production branch: `main`.
11. For this plain static site, use:
    - Build command: `exit 0`
    - Build output directory: `.`
12. Deploy.

Cloudflare Pages can deploy static HTML sites and can connect to GitHub/GitLab for automatic deployments when you push code changes.

Your site will receive a free `*.pages.dev` address.

## Free hosting — GitHub Pages alternative

For a completely static version, you can also publish the files with GitHub Pages.

However, because this project uses Supabase for the admin/database, make sure `supabase-config.js` contains only the public key and that your Supabase RLS policies are enabled.

## Custom domain

Later, you can connect a domain such as:

`careerlift.in`

or

`careerliftjobs.com`

The hosting can remain on a free tier where supported; the custom domain itself normally has a registration cost.

## Daily workflow

Once everything is configured:

1. Open `https://YOUR-SITE/admin.html`
2. Sign in.
3. Enter job title.
4. Enter company.
5. Select category.
6. Add qualification/location/experience.
7. Paste official application URL.
8. Add Telegram/WhatsApp post links if needed.
9. Click **Publish Job**.
10. The job appears on the public website.

You do NOT need to edit `index.html` for every new job.

## Copyright

© 2026 CAREERLIFT — Founded & managed by SHAIK ALTHAF. All rights reserved.

Job information should always be verified from the relevant official recruitment notification or employer website before applying.
