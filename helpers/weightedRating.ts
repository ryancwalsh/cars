/* eslint-disable @typescript-eslint/naming-convention */

import { type Queue } from '../pages/api/queue';

// Default weight if count is null
const defaultCount = 30;
const reliabilityWeight = 100;
const kbbExpertRatingWeight = 100;
const safetyRatingWeight = 100;

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

/**
 * Return the weighted average of values
 */
function calculateWeightedAverage(items: Array<{ value: number; weight: number }>, decimalPlaces = 2): number {
  let totalWeight = 0;
  let weightedSum = 0;

  for (const item of items) {
    weightedSum += item.value * item.weight;
    totalWeight += item.weight;
  }

  if (totalWeight === 0) {
    throw new Error('Total weight cannot be zero.');
  }

  return Number((weightedSum / totalWeight).toFixed(decimalPlaces));
}

/**
 * Maps the value to a 1-5 scale where 5 is best.
 */
function getReverseRatingClamped(value: number, min: number, max: number, decimalPlaces = 2): number {
  const clamped = Math.min(Math.max(value, min), max);
  const normalized = (clamped - min) / (max - min);
  return Number((5 - normalized * 4).toFixed(decimalPlaces));
}

/**
 * Very important! Weightings in this function will determine the sort order of the results!
 */
export function getListingsWithWeightedRatings(listings: Array<Queue['Row']>) {
  return listings
    .map((row) => {
      const weightedRating = calculateWeightedRating(row);
      const mileageRating = row.mileage ? getReverseRatingClamped(row.mileage, 40_000, 300_000) : null;
      const priceRating = row.price_approx ? getReverseRatingClamped(row.price_approx, 5_500, 12_000) : null;
      const items = [];
      if (weightedRating) {
        items.push({ value: weightedRating, weight: 0.9 });
      }

      if (mileageRating) {
        items.push({ value: mileageRating, weight: 0.05 });
      }

      if (priceRating) {
        items.push({ value: priceRating, weight: 0.05 });
      }

      const score = calculateWeightedAverage(items);

      return {
        ...row,
        mileageRating,
        priceRating,
        score,
        weightedRating,
      };
    })
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}
