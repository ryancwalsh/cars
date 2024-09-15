-- public.check_whether_still_available source
DROP VIEW IF EXISTS public.check_whether_still_available;

CREATE VIEW public.check_whether_still_available WITH ( security_invoker = TRUE
) AS
SELECT
    listings.created_at,
    listings.last_checked_at,
    listings.found_at_url,
    listings.listing_url,
    listings.vin
FROM
    listings
WHERE
    listings.is_active = TRUE
    AND listings.last_checked_at < NOW() - INTERVAL '24 hours'
ORDER BY
    listings.created_at ASC;

