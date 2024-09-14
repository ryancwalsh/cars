// `clear && CHROME_PATH=/opt/brave.com/brave/brave SCRAPE_LOGS_PATH=/home/rcwalsh/code/cars/logs BROWSER_USER_DATA_DIRECTORY=/home/rcwalsh/.config/BraveSoftware/Brave-Browser/Default npx tsx helpers/scrapers/carGurus.ts`

/* eslint-disable canonical/id-match */
import { SCRAPE_LOGS_PATH } from '../config';
import { getChromium } from '../generic/chromium';
import { type ScrapedListing } from '../types';
import { saveHtml } from './logging';

const url = `https://www.cargurus.com/Cars/inventorylisting/viewDetailsFilterViewInventoryListing.action?sourceContext=untrackedWithinSite_false_0&distance=25&inventorySearchWidgetType=AUTO&zip=30009&maxAccidents=0&hideSalvage=true&hideFrameDamaged=true&transmissionTypes=AUTOMATIC&hideFleet=true&hideMultipleOwners=true&maxPrice=12000&daysOnMarketMax=7&startYear=2015&hideLemon=true&hideTheft=true&sortDir=ASC&sortType=BEST_MATCH&isDeliveryEnabled=true`;

function removeSubstringAtEnd(string: string, substring: string) {
  if (string.endsWith(substring)) {
    return string.slice(0, -substring.length);
  }

  return string;
}

function cleanListing(listingElement: Element, listing: ScrapedListing) {
  const title = listingElement.querySelector('h4')?.textContent?.trim() ?? '';
  const titleBeforeTrim = `${listing.year} ${listing.make} ${listing.model}`;
  listing.trim = title.replace(titleBeforeTrim, '').trim();

  const priceText = listingElement.querySelector('[data-testid="srp-tile-price"]')?.textContent?.trim().replaceAll(/[$,]/gu, '');
  listing.price_approx = priceText ? Number.parseFloat(priceText) : null;

  listing.location = listingElement.querySelector('[data-testid="srp-tile-location"]')?.textContent?.trim();

  const imgElement = listingElement.querySelector('img');
  listing.image_url = imgElement ? imgElement.src : null;

  const listingLink = listingElement.querySelector('a[data-cg-ft="car-blade-link"]');
  listing.found_at_url = listingLink ? 'https://www.cargurus.com/Cars/inventorylisting/viewDetailsFilterViewInventoryListing.action' + listingLink.getAttribute('href') : null;
}

// eslint-disable-next-line max-lines-per-function
function parseListing(listingElement: Element) {
  const listing: ScrapedListing = {
    drivetrain: null,
    engine: null,
    exterior_color: null,
    found_at_url: null,
    fuel_type: null,
    image_url: null,
    interior_color: null,
    location: null,
    make: null,
    mileage: null,
    model: null,
    price_approx: null,
    safety_rating: null,
    transmission: null,
    trim: null,
    vin: null,
    year: null,
  };
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
  console.log('after cleaning', { listing });

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

function extractCarListings(listingElements: NodeListOf<Element> | undefined) {
  const cars = [];

  for (const listingElement of listingElements ?? []) {
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
export async function getLatestCarGurusListings() {
  const { browser, page } = await getChromium();
  try {
    await page.goto(url, {
      waitUntil: 'networkidle0',
    });
    console.log(`visited ${url}`);

    const now = new Date().toISOString();

    await saveHtml(page, url, `carGurus_${now}`);

    await page.screenshot({
      path: `${SCRAPE_LOGS_PATH}/carGurus_${now}.png`,
    });

    // wait for all redirects https://stackoverflow.com/a/57007420/470749
    const listingsWrapperElement = await page.waitForSelector('#cargurus-listing-search', {
      timeout: 3_000, // max milliseconds to wait
    });

    console.log('listingsWrapperElement', JSON.stringify(listingsWrapperElement, null, 2));

    const listingElements = await listingsWrapperElement?.evaluate(() => {
      return document.querySelectorAll('[data-testid="srp-tile-list"] > div.pazLTN');
    });

    console.log('listingElements', JSON.stringify(listingElements, null, 2));

    const listings = extractCarListings(listingElements);
    console.log({ listings });

    return listings;
  } catch (error) {
    console.error('Error finding the listings:', error);
    return null;
  } finally {
    await browser.close();
  }
}

getLatestCarGurusListings(); // FIXNOW: remove
