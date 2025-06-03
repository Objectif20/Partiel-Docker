--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Debian 17.4-1.pgdg110+2)
-- Dumped by pg_dump version 17.4 (Debian 17.4-1.pgdg110+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: tiger; Type: SCHEMA; Schema: -; Owner: objectif20
--
DROP SCHEMA IF EXISTS tiger CASCADE;

CREATE SCHEMA tiger;


ALTER SCHEMA tiger OWNER TO objectif20;

--
-- Name: tiger_data; Type: SCHEMA; Schema: -; Owner: objectif20
--
DROP SCHEMA IF EXISTS tiger_data CASCADE;

CREATE SCHEMA tiger_data;


ALTER SCHEMA tiger_data OWNER TO objectif20;

--
-- Name: topology; Type: SCHEMA; Schema: -; Owner: objectif20
--
DROP SCHEMA IF EXISTS topology CASCADE;

CREATE SCHEMA topology;


ALTER SCHEMA topology OWNER TO objectif20;

--
-- Name: SCHEMA topology; Type: COMMENT; Schema: -; Owner: objectif20
--

COMMENT ON SCHEMA topology IS 'PostGIS Topology schema';


--
-- Name: fuzzystrmatch; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS fuzzystrmatch WITH SCHEMA public;


--
-- Name: EXTENSION fuzzystrmatch; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION fuzzystrmatch IS 'determine similarities and distance between strings';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- Name: postgis_tiger_geocoder; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder WITH SCHEMA tiger;


--
-- Name: EXTENSION postgis_tiger_geocoder; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis_tiger_geocoder IS 'PostGIS tiger geocoder and reverse geocoder';


--
-- Name: postgis_topology; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis_topology WITH SCHEMA topology;


--
-- Name: EXTENSION postgis_topology; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis_topology IS 'PostGIS topology spatial types and functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin_report; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.admin_report (
    report_id uuid NOT NULL,
    admin_id uuid NOT NULL
);


ALTER TABLE public.admin_report OWNER TO objectif20;

--
-- Name: admins; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.admins (
    admin_id uuid DEFAULT gen_random_uuid() NOT NULL,
    last_name character varying(255) NOT NULL,
    first_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password text,
    active boolean DEFAULT true,
    super_admin boolean DEFAULT false,
    photo text,
    two_factor_enabled boolean DEFAULT false,
    one_signal_id text,
    otp text,
    last_login timestamp without time zone,
    password_code character varying(255) DEFAULT NULL::character varying,
    language_id uuid
);


ALTER TABLE public.admins OWNER TO objectif20;

--
-- Name: appointments; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.appointments (
    appointment_id uuid DEFAULT gen_random_uuid() NOT NULL,
    service_payment_id character varying(255),
    stripe_payment_id character varying(255),
    amount numeric(10,2) NOT NULL,
    commission numeric(10,2),
    transferred_amount numeric(10,2),
    status character varying(50) NOT NULL,
    service_date timestamp without time zone NOT NULL,
    payment_date timestamp without time zone,
    refund_date timestamp without time zone,
    review text,
    client_id uuid NOT NULL,
    presta_commission_id uuid NOT NULL,
    service_id uuid NOT NULL,
    provider_id uuid NOT NULL,
    duration integer,
    code character varying(6) DEFAULT NULL::character varying,
    url_file text
);


ALTER TABLE public.appointments OWNER TO objectif20;

--
-- Name: availabilities; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.availabilities (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    provider_id uuid NOT NULL,
    day_of_week integer NOT NULL,
    morning boolean DEFAULT false NOT NULL,
    morning_start_time time without time zone,
    morning_end_time time without time zone,
    afternoon boolean DEFAULT false NOT NULL,
    afternoon_start_time time without time zone,
    afternoon_end_time time without time zone,
    evening boolean DEFAULT false NOT NULL,
    evening_start_time time without time zone,
    evening_end_time time without time zone,
    CONSTRAINT chk_day_of_week CHECK (((day_of_week >= 0) AND (day_of_week <= 6)))
);


ALTER TABLE public.availabilities OWNER TO objectif20;

