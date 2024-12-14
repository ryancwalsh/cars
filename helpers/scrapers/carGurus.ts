// `clear && yarn tsx helpers/cron_jobs/addNewListings.ts`
// `clear && CHROME_PATH=/opt/brave.com/brave/brave SCRAPE_LOGS_PATH=/home/rcwalsh/code/cars/logs BROWSER_USER_DATA_DIRECTORY=/home/rcwalsh/.config/BraveSoftware/Brave-Browser/Default npx tsx helpers/scrapers/carGurus.ts`

/* eslint-disable canonical/id-match */

import { environment } from '../config';
import { getChromium } from '../generic/chromium';
import { getNumberWithinString } from '../generic/numbers';
import { type ScrapedListing } from '../types';
import { saveHtml } from './logging';
import { getElementFromHtml, getPriceFromText, removeSubstringAtEnd } from './scraping';

const url = `https://www.cargurus.com/Cars/inventorylisting/viewDetailsFilterViewInventoryListing.action?
sourceContext=untrackedWithinSite_false_0
&distance=25
&zip=30009
&isDeliveryEnabled=false
&maxAccidents=0
&hideSalvage=true
&hideFrameDamaged=true
&transmissionTypes=AUTOMATIC
&hideFleet=true
&inventorySearchWidgetType=AUTO
&hideMultipleOwners=true
&hideLemon=true
&hideTheft=true
&startYear=2018
&minPrice=11000
&maxPrice=15000
&sortDir=ASC&sortType=BEST_MATCH`;

// const url = `https://www.example.com`;

const listingTileClass = '.pazLTN'; // must match listingTileClassInner

function cleanListing(listingElement: Element, listing: ScrapedListing): void {
  const title = listingElement.querySelector('h4')?.textContent?.trim() ?? '';
  const titleBeforeTrim = `${listing.year} ${listing.make} ${listing.model}`;
  listing.trim = title.replace(titleBeforeTrim, '').trim();

  listing.price_approx = getPriceFromText(listingElement.querySelector('[data-testid="srp-tile-price"]')?.textContent);

  listing.location = listingElement.querySelector('[data-testid="srp-tile-bucket-text"]')?.textContent?.trim() ?? null;

  const imgElement = listingElement.querySelector('img');
  listing.image_url = imgElement ? imgElement.src : null;

  const listingLink = listingElement.querySelector('a[data-testid="car-blade-link"]');
  listing.found_at_url = listingLink ? `https://www.cargurus.com/Cars/link/${getNumberWithinString(listingLink.getAttribute('href'))}` : 'error';
}

// eslint-disable-next-line max-lines-per-function
function parseListing(listingElement: Element): ScrapedListing | null {
  const listing = {} as ScrapedListing;
  const dtElements = listingElement.querySelectorAll('dt');

  const ddElements = listingElement.querySelectorAll('dd');

  for (const [index, dt] of dtElements.entries()) {
    const key = dt.textContent ? removeSubstringAtEnd(dt.textContent.trim(), ':') : '';
    const value = ddElements[index] && ddElements[index].textContent ? ddElements[index].textContent.trim() : '';

    switch (key) {
      case 'Make':
        listing.make = value;
        break;
      case 'Model':
        listing.model = value;
        break;
      case 'Year':
        listing.year = Number(value);
        break;
      case 'Mileage':
        listing.mileage = Number(value.replaceAll(',', ''));
        break;
      case 'Exterior color':
        listing.exterior_color = value;
        break;
      case 'Interior color':
        listing.interior_color = value;
        break;
      case 'Drivetrain':
        listing.drivetrain = value;
        break;
      case 'Engine':
        listing.engine = value;
        break;
      case 'Transmission':
        listing.transmission = value;
        break;
      case 'Body type':
        listing.body_type = value;
        break;
      case 'Fuel type':
        listing.fuel_type = value;
        break;
      case 'NHTSA overall safety rating':
        listing.safety_rating = Number(value);
        break;
      case 'VIN':
        listing.vin = value;
        break;
    }
  }

  if (!listing.year) {
    return null;
  }

  cleanListing(listingElement, listing);
  // console.log('after cleaning', { listing });

  return listing;
}

function isValidListing(element: Element): boolean {
  const keywordsToAvoid = ['Sponsored'];
  for (const keyword of keywordsToAvoid) {
    if (element.textContent?.includes(keyword)) {
      return false;
    }
  }

  return true;
}

function extractCarListings(nodeListOfListingElements: Element[] | undefined): ScrapedListing[] {
  const cars: ScrapedListing[] = [];

  for (const listingElement of nodeListOfListingElements ?? []) {
    if (isValidListing(listingElement)) {
      const car = parseListing(listingElement);
      if (car) {
        cars.push(car);
      }
    } else {
      console.warn('skipping invalid listing', listingElement);
    }
  }

  return cars;
}

// eslint-disable-next-line max-lines-per-function
export async function getLatestCarGurusListings(pageNumber = 1): Promise<ScrapedListing[]> {
  const { browser, page } = await getChromium();
  const paginatedUrl = `${url}&daysOnMarketMax=900${pageNumber === 1 ? '' : `#resultsPage=${pageNumber}`}`;
  console.log({ paginatedUrl });

  try {
    await page.goto(paginatedUrl, {
      waitUntil: 'networkidle0',
    });
    console.log(`visited ${paginatedUrl}`);

    const now = new Date().toISOString();

    await saveHtml(page, paginatedUrl, `carGurus_${now}`);

    await page.screenshot({
      path: `${environment.SCRAPE_LOGS_PATH}/carGurus_${now}.png`,
    });

    // const localTestFile =''
    // await page.goto(`file://${localTestFile}`);

    // wait for all redirects https://stackoverflow.com/a/57007420/470749
    await page.waitForSelector('#cargurus-listing-search', {
      timeout: 3_000, // max milliseconds to wait
    });

    const carGurusListings = await page.evaluate(() => {
      // Any console logs here will be visible in the browser rather than the terminal.

      const listingTileClassInner = '[data-testid="srp-tile-list"] .pazLTN'; // Must match listingTileClass
      const listingSearchElement = document.querySelectorAll('#cargurus-listing-search');
      console.log({ listingSearchElement });
      const listingElements = document.querySelectorAll(listingTileClassInner); // #cargurus-listing-search [data-testid="srp-tile-list"] div.pazLTN
      console.log('Found listing elements:', listingElements);
      return Array.from(listingElements).map((listingElement) => listingElement.outerHTML);
    });
    // console.log({ carGurusListings });
    const elements = carGurusListings.map((carGurusListing) => getElementFromHtml(carGurusListing, listingTileClass)).filter((item) => item !== null);
    // console.log({ elements });
    const listings = extractCarListings(elements);
    // console.log('Extracted listings:', listings);
    console.log('helpers/scrapers/carGurus.ts finished.', listings.length);
    return listings;
  } catch (error) {
    console.error('Error finding the listings:', error);
    return [];
  } finally {
    await page.close();
    await browser.close();
  }
}
