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

# SQL

```sql
drop view queue;

create view
  queue as
select
  listings.body_type,
  listings.concerns,
  listings.created_at,
  listings.drivetrain,
  listings.engine,
  listings.exterior_color,
  listings.found_at_url,
  listings.fuel_type,
  listings.image_url,
  listings.interior_color,
  listings.is_active,
  listings.listing_url,
  listings.location,
  listings.mileage,
  listings.model_id,
  listings.note,
  listings.notes_from_test_drives,
  listings.number_of_owners,
  listings.price_approx,
  listings.priority,
  listings.safety_rating,
  listings.transmission,
  listings.vin,
  listings.vin_report_url,
  models.id as models__id,
  models.back_seat_folds_flat,
  models.concern,
  models.created_at as models__created_at,
  models.lowercase_hash,
  models.make,
  models.model,
  models.note as models__note,
  models.trim,
  models.year,
  ratings.id as ratings__id,
  ratings.cars_dot_com_rating,
  ratings.cars_dot_com_ratings_count,
  ratings.created_at as ratings__created_at,
  ratings.kbb_consumer_rating,
  ratings.kbb_consumer_ratings_count,
  ratings.kbb_expert_rating,
  ratings.model_id as ratings__model_id
from
  listings
  left join models on listings.model_id = models.id
  left join ratings on models.id = ratings.model_id
where
  listings.is_active = true
order by
  listings.created_at ASC;
```
