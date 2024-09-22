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
        CASE WHEN e.pattern IS NOT NULL -- A match was found in exclusions
            OR m.is_active = FALSE THEN
            FALSE
        ELSE
            TRUE
        END AS allowed
    FROM
        public.models m
        LEFT JOIN public.exclusions e ON m.lowercase_hash LIKE e.pattern -- Pattern matching
) AS inner_query
WHERE
    allowed = TRUE;

