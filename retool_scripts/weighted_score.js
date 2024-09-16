// eslint-disable-next-line max-lines-per-function
function calculateWeightedRating(row) {
    // Default weight if count is null
    const defaultCount = 30;
    const reliabilityWeight = 100;
    const kbbExpertRatingWeight = 100;
    const safetyRatingWeight = 100;

    // Extract ratings and counts from the row
    const {
        cars_dot_com_rating,
        cars_dot_com_ratings_count,
        kbb_consumer_rating,
        kbb_consumer_ratings_count,
        kbb_expert_rating,
        edmunds_rating,
        edmunds_ratings_count,
        edmunds_repair_pal_reliability_rating,
        safety_rating
    } = row;

    const getCount = (count) => count ?? defaultCount;

    const carsWeight = getCount(cars_dot_com_ratings_count);
    const kbbWeight = getCount(kbb_consumer_ratings_count);
    const edmundsWeight = getCount(edmunds_ratings_count);

    // Calculate weighted ratings
    const weightedCarsRating = cars_dot_com_rating * carsWeight;
    const weightedKbbConsumerRating = kbb_consumer_rating * kbbWeight;
    const weightedKbbExpertRating = kbb_expert_rating * kbbExpertRatingWeight;
    const weightedEdmundsRating = edmunds_rating * edmundsWeight;
    const weightedReliabilityRating = edmunds_repair_pal_reliability_rating * reliabilityWeight;
    const weightedSafetyRating = safety_rating * safetyRatingWeight;

    const totalWeight = carsWeight + kbbWeight + kbbExpertRatingWeight + edmundsWeight + reliabilityWeight + safetyRatingWeight;

    const weightedSum = weightedCarsRating + weightedKbbConsumerRating + weightedKbbExpertRating + weightedEdmundsRating + weightedReliabilityRating + weightedSafetyRating;

    const weightedRating = weightedSum / totalWeight;

    return Number(weightedRating.toFixed(2));
}

console.log(calculateWeightedRating({}))

/*
return data.map(row => {
    const weightedRating = calculateWeightedRating(row);
    return { ...row, weightedRating };
}).sort((a, b) => b.weightedRating - a.weightedRating);
*/