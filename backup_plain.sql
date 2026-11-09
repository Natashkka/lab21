--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2026-11-07 00:42:58

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
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: tests_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO tests_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 50369)
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: tests_user
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO tests_user;

--
-- TOC entry 219 (class 1259 OID 50375)
-- Name: Tests; Type: TABLE; Schema: public; Owner: tests_user
--

CREATE TABLE public."Tests" (
    id integer NOT NULL,
    title character varying(255),
    topic character varying(255),
    questions jsonb,
    "generatedByAI" boolean,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    difficulty character varying(255) DEFAULT 'easy'::character varying,
    status character varying(255) DEFAULT 'ready'::character varying
);


ALTER TABLE public."Tests" OWNER TO tests_user;

--
-- TOC entry 218 (class 1259 OID 50374)
-- Name: Tests_id_seq; Type: SEQUENCE; Schema: public; Owner: tests_user
--

CREATE SEQUENCE public."Tests_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Tests_id_seq" OWNER TO tests_user;

--
-- TOC entry 4873 (class 0 OID 0)
-- Dependencies: 218
-- Name: Tests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tests_user
--

ALTER SEQUENCE public."Tests_id_seq" OWNED BY public."Tests".id;


--
-- TOC entry 221 (class 1259 OID 58560)
-- Name: Users; Type: TABLE; Schema: public; Owner: tests_user
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    "passwordHash" character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    role character varying(255) DEFAULT 'user'::character varying NOT NULL,
    "aiGenerationsToday" integer DEFAULT 0 NOT NULL,
    "lastGenerationDate" character varying(255)
);


ALTER TABLE public."Users" OWNER TO tests_user;

--
-- TOC entry 220 (class 1259 OID 58559)
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: tests_user
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Users_id_seq" OWNER TO tests_user;

--
-- TOC entry 4874 (class 0 OID 0)
-- Dependencies: 220
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tests_user
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- TOC entry 4704 (class 2604 OID 50378)
-- Name: Tests id; Type: DEFAULT; Schema: public; Owner: tests_user
--

ALTER TABLE ONLY public."Tests" ALTER COLUMN id SET DEFAULT nextval('public."Tests_id_seq"'::regclass);


--
-- TOC entry 4707 (class 2604 OID 58563)
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: tests_user
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- TOC entry 4863 (class 0 OID 50369)
-- Dependencies: 217
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: tests_user
--

COPY public."SequelizeMeta" (name) FROM stdin;
20260914133931-create-test.js
20260914135232-add-difficulty-to-tests.js
20260918110744-create-user.js
20260923104007-add-role-to-users.js
20260923111940-add-ai-limit-to-users.js
\.


--
-- TOC entry 4865 (class 0 OID 50375)
-- Dependencies: 219
-- Data for Name: Tests; Type: TABLE DATA; Schema: public; Owner: tests_user
--

COPY public."Tests" (id, title, topic, questions, "generatedByAI", "createdAt", "updatedAt", difficulty, status) FROM stdin;
2	Основы Node.js	Node.js	[{"options": ["Цикл событий", "База данных", "Фреймворк"], "question": "Что такое Event Loop?", "correctAnswer": 0}]	f	2026-09-15 10:06:42.646+00	2026-10-27 11:22:00.608+00	easy	ready
1	Обновлённый JavaScript	JavaScript	[{"options": ["Поднятие", "Опускание", "Сдвиг"], "question": "Что такое hoisting?", "correctAnswer": 0}]	f	2026-09-15 10:06:42.646+00	2026-10-27 12:33:42.634+00	easy	ready
20	ысвм	ысвм	[{"options": ["Вариант А", "Вариант Б", "Вариант В"], "question": "Вопрос 1 по теме \\"ысвм\\"?", "correctAnswer": 0}, {"options": ["Вариант А", "Вариант Б", "Вариант В"], "question": "Вопрос 2 по теме \\"ысвм\\"?", "correctAnswer": 0}, {"options": ["Вариант А", "Вариант Б", "Вариант В"], "question": "Вопрос 3 по теме \\"ысвм\\"?", "correctAnswer": 0}, {"options": ["Вариант А", "Вариант Б", "Вариант В"], "question": "Вопрос 4 по теме \\"ысвм\\"?", "correctAnswer": 0}, {"options": ["Вариант А", "Вариант Б", "Вариант В"], "question": "Вопрос 5 по теме \\"ысвм\\"?", "correctAnswer": 0}]	t	2026-10-27 09:28:25.106+00	2026-10-27 09:28:25.106+00	medium	ready
27	SQL	SQL	[{"options": ["Вариант А", "Вариант Б", "Вариант В"], "question": "Вопрос 1 по теме \\"SQL\\"?", "correctAnswer": 0}, {"options": ["Вариант А", "Вариант Б", "Вариант В"], "question": "Вопрос 2 по теме \\"SQL\\"?", "correctAnswer": 0}, {"options": ["Вариант А", "Вариант Б", "Вариант В"], "question": "Вопрос 3 по теме \\"SQL\\"?", "correctAnswer": 0}, {"options": ["Вариант А", "Вариант Б", "Вариант В"], "question": "Вопрос 4 по теме \\"SQL\\"?", "correctAnswer": 0}, {"options": ["Вариант А", "Вариант Б", "Вариант В"], "question": "Вопрос 5 по теме \\"SQL\\"?", "correctAnswer": 0}, {"options": ["Вариант А", "Вариант Б", "Вариант В"], "question": "Вопрос 6 по теме \\"SQL\\"?", "correctAnswer": 0}, {"options": ["Вариант А", "Вариант Б", "Вариант В"], "question": "Вопрос 7 по теме \\"SQL\\"?", "correctAnswer": 0}, {"options": ["Вариант А", "Вариант Б", "Вариант В"], "question": "Вопрос 8 по теме \\"SQL\\"?", "correctAnswer": 0}, {"options": ["Вариант А", "Вариант Б", "Вариант В"], "question": "Вопрос 9 по теме \\"SQL\\"?", "correctAnswer": 0}, {"options": ["Вариант А", "Вариант Б", "Вариант В"], "question": "Вопрос 10 по теме \\"SQL\\"?", "correctAnswer": 0}, {"options": ["Вариант А", "Вариант Б", "Вариант В"], "question": "Вопрос 11 по теме \\"SQL\\"?", "correctAnswer": 0}, {"options": ["Вариант А", "Вариант Б", "Вариант В"], "question": "Вопрос 12 по теме \\"SQL\\"?", "correctAnswer": 0}]	t	2026-10-28 13:35:34.828+00	2026-10-28 13:35:42.083+00	hard	archived
\.


