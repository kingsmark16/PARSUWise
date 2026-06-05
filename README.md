# WISE — A Web-Based Learning Platform

> **Capstone Project** — WISE was developed as a capstone project that demonstrates the design and implementation of a centralized, role-based learning management platform for academic institutions.

**Developed by:**

- `Developer Name 1` *Mark Angel Concina*
- `Developer Name 2` *Kenneth Flororita*

WISE enables administrators to manage users and courses, faculty members to design and deliver structured learning content, and students to discover courses, learn at their own pace, take quizzes, collaborate through course forums, and earn verifiable certificates upon completion.

The project is built as a modern full-stack web application. Its React single-page application provides separate experiences for students, faculty, and administrators, while an Express API manages authentication, course data, progress, assessments, media, and certificates.

## Project objectives

WISE addresses the need for a single academic platform where course delivery and learner engagement can be managed in one place. The system is designed to:

- organize learning materials into courses and modules;
- support distinct access levels for students, faculty, and administrators;
- make learner progress and assessment results visible to the appropriate users;
- encourage discussion through course-specific forums;
- provide course-completion certificates that can be validated publicly; and
- give faculty and administrators analytics that support course and learner monitoring.

## Key capabilities

| Area | Included capabilities |
| --- | --- |
| Authentication and roles | Clerk-based sign-in and protected routes for `ADMIN`, `FACULTY`, and `STUDENT` roles. |
| Course management | Create, edit, publish, draft, archive, search, and organize courses by college. Courses can include thumbnails, descriptions, access codes, and certificate settings. |
| Learning content | Build ordered modules containing YouTube videos, Dropbox-hosted files, PDFs, and external links. Drag-and-drop support is used for content ordering. |
| Student learning | Browse courses, enroll, access course content, resume learning, view active/archived courses, and monitor module and course progress. |
| Assessment | Create module quizzes with multiple-choice, true/false, and identification questions; configure time and attempt limits; track attempts, scores, and answers. |
| Collaboration | Course forums support posts, replies, categories, likes, search, pinned posts, and locked posts. Socket.IO provides real-time post-room communication. |
| Certificates | Track course completion, generate certificate records and files, and allow public certificate verification through the `/verify` page. |
| Analytics | Faculty dashboards provide course and learner analytics, while administrator views include user activity, course totals, top courses, and top students. |
| Media and storage | Cloudinary manages thumbnails/uploads; Supabase is used for PDF storage; Dropbox and YouTube integrations support instructional media. |
| Security and reliability | Authenticated API routes use Clerk middleware, role checks, course-membership checks, activity tracking, and configurable Arcjet rate limiting. |

## User roles

| Role | Primary responsibilities |
| --- | --- |
| Administrator | Oversees users, courses, faculty and student records, platform-wide analytics, and course content visibility. |
| Faculty | Creates and manages courses, modules, lessons, links, and quizzes; views enrolled students and course analytics. |
| Student | Searches and enrolls in courses, completes lessons and quizzes, participates in discussions, tracks achievements, and receives certificates. |

## Technology stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Vite, React Router, Tailwind CSS, TanStack Query, Axios, Radix UI, Recharts, Socket.IO Client |
| Backend | Node.js, Express 5, Socket.IO, Prisma ORM |
| Database | PostgreSQL |
| Authentication | Clerk |
| File and media services | Cloudinary, Supabase Storage, Dropbox API, YouTube Data API / OAuth |
| Certificates | PDFKit and QR Code generation |
| Deployment | Render (configuration included in `render.yaml`) |

## System architecture

```text
React + Vite client
        |
        | HTTPS / REST API + Socket.IO
        v
Express + Node.js server
        |
        +-- Clerk authentication and role authorization
        +-- Prisma ORM -------------------- PostgreSQL database
        +-- Cloudinary -------------------- course thumbnails/media uploads
        +-- Supabase Storage -------------- PDF learning materials
        +-- Dropbox / YouTube ------------- lesson-content integrations
        +-- PDFKit + QR Code -------------- completion certificates
```

The backend also serves the production frontend build, so the application can be deployed as one web service.

## Repository structure

```text
WISE/
├── frontend/              # React/Vite client application
│   ├── src/pages/         # Student, faculty, admin, and public pages
│   ├── src/components/    # Reusable UI and feature components
│   ├── src/hooks/         # API, authentication, analytics, and UI hooks
│   └── public/            # Static assets
├── backend/               # Express API and real-time server
│   ├── prisma/            # PostgreSQL schema, migrations, and seed script
│   └── src/
│       ├── controllers/   # Business logic for platform features
│       ├── routes/        # REST API route definitions
│       ├── middlewares/   # Auth, role, rate-limit, and upload checks
│       ├── services/      # Progress, completion, certificate, and OAuth services
│       └── storage/       # Media-storage provider integrations
├── package.json           # Root build and production scripts
└── render.yaml            # Render deployment configuration
```

