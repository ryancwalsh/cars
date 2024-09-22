-- public.exclusions definition
-- Drop table
-- DROP TABLE public.exclusions;
CREATE TABLE public.exclusions(
    pattern text NOT NULL,
    CONSTRAINT exclusions_pkey PRIMARY KEY (pattern)
);

