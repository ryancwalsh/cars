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

export function getListingsWithWeightedRatings(listings: Array<Queue['Row']>) {
  return listings
    .map((row) => {
      const weightedRating = calculateWeightedRating(row);
      return { ...row, weightedRating };
    })
    .sort((a, b) => (b.weightedRating ?? 0) - (a.weightedRating ?? 0));
}
