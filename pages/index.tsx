import { useEffect, useState } from 'react';

import { type Queue } from './api/queue';

// eslint-disable-next-line max-lines-per-function
export default function Index() {
  const [listings, setListings] = useState<Array<Queue['Row']> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchListings = async () => {
      const response = await fetch('/api/queue');
      const json = await response.json();
      const rows = json.data;
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
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-center mb-4">Car Listings</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings &&
            listings.map((listing) => (
              <div className="bg-white shadow-lg rounded-lg overflow-hidden" key={listing.vin}>
                <img alt={listing.model ?? 'Car Image'} className="w-full h-48 object-cover" src={listing.image_url ?? '/default-car-image.jpg'} />
                <div className="p-4">
                  <h2 className="text-lg font-bold mb-2">
                    {listing.year} {listing.make} {listing.model} {listing.trim}
                  </h2>
                  <p className="text-gray-600">{listing.body_type}</p>
                  <p className="text-gray-600">Mileage: {listing.mileage?.toLocaleString() ?? 'N/A'} miles</p>
                  <p className="text-gray-600">Price: ${listing.price_approx?.toLocaleString() ?? 'N/A'}</p>
                  <p className="text-gray-600">Location: {listing.location}</p>
                  <a className="block mt-4 text-blue-500 hover:underline" href={listing.listing_url as string} rel="noopener noreferrer" target="_blank">
                    View Listing
                  </a>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }
}
