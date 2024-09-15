-- DROP VIEW IF EXISTS public.allowed_models;
CREATE OR REPLACE VIEW public.allowed_models WITH ( security_invoker = TRUE
) AS
SELECT
    id,
    created_at,
    "year",
    make,
    model,
    trim,
    back_seat_folds_flat,
    note,
    concern,
    lowercase_hash
FROM (
    SELECT
        id,
        created_at,
        "year",
        make,
        model,
        trim,
        back_seat_folds_flat,
        note,
        concern,
        lowercase_hash,
        CASE WHEN LOWER(
            make
) IN (
            'alfa romeo', 'audi', 'bmw', 'fiat', 'jeep', 'kia', 'mercedes', 'porsche', 'sentra', 'volkswagen'
)
            OR LOWER(
                CONCAT(
                    "year", '_', LOWER(
                        make
), '_', LOWER(
                        model
)
)
) IN (
                '2012_toyota_camry', '2014_toyota_camry', '2015_hyundai_sonata', '2016_hyundai_sonata', '2016_nissan_pathfinder', '2017_hyundai_sonata', '2018_ford_escape', '2018_hyundai_sonata', '2018_toyota_camry', '2019_hyundai_sonata', '2020_nissan_pathfinder'
)
            OR LOWER(
                lowercase_hash
) LIKE '%dodge_challenger%'
            OR LOWER(
                lowercase_hash
) LIKE '%dodge_charger%'
            OR LOWER(
                lowercase_hash
) LIKE '%ford_f-150%'
            OR LOWER(
                model
) = 'transit cargo'
            OR LOWER(
                lowercase_hash
) LIKE '%subaru_forester%'
            OR LOWER(
                lowercase_hash
) LIKE '%nissan_murano%' THEN
            FALSE
        ELSE
            TRUE
        END AS allowed
    FROM
        public.models
) AS inner_query
WHERE
    allowed = TRUE;

