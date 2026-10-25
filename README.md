# TT Media

A lightweight news site powered by Eleventy and Decap CMS.

## Local development

```bash
npm install
npm start
```

Then open `http://localhost:8080`.

## Deployment

This project is built for Netlify:

1. Push this repository to GitHub.
2. In Netlify, choose Add new site > Import from GitHub.
3. Set build command to `npm run build`.
4. Set publish directory to `_site`.
5. Enable GitHub OAuth for the admin panel in Netlify.

## Admin panel

Open `/admin-panel` in your site. Sign in with the admin password:

```text
admin123
```

This dashboard saves posts in browser storage by default for local demo testing. It also supports a real Supabase database connection when configured.

## Database setup

For a live database-backed news admin, configure Supabase and use the anon/public key in the browser. Never use a service role key in frontend JavaScript or commit it to GitHub.

## Before launch

- Update the site details in `src/_data/site.json`
- Update the GitHub repo in `admin/config.yml`
- Replace all placeholders in `src/pages/*.md`
- Set your real domain in `src/robots.txt`
- Remove the sample posts and publish original content
- Add a real Google AdSense publisher ID only after approval

## AdSense and legal setup

- Add your publisher ID to `src/_data/site.json` under `adsenseClient`
- Add your ads.txt line to `src/ads.txt`
- Place ad unit slots in `src/_includes/post.njk`
- Ensure your privacy policy, terms, editorial policy, and contact page are published before launch
