-- public.finished_ratings source
DROP VIEW IF EXISTS public.finished_ratings;

CREATE OR REPLACE VIEW public.finished_ratings WITH ( security_invoker = TRUE
) AS
SELECT
    allowed_models.id,
    allowed_models.year,
    allowed_models.make,
    allowed_models.model,
    allowed_models."trim",
    ratings.cars_dot_com_rating,
    ratings.cars_dot_com_ratings_count,
    ratings.kbb_consumer_rating,
    ratings.kbb_consumer_ratings_count,
    ratings.kbb_expert_rating,
    ratings.edmunds_rating,
    ratings.edmunds_ratings_count,
    ratings.edmunds_repair_pal_reliability_rating,
    ratings.edmunds_monthly_cost_to_drive_estimate
FROM
    allowed_models
    LEFT JOIN ratings ON allowed_models.id = ratings.model_id
WHERE
    ratings.kbb_consumer_rating IS NOT NULL
    AND ratings.cars_dot_com_rating IS NOT NULL
ORDER BY
    allowed_models.id DESC;

