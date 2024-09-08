-- public.queue source
CREATE OR REPLACE VIEW public.queue WITH ( security_invoker = TRUE
) AS
SELECT
    listings.body_type,
    listings.concerns,
    listings.created_at,
    listings.drivetrain,
    listings.engine,
    listings.exterior_color,
    listings.found_at_url,
    listings.fuel_type,
    listings.image_url,
    listings.interior_color,
    listings.is_active,
    listings.listing_url,
    listings.location,
    listings.mileage,
    listings.model_id,
    listings.note,
    listings.notes_from_test_drives,
    listings.number_of_owners,
    listings.price_approx,
    listings.priority,
    listings.safety_rating,
    listings.transmission,
    listings.vin,
    listings.vin_report_url,
    models.id AS models__id,
    models.back_seat_folds_flat,
    models.concern,
    models.created_at AS models__created_at,
    models.lowercase_hash,
    models.make,
    models.model,
    models.note AS models__note,
    models.trim,
    models.year,
    ratings.id AS ratings__id,
    ratings.cars_dot_com_rating,
    ratings.cars_dot_com_ratings_count,
    ratings.created_at AS ratings__created_at,
    ratings.kbb_consumer_rating,
    ratings.kbb_consumer_ratings_count,
    ratings.kbb_expert_rating,
    ratings.model_id AS ratings__model_id
FROM
    listings
    LEFT JOIN models ON listings.model_id = models.id
    LEFT JOIN ratings ON models.id = ratings.model_id
WHERE
    listings.is_active = TRUE
ORDER BY
    listings.created_at ASC;

