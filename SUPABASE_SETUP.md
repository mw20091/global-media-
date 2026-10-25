# TT Media Database Setup

This project supports a live Supabase-backed admin workflow for news posts.

## 1) Create a Supabase project

- Go to https://supabase.com
- Create a new project
- Copy your project URL and anon key from Project Settings > API

## 2) Add project credentials

Open `src/assets/js/admin-panel.js` and replace the placeholders:

```js
const SUPABASE_URL = 'https://klixbfwfxfcojiwuvhlw.supabase.co';
const SUPABASE_ANON_KEY = 'PASTE_YOUR_ANON_PUBLIC_KEY_HERE';
```

## 3) Create the database table

Run this in the Supabase SQL editor:

```sql
create table if not exists posts (
  id text primary key,
  title text not null,
  author text,
  category text,
  description text,
  body text not null,
  date text,
  image text,
  created_at timestamptz default now()
);

alter table posts enable row level security;

create policy "Allow public read access"
on posts for select
using (true);

create policy "Allow public insert access"
on posts for insert
with check (true);

create policy "Allow public update access"
on posts for update
using (true)
with check (true);

create policy "Allow public delete access"
on posts for delete
using (true);
```

## 4) Create the storage bucket for images

In Supabase Dashboard:

- Storage > New bucket
- Name: `news-images`
- Enable public access

## 5) Security warning

Never use a Supabase service_role key in browser JavaScript.
This key is for server-side use only and must not be committed to GitHub or exposed in a public frontend.

## 6) Use the admin dashboard

Open `/admin-panel`, log in with:

```text
admin123
```

The dashboard saves to Supabase if the project is configured. If not, it falls back to browser local storage for local development.
