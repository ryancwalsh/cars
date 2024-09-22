-- public.queue source
DROP VIEW IF EXISTS public.queue;

CREATE VIEW public.queue WITH ( security_invoker = TRUE
) AS
SELECT
    allowed_models.lowercase_hash,
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
    listings.last_checked_at,
    allowed_models.id AS models__id,
    allowed_models.back_seat_folds_flat,
    allowed_models.concern,
    allowed_models.created_at AS models__created_at,
    allowed_models.make,
    allowed_models.model,
    allowed_models.note AS models__note,
    allowed_models.trim,
    allowed_models.year,
    ratings.id AS ratings__id,
    ratings.cars_dot_com_rating,
    ratings.cars_dot_com_ratings_count,
    ratings.created_at AS ratings__created_at,
    ratings.kbb_consumer_rating,
    ratings.kbb_consumer_ratings_count,
    ratings.kbb_expert_rating,
    ratings.edmunds_rating,
    ratings.edmunds_ratings_count,
    ratings.edmunds_repair_pal_reliability_rating,
    ratings.edmunds_monthly_cost_to_drive_estimate,
    ratings.model_id AS ratings__model_id
FROM
    listings
    INNER JOIN allowed_models ON listings.model_id = allowed_models.id
    LEFT JOIN ratings ON allowed_models.id = ratings.model_id
WHERE
    listings.is_active = TRUE
ORDER BY
    listings.created_at ASC;