## Data model overview

The PostgreSQL schema is centered on `User`, `Course`, `Module`, and `Lesson` records. A course has ordered modules; a module can contain ordered lessons and links, plus one quiz. Enrollments connect students to courses, while lesson, module, and course progress records capture learning activity. Quiz submissions retain attempts and answers. Forum posts and replies are scoped to courses, and completion records can produce a one-to-one certificate.

## Local installation

### Prerequisites

- Node.js 20 or later
- npm
- A PostgreSQL database
- A Clerk application
- Cloudinary and Supabase projects for uploads

Dropbox and YouTube credentials are only required when their respective lesson-upload integrations are enabled.

### 1. Clone and install dependencies

```bash
git clone https://github.com/kingsmark16/WISE-A-Web-Based-Learning-Platform.git
cd WISE-A-Web-Based-Learning-Platform

cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure environment variables

Create `backend/.env`:

```env
# Application and database
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
API_BASE_URL=http://localhost:3000
VERIFY_BASE_URL=http://localhost:5173/verify

# Clerk
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Supabase PDF storage
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_BUCKET=pdfs

# Optional: Arcjet rate limiting
ARCJET_KEY=
ARCJET_MODE=LIVE
ARCJET_LIMIT_WINDOW=30s
ARCJET_LIMIT_MAX=10

# Optional: YouTube integration
YOUTUBE_API_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
YOUTUBE_REDIRECT_URI=http://localhost:3000/api/youtube-auth/callback
YT_OWNER_CLERK_ID=

# Optional: Dropbox integration
DROPBOX_CLIENT_ID=
DROPBOX_CLIENT_SECRET=
DROPBOX_REDIRECT_URI=http://localhost:3000/api/dropbox-auth/callback
```

Create `frontend/.env`:

```env
VITE_CLERK_PUBLISHABLE_KEY=
```

Never commit real credentials or service-role keys. Use values from your own development accounts.

### 3. Prepare the database

From `backend/`, generate the Prisma client and apply the existing migrations:

```bash
npx prisma generate
npx prisma migrate deploy
```

For a local development database where you want Prisma to create a new migration from schema changes, use `npx prisma migrate dev` instead. The included seed script contains sample forum data tied to specific existing record IDs, so review and adjust it before running `npx prisma db seed`.

### 4. Run the application

Use two terminals.

```bash
# Terminal 1
cd backend
npm run dev
```

```bash
# Terminal 2
cd frontend
npm run dev
```

Open the Vite URL displayed in the second terminal—normally [http://localhost:5173](http://localhost:5173). The API runs on `http://localhost:3000`.

## Available commands

| Location | Command | Purpose |
| --- | --- | --- |
| Root | `npm run build` | Installs dependencies, generates Prisma Client, and builds the frontend for deployment. |
| Root | `npm start` | Starts the backend production server. |
| `backend/` | `npm run dev` | Starts the API with Nodemon for development. |
| `backend/` | `npm start` | Starts the API with Node.js. |
| `frontend/` | `npm run dev` | Starts the Vite development server. |
| `frontend/` | `npm run build` | Creates the production frontend bundle. |
| `frontend/` | `npm run lint` | Runs ESLint across the frontend source. |

## Production deployment

`render.yaml` defines a Render web service that installs backend and frontend dependencies, generates Prisma Client, builds the frontend, and runs the backend. Configure the same runtime secrets listed above in Render’s environment-variable settings. Set `NODE_ENV=production`, provide a production `DATABASE_URL`, and set `API_BASE_URL` and `VERIFY_BASE_URL` to the deployed application URL.

In production, Express serves `frontend/dist` and falls back to the React application for client-side routes.

## Health check

After the backend starts, its health endpoint is available at:

```text
GET /health
```

It returns the service status, uptime, and a timestamp.

## Capstone scope and future enhancements

WISE demonstrates an end-to-end learning platform with content delivery, assessment, progress monitoring, collaboration, analytics, and certificate workflows. Possible future improvements include automated tests, a documented API specification, configurable grading policies, notification preferences, accessibility audits, and expanded reporting/export features.

## License

No license has been specified for this repository. Add a license file before distributing or reusing the project outside the intended academic context.
