import { type ListingWithWeightedRatings } from '../helpers/weightedRating';

// eslint-disable-next-line max-lines-per-function
export function ListingCard({ listing }: { readonly listing: ListingWithWeightedRatings }) {
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
