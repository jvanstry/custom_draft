--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: draft; Type: TABLE; Schema: public; Owner: jer; Tablespace: 
--

CREATE TABLE draft (
    start_time timestamp without time zone NOT NULL,
    "createdAt" timestamp without time zone,
    id integer NOT NULL,
    league_id integer NOT NULL
);


ALTER TABLE public.draft OWNER TO jer;

--
-- Name: draft_eligiblePicks; Type: TABLE; Schema: public; Owner: jer; Tablespace: 
--

CREATE TABLE "draft_eligiblePicks" (
    draft_id real,
    eligiblepicks_id real
);


ALTER TABLE public."draft_eligiblePicks" OWNER TO jer;

--
-- Name: draft_id_seq; Type: SEQUENCE; Schema: public; Owner: jer
--

CREATE SEQUENCE draft_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.draft_id_seq OWNER TO jer;

--
-- Name: draft_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jer
--

ALTER SEQUENCE draft_id_seq OWNED BY draft.id;


--
-- Name: draftee; Type: TABLE; Schema: public; Owner: jer; Tablespace: 
--

CREATE TABLE draftee (
    name text NOT NULL,
    "overallPick" real,
    available boolean DEFAULT true,
    "createdAt" timestamp without time zone,
    id integer NOT NULL
);


ALTER TABLE public.draftee OWNER TO jer;

--
-- Name: draftee_id_seq; Type: SEQUENCE; Schema: public; Owner: jer
--

CREATE SEQUENCE draftee_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.draftee_id_seq OWNER TO jer;

--
-- Name: draftee_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jer
--

ALTER SEQUENCE draftee_id_seq OWNED BY draftee.id;


--
-- Name: league; Type: TABLE; Schema: public; Owner: jer; Tablespace: 
--

CREATE TABLE league (
    name text NOT NULL,
    "createdAt" timestamp without time zone,
    id integer NOT NULL,
    creator_id integer NOT NULL
);


ALTER TABLE public.league OWNER TO jer;

--
-- Name: league_id_seq; Type: SEQUENCE; Schema: public; Owner: jer
--

CREATE SEQUENCE league_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.league_id_seq OWNER TO jer;

--
-- Name: league_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jer
--

ALTER SEQUENCE league_id_seq OWNED BY league.id;


--
-- Name: uzer; Type: TABLE; Schema: public; Owner: jer; Tablespace: 
--

CREATE TABLE uzer (
    name text NOT NULL,
    email text,
    password_hash text,
    "createdAt" timestamp without time zone,
    id integer NOT NULL
);


ALTER TABLE public.uzer OWNER TO jer;

--
-- Name: uzer_createdLeagues; Type: TABLE; Schema: public; Owner: jer; Tablespace: 
--

CREATE TABLE "uzer_createdLeagues" (
    uzer_id real,
    createdleagues_id real
);


ALTER TABLE public."uzer_createdLeagues" OWNER TO jer;

--
-- Name: uzer_draftPicks; Type: TABLE; Schema: public; Owner: jer; Tablespace: 
--

CREATE TABLE "uzer_draftPicks" (
    uzer_id real,
    draftpicks_id real
);


ALTER TABLE public."uzer_draftPicks" OWNER TO jer;

--
-- Name: uzer_id_seq; Type: SEQUENCE; Schema: public; Owner: jer
--

CREATE SEQUENCE uzer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.uzer_id_seq OWNER TO jer;

--
-- Name: uzer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jer
--

ALTER SEQUENCE uzer_id_seq OWNED BY uzer.id;


--
-- Name: uzer_leagues; Type: TABLE; Schema: public; Owner: jer; Tablespace: 
--

CREATE TABLE uzer_leagues (
    uzer_id real,
    leagues_id real,
    why text
);


ALTER TABLE public.uzer_leagues OWNER TO jer;

--
-- Name: id; Type: DEFAULT; Schema: public; Owner: jer
--

