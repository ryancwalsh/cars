CREATE TABLE public.listings(
    vin text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    priority smallint NULL,
    is_active boolean NOT NULL DEFAULT TRUE,
    price_approx numeric NULL,
    mileage numeric NULL,
    number_of_owners smallint NULL,
    concerns text NULL,
    note text NULL,
    notes_from_test_drives text NULL,
    location text NULL,
    found_at_url text NULL,
    listing_url text NULL,
    image_url text NULL,
    vin_report_url text NULL,
    model_id bigint NOT NULL,
    exterior_color text NULL,
    interior_color text NULL,
    fuel_type text NULL,
    transmission text NULL,
    body_type text NULL,
    safety_rating numeric NULL,
    drivetrain text NULL,
    engine text NULL,
    CONSTRAINT listings_pkey PRIMARY KEY (vin),
    CONSTRAINT listings_model_id_fkey FOREIGN KEY (model_id) REFERENCES models(id)
)
TABLESPACE pg_default;

