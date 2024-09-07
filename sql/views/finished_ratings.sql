-- public.finished_ratings source
CREATE OR REPLACE VIEW public.finished_ratings AS
SELECT
    models.id,
    models.year,
    models.make,
    models.model,
    models."trim",
    ratings.cars_dot_com_rating,
    ratings.cars_dot_com_ratings_count,
    ratings.kbb_consumer_rating,
    ratings.kbb_consumer_ratings_count,
    ratings.kbb_expert_rating
FROM
    models
    LEFT JOIN ratings ON models.id = ratings.model_id
WHERE
    ratings.kbb_consumer_rating IS NOT NULL
    AND ratings.cars_dot_com_rating IS NOT NULL
ORDER BY
    models.id DESC;

