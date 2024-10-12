/* eslint-disable @typescript-eslint/naming-convention */

import { type Queue } from '../pages/api/queue';

// Default weight if count is null
const defaultCount = 30;
const reliabilityWeight = 100;
const kbbExpertRatingWeight = 100;
const safetyRatingWeight = 100;
export const milesExpected = 300_000;

function getCount(count: number | null | undefined): number {
  return count ?? defaultCount;
}

// eslint-disable-next-line max-lines-per-function
export function calculateWeightedRating(row: Queue['Row']): number | null {
  let weightedSum = 0;
  let totalWeight = 0;

  if (row.cars_dot_com_rating) {
    const carsDotComWeight = getCount(row.cars_dot_com_ratings_count);
    weightedSum += row.cars_dot_com_rating * carsDotComWeight;
    totalWeight += carsDotComWeight;
  }

  if (row.kbb_consumer_rating) {
    const kbbConsumerWeight = getCount(row.kbb_consumer_ratings_count);
    weightedSum += row.kbb_consumer_rating * kbbConsumerWeight;
    totalWeight += kbbConsumerWeight;
  }

  if (row.kbb_expert_rating) {
    weightedSum += row.kbb_expert_rating * kbbExpertRatingWeight;
    totalWeight += kbbExpertRatingWeight;
  }

  if (row.edmunds_rating) {
    const edmundsWeight = getCount(row.edmunds_ratings_count);
    weightedSum += row.edmunds_rating * edmundsWeight;
    totalWeight += edmundsWeight;
  }

  if (row.edmunds_repair_pal_reliability_rating) {
    weightedSum += row.edmunds_repair_pal_reliability_rating * reliabilityWeight;
    totalWeight += reliabilityWeight;
  }

  if (row.safety_rating) {
    weightedSum += row.safety_rating * safetyRatingWeight;
    totalWeight += safetyRatingWeight;
  }

  if (weightedSum && totalWeight) {
    const weightedRating = weightedSum / totalWeight;

    return Number(weightedRating.toFixed(2));
  } else {
    return null;
  }
}

function calculateWeightedScore(items: Array<{ value: number; weight: number }>): number {
  let totalWeight = 0;
  let weightedSum = 0;

  for (const item of items) {
    weightedSum += item.value * item.weight;
    totalWeight += item.weight;
  }

  if (totalWeight === 0) {
    throw new Error('Total weight cannot be zero.');
  }

  // Return the weighted average score
  return weightedSum / totalWeight;
}

/**
 * Converts a `pricePerRemainingMiles` input (such as $0.10) to a 1-5 scale, where cheaper is better, so $0 would be a 5, and high values like $0.17 get a 1.
 * pricePerRemainingMiles tends to be $0.06 to $0.17 if milesExpected = 250k.
 * TODO: Clamp so that $0.01 or $0.02 is a 5 since $0 is impossible.
 * TODO: It's probably better to get rid of the PricePerRemainingMilesScore since price is a result of many more factors than just remnaining miles.  Maybe just have a RemainingMilesScore.
 */
function getPricePerRemainingMilesScore(pricePerRemainingMiles: number | null, max = 0.17): number | null {
  if (pricePerRemainingMiles) {
    // Ensure input is non-negative and clamp values above 0.17
    const clampedInput = Math.min(Math.max(pricePerRemainingMiles, 0), max);

    // Map input from the range [0, 0.17] to [5, 1]
    const score = 5 - (clampedInput / max) * 4;

    const pprmScore = Number(score.toFixed(2));

    return pprmScore;
  } else {
    return null;
  }
}

function getScore(weightedRating: number | null, pprmScore: number | null): number | null {
  if (pprmScore && weightedRating) {
    return Number(
      calculateWeightedScore([
        { value: pprmScore, weight: 0.1 },
        { value: weightedRating, weight: 0.9 },
      ]).toFixed(2),
    );
  } else {
    return null;
  }
}

export function getListingsWithWeightedRatings(listings: Array<Queue['Row']>) {
  return listings
    .map((row) => {
      const weightedRating = calculateWeightedRating(row);
      const pricePerRemainingMiles = row.price_approx && row.mileage && row.mileage < milesExpected ? row.price_approx / (milesExpected - row.mileage) : null;
      const pprmScore = getPricePerRemainingMilesScore(pricePerRemainingMiles);
      const score = getScore(weightedRating, pprmScore);

      return {
        ...row,
        pprmScore,
        pricePerRemainingMiles,
        score,
        weightedRating,
      };
    })
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}
