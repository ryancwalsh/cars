import { useEffect, useState } from 'react';

import { getListingsWithWeightedRatings, milesExpected } from '../helpers/weightedRating';

// eslint-disable-next-line max-lines-per-function
export default function Index() {
  const [listings, setListings] = useState<ReturnType<typeof getListingsWithWeightedRatings> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchListings = async () => {
      const response = await fetch('/api/queue');
      const json = await response.json();
      const rows = getListingsWithWeightedRatings(json.data);
      console.log({ json, rows });
      setListings(rows);
      setLoading(false);
    };

    fetchListings();
  }, []);

  if (loading) {
    return <p className="text-center">Loading...</p>;
  } else {
    return (
      <div className="mx-auto p-4">
        <h1 className="text-2xl font-bold text-center mb-4">{listings?.length} Car Listings</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {listings &&
            listings.map((listing) => (
              <div className="bg-white shadow-lg border rounded-lg overflow-hidden" key={listing.vin}>
                <a className="block mt-4 text-blue-500 hover:underline" href={listing.found_at_url as string} rel="noopener noreferrer" target="_blank">
                  <img alt={listing.model ?? 'Car Image'} className="w-full h-48 object-cover" src={listing.image_url ?? '/default-car-image.jpg'} />
                </a>
                <div className="p-4">
                  <h2 className="text-lg font-bold mb-2">
                    {listing.year} {listing.make} {listing.model} {listing.trim}
                  </h2>
                  <div className="text-gray-600 font-bold">{listing.weightedRating}</div>
                  <div className="text-gray-600">
                    {listing.kbb_consumer_rating}, {listing.kbb_expert_rating}, {listing.cars_dot_com_rating}, {listing.edmunds_rating},{' '}
                    {listing.edmunds_repair_pal_reliability_rating}, {listing.safety_rating}
                  </div>
                  <div className="text-gray-600" title={`price per remaining mile, expecting ${milesExpected} miles`}>
                    {listing.pricePerRemainingMiles ? `$${listing.pricePerRemainingMiles.toFixed(2)} / rem mi` : ''}
                  </div>
                  <div className="text-gray-600 font-bold">${listing.price_approx?.toLocaleString() ?? 'N/A'}</div>
                  <div className="text-gray-600">{listing.mileage?.toLocaleString() ?? 'N/A'} miles</div>
                  <div className="text-gray-600">{listing.location}</div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }
}