--
-- Name: blocked; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.blocked (
    user_id uuid NOT NULL,
    user_id_blocked uuid NOT NULL,
    date_blocked timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.blocked OWNER TO objectif20;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.categories (
    category_id integer NOT NULL,
    name character varying(255) NOT NULL,
    max_weight numeric(10,2) NOT NULL,
    max_dimension character varying(255) NOT NULL
);


ALTER TABLE public.categories OWNER TO objectif20;

--
-- Name: categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: objectif20
--

CREATE SEQUENCE public.categories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_category_id_seq OWNER TO objectif20;

--
-- Name: categories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: objectif20
--

ALTER SEQUENCE public.categories_category_id_seq OWNED BY public.categories.category_id;


--
-- Name: clients; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.clients (
    client_id uuid DEFAULT gen_random_uuid() NOT NULL,
    last_name character varying(255) NOT NULL,
    first_name character varying(255) NOT NULL,
    stripe_customer_id character varying(255) DEFAULT NULL::character varying,
    user_id uuid NOT NULL
);


ALTER TABLE public.clients OWNER TO objectif20;

--
-- Name: deliveries; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.deliveries (
    delivery_id uuid DEFAULT gen_random_uuid() NOT NULL,
    send_date timestamp without time zone NOT NULL,
    delivery_date timestamp without time zone,
    status character varying(50) NOT NULL,
    stripe_payment_id character varying(255),
    amount numeric(10,2) NOT NULL,
    commission numeric(10,2),
    transferred_amount numeric(10,2),
    payment_status character varying(50),
    payment_date timestamp without time zone,
    refund_date timestamp without time zone,
    shipment_id uuid NOT NULL,
    delivery_commission_id uuid NOT NULL,
    delivery_person_id uuid NOT NULL,
    shipment_step integer DEFAULT 0,
    delivery_code character varying(255) DEFAULT NULL::character varying,
    delivery_price numeric(10,2) DEFAULT NULL::numeric,
    end_code character varying(255) DEFAULT NULL::character varying
);


ALTER TABLE public.deliveries OWNER TO objectif20;

--
-- Name: delivery_commission; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.delivery_commission (
    delivery_commission_id uuid DEFAULT gen_random_uuid() NOT NULL,
    percentage numeric(5,2) NOT NULL,
    active boolean DEFAULT true,
    stripe_percentage numeric(5,2),
    stripe_commission numeric(10,2)
);


ALTER TABLE public.delivery_commission OWNER TO objectif20;

--
-- Name: delivery_keywords; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.delivery_keywords (
    keyword_id uuid NOT NULL,
    shipment_id uuid NOT NULL
);


ALTER TABLE public.delivery_keywords OWNER TO objectif20;

--
-- Name: delivery_person_documents; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.delivery_person_documents (
    document_id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    submission_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    document_url text NOT NULL,
    delivery_person_id uuid NOT NULL,
    contact boolean DEFAULT false
);


ALTER TABLE public.delivery_person_documents OWNER TO objectif20;

--
-- Name: delivery_persons; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.delivery_persons (
    delivery_person_id uuid DEFAULT gen_random_uuid() NOT NULL,
    license character varying(255) NOT NULL,
    status character varying(50) NOT NULL,
    professional_email character varying(255) NOT NULL,
    phone_number character varying(50) NOT NULL,
    country character varying(100) NOT NULL,
    city character varying(100) NOT NULL,
    address text NOT NULL,
    photo text,
    balance numeric(10,2) DEFAULT 0.00,
    nfc_code character varying(255),
    stripe_transfer_id character varying(255),
    description text,
    postal_code character varying(20),
    validated boolean DEFAULT false,
    user_id uuid NOT NULL,
    admin_id uuid
);


ALTER TABLE public.delivery_persons OWNER TO objectif20;

--
-- Name: delivery_review_responses; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.delivery_review_responses (
    review_id_response uuid DEFAULT gen_random_uuid() NOT NULL,
    comment text NOT NULL,
    review_id uuid NOT NULL
);


ALTER TABLE public.delivery_review_responses OWNER TO objectif20;

--
-- Name: delivery_reviews; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.delivery_reviews (
    review_id uuid DEFAULT gen_random_uuid() NOT NULL,
    rating integer NOT NULL,
    comment text,
    delivery_id uuid NOT NULL
);


ALTER TABLE public.delivery_reviews OWNER TO objectif20;

--
-- Name: delivery_transfer; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.delivery_transfer (
    delivery_transfer_id uuid DEFAULT gen_random_uuid() NOT NULL,
    date timestamp without time zone NOT NULL,
    amount numeric NOT NULL,
    delivery_id uuid,
    type character varying NOT NULL,
    url text,
    stripe_id text
);


ALTER TABLE public.delivery_transfer OWNER TO objectif20;

--
-- Name: exchange_points; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.exchange_points (
    exchange_point_id uuid DEFAULT gen_random_uuid() NOT NULL,
    city character varying(255) NOT NULL,
    coordinates public.geography(Point,4326) NOT NULL,
    description text,
    warehouse_id uuid,
    isbox boolean DEFAULT false,
    address character varying(255) NOT NULL,
    postal_code character varying(15) NOT NULL
);


ALTER TABLE public.exchange_points OWNER TO objectif20;

--
-- Name: favorite_services; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.favorite_services (
    service_id uuid NOT NULL,
    user_id uuid NOT NULL
);


ALTER TABLE public.favorite_services OWNER TO objectif20;

--
-- Name: favorites; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.favorites (
    shipment_id uuid NOT NULL,
    delivery_person_id uuid NOT NULL
);


ALTER TABLE public.favorites OWNER TO objectif20;

--
-- Name: keywords; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.keywords (
    keyword_id uuid DEFAULT gen_random_uuid() NOT NULL,
    keyword character varying(255) NOT NULL
);


ALTER TABLE public.keywords OWNER TO objectif20;

--
-- Name: languages; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.languages (
    language_id uuid DEFAULT gen_random_uuid() NOT NULL,
    language_name character varying(255) NOT NULL,
    iso_code character varying(10) NOT NULL,
    active boolean DEFAULT true
);


ALTER TABLE public.languages OWNER TO objectif20;

--
-- Name: merchant_contract; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.merchant_contract (
    contract_id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_name character varying(255) NOT NULL,
    siret character varying(20) NOT NULL,
    address text NOT NULL,
    merchant_id uuid NOT NULL
);


ALTER TABLE public.merchant_contract OWNER TO objectif20;

--
-- Name: merchant_documents; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.merchant_documents (
    merchant_document_id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    submission_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    merchant_document_url text NOT NULL,
    merchant_id uuid NOT NULL
);


ALTER TABLE public.merchant_documents OWNER TO objectif20;

--
-- Name: merchant_sector; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.merchant_sector (
    sector_id uuid NOT NULL,
    merchant_id uuid NOT NULL
);


ALTER TABLE public.merchant_sector OWNER TO objectif20;

--
-- Name: merchants; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.merchants (
    merchant_id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_name character varying(255) NOT NULL,
    siret character varying(20) NOT NULL,
    address text NOT NULL,
    stripe_customer_id character varying(255) DEFAULT NULL::character varying,
    description text,
    postal_code character varying(20),
    city character varying(100) NOT NULL,
    country character varying(100) NOT NULL,
    phone character varying(20) NOT NULL,
    user_id uuid NOT NULL,
    first_name character varying(255),
    last_name character varying(255),
    contract_url text
);


ALTER TABLE public.merchants OWNER TO objectif20;

--
-- Name: onesignal_devices; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.onesignal_devices (
    device_id uuid DEFAULT gen_random_uuid() NOT NULL,
    player_id text NOT NULL,
    user_id uuid NOT NULL,
    platform character varying(25) DEFAULT NULL::character varying
);


ALTER TABLE public.onesignal_devices OWNER TO objectif20;

--
-- Name: parcel_images; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.parcel_images (
    image_url character varying(250) NOT NULL,
    parcel_id uuid NOT NULL
);


ALTER TABLE public.parcel_images OWNER TO objectif20;

--
-- Name: parcels; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.parcels (
    parcel_id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    weight numeric(7,2),
    estimate_price numeric(10,2),
    fragility boolean,
    volume numeric(10,2),
    shipment_id uuid NOT NULL
);


ALTER TABLE public.parcels OWNER TO objectif20;

--
-- Name: plans; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.plans (
    plan_id integer NOT NULL,
    name character varying(255) NOT NULL,
    price numeric(6,2),
    priority_shipping_percentage numeric(5,2) DEFAULT 0.00,
    priority_months_offered integer DEFAULT 0,
    max_insurance_coverage numeric(10,2) DEFAULT 0.00,
    extra_insurance_price numeric(10,2) DEFAULT 0.00,
    shipping_discount numeric(5,2) DEFAULT 0.00,
    permanent_discount numeric(10,2) DEFAULT 0.00,
    permanent_discount_percentage numeric(5,2) DEFAULT 0.00,
    small_package_permanent_discount numeric(10,2) DEFAULT 0.00,
    first_shipping_free boolean DEFAULT false,
    first_shipping_free_threshold numeric(10,2) DEFAULT 0.00,
    is_pro boolean DEFAULT false,
    stripe_product_id character varying(255) DEFAULT NULL::character varying,
    stripe_price_id character varying(255) DEFAULT NULL::character varying
);


ALTER TABLE public.plans OWNER TO objectif20;

--
-- Name: plans_plan_id_seq; Type: SEQUENCE; Schema: public; Owner: objectif20
--

CREATE SEQUENCE public.plans_plan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.plans_plan_id_seq OWNER TO objectif20;

--
-- Name: plans_plan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: objectif20
--

ALTER SEQUENCE public.plans_plan_id_seq OWNED BY public.plans.plan_id;


--
-- Name: presta_review_responses; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.presta_review_responses (
    review_presta_response_id uuid DEFAULT gen_random_uuid() NOT NULL,
    comment text NOT NULL,
    review_presta_id uuid NOT NULL
);


ALTER TABLE public.presta_review_responses OWNER TO objectif20;

--
-- Name: presta_reviews; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.presta_reviews (
    review_presta_id uuid DEFAULT gen_random_uuid() NOT NULL,
    rating integer NOT NULL,
    comment text,
    appointment_id uuid NOT NULL,
    CONSTRAINT presta_reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.presta_reviews OWNER TO objectif20;

--
-- Name: provider_commissions; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.provider_commissions (
    provider_commission_id uuid DEFAULT gen_random_uuid() NOT NULL,
    value numeric(10,2) NOT NULL
);


ALTER TABLE public.provider_commissions OWNER TO objectif20;

--
-- Name: provider_contracts; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.provider_contracts (
    provider_contract_id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_name character varying(255) NOT NULL,
    siret character varying(20) NOT NULL,
    address text NOT NULL,
    provider_id uuid NOT NULL,
    contract_url text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.provider_contracts OWNER TO objectif20;

--
-- Name: provider_documents; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.provider_documents (
    provider_documents_id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    submission_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    provider_document_url text NOT NULL,
    provider_id uuid NOT NULL
);


ALTER TABLE public.provider_documents OWNER TO objectif20;

--
-- Name: provider_keywords; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.provider_keywords (
    provider_keyword_id uuid NOT NULL,
    service_id uuid NOT NULL
);


ALTER TABLE public.provider_keywords OWNER TO objectif20;

--
-- Name: provider_keywords_list; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.provider_keywords_list (
    provider_keyword_id uuid DEFAULT gen_random_uuid() NOT NULL,
    keyword character varying(255) NOT NULL
);


ALTER TABLE public.provider_keywords_list OWNER TO objectif20;

--
-- Name: providers; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.providers (
    provider_id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_name character varying(255) NOT NULL,
    siret character varying(20) NOT NULL,
    address text NOT NULL,
    service_type character varying(255) NOT NULL,
    stripe_transfer_id character varying(255) DEFAULT NULL::character varying,
    description text,
    postal_code character varying(20),
    city character varying(100) NOT NULL,
    country character varying(100) NOT NULL,
    phone character varying(20) NOT NULL,
    validated boolean DEFAULT false,
    user_id uuid NOT NULL,
    admin_id uuid,
    first_name character varying(255),
    last_name character varying(255),
    balance numeric(10,2) DEFAULT 0.00
);


ALTER TABLE public.providers OWNER TO objectif20;

--
-- Name: reports; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.reports (
    report_id uuid DEFAULT gen_random_uuid() NOT NULL,
    status character varying(50) NOT NULL,
    report_message text,
    state text,
    user_id uuid NOT NULL
);


ALTER TABLE public.reports OWNER TO objectif20;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.roles (
    role_id uuid NOT NULL,
    admin_id uuid NOT NULL
);


ALTER TABLE public.roles OWNER TO objectif20;

--
-- Name: roles_list; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.roles_list (
    role_id uuid DEFAULT gen_random_uuid() NOT NULL,
    role_name character varying(255) NOT NULL
);


ALTER TABLE public.roles_list OWNER TO objectif20;

--
-- Name: sectors; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.sectors (
    sector_id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.sectors OWNER TO objectif20;

--
-- Name: service_images; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.service_images (
    image_service_id uuid DEFAULT gen_random_uuid() NOT NULL,
    image_service_url text NOT NULL,
    service_id uuid NOT NULL
);


ALTER TABLE public.service_images OWNER TO objectif20;

--
-- Name: services; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.services (
    service_id uuid NOT NULL,
    provider_id uuid NOT NULL
);


ALTER TABLE public.services OWNER TO objectif20;

--
-- Name: services_list; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.services_list (
    service_id uuid DEFAULT gen_random_uuid() NOT NULL,
    service_type character varying(255) NOT NULL,
    status character varying(50) NOT NULL,
    validated boolean DEFAULT false,
    name character varying(255) NOT NULL,
    description text,
    city character varying(100),
    admin_id uuid,
    price numeric(10,2),
    duration_minute integer,
    available boolean,
    price_admin numeric(10,2) DEFAULT NULL::numeric
);


ALTER TABLE public.services_list OWNER TO objectif20;

--
-- Name: shipments; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.shipments (
    shipment_id uuid DEFAULT gen_random_uuid() NOT NULL,
    description text,
    estimated_total_price numeric(10,2),
    proposed_delivery_price numeric(10,2),
    weight numeric(10,2),
    volume numeric(10,2),
    deadline_date timestamp without time zone,
    time_slot character varying(50),
    urgent boolean DEFAULT false,
    status character varying(50),
    image text,
    views integer DEFAULT 0,
    departure_city character varying(255),
    arrival_city character varying(255),
    departure_location public.geometry(Point,4326),
    arrival_location public.geometry(Point,4326),
    user_id uuid NOT NULL,
    delivery_mail character varying(255) DEFAULT NULL::character varying,
    trolleydrop boolean DEFAULT false,
    arrival_address character varying(255),
    departure_address character varying(255),
    arrival_postal character varying(15),
    departure_postal character varying(15),
    arrival_handling boolean DEFAULT false,
    departure_handling boolean DEFAULT false,
    floor_departure_handling integer DEFAULT 0,
    elevator_departure boolean DEFAULT false,
    floor_arrival_handling integer DEFAULT 0,
    elevator_arrival boolean DEFAULT false
);


ALTER TABLE public.shipments OWNER TO objectif20;

--
-- Name: stores; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.stores (
    shipment_id uuid NOT NULL,
    exchange_point_id uuid NOT NULL,
    step integer NOT NULL,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone NOT NULL
);


ALTER TABLE public.stores OWNER TO objectif20;

--
-- Name: subscription_transactions; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.subscription_transactions (
    transaction_id uuid DEFAULT gen_random_uuid() NOT NULL,
    subscription_id uuid NOT NULL,
    month integer NOT NULL,
    year integer NOT NULL,
    price_at_transaction numeric(10,2) NOT NULL,
    invoice_url text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT subscription_transactions_month_check CHECK (((month >= 1) AND (month <= 12)))
);


ALTER TABLE public.subscription_transactions OWNER TO objectif20;

--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.subscriptions (
    subscription_id uuid DEFAULT gen_random_uuid() NOT NULL,
    stripe_customer_id character varying(255) DEFAULT NULL::character varying NOT NULL,
    stripe_subscription_id character varying(255) DEFAULT NULL::character varying,
    status character varying(50),
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone,
    cancellation_date timestamp without time zone,
    user_id uuid NOT NULL,
    plan_id integer NOT NULL,
    first_shipping_free_taken boolean DEFAULT false
);


ALTER TABLE public.subscriptions OWNER TO objectif20;

--
-- Name: subscriptions_plan_id_seq; Type: SEQUENCE; Schema: public; Owner: objectif20
--

CREATE SEQUENCE public.subscriptions_plan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subscriptions_plan_id_seq OWNER TO objectif20;

--
-- Name: subscriptions_plan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: objectif20
--

ALTER SEQUENCE public.subscriptions_plan_id_seq OWNED BY public.subscriptions.plan_id;


--
-- Name: themes; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.themes (
    theme_id integer NOT NULL,
    name character varying(20) NOT NULL
);


ALTER TABLE public.themes OWNER TO objectif20;

--
-- Name: themes_theme_id_seq; Type: SEQUENCE; Schema: public; Owner: objectif20
--

CREATE SEQUENCE public.themes_theme_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.themes_theme_id_seq OWNER TO objectif20;

--
-- Name: themes_theme_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: objectif20
--

ALTER SEQUENCE public.themes_theme_id_seq OWNED BY public.themes.theme_id;


--
-- Name: tickets; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.tickets (
    ticket_id uuid DEFAULT gen_random_uuid() NOT NULL,
    status character varying(50) NOT NULL,
    state character varying(50) NOT NULL,
    description jsonb NOT NULL,
    title character varying(255) NOT NULL,
    creation_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    resolution_date timestamp without time zone,
    priority character varying(50) NOT NULL,
    admin_id_attribute uuid,
    admin_id_get uuid,
    CONSTRAINT tickets_priority_check CHECK (((priority)::text = ANY ((ARRAY['Low'::character varying, 'Medium'::character varying, 'High'::character varying, 'Critical'::character varying])::text[])))
);


ALTER TABLE public.tickets OWNER TO objectif20;

--
-- Name: transfers; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.transfers (
    transfer_id uuid DEFAULT gen_random_uuid() NOT NULL,
    date timestamp without time zone NOT NULL,
    amount numeric(10,2) NOT NULL,
    delivery_person_id uuid NOT NULL,
    type character varying(10) DEFAULT 'auto'::character varying NOT NULL,
    url text,
    stripe_id text,
    CONSTRAINT transfers_type_check CHECK (((type)::text = ANY ((ARRAY['auto'::character varying, 'not-auto'::character varying])::text[])))
);


ALTER TABLE public.transfers OWNER TO objectif20;

--
-- Name: transfers_provider; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.transfers_provider (
    transfer_id uuid DEFAULT gen_random_uuid() NOT NULL,
    date timestamp without time zone NOT NULL,
    amount numeric(10,2) NOT NULL,
    type character varying(10) NOT NULL,
    url text,
    provider_id uuid NOT NULL,
    stripe_id text,
    CONSTRAINT transfers_provider_type_check CHECK (((type)::text = ANY ((ARRAY['auto'::character varying, 'not-auto'::character varying])::text[])))
);


ALTER TABLE public.transfers_provider OWNER TO objectif20;

--
-- Name: trips; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.trips (
    trip_id uuid DEFAULT gen_random_uuid() NOT NULL,
    departure_location public.geometry(Point,4326) NOT NULL,
    arrival_location public.geometry(Point,4326) NOT NULL,
    departure_city character varying(255) NOT NULL,
    arrival_city character varying(255) NOT NULL,
    date timestamp without time zone,
    tolerated_radius numeric(10,2) NOT NULL,
    delivery_person_id uuid NOT NULL,
    weekday character varying(255),
    comeback_today_or_tomorrow character varying(50) NOT NULL,
    CONSTRAINT check_comeback_check CHECK (((comeback_today_or_tomorrow)::text = ANY ((ARRAY['today'::character varying, 'tomorrow'::character varying, 'later'::character varying])::text[])))
);


ALTER TABLE public.trips OWNER TO objectif20;

--
-- Name: users; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.users (
    user_id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(255) NOT NULL,
    password text NOT NULL,
    creation_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    banned boolean DEFAULT false,
    ban_date timestamp without time zone,
    profile_picture text,
    newsletter boolean DEFAULT false,
    last_login timestamp without time zone,
    confirmed boolean DEFAULT false,
    tutorial_done boolean DEFAULT false,
    dark_mode_enabled boolean DEFAULT false,
    two_factor_enabled boolean DEFAULT false,
    one_signal_id text,
    theme_id integer NOT NULL,
    language_id uuid NOT NULL,
    secret_totp text,
    password_code character varying(255) DEFAULT NULL::character varying,
    validate_code character varying(255) DEFAULT NULL::character varying
);


ALTER TABLE public.users OWNER TO objectif20;

--
-- Name: users_theme_id_seq; Type: SEQUENCE; Schema: public; Owner: objectif20
--

CREATE SEQUENCE public.users_theme_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_theme_id_seq OWNER TO objectif20;

--
-- Name: users_theme_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: objectif20
--

ALTER SEQUENCE public.users_theme_id_seq OWNED BY public.users.theme_id;


--
-- Name: vehicle_documents; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.vehicle_documents (
    vehicle_document_id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    submission_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    vehicle_document_url text NOT NULL,
    vehicle_id uuid NOT NULL
);


ALTER TABLE public.vehicle_documents OWNER TO objectif20;

--
-- Name: vehicles; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.vehicles (
    vehicle_id uuid DEFAULT gen_random_uuid() NOT NULL,
    model character varying(255) NOT NULL,
    registration_number character varying(50) NOT NULL,
    electric boolean DEFAULT false,
    validated boolean DEFAULT false,
    co2_consumption numeric(10,2),
    image_url text,
    delivery_person_id uuid NOT NULL,
    category_id integer NOT NULL,
    val_by_admin_id uuid
);


ALTER TABLE public.vehicles OWNER TO objectif20;

--
-- Name: vehicles_category_id_seq; Type: SEQUENCE; Schema: public; Owner: objectif20
--

CREATE SEQUENCE public.vehicles_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vehicles_category_id_seq OWNER TO objectif20;

--
-- Name: vehicles_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: objectif20
--

ALTER SEQUENCE public.vehicles_category_id_seq OWNED BY public.vehicles.category_id;


--
-- Name: warehouses; Type: TABLE; Schema: public; Owner: objectif20
--

CREATE TABLE public.warehouses (
    warehouse_id uuid DEFAULT gen_random_uuid() NOT NULL,
    city character varying(255) NOT NULL,
    capacity numeric(10,2) NOT NULL,
    coordinates public.geography(Point,4326) NOT NULL,
    photo text,
    description text,
    address character varying(255) NOT NULL,
    postal_code character varying(15) NOT NULL
);


ALTER TABLE public.warehouses OWNER TO objectif20;

--
-- Name: categories category_id; Type: DEFAULT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.categories ALTER COLUMN category_id SET DEFAULT nextval('public.categories_category_id_seq'::regclass);


--
-- Name: plans plan_id; Type: DEFAULT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.plans ALTER COLUMN plan_id SET DEFAULT nextval('public.plans_plan_id_seq'::regclass);


--
-- Name: subscriptions plan_id; Type: DEFAULT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.subscriptions ALTER COLUMN plan_id SET DEFAULT nextval('public.subscriptions_plan_id_seq'::regclass);


--
-- Name: themes theme_id; Type: DEFAULT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.themes ALTER COLUMN theme_id SET DEFAULT nextval('public.themes_theme_id_seq'::regclass);


--
-- Name: users theme_id; Type: DEFAULT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.users ALTER COLUMN theme_id SET DEFAULT nextval('public.users_theme_id_seq'::regclass);


--
-- Name: vehicles category_id; Type: DEFAULT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.vehicles ALTER COLUMN category_id SET DEFAULT nextval('public.vehicles_category_id_seq'::regclass);


--
-- Data for Name: admin_report; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.admin_report (report_id, admin_id) FROM stdin;
f08f71dd-aff1-47e3-b646-70bb34a9501d	d3088a02-1918-4ff8-85c5-cab6cf7052b3
\.


--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.admins (admin_id, last_name, first_name, email, password, active, super_admin, photo, two_factor_enabled, one_signal_id, otp, last_login, password_code, language_id) FROM stdin;
5f1143c5-e5cc-4ab3-8159-e1c016e55bff	Delneuf	Quentin	qdelneuf@myges.fr	\N	t	f	\N	f	\N	\N	\N	42121738-9dea-4dee-9cc7-a807573699b4	\N
d3088a02-1918-4ff8-85c5-cab6cf7052b3	Vaurette	Damien	dvaurette@myges.fr	$2b$10$62xyIjZRQWoXXJkLoPScEOHCHpFVDPqqYBL2XVAfhDAezjkvLrxXy	t	t	admin/d3088a02-1918-4ff8-85c5-cab6cf7052b3/images/da50c8fe-5c87-4b01-a7ef-60783b862b66.png	t	\N	OJNVQ4CJJBXDAI3JMEWC66RRFBETUJTN	\N	\N	\N
d6733392-f759-44a2-8a15-32d9cdbf9b11	THIBAUT	Rémy	remy.thibaut2005@gmail.com	$2b$10$/7/Xhl92lEsXBttrqCAHQuPjYE3xlHATtQDzi0fkSlQO55mh0S/Xy	t	t	admin/d6733392-f759-44a2-8a15-32d9cdbf9b11/images/7ffc43ea-0ec8-4d5d-987b-582385e09359.png	f	\N		\N	\N	691a6ac2-7b1a-4394-9d04-aaa586827b20
06ae5d85-6a2d-40e3-8e13-74f9d97d73a4	THIBAUT	Rémt	amphinoman@gmail.com	$2b$10$/wDYtLC.AUCKAJeffbpxje0l3PwYiM2Ssu.cBmoj11arB26.f8mIS	t	f	admin/06ae5d85-6a2d-40e3-8e13-74f9d97d73a4/images/42761e0e-f89d-4949-b8fe-ecb971e094d9.png	f	\N		\N	c9da9ffd-f930-4e6a-8f83-92f44a1f90c5	691a6ac2-7b1a-4394-9d04-aaa586827b20
35cd4423-c198-4478-b95b-846758d03e2d	Doe	John	john.doe@example.com	\N	t	f	\N	f	\N	\N	\N	\N	\N
\.


--
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.appointments (appointment_id, service_payment_id, stripe_payment_id, amount, commission, transferred_amount, status, service_date, payment_date, refund_date, review, client_id, presta_commission_id, service_id, provider_id, duration, code, url_file) FROM stdin;
451f89f9-2912-4655-917e-885681c8a56c	\N	\N	59.99	10.00	\N	pending	2025-04-21 11:00:00	\N	\N	\N	552aa2d4-8160-4022-9ceb-ee3cfed35919	019b46f3-18bc-4610-a8bd-ff1b75d1adb3	9b899f71-31b3-40dd-90e2-80de2cf262fd	e8bb9a20-c223-4dec-a682-6dd6b5817222	60	\N	\N
42dbdb36-7543-4d4e-b779-73eddc486530	\N	\N	59.99	10.00	\N	pending	2025-04-21 11:00:00	\N	\N	\N	552aa2d4-8160-4022-9ceb-ee3cfed35919	019b46f3-18bc-4610-a8bd-ff1b75d1adb3	9b899f71-31b3-40dd-90e2-80de2cf262fd	e8bb9a20-c223-4dec-a682-6dd6b5817222	60	\N	\N
640e2c0f-f992-4f5d-bc9f-43985e8d909c	\N	\N	59.99	10.00	\N	pending	2025-05-05 12:00:00	\N	\N	\N	8cf669aa-6bf0-40bb-a703-248ec3ad90ee	019b46f3-18bc-4610-a8bd-ff1b75d1adb3	6a402a28-ed1b-4cc6-af19-05ce0a5a17e9	e8bb9a20-c223-4dec-a682-6dd6b5817222	60	\N	\N
83d59583-84e8-4138-8917-7ef4e1a489ac	\N	\N	59.99	10.00	\N	pending	2025-06-16 13:00:00	\N	\N	\N	8cf669aa-6bf0-40bb-a703-248ec3ad90ee	019b46f3-18bc-4610-a8bd-ff1b75d1adb3	6a402a28-ed1b-4cc6-af19-05ce0a5a17e9	e8bb9a20-c223-4dec-a682-6dd6b5817222	60	\N	\N
b0df2d0b-41ba-4dca-9f7e-3905ad4e3dca	\N	\N	59.99	10.00	\N	pending	2025-04-28 12:00:00	\N	\N	\N	8cf669aa-6bf0-40bb-a703-248ec3ad90ee	019b46f3-18bc-4610-a8bd-ff1b75d1adb3	6a402a28-ed1b-4cc6-af19-05ce0a5a17e9	e8bb9a20-c223-4dec-a682-6dd6b5817222	60	\N	\N
09780799-5dfa-42f1-b102-2544aec2d349	\N	\N	59.99	10.00	\N	pending	2025-05-12 10:00:00	\N	\N	\N	8cf669aa-6bf0-40bb-a703-248ec3ad90ee	019b46f3-18bc-4610-a8bd-ff1b75d1adb3	6a402a28-ed1b-4cc6-af19-05ce0a5a17e9	e8bb9a20-c223-4dec-a682-6dd6b5817222	60	\N	\N
75565be3-635e-450c-9f9f-2ecfd541855e	\N	\N	59.99	10.00	\N	pending	2025-05-12 13:00:00	\N	\N	\N	8cf669aa-6bf0-40bb-a703-248ec3ad90ee	019b46f3-18bc-4610-a8bd-ff1b75d1adb3	6a402a28-ed1b-4cc6-af19-05ce0a5a17e9	e8bb9a20-c223-4dec-a682-6dd6b5817222	60	\N	\N
7b6bb0b9-2203-42eb-acfb-8ee9781b3efe	\N	\N	59.99	10.00	\N	pending	2025-05-20 13:00:00	\N	\N	\N	8cf669aa-6bf0-40bb-a703-248ec3ad90ee	019b46f3-18bc-4610-a8bd-ff1b75d1adb3	6a402a28-ed1b-4cc6-af19-05ce0a5a17e9	e8bb9a20-c223-4dec-a682-6dd6b5817222	60	\N	\N
\.


--
-- Data for Name: availabilities; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.availabilities (id, provider_id, day_of_week, morning, morning_start_time, morning_end_time, afternoon, afternoon_start_time, afternoon_end_time, evening, evening_start_time, evening_end_time) FROM stdin;
9772f5fe-30e6-43c8-8722-b81d8a8ad598	e8bb9a20-c223-4dec-a682-6dd6b5817222	1	f	12:00:00	14:00:00	f	18:00:00	19:00:00	f	\N	\N
33b3068b-45d4-4170-a77a-30fe156d60dc	e8bb9a20-c223-4dec-a682-6dd6b5817222	6	f	\N	\N	f	\N	\N	f	\N	\N
\.


--
-- Data for Name: blocked; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.blocked (user_id, user_id_blocked, date_blocked) FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.categories (category_id, name, max_weight, max_dimension) FROM stdin;
1	Utilitaire T2	1500.00	6
\.


--
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.clients (client_id, last_name, first_name, stripe_customer_id, user_id) FROM stdin;
242e7ce5-dd7b-4275-a455-90c2ffd1d6a4	VAURETTE	Damien	cus_S5MRFJZAIjb5lv	4003a1a8-2a5d-4d48-bbf2-81795ca42da4
feee62a7-e8f2-412c-ac4c-326852ce095b	Delneuf	Quentin	\N	8dd4546f-7be8-4d9f-97e1-72c5ed4cbbd5
552aa2d4-8160-4022-9ceb-ee3cfed35919	Yagoo	Beaubatis	\N	a6480035-5d8c-4775-88cb-56784b765410
17a28322-f1a3-424f-91bd-0c639b78857d	THIBAUT	Rémy	\N	cad292f7-56e2-4622-b5fd-6693f142efb5
b21d9bfc-582b-4aef-9503-244bc2ecd3a2	Doe	John		e3b78347-2939-4a7d-b65d-483c27a3073b
89f03d28-8d4a-48f5-89d4-28d52aa79ad4	Doe	 t	cus_S0hqxJaANtzEHx	bafb8fd4-899e-40c2-ba4e-9184ed8c852f
11778dfc-2561-46c9-b157-f27c9536cca4	THIBAUT	Rémy	\N	68368825-9cbf-4c14-9766-333a99a19fe5
8cf669aa-6bf0-40bb-a703-248ec3ad90ee	THIBAUT	Rémyt	cus_SIEp9vwsXEGzxp	86eea5f4-37e1-4a80-98b1-fef236e3a44a
\.


--
-- Data for Name: deliveries; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.deliveries (delivery_id, send_date, delivery_date, status, stripe_payment_id, amount, commission, transferred_amount, payment_status, payment_date, refund_date, shipment_id, delivery_commission_id, delivery_person_id, shipment_step, delivery_code, delivery_price, end_code) FROM stdin;
c9820fae-76aa-46c5-9a45-96067bd0982f	2025-05-04 14:17:32.93	\N	taken	\N	69.00	\N	\N	\N	\N	\N	47de72d0-3ef6-4c12-8e74-16553d59c430	943f810c-d794-493d-8548-743f91e881c3	ed92c1b5-ae2b-4362-9d8b-3a38629fce24	1000	0797a67bddda9e56122d402dd2352b0d	\N	\N
3bd1e344-b081-4ecb-bd36-6d7ba16382f1	2025-05-23 18:16:01.186	\N	pending	\N	5.00	\N	\N	\N	\N	\N	fdb7d694-ee0b-4a6d-96ef-2105b2141add	943f810c-d794-493d-8548-743f91e881c3	ed92c1b5-ae2b-4362-9d8b-3a38629fce24	2	f6ff225df1ad8dd03a7daf6bfeeb763c	\N	\N
e699ee3a-639f-43a3-a43d-1c4dacf453d4	2025-05-04 15:53:01.816	\N	taken	\N	15.00	\N	\N	\N	\N	\N	762f380f-e993-4f02-b520-7215c48b5ed0	943f810c-d794-493d-8548-743f91e881c3	5a164066-78a6-4bd1-af89-be8cf75db8bc	1	787f40cd715a689adffc3b51899497b42104ec6f4d38d49daae1bb7ec4ed8307	\N	\N
d81cde01-139c-4cef-9cbf-1add286e1b25	2025-05-03 20:35:56.269	\N	pending	\N	12.00	\N	\N	\N	\N	\N	696739c8-57aa-4ec7-83a7-83e17b2ca6bf	943f810c-d794-493d-8548-743f91e881c3	5a164066-78a6-4bd1-af89-be8cf75db8bc	0	ce61f37c8d362388ddcd26e409290c6b	\N	\N
d40759bd-0ac7-49df-a065-eab19f10c7bf	2025-05-03 16:17:55.932	\N	validated	\N	12.00	\N	\N	\N	\N	\N	4cdaf35c-dc7d-4b39-b8e9-610cc6df9bb2	943f810c-d794-493d-8548-743f91e881c3	5a164066-78a6-4bd1-af89-be8cf75db8bc	1	86f1e53b4cd4ba395e27323191809c72b731ec6bce5e85f37cacc3e3ffefc4bb	\N	157192
241f46b9-91c5-4baf-882c-aa69f747bf32	2025-05-03 16:37:45.96	\N	validated	\N	12.00	\N	\N	\N	\N	\N	4487e93e-4f19-470f-aec0-4e94d16d1b17	943f810c-d794-493d-8548-743f91e881c3	ed92c1b5-ae2b-4362-9d8b-3a38629fce24	0	c84b9816fd14019ec94a64bedc706f86	\N	294504
6009036c-6a16-48e2-b192-6fbd869161a6	2025-05-03 15:47:37.81	\N	validated	\N	12.00	\N	\N	\N	\N	\N	103dd427-ec37-43d8-a36d-36cea926814e	943f810c-d794-493d-8548-743f91e881c3	ed92c1b5-ae2b-4362-9d8b-3a38629fce24	0	8b8c2ba3a52665966a42cbdcfbdb9666	\N	144755
50910dbe-0201-4f66-b1e2-fd72fce84f8c	2025-05-04 11:51:33.538	\N	canceled	\N	70.00	\N	\N	\N	\N	\N	83a87c89-396a-4ffd-9781-206cef14be5a	943f810c-d794-493d-8548-743f91e881c3	ed92c1b5-ae2b-4362-9d8b-3a38629fce24	1	64f414a4c2a35ee4bbe6e3589540870ac92e087f52f2ee7a85757f8cdc4bd8de	\N	\N
79c5b899-12be-4d23-9da2-87eb92e7c391	2025-05-23 18:10:17.878	\N	validated	\N	58.00	\N	\N	\N	\N	\N	a828b361-d48f-42d2-a416-c0fe4f1963ed	943f810c-d794-493d-8548-743f91e881c3	ed92c1b5-ae2b-4362-9d8b-3a38629fce24	0	f6ff225df1ad8dd03a7daf6bfeeb763c	\N	179185
\.


--
-- Data for Name: delivery_commission; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.delivery_commission (delivery_commission_id, percentage, active, stripe_percentage, stripe_commission) FROM stdin;
943f810c-d794-493d-8548-743f91e881c3	15.00	t	2.90	0.25
\.


--
-- Data for Name: delivery_keywords; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.delivery_keywords (keyword_id, shipment_id) FROM stdin;
\.


--
-- Data for Name: delivery_person_documents; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.delivery_person_documents (document_id, name, description, submission_date, document_url, delivery_person_id, contact) FROM stdin;
fcd6744e-b79f-4ed0-80cd-db3cb2332b0f	Projet - virtualisation des rÃ©seau.docx	\N	2025-05-03 09:47:55.369263	delivery-person/ed92c1b5-ae2b-4362-9d8b-3a38629fce24/documents/Projet - virtualisation des rÃ©seau.docx	ed92c1b5-ae2b-4362-9d8b-3a38629fce24	f
74dd4987-136b-410f-9567-67a5872fc178	Projet - virtualisation des rÃ©seau.docx	\N	2025-05-03 14:15:54.938103	delivery-person/5a164066-78a6-4bd1-af89-be8cf75db8bc/documents/Projet - virtualisation des rÃ©seau.docx	5a164066-78a6-4bd1-af89-be8cf75db8bc	f
5cfec0f2-d477-4703-933e-e297545d9c50	Contrat de profil livreur	\N	2025-05-03 09:47:55.4358	delivery-person/ed92c1b5-ae2b-4362-9d8b-3a38629fce24/contracts/contract-ed92c1b5-ae2b-4362-9d8b-3a38629fce24.pdf	ed92c1b5-ae2b-4362-9d8b-3a38629fce24	t
1b6c0f3d-34cc-4124-95c7-c89159a08a81	Contrat de profil livreur	\N	2025-05-03 14:15:55.004795	delivery-person/5a164066-78a6-4bd1-af89-be8cf75db8bc/contracts/contract-5a164066-78a6-4bd1-af89-be8cf75db8bc.pdf	5a164066-78a6-4bd1-af89-be8cf75db8bc	t
217bd0ff-d02b-4040-9dee-d4e735ce9659	2A3_Planning soutenances_Virtualisation rÃ©seaux_M. OUAKI_09.01.25.pdf	\N	2025-05-29 19:33:19.436353	delivery-person/0c78b794-b953-4b67-93a6-c28b03c8f098/documents/2A3_Planning soutenances_Virtualisation rÃ©seaux_M. OUAKI_09.01.25.pdf	0c78b794-b953-4b67-93a6-c28b03c8f098	f
762b1859-cc95-48be-8a53-ce46ed6d7b5d	Contrat de profil livreur	\N	2025-05-29 19:33:19.501686	delivery-person/0c78b794-b953-4b67-93a6-c28b03c8f098/contracts/contract-0c78b794-b953-4b67-93a6-c28b03c8f098.pdf	0c78b794-b953-4b67-93a6-c28b03c8f098	t
\.


--
-- Data for Name: delivery_persons; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.delivery_persons (delivery_person_id, license, status, professional_email, phone_number, country, city, address, photo, balance, nfc_code, stripe_transfer_id, description, postal_code, validated, user_id, admin_id) FROM stdin;
0c78b794-b953-4b67-93a6-c28b03c8f098	qsdqsd	pending	remy.thibaut2005@gmail.com	+33768932201	American Samoa	Samoreau	12 Bis Rue du Bois St Maur	\N	0.00	\N	\N	\N	77210	f	68368825-9cbf-4c14-9766-333a99a19fe5	\N
5a164066-78a6-4bd1-af89-be8cf75db8bc	qsdqsd	pending	rthibaut@myges.fr	+33768932201	Angola	Samoreau	12 Bis Rue du Bois St Maur	\N	10.00	coucou	\N	\N	77210	\N	cad292f7-56e2-4622-b5fd-6693f142efb5	\N
ed92c1b5-ae2b-4362-9d8b-3a38629fce24	qsdqsd	pending	amphinoman@gmail.com	+337689322017	Aland Islands	Samoreau	12 Bis Rue du Bois St Maur tt	\N	0.00	NFC-1748805030432-8416	acct_1RMSsa2Undt8pAfp	\N	77210	t	86eea5f4-37e1-4a80-98b1-fef236e3a44a	\N
\.


--
-- Data for Name: delivery_review_responses; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.delivery_review_responses (review_id_response, comment, review_id) FROM stdin;
bb756de0-01f0-411e-a876-7517b044c85f	test	fd320b91-bbff-4cff-b28a-e7700e1f06cd
\.


--
-- Data for Name: delivery_reviews; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.delivery_reviews (review_id, rating, comment, delivery_id) FROM stdin;
fd320b91-bbff-4cff-b28a-e7700e1f06cd	5	top	d40759bd-0ac7-49df-a065-eab19f10c7bf
\.


--
-- Data for Name: delivery_transfer; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.delivery_transfer (delivery_transfer_id, date, amount, delivery_id, type, url, stripe_id) FROM stdin;
77088076-f969-42b3-b971-5405135074d6	2025-05-24 14:25:22.533	57.09	79c5b899-12be-4d23-9da2-87eb92e7c391	auto	/shipments/a828b361-d48f-42d2-a416-c0fe4f1963ed/delivery/79c5b899-12be-4d23-9da2-87eb92e7c391/facture_79c5b899-12be-4d23-9da2-87eb92e7c391.pdf	pi_3RSH8e2Yjtdc4Smm12FSoaId
7695820d-0ca1-4613-af32-2f0710dd3eef	2025-05-24 14:50:10.931	70.285	c9820fae-76aa-46c5-9a45-96067bd0982f	auto	/shipments/47de72d0-3ef6-4c12-8e74-16553d59c430/delivery/c9820fae-76aa-46c5-9a45-96067bd0982f/facture_c9820fae-76aa-46c5-9a45-96067bd0982f.pdf	pi_3RSHWe2Yjtdc4Smm0bSQM0uO
2c1b72dd-f962-40ec-8b42-cd00211d5089	2025-05-24 14:52:22.637	70.285	c9820fae-76aa-46c5-9a45-96067bd0982f	auto	/shipments/47de72d0-3ef6-4c12-8e74-16553d59c430/delivery/c9820fae-76aa-46c5-9a45-96067bd0982f/facture_c9820fae-76aa-46c5-9a45-96067bd0982f.pdf	pi_3RSHYm2Yjtdc4Smm01VHqE5Y
177f38e0-e3ad-4c70-8b82-33d3212838a1	2025-05-31 19:15:25.991	13.445	e699ee3a-639f-43a3-a43d-1c4dacf453d4	auto	/shipments/762f380f-e993-4f02-b520-7215c48b5ed0/delivery/e699ee3a-639f-43a3-a43d-1c4dacf453d4/facture_e699ee3a-639f-43a3-a43d-1c4dacf453d4.pdf	pi_3RUt0B2Yjtdc4Smm091bjZLx
\.


--
-- Data for Name: exchange_points; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.exchange_points (exchange_point_id, city, coordinates, description, warehouse_id, isbox, address, postal_code) FROM stdin;
0470ad57-8a2d-49e6-b04a-8b215d565868	Bordeaux	0101000020E6100000B8E9CF7EA488E2BF6AF981AB3C6B4640	\N	\N	f	Adresse inconnue	00000
5a898e06-b517-4e06-a70d-1550b0f63c24	Lyon	0101000020E61000009D11A5BDC15713406F1283C0CAE14640	\N	2538eccd-00ea-492c-bb73-70ca96d9a0c6	f	Adresse inconnue	00000
ae6d38b2-183b-4676-b4b6-9521a366ba07	Samoreau	0101000020E6100000B3EF8AE07F0B0640713AC95697354840	\N	\N	f	Adresse inconnue	00000
e99ab854-d178-4617-928e-cd3f935930e1	Samoreau	0101000020E6100000B3EF8AE07F0B0640713AC95697354840	\N	\N	f	Adresse inconnue	00000
e409a04e-9508-4e69-a5b5-97b4d12c590a	Samoreau	0101000020E6100000B3EF8AE07F0B0640713AC95697354840	\N	\N	f	Adresse inconnue	00000
583ca190-5c09-4075-a6ee-b6c9180d22e3	Lyon	0101000020E61000009D11A5BDC15713406F1283C0CAE14640	\N	2538eccd-00ea-492c-bb73-70ca96d9a0c6	f	Adresse inconnue	00000
545572b8-9b2a-4173-ab7b-6003f472a120	Paris	0101000020E610000094A2957B81C90240ECE5D2533F6D4840	\N	\N	f	Adresse inconnue	00000
94620972-9fd3-4af5-afd9-36f5395069fe	Lyon	0101000020E61000009D11A5BDC15713406F1283C0CAE14640	\N	2538eccd-00ea-492c-bb73-70ca96d9a0c6	f	Adresse inconnue	00000
770b9244-9b18-47ae-987c-e70752e65c95	Lyon	0101000020E61000009D11A5BDC15713406F1283C0CAE14640	\N	2538eccd-00ea-492c-bb73-70ca96d9a0c6	f	Adresse inconnue	00000
1c9bf507-22fe-4c36-ab9e-fb7017a12d6c	Lyon	0101000020E61000009D11A5BDC15713406F1283C0CAE14640	\N	2538eccd-00ea-492c-bb73-70ca96d9a0c6	f	Adresse inconnue	00000
53fdf2a4-71c0-4cbc-b4f2-ce4fd0c15736	Lyon	0101000020E61000009D11A5BDC15713406F1283C0CAE14640	\N	2538eccd-00ea-492c-bb73-70ca96d9a0c6	f	Adresse inconnue	00000
\.


--
-- Data for Name: favorite_services; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.favorite_services (service_id, user_id) FROM stdin;
\.


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.favorites (shipment_id, delivery_person_id) FROM stdin;
\.


--
-- Data for Name: keywords; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.keywords (keyword_id, keyword) FROM stdin;
5b9ebd22-d42c-49c6-9820-d3fdd95750ec	fragile
7ad2980d-f179-4538-8e2b-a774d3acd7c2	électronique
\.


--
-- Data for Name: languages; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.languages (language_id, language_name, iso_code, active) FROM stdin;
ae8f67fc-7597-406c-8dca-881905d82cb1	Italiano	it	t
dd3de120-0596-4b4e-9b09-99b5541fbb1b	English	gb	t
2b87c392-1e4b-41ad-aa28-f5b1a1d48e36	Espagnol	es	t
691a6ac2-7b1a-4394-9d04-aaa586827b20	Français	fr	t
59f02076-b192-4ffd-b7cf-9fff8dac8e28	Japonais	jp	t
\.


--
-- Data for Name: merchant_contract; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.merchant_contract (contract_id, company_name, siret, address, merchant_id) FROM stdin;
\.


--
-- Data for Name: merchant_documents; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.merchant_documents (merchant_document_id, name, description, submission_date, merchant_document_url, merchant_id) FROM stdin;
\.


--
-- Data for Name: merchant_sector; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.merchant_sector (sector_id, merchant_id) FROM stdin;
\.


--
-- Data for Name: merchants; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.merchants (merchant_id, company_name, siret, address, stripe_customer_id, description, postal_code, city, country, phone, user_id, first_name, last_name, contract_url) FROM stdin;
dab6cdc0-4359-4543-a7fa-781e1de5cf23	Entreprise Exemple	12345678901234	123 Rue de l'Exemple	cus_S0fsNI4mLvmEXt	Une entreprise fictive pour les tests.	75000	Paris	France	0123456789	27d9b341-3d77-4e7e-91da-69d38cc950b2	\N	\N	\N
848d8460-f4c9-46fe-8f1d-933b2bc3f0a4	Nouvelle Entreprise Test	98765432109876	456 Nouvelle Rue	cus_S0hrfI5cHS5hvk	Entreprise de test pour des démonstrations.	75001	Lyon	France	0987654321	1e445002-76ef-462b-ab01-26646410c08c	\N	\N	\N
5d498c89-d38c-46b6-b483-5bde2211d79c	Test	23478976512789	12 Bis Rue du Bois St Maur	cus_S5MRFJZAIjb5lv	Test	77210	Samoreau	Andorra	0768932201	58415527-2e7e-4289-a24b-a0c70ff5b6b7	Rémy	THIBAUT	\N
c031e5c6-59d9-4576-a408-a6831d6fd601	test	12345678912349	12 Bis Rue du Bois St Maur	\N	test	77210	Samoreau	Algeria	0768932201	d98bf725-63c9-4671-a774-c9af7482982d	Rémy	THIBAUT	merchant/12345678912349/contracts/contract-undefined.pdf
\.


--
-- Data for Name: onesignal_devices; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.onesignal_devices (device_id, player_id, user_id, platform) FROM stdin;
c13d3012-a22f-4d01-a41c-0a6ea4662ec4	d1337d24-d2d2-4607-8d2f-d846f909fdc4	86eea5f4-37e1-4a80-98b1-fef236e3a44a	web
c5c0a876-083a-4214-9de9-0f800ac1a63e	b7673c45-0c32-4b2b-a43e-cf1ac206b38d	86eea5f4-37e1-4a80-98b1-fef236e3a44a	web
7c4d1a0a-be60-45ae-b8b5-a81f906e2a20	280e083c-b1f7-4053-96c2-3eb51b6939ea	86eea5f4-37e1-4a80-98b1-fef236e3a44a	web
7c252f87-f3ea-4719-89da-50a2482fd5cb	09ac9253-16eb-4b80-acbb-71dada82b0e6	93ee1b03-4f1b-4805-bd2e-efba5f871896	web
090eee3a-3572-4c80-a260-298f40fd976a	09ac9253-16eb-4b80-acbb-71dada82b0e6	68368825-9cbf-4c14-9766-333a99a19fe5	web
e3273b05-b650-4d65-9f5a-15e2dae05ad1	09ac9253-16eb-4b80-acbb-71dada82b0e6	86eea5f4-37e1-4a80-98b1-fef236e3a44a	web
c602730b-83d8-49dc-869c-21671be6aa9e	09ac9253-16eb-4b80-acbb-71dada82b0e6	58415527-2e7e-4289-a24b-a0c70ff5b6b7	web
118f2bd8-d1cf-4243-ae7a-2a3c266e9a51	560caf24-cb98-4ac4-a678-5d6826c33dd9	86eea5f4-37e1-4a80-98b1-fef236e3a44a	mobile
ea2d82c4-c85e-454f-b2db-b15065addaa5	b2fb8646-f948-47e7-a354-b90d103d9fc4	86eea5f4-37e1-4a80-98b1-fef236e3a44a	mobile
\.


--
-- Data for Name: parcel_images; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.parcel_images (image_url, parcel_id) FROM stdin;
shipments/76032b46-7dc3-4f03-9e60-17980818ba8b/parcels/06d9bb50-2cd0-45a1-8637-473a7c913dbc/images/Oracle - 2A3 - Groupe 1.pdf	06d9bb50-2cd0-45a1-8637-473a7c913dbc
shipments/76032b46-7dc3-4f03-9e60-17980818ba8b/parcels/cf13d088-01fe-4a41-b71b-6a01991996c5/images/Oracle - 2A3 - Groupe 1.pdf	cf13d088-01fe-4a41-b71b-6a01991996c5
shipments/4487e93e-4f19-470f-aec0-4e94d16d1b17/parcels/5cf51880-76de-4cbb-b8b9-f8cd1955f373/images/Oracle - 2A3 - Groupe 1.pdf	5cf51880-76de-4cbb-b8b9-f8cd1955f373
shipments/4487e93e-4f19-470f-aec0-4e94d16d1b17/parcels/c3e919eb-e40a-41ca-b3c6-ff2aced392f6/images/Oracle - 2A3 - Groupe 1.pdf	c3e919eb-e40a-41ca-b3c6-ff2aced392f6
shipments/696739c8-57aa-4ec7-83a7-83e17b2ca6bf/parcels/9966a233-cab7-4809-ab8c-7bebfe5a525b/images/Oracle - 2A3 - Groupe 1.pdf	9966a233-cab7-4809-ab8c-7bebfe5a525b
shipments/696739c8-57aa-4ec7-83a7-83e17b2ca6bf/parcels/d3caffd0-3bd8-4e10-a269-4f3348ea4505/images/Oracle - 2A3 - Groupe 1.pdf	d3caffd0-3bd8-4e10-a269-4f3348ea4505
shipments/cb59b4c8-36b9-4ac2-af6c-91715430b151/parcels/78c876d5-f694-403a-8a24-29e578b7d98d/images/8c805765-046b-44c9-915a-e8ef4e5ff575-Oracle - 2A3 - Groupe 1.pdf	78c876d5-f694-403a-8a24-29e578b7d98d
shipments/cb59b4c8-36b9-4ac2-af6c-91715430b151/parcels/36dacc9e-ec95-44c7-9b9b-a37cb87bb3b1/images/92af3307-6dcd-4cdf-9302-388d1faf57dc-Oracle - 2A3 - Groupe 1.pdf	36dacc9e-ec95-44c7-9b9b-a37cb87bb3b1
shipments/d776818b-ff21-42df-add9-6ebbe13b0a5a/parcels/f5c6ce75-a213-4f59-a0a2-0269d9feb398/images/4680bb58-121e-499d-b386-3252c826986e.pdf	f5c6ce75-a213-4f59-a0a2-0269d9feb398
shipments/d776818b-ff21-42df-add9-6ebbe13b0a5a/parcels/246c291d-04eb-4b67-b12f-f1efcec3fdc5/images/cc6090fa-0d76-4ceb-9b47-a4bb4a1896f9.pdf	246c291d-04eb-4b67-b12f-f1efcec3fdc5
shipments/8107a456-4984-4445-af6a-d205c7545343/parcels/380c860f-3a09-447a-b31d-e8f42305aad1/images/5a0208fa-2f75-4e90-b422-db60a3c01b8c.png	380c860f-3a09-447a-b31d-e8f42305aad1
shipments/db976cd2-414a-43c0-ba35-47ee667e3826/parcels/2e99ec6f-b57f-49b0-b31c-00e0022bd1fd/images/94158744-e503-48e5-a149-f2a6bd4b1a04.png	2e99ec6f-b57f-49b0-b31c-00e0022bd1fd
shipments/bbdf45e5-623e-4f5f-9b33-d6d5f434a63c/parcels/fd39a47b-b8cb-4201-bec8-0ed951138957/images/d97cc6f4-26bf-4601-968c-ce17ee95d7f2.png	fd39a47b-b8cb-4201-bec8-0ed951138957
shipments/29aebce3-0684-4d17-b8c2-8967f0ae61b5/parcels/3f84cddf-80d0-40cc-93d6-b5107e9d2c9f/images/6356fc9c-1db6-4b19-a897-7d2b8ae80923.png	3f84cddf-80d0-40cc-93d6-b5107e9d2c9f
shipments/42ef48bd-cd21-4a7e-93fe-f12138832867/parcels/490422ac-2f5c-42bf-9c27-1d539283c4c1/images/5a0a154e-3041-42f4-9761-03caa74e4600.png	490422ac-2f5c-42bf-9c27-1d539283c4c1
shipments/103dd427-ec37-43d8-a36d-36cea926814e/parcels/a242c14c-1f9b-494c-a317-84698bd7077b/images/1bb42535-2967-4c2f-82b0-ede2c05a987f.png	a242c14c-1f9b-494c-a317-84698bd7077b
shipments/1363c192-5791-4abe-b644-d7605421da2d/parcels/886aca71-ce9c-42ef-9e22-086956b8288a/images/56f1673e-1f49-4674-97a3-4e2a24e3abdf.png	886aca71-ce9c-42ef-9e22-086956b8288a
shipments/4cdaf35c-dc7d-4b39-b8e9-610cc6df9bb2/parcels/a8247227-fd9c-46a0-abf6-65100c322939/images/34782704-01b2-438f-b365-9d2712c9a488.png	a8247227-fd9c-46a0-abf6-65100c322939
shipments/83a87c89-396a-4ffd-9781-206cef14be5a/parcels/f6422657-31a2-4f59-ba08-2d428f98051d/images/d294816f-3a5a-4cc2-9f1b-fe5426259c0d.png	f6422657-31a2-4f59-ba08-2d428f98051d
shipments/762f380f-e993-4f02-b520-7215c48b5ed0/parcels/96c6c890-f8ea-47b7-b8b9-d2c2e0e8b111/images/ebf05b8e-741d-4e1e-86d7-c36e6610aa86.png	96c6c890-f8ea-47b7-b8b9-d2c2e0e8b111
shipments/79160ac8-3e47-46e3-82f8-d96a376911e0/parcels/a1b0301c-3811-482f-aef4-88ef2f3336ad/images/75f3c331-3262-42a5-8602-96f778b3f771.png	a1b0301c-3811-482f-aef4-88ef2f3336ad
shipments/8caba19c-82a0-4326-a3c9-ea8ff2f86e1b/parcels/cdfeba5f-7520-4e2b-9e97-ad5de14703d3/images/36a17513-4435-4feb-ba78-0a864f1e01c7.png	cdfeba5f-7520-4e2b-9e97-ad5de14703d3
shipments/0f7df91f-59ba-4f8e-826a-976136ea0bb1/parcels/54c517fb-cc98-4a8a-be7e-83097f1d0006/images/502422db-51d8-4282-ad33-ec9f4f8aa188.png	54c517fb-cc98-4a8a-be7e-83097f1d0006
shipments/51df84c6-ab98-4e22-b92c-277dc8df85c9/parcels/9bb4767e-441a-4adc-9967-9e320bf0cc6b/images/1bf72456-740a-46e8-a8da-3251a1bea293.png	9bb4767e-441a-4adc-9967-9e320bf0cc6b
shipments/fde7b1f7-1d8f-40a4-a483-ffb392d0651b/parcels/43c7b4b6-2bf5-433a-b28c-c04aa2e60e92/images/c7f72859-8d72-4331-a857-d437eb2cb15e.png	43c7b4b6-2bf5-433a-b28c-c04aa2e60e92
shipments/fdb7d694-ee0b-4a6d-96ef-2105b2141add/parcels/3bc1521e-5cf6-46eb-a131-c6f41c26f194/images/55e50ade-dfee-441e-a618-40d3d5809c43.png	3bc1521e-5cf6-46eb-a131-c6f41c26f194
shipments/0c0a7249-ae27-45a2-bcb5-6b81be690119/parcels/73179fe3-6aa6-4b63-986d-fd9efbed3987/images/9410d530-e4ae-45e6-9d63-6a13df2c0357.png	73179fe3-6aa6-4b63-986d-fd9efbed3987
shipments/7191eaf9-b65c-4d99-9f47-c4886c8a59e5/parcels/09c63039-2eb2-462f-a651-8821614f1ec3/images/97083223-10cd-4d49-8e7f-a5f5df1b9e5e.png	09c63039-2eb2-462f-a651-8821614f1ec3
shipments/a828b361-d48f-42d2-a416-c0fe4f1963ed/parcels/93bfcc07-c753-4e4b-bf10-b904a7cf06cc/images/4f4c2c0f-854f-4207-9eb3-418679bae1ed.png	93bfcc07-c753-4e4b-bf10-b904a7cf06cc
\.


--
-- Data for Name: parcels; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.parcels (parcel_id, name, weight, estimate_price, fragility, volume, shipment_id) FROM stdin;
4107967b-ad40-4d69-a34e-0844dda6cdc1	Ordinateur portable	2.50	\N	t	\N	37b6791d-451d-407a-86c8-8d4412c63a74
12cfdec9-b480-452c-a7d9-c9d4cd5105ed	Ordinateur portable	2.50	\N	t	\N	47de72d0-3ef6-4c12-8e74-16553d59c430
7aed175c-36b9-479f-9f71-430f8d9d0cd2	Ordinateur portable	2.50	\N	t	\N	173c1964-3113-4681-ad88-363797de5012
81674725-00f3-45cc-b3ab-c02b51728d22	Test	1.00	\N	t	\N	173c1964-3113-4681-ad88-363797de5012
aaf79466-3a14-44f3-b7a2-c7374551426a	Ordinateur portable	2.50	\N	t	\N	7074c653-c7ef-4754-b0ba-c377f94cdf5d
d536bb70-ed11-4199-b695-cd59eeb3faa6	Test	1.00	\N	t	\N	7074c653-c7ef-4754-b0ba-c377f94cdf5d
9efd34a6-b075-4934-aadb-a562ba744ce8	Ordinateur portable	2.50	\N	t	\N	52b29d02-a8b0-4359-8731-d636e25907ba
21b229ab-0962-45f2-a012-3d60d2c85b98	Test	1.00	\N	t	\N	52b29d02-a8b0-4359-8731-d636e25907ba
e072aab8-ceba-415d-a883-31ce11e19298	Ordinateur portable	2.50	\N	t	\N	b568244c-399f-48dd-ab75-2d166eea4dc0
1ee7297d-92f1-460c-834b-5dde64c30b22	Test	1.00	\N	t	\N	b568244c-399f-48dd-ab75-2d166eea4dc0
2a7cb5c9-8d24-4da9-bda6-fc3215207245	Ordinateur portable	2.50	\N	t	\N	ec0997a8-0032-4f39-8c9b-5ba7d003354a
b2d6104e-7c2a-44ed-b57d-2cf62f4c8098	Test	1.00	\N	t	\N	ec0997a8-0032-4f39-8c9b-5ba7d003354a
06d9bb50-2cd0-45a1-8637-473a7c913dbc	Ordinateur portable	2.50	\N	t	\N	76032b46-7dc3-4f03-9e60-17980818ba8b
cf13d088-01fe-4a41-b71b-6a01991996c5	Test	1.00	\N	t	\N	76032b46-7dc3-4f03-9e60-17980818ba8b
5cf51880-76de-4cbb-b8b9-f8cd1955f373	Ordinateur portable	2.50	\N	t	\N	4487e93e-4f19-470f-aec0-4e94d16d1b17
c3e919eb-e40a-41ca-b3c6-ff2aced392f6	Test	1.00	\N	t	\N	4487e93e-4f19-470f-aec0-4e94d16d1b17
9966a233-cab7-4809-ab8c-7bebfe5a525b	Ordinateur portable	2.50	\N	t	\N	696739c8-57aa-4ec7-83a7-83e17b2ca6bf
d3caffd0-3bd8-4e10-a269-4f3348ea4505	Test	1.00	\N	t	\N	696739c8-57aa-4ec7-83a7-83e17b2ca6bf
78c876d5-f694-403a-8a24-29e578b7d98d	Ordinateur portable	2.50	\N	t	\N	cb59b4c8-36b9-4ac2-af6c-91715430b151
36dacc9e-ec95-44c7-9b9b-a37cb87bb3b1	Test	1.00	\N	t	\N	cb59b4c8-36b9-4ac2-af6c-91715430b151
14e758fc-43a1-47b7-ac9e-72d6e7637a68	Ordinateur portable	2.50	\N	t	\N	75fd099f-62af-4fde-a566-56c0c185af75
f5c6ce75-a213-4f59-a0a2-0269d9feb398	Ordinateur portable	2.50	\N	t	\N	d776818b-ff21-42df-add9-6ebbe13b0a5a
246c291d-04eb-4b67-b12f-f1efcec3fdc5	Test	1.00	\N	t	\N	d776818b-ff21-42df-add9-6ebbe13b0a5a
380c860f-3a09-447a-b31d-e8f42305aad1	TEST	30.00	12.00	t	2.00	8107a456-4984-4445-af6a-d205c7545343
2e99ec6f-b57f-49b0-b31c-00e0022bd1fd	TEST	30.00	12.00	t	2.00	db976cd2-414a-43c0-ba35-47ee667e3826
fd39a47b-b8cb-4201-bec8-0ed951138957	TEST	30.00	12.00	t	2.00	bbdf45e5-623e-4f5f-9b33-d6d5f434a63c
3f84cddf-80d0-40cc-93d6-b5107e9d2c9f	TEST	30.00	12.00	t	2.00	29aebce3-0684-4d17-b8c2-8967f0ae61b5
490422ac-2f5c-42bf-9c27-1d539283c4c1	TEST	30.00	12.00	t	1.00	42ef48bd-cd21-4a7e-93fe-f12138832867
a242c14c-1f9b-494c-a317-84698bd7077b	Test	30.00	12.00	t	1.00	103dd427-ec37-43d8-a36d-36cea926814e
886aca71-ce9c-42ef-9e22-086956b8288a	TEST	30.00	12.00	t	2.00	1363c192-5791-4abe-b644-d7605421da2d
a8247227-fd9c-46a0-abf6-65100c322939	TEST	30.00	12.00	t	3.00	4cdaf35c-dc7d-4b39-b8e9-610cc6df9bb2
f6422657-31a2-4f59-ba08-2d428f98051d	TEST	30.00	12.00	t	3.00	83a87c89-396a-4ffd-9781-206cef14be5a
96c6c890-f8ea-47b7-b8b9-d2c2e0e8b111	TEST	30.00	12.00	t	3.00	762f380f-e993-4f02-b520-7215c48b5ed0
a1b0301c-3811-482f-aef4-88ef2f3336ad	TEST	30.00	12.00	t	3.00	79160ac8-3e47-46e3-82f8-d96a376911e0
cdfeba5f-7520-4e2b-9e97-ad5de14703d3	TEST	30.00	12.00	t	2.00	8caba19c-82a0-4326-a3c9-ea8ff2f86e1b
54c517fb-cc98-4a8a-be7e-83097f1d0006	TEST	30.00	12.00	t	2.00	0f7df91f-59ba-4f8e-826a-976136ea0bb1
9bb4767e-441a-4adc-9967-9e320bf0cc6b	TEST	30.00	12.00	t	3.00	51df84c6-ab98-4e22-b92c-277dc8df85c9
43c7b4b6-2bf5-433a-b28c-c04aa2e60e92	Truc pikachu	50.00	12.00	t	4.00	fde7b1f7-1d8f-40a4-a483-ffb392d0651b
3bc1521e-5cf6-46eb-a131-c6f41c26f194	test	30.00	11.98	t	2.00	fdb7d694-ee0b-4a6d-96ef-2105b2141add
73179fe3-6aa6-4b63-986d-fd9efbed3987	test	30.00	12.00	t	2.00	0c0a7249-ae27-45a2-bcb5-6b81be690119
09c63039-2eb2-462f-a651-8821614f1ec3	TEST	30.00	12.00	t	3.00	7191eaf9-b65c-4d99-9f47-c4886c8a59e5
93bfcc07-c753-4e4b-bf10-b904a7cf06cc	Test	50.00	12.00	f	4.00	a828b361-d48f-42d2-a416-c0fe4f1963ed
\.


--
-- Data for Name: plans; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.plans (plan_id, name, price, priority_shipping_percentage, priority_months_offered, max_insurance_coverage, extra_insurance_price, shipping_discount, permanent_discount, permanent_discount_percentage, small_package_permanent_discount, first_shipping_free, first_shipping_free_threshold, is_pro, stripe_product_id, stripe_price_id) FROM stdin;
3	Test	12.00	1.00	0	0.00	0.00	0.00	0.00	0.00	0.00	t	0.00	f	\N	price_1RNeda2Yjtdc4SmmEPGmY4ge
1	Free	0.00	2.00	0	1.00	1.00	1.00	1.00	0.00	1.00	t	1.00	t	\N	price_1RNfSu2Yjtdc4Smm0caWG5tR
2	Payant	10.00	2.00	2	1500.00	15.00	5.00	15.00	0.00	6.00	t	150.00	t	prod_S0K70mPUR03Fd3	price_1R6JTP2Yjtdc4SmmXfTnZsp4
\.


--
-- Data for Name: presta_review_responses; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.presta_review_responses (review_presta_response_id, comment, review_presta_id) FROM stdin;
dbdad86f-d18d-4ac5-96ce-1f6d87b0d754	test	f6344c91-c10f-44db-befd-98b4925fc3a6
\.


--
-- Data for Name: presta_reviews; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.presta_reviews (review_presta_id, rating, comment, appointment_id) FROM stdin;
f6344c91-c10f-44db-befd-98b4925fc3a6	4	Top	451f89f9-2912-4655-917e-885681c8a56c
50fe4556-f20d-4c75-bba4-44557c6558b9	5	Incroyable	83d59583-84e8-4138-8917-7ef4e1a489ac
c1df6c1e-1981-4ea2-a516-28a1d18d79e3	5	top	09780799-5dfa-42f1-b102-2544aec2d349
7c6724ce-b7c1-48ef-bfc9-85dcdb83451b	5	top	640e2c0f-f992-4f5d-bc9f-43985e8d909c
\.


--
-- Data for Name: provider_commissions; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.provider_commissions (provider_commission_id, value) FROM stdin;
019b46f3-18bc-4610-a8bd-ff1b75d1adb3	10.00
\.


--
-- Data for Name: provider_contracts; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.provider_contracts (provider_contract_id, company_name, siret, address, provider_id, contract_url, created_at) FROM stdin;
19686f14-15fd-49d4-9f39-e08d6c572567	Landtales	78423	12 rue du petit pois	b3b90eb4-033e-4c8c-b056-c8e3d9120db8	provider/78423/contracts/contract-b3b90eb4-033e-4c8c-b056-c8e3d9120db8.pdf	2025-05-29 13:06:15.286288
73fa6584-9fa1-4c5c-9612-83458d79675e	tes	12345678912346	12 Bis Rue du Bois St Maur	e8bb9a20-c223-4dec-a682-6dd6b5817222	provider/12345678912346/contracts/contract-e8bb9a20-c223-4dec-a682-6dd6b5817222.pdf	2025-05-29 13:06:15.286288
\.


--
-- Data for Name: provider_documents; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.provider_documents (provider_documents_id, name, description, submission_date, provider_document_url, provider_id) FROM stdin;
e398999f-0aea-496c-b769-61c6a0600f7e	test.pdf	\N	2025-03-25 22:58:27.346541	provider/78423/documents/test.pdf	b3b90eb4-033e-4c8c-b056-c8e3d9120db8
fddfcadd-7bf3-44c1-8c82-5be7e7915c16	test.jpg	\N	2025-03-25 22:58:27.37636	provider/78423/documents/test.jpg	b3b90eb4-033e-4c8c-b056-c8e3d9120db8
0da8410a-af13-42ed-a7a3-0271e4bf03c5	test.png	\N	2025-03-25 22:58:27.406166	provider/78423/documents/test.png	b3b90eb4-033e-4c8c-b056-c8e3d9120db8
55603f97-26d9-4e8a-8d2e-e7955df33e75	test.jpeg	\N	2025-04-05 14:11:53.705865	provider/12345678912346/documents/test.jpeg	e8bb9a20-c223-4dec-a682-6dd6b5817222
8038d069-61d6-4f83-9ec2-7283e61ffc0f	Test	Test	2025-04-15 14:03:41.135255	e8bb9a20-c223-4dec-a682-6dd6b5817222/documents/Test	e8bb9a20-c223-4dec-a682-6dd6b5817222
fd537b1b-590b-46cf-8378-d2860e9b695c	Test33	Testest	2025-04-15 14:13:42.617063	e8bb9a20-c223-4dec-a682-6dd6b5817222/documents/Test33	e8bb9a20-c223-4dec-a682-6dd6b5817222
3b40fad3-b9ab-43bb-b797-4d9d9b263b1a	test2	test	2025-04-27 18:46:34.28983	e8bb9a20-c223-4dec-a682-6dd6b5817222/documents/test2	e8bb9a20-c223-4dec-a682-6dd6b5817222
\.


--
-- Data for Name: provider_keywords; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.provider_keywords (provider_keyword_id, service_id) FROM stdin;
c7c65ad4-ddcb-493f-b0a9-a7fe2d91de37	6a402a28-ed1b-4cc6-af19-05ce0a5a17e9
34b2769f-d4fe-4959-828b-778b12fdf68d	0a036859-4a58-47e3-8eed-70def46b2b64
a32268ca-4e88-4d2b-8eb4-2b2f5da5985f	0a036859-4a58-47e3-8eed-70def46b2b64
34b2769f-d4fe-4959-828b-778b12fdf68d	bf546ea4-9eec-4736-82cd-5ca4798e9526
a32268ca-4e88-4d2b-8eb4-2b2f5da5985f	bf546ea4-9eec-4736-82cd-5ca4798e9526
219befb9-9183-4185-88b8-0d7809502103	97d39475-aac1-4450-8a52-87ac8cdf0699
99fd68bb-ffb3-48ce-bbac-6f47b6068e9e	97d39475-aac1-4450-8a52-87ac8cdf0699
2efa3d07-a688-4551-b37e-6d3e221bb190	4f281703-5b45-48ab-a45e-d1d05f9bbed5
\.


--
-- Data for Name: provider_keywords_list; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.provider_keywords_list (provider_keyword_id, keyword) FROM stdin;
c7c65ad4-ddcb-493f-b0a9-a7fe2d91de37	Test1
b98e08da-9351-43c6-b67b-ff461947aa21	Test2
34b2769f-d4fe-4959-828b-778b12fdf68d	Test
a32268ca-4e88-4d2b-8eb4-2b2f5da5985f	coucou
219befb9-9183-4185-88b8-0d7809502103	Chef
99fd68bb-ffb3-48ce-bbac-6f47b6068e9e	126
2efa3d07-a688-4551-b37e-6d3e221bb190	etes
\.


--
-- Data for Name: providers; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.providers (provider_id, company_name, siret, address, service_type, stripe_transfer_id, description, postal_code, city, country, phone, validated, user_id, admin_id, first_name, last_name, balance) FROM stdin;
b3b90eb4-033e-4c8c-b056-c8e3d9120db8	Landtales	78423	12 rue du petit pois	Voyages	\N	C'est moi	75012	Paris	France	123456789	\N	5f0a90e1-321b-4a36-88ad-6c414a0dd091	\N	Rémy	THIBAUT	10.00
e8bb9a20-c223-4dec-a682-6dd6b5817222	tes	12345678912346	12 Bis Rue du Bois St Maur	agriculture	acct_1RMUaGFackEIgyDY	test	77210	Samoreau	Andorra	0768932201	t	93ee1b03-4f1b-4805-bd2e-efba5f871896	d6733392-f759-44a2-8a15-32d9cdbf9b11	Rémy	THIBAUT	0.00
\.


--
-- Data for Name: reports; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.reports (report_id, status, report_message, state, user_id) FROM stdin;
f08f71dd-aff1-47e3-b646-70bb34a9501d	pending	<p class="text-node">test</p>	new	93ee1b03-4f1b-4805-bd2e-efba5f871896
19a1e054-e208-4921-86dc-ffc35c722f2b	pending	<b>Test</b>	new	86eea5f4-37e1-4a80-98b1-fef236e3a44a
5f29988f-0ebf-4e02-b525-ce8b99f6ccc9	pending	<i>Test</i> <b>test</b>	new	86eea5f4-37e1-4a80-98b1-fef236e3a44a
a9d1c134-8e0f-42a2-846c-6fbbaa0a6816	pending	Test	new	86eea5f4-37e1-4a80-98b1-fef236e3a44a
24c7fef1-8b52-4394-a718-346216b27286	pending	<ul><li>Werwer</li><li>Werwerwer</li><li>Werwerw</li></ul><div>Werwer</div><div><br></div><div><br></div><h1>werwerwerwe</h1><div><br></div><h2>werwe</h2>	new	86eea5f4-37e1-4a80-98b1-fef236e3a44a
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.roles (role_id, admin_id) FROM stdin;
03e90c3d-b951-4505-bad5-aed403ba0fa1	d6733392-f759-44a2-8a15-32d9cdbf9b11
36822d58-9130-413b-a82f-de942554708c	d6733392-f759-44a2-8a15-32d9cdbf9b11
36822d58-9130-413b-a82f-de942554708c	d3088a02-1918-4ff8-85c5-cab6cf7052b3
f01110a6-7035-4c80-9bbe-9dfcb9c33995	d6733392-f759-44a2-8a15-32d9cdbf9b11
e9e28830-c7dc-44dc-8969-c7946f680155	d6733392-f759-44a2-8a15-32d9cdbf9b11
29652dd9-78b4-4f24-80a8-614abdb1f034	5f1143c5-e5cc-4ab3-8159-e1c016e55bff
72652a4f-85f2-4254-99db-1535f20d9b47	5f1143c5-e5cc-4ab3-8159-e1c016e55bff
f01110a6-7035-4c80-9bbe-9dfcb9c33995	5f1143c5-e5cc-4ab3-8159-e1c016e55bff
e9e28830-c7dc-44dc-8969-c7946f680155	5f1143c5-e5cc-4ab3-8159-e1c016e55bff
33106a0f-ab23-4bbb-aee3-6f87935f369d	d6733392-f759-44a2-8a15-32d9cdbf9b11
72652a4f-85f2-4254-99db-1535f20d9b47	d6733392-f759-44a2-8a15-32d9cdbf9b11
03e90c3d-b951-4505-bad5-aed403ba0fa1	35cd4423-c198-4478-b95b-846758d03e2d
36822d58-9130-413b-a82f-de942554708c	35cd4423-c198-4478-b95b-846758d03e2d
29652dd9-78b4-4f24-80a8-614abdb1f034	35cd4423-c198-4478-b95b-846758d03e2d
03e90c3d-b951-4505-bad5-aed403ba0fa1	06ae5d85-6a2d-40e3-8e13-74f9d97d73a4
36822d58-9130-413b-a82f-de942554708c	06ae5d85-6a2d-40e3-8e13-74f9d97d73a4
f01110a6-7035-4c80-9bbe-9dfcb9c33995	06ae5d85-6a2d-40e3-8e13-74f9d97d73a4
\.


--
-- Data for Name: roles_list; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.roles_list (role_id, role_name) FROM stdin;
03e90c3d-b951-4505-bad5-aed403ba0fa1	MAIL
36822d58-9130-413b-a82f-de942554708c	TICKET
29652dd9-78b4-4f24-80a8-614abdb1f034	MERCHANT
72652a4f-85f2-4254-99db-1535f20d9b47	DELIVERY
f01110a6-7035-4c80-9bbe-9dfcb9c33995	PROVIDER
33106a0f-ab23-4bbb-aee3-6f87935f369d	LANGUAGE
e9e28830-c7dc-44dc-8969-c7946f680155	FINANCE
\.


--
-- Data for Name: sectors; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.sectors (sector_id, name) FROM stdin;
\.


--
-- Data for Name: service_images; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.service_images (image_service_id, image_service_url, service_id) FROM stdin;
e90fa765-400a-484e-a31d-638f1421dce9	img.jpg	6a402a28-ed1b-4cc6-af19-05ce0a5a17e9
e86baa2e-2dd8-43e5-99fa-b772bb7dfbfd	img.jpg	4f281703-5b45-48ab-a45e-d1d05f9bbed5
cefc3b10-9d57-40c4-804f-472a2ab4ee71	img.jpg	bf546ea4-9eec-4736-82cd-5ca4798e9526
885c4097-2a38-4cf4-809b-cfd2d5198b27	img.jpg	97d39475-aac1-4450-8a52-87ac8cdf0699
d5548a9a-2e7a-4d70-b232-018293c06b86	img.jpg	97d39475-aac1-4450-8a52-87ac8cdf0699
693ee7c4-6897-4419-86f1-374c2c81826b	img.jpg	9b899f71-31b3-40dd-90e2-80de2cf262fd
65e265e6-a3eb-45c7-8322-738309c64170	img.jpg	9b899f71-31b3-40dd-90e2-80de2cf262fd
1c3fced9-34ec-4a5e-8cb0-4af265033b2e	img.jpg	bf546ea4-9eec-4736-82cd-5ca4798e9526
0c8417f8-b355-4e2a-a136-e4137a89b55e	img.jpg	0a036859-4a58-47e3-8eed-70def46b2b64
e4c462ef-914b-4e70-9e7b-8940f6489df0	img.jpg	0a036859-4a58-47e3-8eed-70def46b2b64
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.services (service_id, provider_id) FROM stdin;
9b899f71-31b3-40dd-90e2-80de2cf262fd	e8bb9a20-c223-4dec-a682-6dd6b5817222
0a036859-4a58-47e3-8eed-70def46b2b64	e8bb9a20-c223-4dec-a682-6dd6b5817222
bf546ea4-9eec-4736-82cd-5ca4798e9526	e8bb9a20-c223-4dec-a682-6dd6b5817222
97d39475-aac1-4450-8a52-87ac8cdf0699	e8bb9a20-c223-4dec-a682-6dd6b5817222
6a402a28-ed1b-4cc6-af19-05ce0a5a17e9	e8bb9a20-c223-4dec-a682-6dd6b5817222
\.


--
-- Data for Name: services_list; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.services_list (service_id, service_type, status, validated, name, description, city, admin_id, price, duration_minute, available, price_admin) FROM stdin;
6a402a28-ed1b-4cc6-af19-05ce0a5a17e9	test	going	t	Promenade	test	Paris	\N	59.99	60	t	12.00
4f281703-5b45-48ab-a45e-d1d05f9bbed5	test	pending	f	test	testetetetetetetet	Paris	\N	12.00	12	t	\N
0a036859-4a58-47e3-8eed-70def46b2b64	Test	active	f	Test Test	Ceci est un test	Paris	\N	49.99	60	t	\N
9b899f71-31b3-40dd-90e2-80de2cf262fd	Test	active	f	Test Test	Ceci est un test	Paris	\N	49.99	60	t	\N
97d39475-aac1-4450-8a52-87ac8cdf0699	test	pending	t	test	Tetsetetetettetetet	Paris	\N	112.00	1112	t	\N
bf546ea4-9eec-4736-82cd-5ca4798e9526	Test	active	t	Test Test	Ceci est un test	Paris	d6733392-f759-44a2-8a15-32d9cdbf9b11	49.99	60	t	\N
\.


--
-- Data for Name: shipments; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.shipments (shipment_id, description, estimated_total_price, proposed_delivery_price, weight, volume, deadline_date, time_slot, urgent, status, image, views, departure_city, arrival_city, departure_location, arrival_location, user_id, delivery_mail, trolleydrop, arrival_address, departure_address, arrival_postal, departure_postal, arrival_handling, departure_handling, floor_departure_handling, elevator_departure, floor_arrival_handling, elevator_arrival) FROM stdin;
4487e93e-4f19-470f-aec0-4e94d16d1b17	Fer à repasser	12.00	NaN	10.00	0.00	\N	\N	f	validated	https://blog-media.but.fr/wp-content/uploads/2023/06/05-quel-fer-a-repasser-prendre.jpg	0	Paris	Lyon	0101000020E6100000A835CD3B4ED1024076E09C11A56D4840	0101000020E61000009D11A5BDC15713406F1283C0CAE14640	bafb8fd4-899e-40c2-ba4e-9184ed8c852f	\N	f	\N	\N	\N	\N	f	f	0	f	0	f
696739c8-57aa-4ec7-83a7-83e17b2ca6bf	Fer à repasser	12.00	NaN	10.00	0.00	\N	\N	f	\N	https://blog-media.but.fr/wp-content/uploads/2023/06/05-quel-fer-a-repasser-prendre.jpg	0	Paris	Lyon	0101000020E6100000A835CD3B4ED1024076E09C11A56D4840	0101000020E61000009D11A5BDC15713406F1283C0CAE14640	bafb8fd4-899e-40c2-ba4e-9184ed8c852f	\N	f	\N	\N	\N	\N	f	f	0	f	0	f
cb59b4c8-36b9-4ac2-af6c-91715430b151	Fer à repasser	12.00	NaN	10.00	0.00	\N	\N	f	\N	https://blog-media.but.fr/wp-content/uploads/2023/06/05-quel-fer-a-repasser-prendre.jpg	0	Paris	Lyon	0101000020E6100000A835CD3B4ED1024076E09C11A56D4840	0101000020E61000009D11A5BDC15713406F1283C0CAE14640	bafb8fd4-899e-40c2-ba4e-9184ed8c852f	\N	f	\N	\N	\N	\N	f	f	0	f	0	f
75fd099f-62af-4fde-a566-56c0c185af75	Fer à repasser	12.00	NaN	10.00	0.00	\N	\N	f	\N	https://blog-media.but.fr/wp-content/uploads/2023/06/05-quel-fer-a-repasser-prendre.jpg	0	Paris	Lyon	0101000020E6100000A835CD3B4ED1024076E09C11A56D4840	0101000020E61000009D11A5BDC15713406F1283C0CAE14640	bafb8fd4-899e-40c2-ba4e-9184ed8c852f	\N	f	\N	\N	\N	\N	f	f	0	f	0	f
d776818b-ff21-42df-add9-6ebbe13b0a5a	Fer à repasser	12.00	NaN	10.00	0.00	\N	\N	f	\N	https://blog-media.but.fr/wp-content/uploads/2023/06/05-quel-fer-a-repasser-prendre.jpg	0	Paris	Lyon	0101000020E6100000A835CD3B4ED1024076E09C11A56D4840	0101000020E61000009D11A5BDC15713406F1283C0CAE14640	bafb8fd4-899e-40c2-ba4e-9184ed8c852f	\N	f	\N	\N	\N	\N	f	f	0	f	0	f
f6c15bf8-9d47-41f8-bb54-fee56d450094	Fer à repasser	10.00	\N	10.00	0.00	\N	\N	f	\N	https://blog-media.but.fr/wp-content/uploads/2023/06/05-quel-fer-a-repasser-prendre.jpg	0	Paris	Lyon	0101000020E6100000A835CD3B4ED1024076E09C11A56D4840	0101000020E61000009D11A5BDC15713406F1283C0CAE14640	bafb8fd4-899e-40c2-ba4e-9184ed8c852f	\N	f	\N	\N	\N	\N	f	f	0	f	0	f
756f5cdb-9200-4677-b630-6b7df0704411	Fer à repasser	10.00	\N	10.00	0.00	\N	\N	f	\N	https://blog-media.but.fr/wp-content/uploads/2023/06/05-quel-fer-a-repasser-prendre.jpg	0	Paris	Lyon	0101000020E6100000A835CD3B4ED1024076E09C11A56D4840	0101000020E61000009D11A5BDC15713406F1283C0CAE14640	bafb8fd4-899e-40c2-ba4e-9184ed8c852f	\N	f	\N	\N	\N	\N	f	f	0	f	0	f
5a3aa52c-e927-473b-8be8-483cf8e794f8	Fer à repasser	10.00	\N	10.00	0.00	\N	\N	f	\N	https://blog-media.but.fr/wp-content/uploads/2023/06/05-quel-fer-a-repasser-prendre.jpg	0	Paris	Lyon	0101000020E6100000A835CD3B4ED1024076E09C11A56D4840	0101000020E61000009D11A5BDC15713406F1283C0CAE14640	bafb8fd4-899e-40c2-ba4e-9184ed8c852f	\N	f	\N	\N	\N	\N	f	f	0	f	0	f
c14a4715-ecec-480e-9eea-9ac5bf01816d	Fer à repasser	10.00	\N	10.00	0.00	\N	\N	f	\N	https://blog-media.but.fr/wp-content/uploads/2023/06/05-quel-fer-a-repasser-prendre.jpg	0	Paris	Lyon	0101000020E6100000A835CD3B4ED1024076E09C11A56D4840	0101000020E61000009D11A5BDC15713406F1283C0CAE14640	bafb8fd4-899e-40c2-ba4e-9184ed8c852f	\N	f	\N	\N	\N	\N	f	f	0	f	0	f
aef41082-ab8f-4184-a14d-173a2ab009b9	Fer à repasser	10.00	\N	10.00	0.00	\N	\N	f	\N	https://blog-media.but.fr/wp-content/uploads/2023/06/05-quel-fer-a-repasser-prendre.jpg	0	Paris	Lyon	0101000020E6100000A835CD3B4ED1024076E09C11A56D4840	0101000020E61000009D11A5BDC15713406F1283C0CAE14640	bafb8fd4-899e-40c2-ba4e-9184ed8c852f	\N	f	\N	\N	\N	\N	f	f	0	f	0	f
173c1964-3113-4681-ad88-363797de5012	Fer à repasser	10.00	\N	10.00	0.00	\N	\N	f	\N	https://blog-media.but.fr/wp-content/uploads/2023/06/05-quel-fer-a-repasser-prendre.jpg	0	Paris	Lyon	0101000020E6100000A835CD3B4ED1024076E09C11A56D4840	0101000020E61000009D11A5BDC15713406F1283C0CAE14640	bafb8fd4-899e-40c2-ba4e-9184ed8c852f	\N	f	\N	\N	\N	\N	f	f	0	f	0	f
7074c653-c7ef-4754-b0ba-c377f94cdf5d	Fer à repasser	10.00	\N	10.00	0.00	\N	\N	f	\N	https://blog-media.but.fr/wp-content/uploads/2023/06/05-quel-fer-a-repasser-prendre.jpg	0	Paris	Lyon	0101000020E6100000A835CD3B4ED1024076E09C11A56D4840	0101000020E61000009D11A5BDC15713406F1283C0CAE14640	bafb8fd4-899e-40c2-ba4e-9184ed8c852f	\N	f	\N	\N	\N	\N	f	f	0	f	0	f
52b29d02-a8b0-4359-8731-d636e25907ba	Fer à repasser	10.00	\N	10.00	0.00	\N	\N	f	\N	https://blog-media.but.fr/wp-content/uploads/2023/06/05-quel-fer-a-repasser-prendre.jpg	0	Paris	Lyon	0101000020E6100000A835CD3B4ED1024076E09C11A56D4840	0101000020E61000009D11A5BDC15713406F1283C0CAE14640	bafb8fd4-899e-40c2-ba4e-9184ed8c852f	\N	f	\N	\N	\N	\N	f	f	0	f	0	f
b568244c-399f-48dd-ab75-2d166eea4dc0	Fer à repasser	10.00	\N	10.00	0.00	\N	\N	f	\N	https://blog-media.but.fr/wp-content/uploads/2023/06/05-quel-fer-a-repasser-prendre.jpg	0	Paris	Lyon	0101000020E6100000A835CD3B4ED1024076E09C11A56D4840	0101000020E61000009D11A5BDC15713406F1283C0CAE14640	bafb8fd4-899e-40c2-ba4e-9184ed8c852f	\N	f	\N	\N	\N	\N	f	f	0	f	0	f
ec0997a8-0032-4f39-8c9b-5ba7d003354a	Fer à repasser	10.00	\N	10.00	0.00	\N	\N	f	\N	https://blog-media.but.fr/wp-content/uploads/2023/06/05-quel-fer-a-repasser-prendre.jpg	0	Paris	Lyon	0101000020E6100000A835CD3B4ED1024076E09C11A56D4840	0101000020E61000009D11A5BDC15713406F1283C0CAE14640	bafb8fd4-899e-40c2-ba4e-9184ed8c852f	\N	f	\N	\N	\N	\N	f	f	0	f	0	f
76032b46-7dc3-4f03-9e60-17980818ba8b	Fer à repasser	10.00	\N	10.00	0.00	\N	\N	f	\N	https://blog-media.but.fr/wp-content/uploads/2023/06/05-quel-fer-a-repasser-prendre.jpg	0	Paris	Lyon	0101000020E6100000A835CD3B4ED1024076E09C11A56D4840	0101000020E61000009D11A5BDC15713406F1283C0CAE14640	bafb8fd4-899e-40c2-ba4e-9184ed8c852f	\N	f	\N	\N	\N	\N	f	f	0	f	0	f
47de72d0-3ef6-4c12-8e74-16553d59c430	Fer à repasser	10.00	\N	10.00	0.00	\N	\N	f	\N	https://blog-media.but.fr/wp-content/uploads/2023/06/05-quel-fer-a-repasser-prendre.jpg	0	Paris	Lyon	0101000020E6100000A835CD3B4ED1024076E09C11A56D4840	0101000020E61000009D11A5BDC15713406F1283C0CAE14640	bafb8fd4-899e-40c2-ba4e-9184ed8c852f	amphinoman@gmail.com	f	\N	\N	\N	\N	f	f	0	f	0	f
37b6791d-451d-407a-86c8-8d4412c63a74	Fer à repasser	10.00	\N	10.00	0.00	\N	\N	f	\N	https://blog-media.but.fr/wp-content/uploads/2023/06/05-quel-fer-a-repasser-prendre.jpg	0	Paris	Lyon	0101000020E6100000A835CD3B4ED1024076E09C11A56D4840	0101000020E61000009D11A5BDC15713406F1283C0CAE14640	bafb8fd4-899e-40c2-ba4e-9184ed8c852f	\N	f	\N	\N	\N	\N	f	f	0	f	0	f
fde7b1f7-1d8f-40a4-a483-ffb392d0651b	Test 15	12.00	NaN	50.00	4.00	2025-05-15 02:00:00	\N	t	pending	https://static.vecteezy.com/ti/vecteur-libre/p1/5720408-icone-image-croisee-image-non-disponible-supprimer-symbole-vecteur-image-gratuit-vectoriel.jpg	0	Samoreau	Samoreau	0101000020E6100000B3EF8AE07F0B0640713AC95697354840	0101000020E6100000B3EF8AE07F0B0640713AC95697354840	58415527-2e7e-4289-a24b-a0c70ff5b6b7	amphinoman@gmail.com	t	\N	\N	\N	\N	f	f	0	f	0	f
db976cd2-414a-43c0-ba35-47ee667e3826	test	12.00	NaN	30.00	2.00	2025-04-09 00:00:00	\N	f	pending	\N	0	Samoreau	Samoreau	0101000020E6100000B3EF8AE07F0B0640713AC95697354840	0101000020E6100000B3EF8AE07F0B0640713AC95697354840	86eea5f4-37e1-4a80-98b1-fef236e3a44a	\N	f	\N	\N	\N	\N	f	f	0	f	0	f
bbdf45e5-623e-4f5f-9b33-d6d5f434a63c	test	12.00	NaN	30.00	2.00	2025-04-09 00:00:00	\N	f	pending	\N	0	Samoreau	Samoreau	0101000020E6100000B3EF8AE07F0B0640713AC95697354840	0101000020E6100000B3EF8AE07F0B0640713AC95697354840	86eea5f4-37e1-4a80-98b1-fef236e3a44a	\N	f	\N	\N	\N	\N	f	f	0	f	0	f
29aebce3-0684-4d17-b8c2-8967f0ae61b5	test	12.00	NaN	30.00	2.00	2001-02-01 00:00:00	\N	f	pending	\N	0	Samoreau	Samoreau	0101000020E6100000B3EF8AE07F0B0640713AC95697354840	0101000020E6100000B3EF8AE07F0B0640713AC95697354840	86eea5f4-37e1-4a80-98b1-fef236e3a44a	\N	f	\N	\N	\N	\N	f	f	0	f	0	f
42ef48bd-cd21-4a7e-93fe-f12138832867	test	12.00	NaN	30.00	1.00	2001-02-01 00:00:00	\N	f	pending	\N	0	Samoreau	Samoreau	0101000020E6100000B3EF8AE07F0B0640713AC95697354840	0101000020E6100000B3EF8AE07F0B0640713AC95697354840	86eea5f4-37e1-4a80-98b1-fef236e3a44a	\N	f	\N	\N	\N	\N	f	f	0	f	0	f
1363c192-5791-4abe-b644-d7605421da2d	Test	12.00	NaN	30.00	2.00	2001-02-01 00:00:00	\N	t	pending	https://static.vecteezy.com/ti/vecteur-libre/p1/5720408-icone-image-croisee-image-non-disponible-supprimer-symbole-vecteur-image-gratuit-vectoriel.jpg	0	Samoreau	Samoreau	0101000020E6100000B3EF8AE07F0B0640713AC95697354840	0101000020E6100000B3EF8AE07F0B0640713AC95697354840	86eea5f4-37e1-4a80-98b1-fef236e3a44a	amphinoman@gmail.com	f	\N	\N	\N	\N	f	f	0	f	0	f
8107a456-4984-4445-af6a-d205c7545343	test	12.00	NaN	30.00	2.00	2025-04-09 00:00:00	\N	f	validated	\N	0	Samoreau	Samoreau	0101000020E610000000000000000000000000000000000000	0101000020E610000000000000000000000000000000000000	86eea5f4-37e1-4a80-98b1-fef236e3a44a	\N	f	\N	\N	\N	\N	f	f	0	f	0	f
103dd427-ec37-43d8-a36d-36cea926814e	Livraison Test	12.00	NaN	30.00	1.00	2001-02-01 00:00:00	\N	t	validated	https://static.vecteezy.com/ti/vecteur-libre/p1/5720408-icone-image-croisee-image-non-disponible-supprimer-symbole-vecteur-image-gratuit-vectoriel.jpg	0	Samoreau	Samoreau	0101000020E6100000B3EF8AE07F0B0640713AC95697354840	0101000020E6100000B3EF8AE07F0B0640713AC95697354840	cad292f7-56e2-4622-b5fd-6693f142efb5	amphinoman@gmail.com	f	\N	\N	\N	\N	f	f	0	f	0	f
4cdaf35c-dc7d-4b39-b8e9-610cc6df9bb2	Livraison Test 2	12.00	NaN	30.00	3.00	2001-02-01 00:00:00	\N	t	pending	https://static.vecteezy.com/ti/vecteur-libre/p1/5720408-icone-image-croisee-image-non-disponible-supprimer-symbole-vecteur-image-gratuit-vectoriel.jpg	0	Samoreau	Paris	0101000020E6100000B3EF8AE07F0B0640713AC95697354840	0101000020E6100000B97768B345AD024096EF7442436F4840	86eea5f4-37e1-4a80-98b1-fef236e3a44a	amphinoman@gmail.com	f	\N	\N	\N	\N	f	f	0	f	0	f
83a87c89-396a-4ffd-9781-206cef14be5a	Test 3	12.00	NaN	30.00	3.00	2001-02-01 00:00:00	\N	f	pending	https://static.vecteezy.com/ti/vecteur-libre/p1/5720408-icone-image-croisee-image-non-disponible-supprimer-symbole-vecteur-image-gratuit-vectoriel.jpg	0	Samoreau	Paris	0101000020E6100000B3EF8AE07F0B0640713AC95697354840	0101000020E6100000B97768B345AD024096EF7442436F4840	cad292f7-56e2-4622-b5fd-6693f142efb5	amphinoman@gmail.com	f	\N	\N	\N	\N	f	f	0	f	0	f
79160ac8-3e47-46e3-82f8-d96a376911e0	Test 67	12.00	NaN	30.00	3.00	2001-02-01 00:00:00	\N	t	pending	https://static.vecteezy.com/ti/vecteur-libre/p1/5720408-icone-image-croisee-image-non-disponible-supprimer-symbole-vecteur-image-gratuit-vectoriel.jpg	0	Samoreau	Samoreau	0101000020E6100000B3EF8AE07F0B0640713AC95697354840	0101000020E6100000B3EF8AE07F0B0640713AC95697354840	58415527-2e7e-4289-a24b-a0c70ff5b6b7	amphinoman@gmail.com	f	\N	\N	\N	\N	f	f	0	f	0	f
8caba19c-82a0-4326-a3c9-ea8ff2f86e1b	Expédition	0.00	NaN	30.00	2.00	2025-05-07 00:00:00	\N	f	pending	https://static.vecteezy.com/ti/vecteur-libre/p1/5720408-icone-image-croisee-image-non-disponible-supprimer-symbole-vecteur-image-gratuit-vectoriel.jpg	0	Samoreau	Samoreau	0101000020E6100000B3EF8AE07F0B0640713AC95697354840	0101000020E6100000B3EF8AE07F0B0640713AC95697354840	58415527-2e7e-4289-a24b-a0c70ff5b6b7	amphinoman@gmail.com	f	\N	\N	\N	\N	f	f	0	f	0	f
0f7df91f-59ba-4f8e-826a-976136ea0bb1	Test	12.00	NaN	30.00	2.00	2025-05-16 02:00:00	\N	t	pending	https://static.vecteezy.com/ti/vecteur-libre/p1/5720408-icone-image-croisee-image-non-disponible-supprimer-symbole-vecteur-image-gratuit-vectoriel.jpg	0	Samoreau	Samoreau	0101000020E6100000B3EF8AE07F0B0640713AC95697354840	0101000020E6100000B3EF8AE07F0B0640713AC95697354840	58415527-2e7e-4289-a24b-a0c70ff5b6b7	amphinoman@gmail.com	f	\N	\N	\N	\N	f	f	0	f	0	f
51df84c6-ab98-4e22-b92c-277dc8df85c9	Test 45	15.00	NaN	30.00	3.00	2025-05-22 02:00:00	\N	t	pending	shipments/51df84c6-ab98-4e22-b92c-277dc8df85c9/d8037e11-2c02-4d0d-bb28-63aca4f4dd35.png	0	Samoreau	Samoreau	0101000020E6100000B3EF8AE07F0B0640713AC95697354840	0101000020E6100000B3EF8AE07F0B0640713AC95697354840	58415527-2e7e-4289-a24b-a0c70ff5b6b7	amphinoman@gmail.com	f	\N	\N	\N	\N	f	f	0	f	0	f
762f380f-e993-4f02-b520-7215c48b5ed0	Test 4	15.00	NaN	30.00	3.00	2001-02-01 00:00:00	\N	t	pending	shipments/51df84c6-ab98-4e22-b92c-277dc8df85c9/d8037e11-2c02-4d0d-bb28-63aca4f4dd35.png	0	Samoreau	Samoreau	0101000020E6100000B3EF8AE07F0B0640713AC95697354840	0101000020E6100000B3EF8AE07F0B0640713AC95697354840	86eea5f4-37e1-4a80-98b1-fef236e3a44a	amphinoman@gmail.com	f	\N	\N	\N	\N	f	f	0	f	0	f
fdb7d694-ee0b-4a6d-96ef-2105b2141add	Envoie de colis	15.00	NaN	30.00	2.00	2025-05-23 00:00:00	\N	f	pending	https://static.vecteezy.com/ti/vecteur-libre/p1/5720408-icone-image-croisee-image-non-disponible-supprimer-symbole-vecteur-image-gratuit-vectoriel.jpg	0	Samoreau	Samoreau	0101000020E6100000B3EF8AE07F0B0640713AC95697354840	0101000020E6100000B3EF8AE07F0B0640713AC95697354840	58415527-2e7e-4289-a24b-a0c70ff5b6b7	amphinoman@gmail.com	f	\N	\N	\N	\N	f	f	0	f	0	f
0c0a7249-ae27-45a2-bcb5-6b81be690119	Test34	12.00	NaN	30.00	2.00	2025-05-23 00:00:00	\N	t	pending	https://static.vecteezy.com/ti/vecteur-libre/p1/5720408-icone-image-croisee-image-non-disponible-supprimer-symbole-vecteur-image-gratuit-vectoriel.jpg	0	Samoreau	Samoreau	0101000020E6100000B3EF8AE07F0B0640713AC95697354840	0101000020E6100000B3EF8AE07F0B0640713AC95697354840	86eea5f4-37e1-4a80-98b1-fef236e3a44a	amphinoman@gmail.com	f	\N	\N	\N	\N	f	f	0	f	0	f
7191eaf9-b65c-4d99-9f47-c4886c8a59e5	test	12.00	NaN	30.00	3.00	2025-05-22 02:00:00	\N	f	pending	shipments/7191eaf9-b65c-4d99-9f47-c4886c8a59e5/51feb59f-62b8-4b51-8f2b-c7c84d477e13.png	0	Samoreau	Samoreau	0101000020E610000053FFC5D8AE050640C5ED2B6A8B354840	0101000020E6100000B3EF8AE07F0B0640713AC95697354840	58415527-2e7e-4289-a24b-a0c70ff5b6b7	amphinoman@gmail.com	t	12 Bis Rue du Bois St Maur	12 Bis Rue du Bois St Maur	77210	77210	f	f	0	f	0	f
a828b361-d48f-42d2-a416-c0fe4f1963ed	15	60.00	NaN	50.00	4.00	2025-05-23 02:00:00	\N	t	validated	shipments/a828b361-d48f-42d2-a416-c0fe4f1963ed/e55e319e-ddbc-409c-a6a9-6f0191b682fe.png	0	Samoreau	Samoreau	0101000020E6100000B3EF8AE07F0B0640713AC95697354840	0101000020E6100000B3EF8AE07F0B0640713AC95697354840	58415527-2e7e-4289-a24b-a0c70ff5b6b7	magnaswingthebest@gmail.com	f	12 Bis Rue du Bois St Maur	12 Bis Rue du Bois St Maur	77210	77210	t	t	2	t	0	t
\.


--
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM stdin;
\.


--
-- Data for Name: stores; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.stores (shipment_id, exchange_point_id, step, start_date, end_date) FROM stdin;
103dd427-ec37-43d8-a36d-36cea926814e	e409a04e-9508-4e69-a5b5-97b4d12c590a	1	2001-02-01 00:00:00	2025-05-02 00:00:00
4cdaf35c-dc7d-4b39-b8e9-610cc6df9bb2	583ca190-5c09-4075-a6ee-b6c9180d22e3	1	2001-02-01 00:00:00	2025-05-09 00:00:00
83a87c89-396a-4ffd-9781-206cef14be5a	545572b8-9b2a-4173-ab7b-6003f472a120	1	2001-02-01 00:00:00	2025-05-22 00:00:00
762f380f-e993-4f02-b520-7215c48b5ed0	94620972-9fd3-4af5-afd9-36f5395069fe	1	2001-02-01 00:00:00	2025-05-24 00:00:00
762f380f-e993-4f02-b520-7215c48b5ed0	770b9244-9b18-47ae-987c-e70752e65c95	2	2025-05-24 00:00:00	2025-05-28 12:00:00
fdb7d694-ee0b-4a6d-96ef-2105b2141add	1c9bf507-22fe-4c36-ab9e-fb7017a12d6c	1	2025-05-23 00:00:00	2025-05-28 12:00:00
fdb7d694-ee0b-4a6d-96ef-2105b2141add	53fdf2a4-71c0-4cbc-b4f2-ce4fd0c15736	2	2025-05-28 12:00:00	2025-05-28 12:00:00
\.


--
-- Data for Name: subscription_transactions; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.subscription_transactions (transaction_id, subscription_id, month, year, price_at_transaction, invoice_url, created_at) FROM stdin;
24898957-0532-44da-8bb7-cabe814182c7	5f6f987d-e301-4fe3-b1d9-23a3406a9603	10	2024	10.00	test	2024-11-13 20:01:59
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.subscriptions (subscription_id, stripe_customer_id, stripe_subscription_id, status, start_date, end_date, cancellation_date, user_id, plan_id, first_shipping_free_taken) FROM stdin;
b0309a71-2f71-424f-81dd-ecd9fda24298	cus_S0hqxJaANtzEHx	sub_1R6gRF2Yjtdc4SmmLhR7LxC5	active	2025-03-25 23:59:17	2025-04-26 00:59:17	\N	e3b78347-2939-4a7d-b65d-483c27a3073b	2	f
00ca9cde-4766-4af9-bd69-030d47ddc129	cus_S5MRFJZAIjb5lv	sub_1RBBih2Yjtdc4SmmIUb8gc59	active	2025-04-07 09:11:55	2025-05-07 09:11:55	\N	4003a1a8-2a5d-4d48-bbf2-81795ca42da4	2	f
d2f1800d-c36c-44c7-9929-6e56bf268891	cus_S0hrfI5cHS5hvk	sub_1R6gRY2Yjtdc4Smmlgf3Alxj	active	2025-03-25 23:59:36	2025-04-26 00:59:36	\N	1e445002-76ef-462b-ab01-26646410c08c	1	f
5f6f987d-e301-4fe3-b1d9-23a3406a9603	cus_S0epMdj3oDF3Ow	\N	cancelled	2025-05-08 19:50:58	\N	2025-06-01 00:00:00	86eea5f4-37e1-4a80-98b1-fef236e3a44a	1	f
7a9d7612-1722-4a2a-b770-21513fd79911	cus_SIEp9vwsXEGzxp	sub_1RNeOG2Yjtdc4SmmSd80oMwl	cancelled	2025-06-01 00:00:00	2025-07-01 00:00:00	2025-06-01 00:00:00	86eea5f4-37e1-4a80-98b1-fef236e3a44a	2	f
cd762a85-966e-45c8-afea-2ff299fc941f	cus_SIEp9vwsXEGzxp	\N	cancelled	2025-06-01 00:00:00	2025-07-01 00:00:00	2025-06-01 00:00:00	86eea5f4-37e1-4a80-98b1-fef236e3a44a	1	f
da31bc7a-22d5-490c-9107-3652cb2c4571	cus_SIEp9vwsXEGzxp	sub_1RNeUj2Yjtdc4SmmZxhAC0QY	cancelled	2025-06-01 00:00:00	2025-07-01 00:00:00	2025-06-01 00:00:00	86eea5f4-37e1-4a80-98b1-fef236e3a44a	2	f
eaee70c6-fbcf-49ed-bbef-adeca0c78cc2	cus_SIEp9vwsXEGzxp	sub_1RNedb2Yjtdc4Smm4s8eu3Qu	cancelled	2025-06-01 00:00:00	2025-07-01 00:00:00	2025-06-01 00:00:00	86eea5f4-37e1-4a80-98b1-fef236e3a44a	3	f
c4fea3bc-7d12-4e1d-8a43-42b869949591	cus_SIEp9vwsXEGzxp	sub_1RNeeK2Yjtdc4SmmBwPhxC3Y	cancelled	2025-06-01 00:00:00	2025-07-01 00:00:00	2025-06-01 00:00:00	86eea5f4-37e1-4a80-98b1-fef236e3a44a	2	f
5e1f85c5-819f-4cbb-9508-95445651f143	cus_SIEp9vwsXEGzxp	sub_1RNeiq2Yjtdc4SmmxHk9tiCp	cancelled	2025-06-01 00:00:00	2025-07-01 00:00:00	2025-06-01 00:00:00	86eea5f4-37e1-4a80-98b1-fef236e3a44a	3	f
114ad71f-045d-41b8-92c0-18dc54270704	cus_SIEp9vwsXEGzxp	sub_1RNfSu2Yjtdc4SmmHnIbqGCw	active	2025-06-01 00:00:00	2025-07-01 00:00:00	\N	86eea5f4-37e1-4a80-98b1-fef236e3a44a	1	f
324ef96c-b699-4abb-a7fa-5b547b188725	cus_S5MRFJZAIjb5lv	\N	active	2025-06-01 00:00:00	\N	\N	58415527-2e7e-4289-a24b-a0c70ff5b6b7	1	f
\.


--
-- Data for Name: themes; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.themes (theme_id, name) FROM stdin;
1	default
2	beau_gosse
\.


--
-- Data for Name: tickets; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.tickets (ticket_id, status, state, description, title, creation_date, resolution_date, priority, admin_id_attribute, admin_id_get) FROM stdin;
e30c8946-b53a-4352-9e10-1ed62b7554fc	closed	Pending	"Problème à résoudre..."	Test	2025-03-18 21:07:19.465754	\N	High	d6733392-f759-44a2-8a15-32d9cdbf9b11	06ae5d85-6a2d-40e3-8e13-74f9d97d73a4
e97bd3cd-5fd9-4503-9ccb-2966fd532707	open	Progress	"<p class=\\"text-node\\"><span style=\\"color: hsl(var(--foreground))\\">Ceci est un gros problème Pour écrire en g</span><strong>ras<u> souliugné </u><em><u>italique</u></em></strong></p><ol class=\\"list-node\\"><li><p class=\\"text-node\\">num 1</p></li></ol><p class=\\"text-node\\"><a class=\\"link\\" href=\\"https://google.com\\" target=\\"_blank\\">num 2</a></p>"	Démo pour jérem	2025-03-19 09:23:48.521963	\N	High	d6733392-f759-44a2-8a15-32d9cdbf9b11	35cd4423-c198-4478-b95b-846758d03e2d
6d4fd63c-d9f0-496b-8c2a-4f8bc27dddfb	open	Progress	"<p class=\\"text-node\\">L'utilisateur ne peut pas se connecter à l'application.</p><img src=\\"https://console.minio.remythibaut.fr/api/v1/buckets/ticket/objects/download?preview=true&amp;prefix=aee0ab48-5f3b-4701-8842-67b48ceba0de&amp;version_id=null\\" alt=\\"\\" title=\\"\\" id=\\"3nqxbuu46\\" width=\\"518\\" height=\\"291\\">"	Nouveau titre	2025-03-15 09:36:17.955183	\N	High	d6733392-f759-44a2-8a15-32d9cdbf9b11	06ae5d85-6a2d-40e3-8e13-74f9d97d73a4
b7f947bb-b4fb-451b-8efa-31d7f101d9ed	Open	Done	"L'utilisateur ne peut pas se connecter à l'application."	Test01	2025-03-15 09:49:39.563824	\N	Medium	\N	\N
378a51a0-261d-4d37-b77d-64a5b8951e7c	Open	Progress	"L'utilisateur ne peut pas se connecter à l'application."	Problème de connexion	2025-03-14 08:47:22.110058	\N	High	d6733392-f759-44a2-8a15-32d9cdbf9b11	d3088a02-1918-4ff8-85c5-cab6cf7052b3
282fab15-35f7-4e17-9095-fcdf9e6d8039	closed	Progress	"L'utilisateur ne peut pas se connecter à l'application."	Problème de connexion	2025-03-18 13:27:37.75185	\N	High	d6733392-f759-44a2-8a15-32d9cdbf9b11	d6733392-f759-44a2-8a15-32d9cdbf9b11
915f5117-517f-4d61-a540-336fb0600ea4	open	Done	"<h1 class=\\"heading-node\\">ertertert</h1><p class=\\"text-node\\"><strong>sqdfsdfsd</strong></p><p class=\\"text-node\\"><a class=\\"link\\" href=\\"https://test.com\\" target=\\"_blank\\">ce truc</a></p><img src=\\"https://cdn.futura-sciences.com/cdn-cgi/image/width=1024,quality=60,format=auto/sources/images/dossier/773/01-intro-773.jpg\\" alt=\\"\\" title=\\"\\" id=\\"5i6m6cyiq\\" width=\\"500.24867486572265\\" height=\\"260.383343460381\\"><p class=\\"text-node\\"></p><p class=\\"text-node\\"><span><strong>ghjghj</strong></span></p><p class=\\"text-node\\"><em>fghfghfgh</em></p><p class=\\"text-node\\"><u>fghfgh</u></p><blockquote class=\\"block-node\\"><pre class=\\"block-node\\"><code>sdfsdfsd</code></pre><hr><pre class=\\"block-node\\"><code>\\n\\n</code></pre></blockquote><img src=\\"https://cdn.futura-sciences.com/sources/images/dossier/773/01-intro-773.jpg\\" alt=\\"\\" title=\\"\\" id=\\"m09iucild\\" width=\\"492.54543457031247\\" height=\\"256.55663295200895\\" filename=\\"original.jpg\\"><p class=\\"text-node\\"></p><img src=\\"https://cdn.futura-sciences.com/sources/images/dossier/773/01-intro-773.jpg\\" alt=\\"\\" title=\\"\\" id=\\"c3gvdb7mw\\" width=\\"496\\" height=\\"258\\" filename=\\"logo_VilledeMeudon_500_500.jpg\\">"	Problème de connexion	2025-03-16 12:31:45.875636	\N	Low	d6733392-f759-44a2-8a15-32d9cdbf9b11	d6733392-f759-44a2-8a15-32d9cdbf9b11
a8b61940-e087-48a9-acd4-4e746cd2669d	open	Pending	"<ol class=\\"list-node\\"><li><p class=\\"text-node\\">Problème à résoudre...</p></li></ol><h1 class=\\"heading-node\\">dfsdf</h1><p class=\\"text-node\\"><strong>Test</strong></p><p class=\\"text-node\\"></p><p class=\\"text-node\\"><em>kjdsqkjdqks</em></p><p class=\\"text-node\\"></p><p class=\\"text-node\\"><u>jkdqksjdqksj</u></p><p class=\\"text-node\\"></p><p class=\\"text-node\\"><span style=\\"color: var(--mt-accent-bold-blue)\\">sdfsdfsdf</span></p><p class=\\"text-node\\"><code class=\\"inline\\" spellcheck=\\"false\\">sdfsdfsdfsd</code></p><p class=\\"text-node\\"></p><pre class=\\"block-node\\"><code>zerzerzerzer</code></pre><hr><p class=\\"text-node\\"></p><p class=\\"text-node\\"><a class=\\"link\\" href=\\"https://test.com\\" target=\\"_blank\\">test</a></p><p class=\\"text-node\\"></p><img src=\\"https://cdn.futura-sciences.com/cdn-cgi/image/width=1024,quality=60,format=auto/sources/images/dossier/773/01-intro-773.jpg\\" alt=\\"\\" title=\\"\\" id=\\"knyjjyot8\\" width=\\"464\\" height=\\"241\\"><p class=\\"text-node\\"></p><img src=\\"https://cdn.futura-sciences.com/sources/images/dossier/773/01-intro-773.jpg\\" alt=\\"\\" title=\\"\\" id=\\"u356ma2rp\\" width=\\"460\\" height=\\"239\\" filename=\\"original.jpg\\"><p class=\\"text-node\\"></p><blockquote class=\\"block-node\\"><p class=\\"text-node\\">zerzer</p></blockquote>"	Test	2025-03-18 14:46:48.40962	\N	High	d3088a02-1918-4ff8-85c5-cab6cf7052b3	d3088a02-1918-4ff8-85c5-cab6cf7052b3
\.


--
-- Data for Name: transfers; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.transfers (transfer_id, date, amount, delivery_person_id, type, url, stripe_id) FROM stdin;
7bfc30b5-33df-4f1e-b298-296d50d94156	2025-05-25 13:31:11.045	174.00	ed92c1b5-ae2b-4362-9d8b-3a38629fce24	not-auto	client-document/86eea5f4-37e1-4a80-98b1-fef236e3a44a/delivery/invoice/facture_test.pdf	test
0ca7d464-a4bc-4da6-bd9b-e8858b43e1a0	2025-05-11 16:23:47.436	7.00	ed92c1b5-ae2b-4362-9d8b-3a38629fce24	not-auto	client-document/86eea5f4-37e1-4a80-98b1-fef236e3a44a/delivery/invoice/facture_test.pdf	test
f7d41af3-152f-4a7b-bef0-cc1ed41810b0	2025-05-08 18:07:43.404	10.00	ed92c1b5-ae2b-4362-9d8b-3a38629fce24	not-auto	client-document/86eea5f4-37e1-4a80-98b1-fef236e3a44a/delivery/invoice/facture_test.pdf	test
30f1ded9-40dc-42e9-999f-700bc4afd011	2025-05-24 14:33:09.499	58.00	ed92c1b5-ae2b-4362-9d8b-3a38629fce24	not-auto	client-document/86eea5f4-37e1-4a80-98b1-fef236e3a44a/delivery/invoice/facture_test.pdf	tr_1RSHGC2Yjtdc4SmmZETVTODF
92dbb6f2-4464-4f8c-9706-ea6bf00f14eb	2025-05-25 13:29:52.5	174.00	ed92c1b5-ae2b-4362-9d8b-3a38629fce24	not-auto	tempclient-document/86eea5f4-37e1-4a80-98b1-fef236e3a44a/delivery/invoice/facture_test.pdf	test
\.


--
-- Data for Name: transfers_provider; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.transfers_provider (transfer_id, date, amount, type, url, provider_id, stripe_id) FROM stdin;
ff93edfe-af44-4212-a761-f2828e182cd0	2025-05-08 15:52:46.672	10.00	not-auto	temp	e8bb9a20-c223-4dec-a682-6dd6b5817222	test
dee1d85b-b43e-4255-820b-3c759af2c381	2025-05-08 15:58:44.383	120.00	not-auto	temp	e8bb9a20-c223-4dec-a682-6dd6b5817222	test
39924c33-5f4d-4648-8c15-eff34d8ed806	2025-05-08 15:59:15.203	7.00	not-auto	temp	e8bb9a20-c223-4dec-a682-6dd6b5817222	test
4ee52cc4-d07b-41e3-b868-50fcfc712ed9	2025-05-08 16:00:47.057	17.00	not-auto	temp	e8bb9a20-c223-4dec-a682-6dd6b5817222	test
\.


--
-- Data for Name: trips; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.trips (trip_id, departure_location, arrival_location, departure_city, arrival_city, date, tolerated_radius, delivery_person_id, weekday, comeback_today_or_tomorrow) FROM stdin;
c1f091ad-0365-4c7b-be58-e7cb5c5f4474	0101000020E61000007808E3A7718F0240852F0219F06D4840	0101000020E6100000344B02D4D47A154035351A0AE9A54540	Paris	Marseille	\N	5.00	5a164066-78a6-4bd1-af89-be8cf75db8bc	1	later
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.users (user_id, email, password, creation_date, banned, ban_date, profile_picture, newsletter, last_login, confirmed, tutorial_done, dark_mode_enabled, two_factor_enabled, one_signal_id, theme_id, language_id, secret_totp, password_code, validate_code) FROM stdin;
a6480035-5d8c-4775-88cb-56784b765410	damien.esgi@gmail.com	$2b$10$Q/Gl5pmDsrNWIwas5CS2R.W5xaXNT4VXnzpkHICXBcLNjgwK0NlJa	2025-04-17 09:59:57.57125	f	\N		f	\N	t	t	f	f	\N	1	691a6ac2-7b1a-4394-9d04-aaa586827b20	\N	\N	f3fad308-1b53-4a55-aa29-d5755a891268
bafb8fd4-899e-40c2-ba4e-9184ed8c852f	john.doe@example.com	$2b$10$1MJg33K36grrFncaNSLszOSPDg0YGCuti.hFJKpVBw9rafZkxXauW	2025-03-24 22:21:56.49197	f	\N		t	\N	f	f	f	f	\N	1	691a6ac2-7b1a-4394-9d04-aaa586827b20	\N	\N	\N
c54c4740-a5f9-449c-8c79-f0fbff52e0f6	zbhb3l8v7m@osxofulk.com	$2b$10$nmxon7vBAfVGJARnVZAUzuBcQYf.B5K8jcj8cyUwqa0a33p3YoFt.	2025-05-29 13:24:53.033269	f	\N	\N	t	\N	f	f	f	f	\N	1	2b87c392-1e4b-41ad-aa28-f5b1a1d48e36	\N	\N	\N
93ee1b03-4f1b-4805-bd2e-efba5f871896	amphinoman@gmail.com	$2b$10$r/0VAwcoR6oNU3td7BX9YOO6uyQmNgcl4ebgi7pX8BabMqoeGAckm	2025-04-05 14:11:53.642841	f	\N	93ee1b03-4f1b-4805-bd2e-efba5f871896/image-68c81d80-a9e2-48b3-be81-bcacbf1b0df1.jpg	t	\N	t	t	f	f	\N	1	691a6ac2-7b1a-4394-9d04-aaa586827b20		\N	d04f66ee-7078-41f2-8dd0-193e1f49632f
d98bf725-63c9-4671-a774-c9af7482982d	mjddsfyvtl@cmhvzylmfc.com	$2b$10$W1uW5KFG7zRTPdL8VnyvquVqzrFbwhuWxduA7W6FPi10Yzb9F4SbW	2025-05-29 19:10:02.196751	f	\N	\N	f	\N	f	f	f	f	\N	1	2b87c392-1e4b-41ad-aa28-f5b1a1d48e36	\N	\N	498a01d7-9572-4a9a-b249-17323dd4166d
5f0a90e1-321b-4a36-88ad-6c414a0dd091	test@gmail2.com	$2b$10$xJJglR2yv8QC.zkQrNBK9eLPiyEY9akNA.1cQJ332q5wPCgQJ9WIm	2025-03-25 22:58:27.277948	f	\N	\N	t	\N	t	f	f	f	\N	1	691a6ac2-7b1a-4394-9d04-aaa586827b20	\N	\N	\N
4003a1a8-2a5d-4d48-bbf2-81795ca42da4	damien.vaurette@bbraun.com	$2b$10$ifF3vLs./ZzNDzCzryxF1.cJjMksjPh.5ZKb8KoSFVA2gtJ1laDvi	2025-04-07 09:11:54.07822	f	\N	\N	f	\N	t	f	f	f	\N	1	691a6ac2-7b1a-4394-9d04-aaa586827b20	\N	\N	2e3d336e-6fab-4252-b2c9-239fcffc7be8
cad292f7-56e2-4622-b5fd-6693f142efb5	mobova6612@bocapies.com	$2b$10$4qWNW9irUq2vSKlh4pFL1uqeDe8DbLS6Tgj.hGYbWhIlVbgMIf2NO	2025-05-01 12:33:15.032775	f	\N	\N	t	\N	t	t	f	f	\N	1	691a6ac2-7b1a-4394-9d04-aaa586827b20	\N	\N	2b6089da-22b6-4476-bedc-f62f4eb1848a
68368825-9cbf-4c14-9766-333a99a19fe5	zvsvqvzfza@vwhins.com	$2b$10$gvXEdTIhzAqrdOoZm6iCz.IUUDTdtVcPNpH/uaNclbuHk4MP7S7E6	2025-05-29 19:22:57.343856	f	\N	\N	f	\N	t	t	f	f	\N	1	dd3de120-0596-4b4e-9b09-99b5541fbb1b	\N	\N	f26b0ac0-0e3e-49cc-a32f-383959b7ef1a
86eea5f4-37e1-4a80-98b1-fef236e3a44a	rthibaut@myges.fr	$2b$10$hX7L6F3yJP4c78LfuaxDcOzm99a7Ii3gzITFK5W.Rqvr18FYfM6FO	2025-04-22 10:00:44.415631	f	\N	86eea5f4-37e1-4a80-98b1-fef236e3a44a/image-9fc3e4e9-efd8-4cf0-9baf-44e9402c6ba0.jpg	t	\N	t	t	f	f	\N	1	ae8f67fc-7597-406c-8dca-881905d82cb1		976561f0-b45d-41ed-b8b1-c1a87f0b5015	67359f7a-f010-4696-80cd-f0cd7f774b02
27d9b341-3d77-4e7e-91da-69d38cc950b2	commercant@example.com	$2b$10$y3zIoZQLHnYngZz.sKNAyuvmf7sSIoSPv6u.wdaxo8CDuQ3DVESZC	2025-03-25 20:56:36.705731	f	\N	\N	t	\N	f	f	f	f	\N	1	691a6ac2-7b1a-4394-9d04-aaa586827b20	\N	\N	\N
58415527-2e7e-4289-a24b-a0c70ff5b6b7	remy.thibaut2005@gmail.com	$2b$10$/qcJcXVOqR0b5eNAYfjsCulzBO.0oH8E7gg8/8XFkhwfX1J3VQm/m	2025-04-24 19:55:49.789195	f	\N	\N	t	\N	t	t	f	f	\N	1	691a6ac2-7b1a-4394-9d04-aaa586827b20	\N	\N	a22aaec9-fb31-4669-bea3-e2d3f0c0a6a0
8dd4546f-7be8-4d9f-97e1-72c5ed4cbbd5	qdelneuf@myges.fr	$2b$10$Gd1OjbD3k7pd.Ead.j6MJexNhlY51brxSiXTYwYjYJ759uix3cgHK	2025-04-17 09:57:20.38369	f	\N	\N	t	\N	t	t	f	f	\N	1	691a6ac2-7b1a-4394-9d04-aaa586827b20	\N	\N	e2b5614f-dd52-4205-a024-e98a958a49da
e3b78347-2939-4a7d-b65d-483c27a3073b	remytt@test.com	$2b$10$m8Nx1o1JLE6tAgMRtNIKD.o46KwEuIfh5oGj9bIpzdmKZA6Tp/Dtm	2025-03-25 22:59:15.790607	f	\N	\N	t	\N	f	f	f	f	\N	1	691a6ac2-7b1a-4394-9d04-aaa586827b20	\N	\N	\N
1e445002-76ef-462b-ab01-26646410c08c	newcommercantttt@example.com	$2b$10$y/j5HVVi8AH/Gt6bYHgtWeFf73AS5jIC78F26rEfHht2em154ylAm	2025-03-25 22:59:34.983543	f	\N	\N	f	\N	f	f	f	f	\N	1	691a6ac2-7b1a-4394-9d04-aaa586827b20	\N	\N	\N
\.


--
-- Data for Name: vehicle_documents; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.vehicle_documents (vehicle_document_id, name, description, submission_date, vehicle_document_url, vehicle_id) FROM stdin;
1f174865-b55c-4c37-811f-aa8d79cc4e79	Projet - virtualisation des rÃ©seau.docx	\N	2025-05-10 13:04:11.273873	86eea5f4-37e1-4a80-98b1-fef236e3a44a/deliveryman/vehicle/documents/960ce949-6e84-4143-82e1-ffc77789a9cd/Projet - virtualisation des rÃ©seau.docx	960ce949-6e84-4143-82e1-ffc77789a9cd
\.


--
-- Data for Name: vehicles; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.vehicles (vehicle_id, model, registration_number, electric, validated, co2_consumption, image_url, delivery_person_id, category_id, val_by_admin_id) FROM stdin;
960ce949-6e84-4143-82e1-ffc77789a9cd	zeaz	23456789	f	t	0.00	86eea5f4-37e1-4a80-98b1-fef236e3a44a/deliveryman/vehicle/zeaz_23456789_1746882250390.jpg	ed92c1b5-ae2b-4362-9d8b-3a38629fce24	1	d6733392-f759-44a2-8a15-32d9cdbf9b11
\.


--
-- Data for Name: warehouses; Type: TABLE DATA; Schema: public; Owner: objectif20
--

COPY public.warehouses (warehouse_id, city, capacity, coordinates, photo, description, address, postal_code) FROM stdin;
2538eccd-00ea-492c-bb73-70ca96d9a0c6	Lyon	1000.00	0101000020E61000009D11A5BDC15713406F1283C0CAE14640	https://example.com/photo-lyon.jpg	Entrepôt principal situé à Lyon, proche du centre logistique régional.	Adresse inconnue	00000
\.


--
-- Data for Name: geocode_settings; Type: TABLE DATA; Schema: tiger; Owner: objectif20
--

COPY tiger.geocode_settings (name, setting, unit, category, short_desc) FROM stdin;
\.


--
-- Data for Name: pagc_gaz; Type: TABLE DATA; Schema: tiger; Owner: objectif20
--

COPY tiger.pagc_gaz (id, seq, word, stdword, token, is_custom) FROM stdin;
\.


--
-- Data for Name: pagc_lex; Type: TABLE DATA; Schema: tiger; Owner: objectif20
--

COPY tiger.pagc_lex (id, seq, word, stdword, token, is_custom) FROM stdin;
\.


--
-- Data for Name: pagc_rules; Type: TABLE DATA; Schema: tiger; Owner: objectif20
--

COPY tiger.pagc_rules (id, rule, is_custom) FROM stdin;
\.


--
-- Data for Name: topology; Type: TABLE DATA; Schema: topology; Owner: objectif20
--

COPY topology.topology (id, name, srid, "precision", hasz) FROM stdin;
\.


--
-- Data for Name: layer; Type: TABLE DATA; Schema: topology; Owner: objectif20
--

COPY topology.layer (topology_id, layer_id, schema_name, table_name, feature_column, feature_type, level, child_id) FROM stdin;
\.


--
-- Name: categories_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: objectif20
--

SELECT pg_catalog.setval('public.categories_category_id_seq', 8, true);


--
-- Name: plans_plan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: objectif20
--

SELECT pg_catalog.setval('public.plans_plan_id_seq', 3, true);


--
-- Name: subscriptions_plan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: objectif20
--

SELECT pg_catalog.setval('public.subscriptions_plan_id_seq', 4, true);


--
-- Name: themes_theme_id_seq; Type: SEQUENCE SET; Schema: public; Owner: objectif20
--

SELECT pg_catalog.setval('public.themes_theme_id_seq', 1, true);


--
-- Name: users_theme_id_seq; Type: SEQUENCE SET; Schema: public; Owner: objectif20
--

SELECT pg_catalog.setval('public.users_theme_id_seq', 1, true);


--
-- Name: vehicles_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: objectif20
--

SELECT pg_catalog.setval('public.vehicles_category_id_seq', 1, false);


--
-- Name: topology_id_seq; Type: SEQUENCE SET; Schema: topology; Owner: objectif20
--

SELECT pg_catalog.setval('topology.topology_id_seq', 1, false);


--
-- Name: admin_report admin_report_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.admin_report
    ADD CONSTRAINT admin_report_pkey PRIMARY KEY (report_id, admin_id);


--
-- Name: admins admins_email_key; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_email_key UNIQUE (email);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (admin_id);


--
-- Name: appointments appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (appointment_id);


--
-- Name: availabilities availabilities_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.availabilities
    ADD CONSTRAINT availabilities_pkey PRIMARY KEY (id);


--
-- Name: blocked blocked_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.blocked
    ADD CONSTRAINT blocked_pkey PRIMARY KEY (user_id, user_id_blocked);


--
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);


--
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (client_id);


--
-- Name: clients clients_stripe_customer_id_key; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_stripe_customer_id_key UNIQUE (stripe_customer_id);


--
-- Name: deliveries deliveries_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.deliveries
    ADD CONSTRAINT deliveries_pkey PRIMARY KEY (delivery_id);


--
-- Name: delivery_commission delivery_commission_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.delivery_commission
    ADD CONSTRAINT delivery_commission_pkey PRIMARY KEY (delivery_commission_id);


--
-- Name: delivery_keywords delivery_keywords_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.delivery_keywords
    ADD CONSTRAINT delivery_keywords_pkey PRIMARY KEY (keyword_id, shipment_id);


--
-- Name: delivery_person_documents delivery_person_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.delivery_person_documents
    ADD CONSTRAINT delivery_person_documents_pkey PRIMARY KEY (document_id);


--
-- Name: delivery_persons delivery_persons_nfc_code_key; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.delivery_persons
    ADD CONSTRAINT delivery_persons_nfc_code_key UNIQUE (nfc_code);


--
-- Name: delivery_persons delivery_persons_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.delivery_persons
    ADD CONSTRAINT delivery_persons_pkey PRIMARY KEY (delivery_person_id);


--
-- Name: delivery_persons delivery_persons_professional_email_key; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.delivery_persons
    ADD CONSTRAINT delivery_persons_professional_email_key UNIQUE (professional_email);


--
-- Name: delivery_review_responses delivery_review_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.delivery_review_responses
    ADD CONSTRAINT delivery_review_responses_pkey PRIMARY KEY (review_id_response);


--
-- Name: delivery_reviews delivery_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.delivery_reviews
    ADD CONSTRAINT delivery_reviews_pkey PRIMARY KEY (review_id);


--
-- Name: delivery_transfer delivery_transfer_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.delivery_transfer
    ADD CONSTRAINT delivery_transfer_pkey PRIMARY KEY (delivery_transfer_id);


--
-- Name: exchange_points exchange_points_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.exchange_points
    ADD CONSTRAINT exchange_points_pkey PRIMARY KEY (exchange_point_id);


--
-- Name: favorite_services favorite_services_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.favorite_services
    ADD CONSTRAINT favorite_services_pkey PRIMARY KEY (service_id, user_id);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (shipment_id, delivery_person_id);


--
-- Name: keywords keywords_keyword_key; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.keywords
    ADD CONSTRAINT keywords_keyword_key UNIQUE (keyword);


--
-- Name: keywords keywords_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.keywords
    ADD CONSTRAINT keywords_pkey PRIMARY KEY (keyword_id);


--
-- Name: languages languages_iso_code_key; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.languages
    ADD CONSTRAINT languages_iso_code_key UNIQUE (iso_code);


--
-- Name: languages languages_language_name_key; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.languages
    ADD CONSTRAINT languages_language_name_key UNIQUE (language_name);


--
-- Name: languages languages_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.languages
    ADD CONSTRAINT languages_pkey PRIMARY KEY (language_id);


--
-- Name: merchant_contract merchant_contract_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.merchant_contract
    ADD CONSTRAINT merchant_contract_pkey PRIMARY KEY (contract_id);


--
-- Name: merchant_contract merchant_contract_siret_key; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.merchant_contract
    ADD CONSTRAINT merchant_contract_siret_key UNIQUE (siret);


--
-- Name: merchant_documents merchant_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.merchant_documents
    ADD CONSTRAINT merchant_documents_pkey PRIMARY KEY (merchant_document_id);


--
-- Name: merchant_sector merchant_sector_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.merchant_sector
    ADD CONSTRAINT merchant_sector_pkey PRIMARY KEY (sector_id, merchant_id);


--
-- Name: merchants merchants_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.merchants
    ADD CONSTRAINT merchants_pkey PRIMARY KEY (merchant_id);


--
-- Name: merchants merchants_siret_key; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.merchants
    ADD CONSTRAINT merchants_siret_key UNIQUE (siret);


--
-- Name: merchants merchants_stripe_customer_id_key; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.merchants
    ADD CONSTRAINT merchants_stripe_customer_id_key UNIQUE (stripe_customer_id);


--
-- Name: onesignal_devices onesignal_devices_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.onesignal_devices
    ADD CONSTRAINT onesignal_devices_pkey PRIMARY KEY (device_id);


--
-- Name: parcel_images parcel_images_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.parcel_images
    ADD CONSTRAINT parcel_images_pkey PRIMARY KEY (image_url);


--
-- Name: parcels parcels_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.parcels
    ADD CONSTRAINT parcels_pkey PRIMARY KEY (parcel_id);


--
-- Name: plans plans_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.plans
    ADD CONSTRAINT plans_pkey PRIMARY KEY (plan_id);


--
-- Name: presta_review_responses presta_review_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.presta_review_responses
    ADD CONSTRAINT presta_review_responses_pkey PRIMARY KEY (review_presta_response_id);


--
-- Name: presta_reviews presta_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.presta_reviews
    ADD CONSTRAINT presta_reviews_pkey PRIMARY KEY (review_presta_id);


--
-- Name: provider_commissions provider_commissions_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.provider_commissions
    ADD CONSTRAINT provider_commissions_pkey PRIMARY KEY (provider_commission_id);


--
-- Name: provider_contracts provider_contracts_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.provider_contracts
    ADD CONSTRAINT provider_contracts_pkey PRIMARY KEY (provider_contract_id);


--
-- Name: provider_contracts provider_contracts_siret_key; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.provider_contracts
    ADD CONSTRAINT provider_contracts_siret_key UNIQUE (siret);


--
-- Name: provider_documents provider_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.provider_documents
    ADD CONSTRAINT provider_documents_pkey PRIMARY KEY (provider_documents_id);


--
-- Name: provider_keywords_list provider_keywords_list_keyword_key; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.provider_keywords_list
    ADD CONSTRAINT provider_keywords_list_keyword_key UNIQUE (keyword);


--
-- Name: provider_keywords_list provider_keywords_list_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.provider_keywords_list
    ADD CONSTRAINT provider_keywords_list_pkey PRIMARY KEY (provider_keyword_id);


--
-- Name: provider_keywords provider_keywords_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.provider_keywords
    ADD CONSTRAINT provider_keywords_pkey PRIMARY KEY (provider_keyword_id, service_id);


--
-- Name: providers providers_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.providers
    ADD CONSTRAINT providers_pkey PRIMARY KEY (provider_id);


--
-- Name: providers providers_siret_key; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.providers
    ADD CONSTRAINT providers_siret_key UNIQUE (siret);


--
-- Name: reports reports_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (report_id);


--
-- Name: roles_list roles_list_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.roles_list
    ADD CONSTRAINT roles_list_pkey PRIMARY KEY (role_id);


--
-- Name: roles_list roles_list_role_name_key; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.roles_list
    ADD CONSTRAINT roles_list_role_name_key UNIQUE (role_name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (role_id, admin_id);


--
-- Name: sectors sectors_name_key; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_name_key UNIQUE (name);


--
-- Name: sectors sectors_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_pkey PRIMARY KEY (sector_id);


--
-- Name: service_images service_images_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.service_images
    ADD CONSTRAINT service_images_pkey PRIMARY KEY (image_service_id);


--
-- Name: services_list services_list_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.services_list
    ADD CONSTRAINT services_list_pkey PRIMARY KEY (service_id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (service_id, provider_id);


--
-- Name: shipments shipments_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT shipments_pkey PRIMARY KEY (shipment_id);


--
-- Name: stores stores_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_pkey PRIMARY KEY (shipment_id, exchange_point_id);


--
-- Name: subscription_transactions subscription_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.subscription_transactions
    ADD CONSTRAINT subscription_transactions_pkey PRIMARY KEY (transaction_id);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (subscription_id);


--
-- Name: themes themes_name_key; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.themes
    ADD CONSTRAINT themes_name_key UNIQUE (name);


--
-- Name: themes themes_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.themes
    ADD CONSTRAINT themes_pkey PRIMARY KEY (theme_id);


--
-- Name: tickets tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_pkey PRIMARY KEY (ticket_id);


--
-- Name: transfers transfers_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.transfers
    ADD CONSTRAINT transfers_pkey PRIMARY KEY (transfer_id);


--
-- Name: transfers_provider transfers_provider_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.transfers_provider
    ADD CONSTRAINT transfers_provider_pkey PRIMARY KEY (transfer_id);


--
-- Name: trips trips_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_pkey PRIMARY KEY (trip_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: vehicle_documents vehicle_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.vehicle_documents
    ADD CONSTRAINT vehicle_documents_pkey PRIMARY KEY (vehicle_document_id);


--
-- Name: vehicles vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_pkey PRIMARY KEY (vehicle_id);


--
-- Name: vehicles vehicles_registration_number_key; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_registration_number_key UNIQUE (registration_number);


--
-- Name: warehouses warehouses_pkey; Type: CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.warehouses
    ADD CONSTRAINT warehouses_pkey PRIMARY KEY (warehouse_id);


--
-- Name: admins admin_language; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admin_language FOREIGN KEY (language_id) REFERENCES public.languages(language_id);


--
-- Name: admin_report admin_report_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.admin_report
    ADD CONSTRAINT admin_report_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.admins(admin_id) ON DELETE CASCADE;


--
-- Name: admin_report admin_report_report_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.admin_report
    ADD CONSTRAINT admin_report_report_id_fkey FOREIGN KEY (report_id) REFERENCES public.reports(report_id) ON DELETE CASCADE;


--
-- Name: appointments appointments_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(client_id) ON DELETE CASCADE;


--
-- Name: appointments appointments_presta_commission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_presta_commission_id_fkey FOREIGN KEY (presta_commission_id) REFERENCES public.provider_commissions(provider_commission_id) ON DELETE CASCADE;


--
-- Name: appointments appointments_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.providers(provider_id) ON DELETE CASCADE;


--
-- Name: appointments appointments_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services_list(service_id) ON DELETE CASCADE;


--
-- Name: blocked blocked_user_id_blocked_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.blocked
    ADD CONSTRAINT blocked_user_id_blocked_fkey FOREIGN KEY (user_id_blocked) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: blocked blocked_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.blocked
    ADD CONSTRAINT blocked_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: clients clients_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: deliveries deliveries_delivery_commission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.deliveries
    ADD CONSTRAINT deliveries_delivery_commission_id_fkey FOREIGN KEY (delivery_commission_id) REFERENCES public.delivery_commission(delivery_commission_id) ON DELETE CASCADE;


--
-- Name: deliveries deliveries_delivery_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.deliveries
    ADD CONSTRAINT deliveries_delivery_person_id_fkey FOREIGN KEY (delivery_person_id) REFERENCES public.delivery_persons(delivery_person_id) ON DELETE CASCADE;


--
-- Name: deliveries deliveries_shipment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.deliveries
    ADD CONSTRAINT deliveries_shipment_id_fkey FOREIGN KEY (shipment_id) REFERENCES public.shipments(shipment_id) ON DELETE CASCADE;


--
-- Name: delivery_keywords delivery_keywords_keyword_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.delivery_keywords
    ADD CONSTRAINT delivery_keywords_keyword_id_fkey FOREIGN KEY (keyword_id) REFERENCES public.keywords(keyword_id) ON DELETE CASCADE;


--
-- Name: delivery_keywords delivery_keywords_shipment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.delivery_keywords
    ADD CONSTRAINT delivery_keywords_shipment_id_fkey FOREIGN KEY (shipment_id) REFERENCES public.shipments(shipment_id) ON DELETE CASCADE;


--
-- Name: delivery_person_documents delivery_person_documents_delivery_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.delivery_person_documents
    ADD CONSTRAINT delivery_person_documents_delivery_person_id_fkey FOREIGN KEY (delivery_person_id) REFERENCES public.delivery_persons(delivery_person_id) ON DELETE CASCADE;


--
-- Name: delivery_persons delivery_persons_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.delivery_persons
    ADD CONSTRAINT delivery_persons_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.admins(admin_id) ON DELETE SET NULL;


--
-- Name: delivery_persons delivery_persons_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.delivery_persons
    ADD CONSTRAINT delivery_persons_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: delivery_review_responses delivery_review_responses_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.delivery_review_responses
    ADD CONSTRAINT delivery_review_responses_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.delivery_reviews(review_id) ON DELETE CASCADE;


--
-- Name: delivery_reviews delivery_reviews_delivery_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.delivery_reviews
    ADD CONSTRAINT delivery_reviews_delivery_id_fkey FOREIGN KEY (delivery_id) REFERENCES public.deliveries(delivery_id) ON DELETE CASCADE;


--
-- Name: delivery_transfer delivery_transfer_delivery_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.delivery_transfer
    ADD CONSTRAINT delivery_transfer_delivery_id_fkey FOREIGN KEY (delivery_id) REFERENCES public.deliveries(delivery_id);


--
-- Name: exchange_points exchange_points_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.exchange_points
    ADD CONSTRAINT exchange_points_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(warehouse_id) ON DELETE CASCADE;


--
-- Name: favorite_services favorite_services_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.favorite_services
    ADD CONSTRAINT favorite_services_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services_list(service_id) ON DELETE CASCADE;


--
-- Name: favorite_services favorite_services_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.favorite_services
    ADD CONSTRAINT favorite_services_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: favorites favorites_delivery_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_delivery_person_id_fkey FOREIGN KEY (delivery_person_id) REFERENCES public.delivery_persons(delivery_person_id) ON DELETE CASCADE;


--
-- Name: favorites favorites_shipment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_shipment_id_fkey FOREIGN KEY (shipment_id) REFERENCES public.shipments(shipment_id) ON DELETE CASCADE;


--
-- Name: availabilities fk_provider; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.availabilities
    ADD CONSTRAINT fk_provider FOREIGN KEY (provider_id) REFERENCES public.providers(provider_id) ON DELETE CASCADE;


--
-- Name: merchant_contract merchant_contract_merchant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.merchant_contract
    ADD CONSTRAINT merchant_contract_merchant_id_fkey FOREIGN KEY (merchant_id) REFERENCES public.merchants(merchant_id) ON DELETE CASCADE;


--
-- Name: merchant_documents merchant_documents_merchant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.merchant_documents
    ADD CONSTRAINT merchant_documents_merchant_id_fkey FOREIGN KEY (merchant_id) REFERENCES public.merchants(merchant_id) ON DELETE CASCADE;


--
-- Name: merchant_sector merchant_sector_merchant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.merchant_sector
    ADD CONSTRAINT merchant_sector_merchant_id_fkey FOREIGN KEY (merchant_id) REFERENCES public.merchants(merchant_id) ON DELETE CASCADE;


--
-- Name: merchant_sector merchant_sector_sector_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.merchant_sector
    ADD CONSTRAINT merchant_sector_sector_id_fkey FOREIGN KEY (sector_id) REFERENCES public.sectors(sector_id) ON DELETE CASCADE;


--
-- Name: merchants merchants_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.merchants
    ADD CONSTRAINT merchants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: onesignal_devices onesignal_devices_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.onesignal_devices
    ADD CONSTRAINT onesignal_devices_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: parcel_images parcel_images_parcel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.parcel_images
    ADD CONSTRAINT parcel_images_parcel_id_fkey FOREIGN KEY (parcel_id) REFERENCES public.parcels(parcel_id) ON DELETE CASCADE;


--
-- Name: parcels parcels_shipment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.parcels
    ADD CONSTRAINT parcels_shipment_id_fkey FOREIGN KEY (shipment_id) REFERENCES public.shipments(shipment_id) ON DELETE CASCADE;


--
-- Name: presta_review_responses presta_review_responses_review_presta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.presta_review_responses
    ADD CONSTRAINT presta_review_responses_review_presta_id_fkey FOREIGN KEY (review_presta_id) REFERENCES public.presta_reviews(review_presta_id) ON DELETE CASCADE;


--
-- Name: presta_reviews presta_reviews_appointment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.presta_reviews
    ADD CONSTRAINT presta_reviews_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments(appointment_id) ON DELETE CASCADE;


--
-- Name: provider_contracts provider_contracts_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.provider_contracts
    ADD CONSTRAINT provider_contracts_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.providers(provider_id) ON DELETE CASCADE;


--
-- Name: provider_documents provider_documents_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.provider_documents
    ADD CONSTRAINT provider_documents_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.providers(provider_id) ON DELETE CASCADE;


--
-- Name: provider_keywords provider_keywords_provider_keyword_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.provider_keywords
    ADD CONSTRAINT provider_keywords_provider_keyword_id_fkey FOREIGN KEY (provider_keyword_id) REFERENCES public.provider_keywords_list(provider_keyword_id) ON DELETE CASCADE;


--
-- Name: provider_keywords provider_keywords_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.provider_keywords
    ADD CONSTRAINT provider_keywords_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services_list(service_id) ON DELETE CASCADE;


--
-- Name: providers providers_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.providers
    ADD CONSTRAINT providers_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.admins(admin_id) ON DELETE SET NULL;


--
-- Name: providers providers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.providers
    ADD CONSTRAINT providers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: reports reports_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: roles roles_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.admins(admin_id) ON DELETE CASCADE;


--
-- Name: roles roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles_list(role_id) ON DELETE CASCADE;


--
-- Name: service_images service_images_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.service_images
    ADD CONSTRAINT service_images_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services_list(service_id) ON DELETE CASCADE;


--
-- Name: services_list services_list_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.services_list
    ADD CONSTRAINT services_list_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.admins(admin_id) ON DELETE SET NULL;


--
-- Name: services services_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.providers(provider_id) ON DELETE CASCADE;


--
-- Name: services services_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services_list(service_id) ON DELETE CASCADE;


--
-- Name: shipments shipments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT shipments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: stores stores_exchange_point_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_exchange_point_id_fkey FOREIGN KEY (exchange_point_id) REFERENCES public.exchange_points(exchange_point_id) ON DELETE CASCADE;


--
-- Name: stores stores_shipment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_shipment_id_fkey FOREIGN KEY (shipment_id) REFERENCES public.shipments(shipment_id) ON DELETE CASCADE;


--
-- Name: subscription_transactions subscription_transactions_subscription_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.subscription_transactions
    ADD CONSTRAINT subscription_transactions_subscription_id_fkey FOREIGN KEY (subscription_id) REFERENCES public.subscriptions(subscription_id) ON DELETE CASCADE;


--
-- Name: subscriptions subscriptions_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.plans(plan_id) ON DELETE CASCADE;


--
-- Name: subscriptions subscriptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: tickets tickets_admin_id_attribute_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_admin_id_attribute_fkey FOREIGN KEY (admin_id_attribute) REFERENCES public.admins(admin_id) ON DELETE SET NULL;


--
-- Name: tickets tickets_admin_id_get_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_admin_id_get_fkey FOREIGN KEY (admin_id_get) REFERENCES public.admins(admin_id) ON DELETE SET NULL;


--
-- Name: transfers transfers_delivery_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.transfers
    ADD CONSTRAINT transfers_delivery_person_id_fkey FOREIGN KEY (delivery_person_id) REFERENCES public.delivery_persons(delivery_person_id) ON DELETE CASCADE;


--
-- Name: transfers_provider transfers_provider_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.transfers_provider
    ADD CONSTRAINT transfers_provider_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.providers(provider_id) ON DELETE CASCADE;


--
-- Name: trips trips_delivery_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_delivery_person_id_fkey FOREIGN KEY (delivery_person_id) REFERENCES public.delivery_persons(delivery_person_id) ON DELETE CASCADE;


--
-- Name: users users_language_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(language_id);


--
-- Name: users users_theme_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_theme_id_fkey FOREIGN KEY (theme_id) REFERENCES public.themes(theme_id);


--
-- Name: vehicle_documents vehicle_documents_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.vehicle_documents
    ADD CONSTRAINT vehicle_documents_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(vehicle_id) ON DELETE CASCADE;


--
-- Name: vehicles vehicles_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id) ON DELETE CASCADE;


--
-- Name: vehicles vehicles_delivery_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_delivery_person_id_fkey FOREIGN KEY (delivery_person_id) REFERENCES public.delivery_persons(delivery_person_id) ON DELETE CASCADE;


--
-- Name: vehicles vehicles_val_by_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: objectif20
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_val_by_admin_id_fkey FOREIGN KEY (val_by_admin_id) REFERENCES public.admins(admin_id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