ALTER TABLE ONLY draft ALTER COLUMN id SET DEFAULT nextval('draft_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: jer
--

ALTER TABLE ONLY draftee ALTER COLUMN id SET DEFAULT nextval('draftee_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: jer
--

ALTER TABLE ONLY league ALTER COLUMN id SET DEFAULT nextval('league_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: jer
--

ALTER TABLE ONLY uzer ALTER COLUMN id SET DEFAULT nextval('uzer_id_seq'::regclass);


--
-- Data for Name: draft; Type: TABLE DATA; Schema: public; Owner: jer
--

COPY draft (start_time, "createdAt", id, league_id) FROM stdin;
\.


--
-- Data for Name: draft_eligiblePicks; Type: TABLE DATA; Schema: public; Owner: jer
--

COPY "draft_eligiblePicks" (draft_id, eligiblepicks_id) FROM stdin;
\.


--
-- Name: draft_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jer
--

SELECT pg_catalog.setval('draft_id_seq', 1, false);


--
-- Data for Name: draftee; Type: TABLE DATA; Schema: public; Owner: jer
--

COPY draftee (name, "overallPick", available, "createdAt", id) FROM stdin;
\.


--
-- Name: draftee_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jer
--

SELECT pg_catalog.setval('draftee_id_seq', 1, false);


--
-- Data for Name: league; Type: TABLE DATA; Schema: public; Owner: jer
--

COPY league (name, "createdAt", id, creator_id) FROM stdin;
\.


--
-- Name: league_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jer
--

SELECT pg_catalog.setval('league_id_seq', 1, false);


--
-- Data for Name: uzer; Type: TABLE DATA; Schema: public; Owner: jer
--

COPY uzer (name, email, password_hash, "createdAt", id) FROM stdin;
jerry	\N	\N	2014-04-25 20:37:13.351	1
\.


--
-- Data for Name: uzer_createdLeagues; Type: TABLE DATA; Schema: public; Owner: jer
--

COPY "uzer_createdLeagues" (uzer_id, createdleagues_id) FROM stdin;
\.


--
-- Data for Name: uzer_draftPicks; Type: TABLE DATA; Schema: public; Owner: jer
--

COPY "uzer_draftPicks" (uzer_id, draftpicks_id) FROM stdin;
\.


--
-- Name: uzer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jer
--

SELECT pg_catalog.setval('uzer_id_seq', 1, true);


--
-- Data for Name: uzer_leagues; Type: TABLE DATA; Schema: public; Owner: jer
--

COPY uzer_leagues (uzer_id, leagues_id, why) FROM stdin;
\.


--
-- Name: draft_pkey; Type: CONSTRAINT; Schema: public; Owner: jer; Tablespace: 
--

ALTER TABLE ONLY draft
    ADD CONSTRAINT draft_pkey PRIMARY KEY (id);


--
-- Name: draftee_pkey; Type: CONSTRAINT; Schema: public; Owner: jer; Tablespace: 
--

ALTER TABLE ONLY draftee
    ADD CONSTRAINT draftee_pkey PRIMARY KEY (id);


--
-- Name: league_pkey; Type: CONSTRAINT; Schema: public; Owner: jer; Tablespace: 
--

ALTER TABLE ONLY league
    ADD CONSTRAINT league_pkey PRIMARY KEY (id);


--
-- Name: uzer_pkey; Type: CONSTRAINT; Schema: public; Owner: jer; Tablespace: 
--

ALTER TABLE ONLY uzer
    ADD CONSTRAINT uzer_pkey PRIMARY KEY (id);


--
-- Name: draft_eligiblePicks_draft_id_index; Type: INDEX; Schema: public; Owner: jer; Tablespace: 
--

CREATE INDEX "draft_eligiblePicks_draft_id_index" ON "draft_eligiblePicks" USING btree (draft_id);


--
-- Name: draft_eligiblePicks_eligiblepicks_id_index; Type: INDEX; Schema: public; Owner: jer; Tablespace: 
--

CREATE INDEX "draft_eligiblePicks_eligiblepicks_id_index" ON "draft_eligiblePicks" USING btree (eligiblepicks_id);


--
-- Name: uzer_createdLeagues_createdleagues_id_index; Type: INDEX; Schema: public; Owner: jer; Tablespace: 
--

CREATE INDEX "uzer_createdLeagues_createdleagues_id_index" ON "uzer_createdLeagues" USING btree (createdleagues_id);


--
-- Name: uzer_createdLeagues_uzer_id_index; Type: INDEX; Schema: public; Owner: jer; Tablespace: 
--

CREATE INDEX "uzer_createdLeagues_uzer_id_index" ON "uzer_createdLeagues" USING btree (uzer_id);


--
-- Name: uzer_draftPicks_draftpicks_id_index; Type: INDEX; Schema: public; Owner: jer; Tablespace: 
--

CREATE INDEX "uzer_draftPicks_draftpicks_id_index" ON "uzer_draftPicks" USING btree (draftpicks_id);


--
-- Name: uzer_draftPicks_uzer_id_index; Type: INDEX; Schema: public; Owner: jer; Tablespace: 
--

CREATE INDEX "uzer_draftPicks_uzer_id_index" ON "uzer_draftPicks" USING btree (uzer_id);


--
-- Name: uzer_leagues_leagues_id_index; Type: INDEX; Schema: public; Owner: jer; Tablespace: 
--

CREATE INDEX uzer_leagues_leagues_id_index ON uzer_leagues USING btree (leagues_id);


--
-- Name: uzer_leagues_uzer_id_index; Type: INDEX; Schema: public; Owner: jer; Tablespace: 
--

CREATE INDEX uzer_leagues_uzer_id_index ON uzer_leagues USING btree (uzer_id);


--
-- Name: public; Type: ACL; Schema: -; Owner: jer
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM jer;
GRANT ALL ON SCHEMA public TO jer;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

