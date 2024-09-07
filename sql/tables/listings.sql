-- public.listings definition
-- Drop table
-- DROP TABLE public.listings;
CREATE TABLE public.listings(
    vin text NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    priority int2 NULL,
    is_active bool DEFAULT TRUE NOT NULL,
    price_approx numeric NULL,
    mileage numeric NULL,
    number_of_owners int2 NULL,
    concerns text NULL,
    note text NULL,
    notes_from_test_drives text NULL,
    "location" text NULL,
    found_at_url text NOT NULL,
    listing_url text NULL,
    image_url text NULL,
    vin_report_url text NULL,
    model_id int8 NOT NULL,
    exterior_color text NULL,
    interior_color text NULL,
    fuel_type text NULL,
    transmission text NULL,
    body_type text NULL,
    safety_rating numeric NULL,
    drivetrain text NULL,
    engine text NULL,
    CONSTRAINT listings_found_at_url_key UNIQUE (found_at_url),
    CONSTRAINT listings_pkey PRIMARY KEY (vin)
);

-- public.listings foreign keys
ALTER TABLE public.listings
    ADD CONSTRAINT listings_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.models(id);

