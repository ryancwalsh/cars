# Dev

```
yarn dev
```

# TODO

- since carGurus is so good at blocking bots [and by the way is now blocking even my real human-controlled Brave browser (logged in or out) but not Firefox], get Chrome extension to upsert listings. Or figure out how to make Puppeteer using the cookies/localStorage/sessions of my real browser.
- add weighted score to Retool webapp

# Later

- make an API route that scrapes CarGurus search results and doesn't get blocked by their bot detector
- make a cron job that calls the CarGurus scraper
- get it working on Vercel (lower priority since I could run this on my local laptop or Digital Ocean)
- use Retool to create a UI that allows blocking models
- Autotrader?
- make Retool mobile app

# Links

- https://supabase.com/dashboard/project/yzvxivcshrizfccwujzp/editor/29539?schema=public
- https://docs.google.com/spreadsheets/d/1zbVM49t9cVFi_YPUVExwWkUPISUiC1psUyI4EcHq2SU/edit?gid=2037153460#gid=2037153460

# Direct connection to Supabase Postgresql DB (such as via DBeaver)

URL:

jdbc:postgresql://aws-0-us-east-1.pooler.supabase.com:6543/postgres

username: postgres.yzvxivcshrizfccwujzp

(The second part comes from the subdomain of SUPABASE_URL environment variable.)

password: {in Bitwarden}

https://supabase.com/dashboard/project/yzvxivcshrizfccwujzp/settings/database
