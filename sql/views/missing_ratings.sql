-- public.missing_ratings source
DROP VIEW IF EXISTS public.missing_ratings;

CREATE VIEW public.missing_ratings WITH ( security_invoker = TRUE
) AS
SELECT
    allowed_models.id,
    allowed_models.year,
    allowed_models.make,
    allowed_models.model,
    allowed_models."trim",
    allowed_models.lowercase_hash,
    ratings.cars_dot_com_rating,
    ratings.cars_dot_com_ratings_count,
    ratings.cars_dot_com_url,
    ratings.edmunds_rating,
    ratings.edmunds_ratings_count,
    ratings.edmunds_repair_pal_reliability_rating,
    ratings.edmunds_monthly_cost_to_drive_estimate,
    ratings.edmunds_url,
    ratings.kbb_consumer_rating,
    ratings.kbb_consumer_ratings_count,
    ratings.kbb_expert_rating,
    ratings.kbb_url
FROM
    allowed_models
    LEFT JOIN ratings ON allowed_models.id = ratings.model_id
    LEFT JOIN listings ON listings.model_id = allowed_models.id
WHERE (
    ratings.cars_dot_com_url IS NULL
    OR ratings.edmunds_url IS NULL
    OR ratings.kbb_url IS NULL)
AND listings.is_active = TRUE
ORDER BY
    listings.last_checked_at DESC;

