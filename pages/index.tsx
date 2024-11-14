import { useEffect, useState } from 'react';

import { ListingCard } from '../components/ListingCard';
import { getListingsWithWeightedRatings, type ListingWithWeightedRatings } from '../helpers/weightedRating';

export default function Index() {
  const [listings, setListings] = useState<ListingWithWeightedRatings[] | null>(null);
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
