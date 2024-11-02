import { useEffect, useState } from 'react';

import { getListingsWithWeightedRatings } from '../helpers/weightedRating';

// eslint-disable-next-line max-lines-per-function
function ListingCard({ listing }: { readonly listing: ReturnType<typeof getListingsWithWeightedRatings>[0] }) {
  return (
    <div className="bg-white shadow-lg border rounded-lg overflow-hidden" key={listing.vin}>
      <a className="block mt-4 text-blue-500 hover:underline" href={listing.found_at_url as string} rel="noopener noreferrer" target="_blank">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={listing.model ?? 'Car Image'} className="w-full h-48 object-cover" src={listing.image_url ?? '/default-car-image.jpg'} />
      </a>
      <div className="p-4">
        <h2 className="text-lg font-bold mb-2">
          {listing.year} {listing.make} {listing.model} {listing.trim}
        </h2>
        <div className="text-gray-600 font-bold" title="Overall score">
          {listing.score?.toFixed(1)}
        </div>
        <div className="text-gray-600 pl-3" title="Weighted Rating">
          {listing.weightedRating?.toFixed(1)}:
        </div>
        <div className="text-gray-600 pl-6" title="individual ratings">
          {listing.kbb_consumer_rating}, {listing.kbb_expert_rating}, {listing.cars_dot_com_rating}, {listing.edmunds_rating}, {listing.edmunds_repair_pal_reliability_rating},{' '}
          {listing.safety_rating}
        </div>
        {/* <div className="text-gray-600 pl-3" title={`price per remaining mile, expecting ${milesExpected} miles`}>
                    {listing.pricePerRemainingMiles ? `$${listing.pricePerRemainingMiles.toFixed(2)} / rem mi` : ''}
                  </div> */}
        <div className="text-gray-600 font-bold pl-3" title={`price rating: ${listing.priceRating}`}>
          ${listing.price_approx?.toLocaleString() ?? 'N/A'}
        </div>
        <div className="text-gray-600 pl-3" title={`mileage rating: ${listing.mileageRating}`}>
          {listing.mileage?.toLocaleString() ?? 'N/A'} miles
        </div>
        <div className="text-gray-600">{listing.location}</div>
      </div>
    </div>
  );
}

// eslint-disable-next-line max-lines-per-function
export default function Index() {
  const [listings, setListings] = useState<ReturnType<typeof getListingsWithWeightedRatings> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchListings = async () => {
      const response = await fetch('/api/queue');
      const json = await response.json();
      const rows = getListingsWithWeightedRatings(json.data);
      // eslint-disable-next-line no-console
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
          {listings && listings.map((listing) => <ListingCard key={listing.vin} listing={listing} />)}
        </div>
      </div>
    );
  }
}
