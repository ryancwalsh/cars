# Goal

To buy a car that fits my needs.

## App goal

To show an updated list of nearby used car listings filtered by my requirements and sorted descending by a weighted score (determined by various factors such as 3rd party ratings).

# Architecture / Design

TODO

# Linting

TODO

# Running the local dev server

```
yarn install
yarn dev
```

# TODO

1. make a mobile-responsive Next.js page that allows viewing and editing the queue
1. handle CarGurus pagination to allow getting listings older than 7 days
1. edit Retool mobile app at https://rcwalsh.retool.com/mobile/editor/Cars%20mobile to
   1. have better weighted score
   1. show all scores
   1. allow toggling is_active
   1. add notes
   1. change weights
1. make cron job that runs `yarn tsx helpers/cron_jobs/addNewListings.ts` daily
1. add screeshots of Supabase, Retool, etc to this readme
1. use Retool to create a UI that allows blocking models (as a replacement for manual `allowed_models` view)

## Later

- Autotrader?
- get it working on Vercel (lower priority since I could run this on my local laptop or Digital Ocean)

# Notes

I think as long as I:

- run it on my local computer (on a residential IP instead of in a cloud like AWS)
- don't use "headless" mode but instead have it open an actual browser window
- tell it to rely on the "userDataDir" of my real browser where I've already passed the captcha
- use https://www.npmjs.com/package/puppeteer-extra-plugin-stealth
- run the browser via a TypeScript script directly instead of within a Next.js API endpoint

it seems to work. 🤞

It linked to https://bot.sannysoft.com/ which is a cool page.

P.S. Free up to 1k URLs: https://www.zenrows.com/?fpr=signup

# Links (protected)

- https://supabase.com/dashboard/project/yzvxivcshrizfccwujzp/editor/29539?schema=public
- https://docs.google.com/spreadsheets/d/1zbVM49t9cVFi_YPUVExwWkUPISUiC1psUyI4EcHq2SU/edit?gid=2037153460#gid=2037153460

# Direct connection to Supabase Postgresql DB (such as via DBeaver)

URL:

jdbc:postgresql://aws-0-us-east-1.pooler.supabase.com:6543/postgres

username: postgres.yzvxivcshrizfccwujzp

(The second part comes from the subdomain of SUPABASE_URL environment variable.)

password: {in Bitwarden}

https://supabase.com/dashboard/project/yzvxivcshrizfccwujzp/settings/database
