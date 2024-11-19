/* eslint-disable @typescript-eslint/naming-convention */

import { type Queue } from '../pages/api/queue';

export type Weights = {
  outer: {
    mileage: number;
    price: number;
    ratings: number;
  };
  ratings: {
    /**
     * Default weight if count is null
     */
    defaultCount: number;
    kbbExpertRatingWeight: number;
    reliabilityWeight: number;
    safetyRatingWeight: number;
  };
};

function getCount(defaultCount: number, count: number | null | undefined): number {
  return count ?? defaultCount;
}

// eslint-disable-next-line max-lines-per-function
export function calculateWeightedRating(row: Queue['Row'], weights: Weights): number | null {
  let weightedSum = 0;
  let totalWeight = 0;

  if (row.cars_dot_com_rating) {
    const carsDotComWeight = getCount(weights.ratings.defaultCount, row.cars_dot_com_ratings_count);
    weightedSum += row.cars_dot_com_rating * carsDotComWeight;
    totalWeight += carsDotComWeight;
  }

  if (row.kbb_consumer_rating) {
    const kbbConsumerWeight = getCount(weights.ratings.defaultCount, row.kbb_consumer_ratings_count);
    weightedSum += row.kbb_consumer_rating * kbbConsumerWeight;
    totalWeight += kbbConsumerWeight;
  }

  if (row.kbb_expert_rating) {
    weightedSum += row.kbb_expert_rating * weights.ratings.kbbExpertRatingWeight;
    totalWeight += weights.ratings.kbbExpertRatingWeight;
  }

  if (row.edmunds_rating) {
    const edmundsWeight = getCount(weights.ratings.defaultCount, row.edmunds_ratings_count);
    weightedSum += row.edmunds_rating * edmundsWeight;
    totalWeight += edmundsWeight;
  }

  if (row.edmunds_repair_pal_reliability_rating) {
    weightedSum += row.edmunds_repair_pal_reliability_rating * weights.ratings.reliabilityWeight;
    totalWeight += weights.ratings.reliabilityWeight;
  }

  if (row.safety_rating) {
    weightedSum += row.safety_rating * weights.ratings.safetyRatingWeight;
    totalWeight += weights.ratings.safetyRatingWeight;
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

export type ListingWithWeightedRatings = Queue['Row'] & {
  mileageRating: number | null;
  priceRating: number | null;
  score: number | null;
  weightedRating: number | null;
};

/**
 * Very important! Weightings in this function will determine the sort order of the results!
 */
export function getListingsWithWeightedRatings(listings: Array<Queue['Row']>, weights: Weights): ListingWithWeightedRatings[] {
  return listings
    .map((row) => {
      const weightedRating = calculateWeightedRating(row, weights);
      const mileageRating = row.mileage ? getReverseRatingClamped(row.mileage, 40_000, 300_000) : null;
      const priceRating = row.price_approx ? getReverseRatingClamped(row.price_approx, 5_500, 12_000) : null;
      const items = [];
      if (weightedRating) {
        items.push({ value: weightedRating, weight: weights.outer.ratings });
      }

      if (mileageRating) {
        items.push({ value: mileageRating, weight: weights.outer.mileage });
      }

      if (priceRating) {
        items.push({ value: priceRating, weight: weights.outer.price });
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
