import { useLocalStorage } from 'usehooks-ts';

import { LocalStorageKey } from '../helpers/enums';
import { type Weights } from '../helpers/weightedRating';

export const defaultWeights = {
  outer: {
    mileage: 0.05,
    price: 0.05,
    ratings: 0.9,
  },
  ratings: {
    /**
     * Default weight if count is null
     */
    defaultCount: 30,
    kbbExpertRatingWeight: 100,
    reliabilityWeight: 100,
    safetyRatingWeight: 100,
  },
};

// eslint-disable-next-line max-lines-per-function
export function WeightsInputs() {
  const [weights, setWeights] = useLocalStorage<Weights>(LocalStorageKey.WEIGHTS, defaultWeights); // https://usehooks-ts.com/react-hook/use-local-storage

  function handleOuterChange(key: keyof Weights['outer'], value: number): void {
    const updatedOuterWeights: Weights['outer'] = { ...weights.outer, [key]: value };
    let totalWeight = 0;

    for (const weight of Object.values(updatedOuterWeights)) {
      totalWeight += weight;
    }

    // Normalize each weight to ensure their sum equals 1
    const normalizedOuterWeights = {} as Weights['outer'];
    for (const [outerKey, outerValue] of Object.entries(updatedOuterWeights)) {
      normalizedOuterWeights[outerKey as keyof Weights['outer']] = Number((outerValue / totalWeight).toFixed(2));
    }

    setWeights({
      ...weights,
      outer: normalizedOuterWeights,
    });
  }

  const handleRatingsChange = (key: keyof Weights['ratings'], value: number) => {
    setWeights({
      ...weights,
      ratings: { ...weights.ratings, [key]: value },
    });
  };

  return (
    <div className="flex space-x-4">
      <div>
        <h3 className="font-bold">Outer Weights</h3>
        {Object.entries(weights.outer).map(([key, value]) => (
          <div className="mb-2" key={key}>
            <label>
              {key} ({value.toFixed(2)})
            </label>
            <input
              max="1"
              min="0"
              onChange={(event) => handleOuterChange(key as keyof Weights['outer'], Number.parseFloat(event.target.value))}
              step="0.01"
              type="range"
              value={value}
            />
          </div>
        ))}
      </div>
      <div>
        <h3 className="font-bold">Ratings Weights</h3>
        {Object.entries(weights.ratings).map(([key, value]) => (
          <div className="mb-2" key={key}>
            <label>{key}: </label>
            <input onChange={(event) => handleRatingsChange(key as keyof Weights['ratings'], Number.parseFloat(event.target.value))} type="number" value={value} />
          </div>
        ))}
      </div>
    </div>
  );
}
