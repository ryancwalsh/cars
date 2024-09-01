# Dev

```
yarn dev
```

# TODO

- make an API route that scrapes CarGurus search results
  - https://www.cargurus.com/Cars/inventorylisting/viewDetailsFilterViewInventoryListing.action?sourceContext=untrackedWithinSite_false_0&distance=100&inventorySearchWidgetType=AUTO&zip=30009&sortDir=ASC&sortType=BEST_MATCH&isDeliveryEnabled=true
- make a cron job that finds ratings for models that haven't had ratings looked up yet
- make a cron job that calls the CarGurus scraper
- use Retool to create a UI that allows us to mark listings as inactive, priority, etc. Shows ratings, images, etc.

# Later

- make an API route that scrapes DuckDuckGo and Edmunds and inserts ratings for a model
- get it working on Vercel (lower priority since I could run this on my local laptop or Digital Ocean)
- use Retool to create a UI that allows blocking models
- Autotrader?

# Links

- https://supabase.com/dashboard/project/yzvxivcshrizfccwujzp/editor/29539?schema=public
- https://docs.google.com/spreadsheets/d/1zbVM49t9cVFi_YPUVExwWkUPISUiC1psUyI4EcHq2SU/edit?gid=2037153460#gid=2037153460
