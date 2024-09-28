// `clear && yarn tsx helpers/cron_jobs/addNewListings.ts`

import { addNewListings } from '../addNewListings';

const args = process.argv.slice(2); // Get command line arguments starting from index 2 (which is the first real argument).

// Parse the first argument as a number, defaulting to 1 if not provided or invalid
const pageNumber = args.length > 0 && !Number.isNaN(Number(args[0])) ? Number(args[0]) : 1;

addNewListings(pageNumber);
