-- public.ratings definition
-- Drop table
-- DROP TABLE public.ratings;
CREATE TABLE public.ratings(
    id int8 GENERATED BY DEFAULT AS IDENTITY NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    model_id int8 NOT NULL,
    cars_dot_com_rating numeric NULL,
    cars_dot_com_ratings_count numeric NULL,
    kbb_expert_rating numeric NULL,
    kbb_consumer_rating numeric NULL,
    kbb_consumer_ratings_count numeric NULL,
    edmunds_rating numeric NULL,
    edmunds_ratings_count numeric NULL,
    edmunds_monthly_cost_to_drive_estimate numeric NULL,
    cars_dot_com_url text NULL,
    kbb_url text NULL,
    edmunds_url text NULL,
    edmunds_repair_pal_reliability_rating numeric NULL,
    CONSTRAINT ratings_model_id_key UNIQUE (model_id),
    CONSTRAINT ratings_pkey PRIMARY KEY (id)
);

-- public.ratings foreign keys
ALTER TABLE public.ratings
    ADD CONSTRAINT ratings_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.models(id);