--
-- TOC entry 4867 (class 0 OID 58560)
-- Dependencies: 221
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: tests_user
--

COPY public."Users" (id, email, "passwordHash", "createdAt", "updatedAt", role, "aiGenerationsToday", "lastGenerationDate") FROM stdin;
2	user@example.com	$2b$10$Ktx3v2y2ZVDeOoPLfmFxhuXAxLHB2xLQhcFoPr98wdyiDro3QzU.S	2026-09-23 11:10:41.66+00	2026-10-16 11:01:27.34+00	user	3	2026-10-16
3	bart.nat8@gmail.com	$2b$10$Bkj/FxASU0LWy/w77ZxSo.iNxwm76a2OQeJWFlKEuJevDD/gTdncm	2026-10-16 11:17:56.162+00	2026-10-16 11:17:56.162+00	user	0	\N
4	bart.nat@gmail.com	$2b$10$v.rjeQ03pxHfID3lvtb/L.vmeNoFLFHcpuejDWPrZP59zJSrBT3Wm	2026-10-27 10:35:46.452+00	2026-10-27 10:35:46.452+00	user	0	\N
5	bart.na@gmail.com	$2b$10$jTkPchyDTdXq8V9iiCJb0OAfwqMk6lXqQZ5aRMtesMh4PasTc6zji	2026-10-27 10:40:02.397+00	2026-10-27 10:40:02.397+00	user	0	\N
6	bart.nat88@gmail.com	$2b$10$2KH30BVwecwsbBCC5hc6GOgp.1E4PuQ1NoVWskftVQJMgqr3of2ti	2026-10-27 10:41:11.653+00	2026-10-27 10:41:59.115+00	user	3	2026-10-27
1	test@example.com	$2b$10$BAvQxH0rgmmPOV0wozTlA.jlNJpnI9QsqzpfU7ht89wyvdVooKhkC	2026-09-18 11:48:23.145+00	2026-10-28 13:35:34.776+00	admin	1	2026-10-28
\.


--
-- TOC entry 4875 (class 0 OID 0)
-- Dependencies: 218
-- Name: Tests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tests_user
--

SELECT pg_catalog.setval('public."Tests_id_seq"', 27, true);


--
-- TOC entry 4876 (class 0 OID 0)
-- Dependencies: 220
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tests_user
--

SELECT pg_catalog.setval('public."Users_id_seq"', 6, true);


--
-- TOC entry 4711 (class 2606 OID 50373)
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: tests_user
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- TOC entry 4713 (class 2606 OID 50382)
-- Name: Tests Tests_pkey; Type: CONSTRAINT; Schema: public; Owner: tests_user
--

ALTER TABLE ONLY public."Tests"
    ADD CONSTRAINT "Tests_pkey" PRIMARY KEY (id);


--
-- TOC entry 4715 (class 2606 OID 58569)
-- Name: Users Users_email_key; Type: CONSTRAINT; Schema: public; Owner: tests_user
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- TOC entry 4717 (class 2606 OID 58567)
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: tests_user
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


-- Completed on 2026-11-07 00:42:58

--
-- PostgreSQL database dump complete
--

