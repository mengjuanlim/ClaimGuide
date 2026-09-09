# ClaimGuide SaaS testing build

A deployable full-stack testing application for insureds to organise claim documents, record policy issues, maintain an audit history and prepare editable insurer responses.

## Included
- React/Vite responsive frontend
- Express API and SQLite persistence
- Google and Facebook OAuth hooks through Passport
- Optional demo login for testing
- Claim creation, document upload/download, response versioning and activity history
- Helmet security headers, authenticated ownership checks, upload allow-list and size limits
- Dockerfile and Docker Compose

## Local start
1. Install Node.js 22 or later.
2. Copy `.env.example` to `.env`.
3. Replace both secrets. Keep `DEMO_AUTH=true` for initial testing.
4. Run `npm install`.
5. Run `npm run dev`.
6. Open `http://localhost:5173` and use **Use testing account**.

## Docker start
1. Copy `.env.example` to `.env` and replace secrets.
2. Run `docker compose up --build`.
3. Open `http://localhost:4000`.

## Google login
Create a Google OAuth web application and set:
- Authorized JavaScript origin: your public application URL
- Authorized redirect URI: `https://YOUR-DOMAIN/auth/google/callback`
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`

## Facebook login
Create a Meta/Facebook app with Facebook Login and set:
- Valid OAuth redirect URI: `https://YOUR-DOMAIN/auth/facebook/callback`
- `FACEBOOK_APP_ID` and `FACEBOOK_APP_SECRET` in `.env`

Set `APP_URL` to the frontend origin. For the single-container production build, set it to the public HTTPS URL. Set `DEMO_AUTH=false` before external testing.

## Testing limitations
- The response generator is intentionally a deterministic template using verified user-entered fields. It does not call an AI provider or make a coverage decision.
- SQLite and local disk uploads are suitable for a small test deployment. For public or multi-instance use, replace these with a managed database and private object storage.
- Configure HTTPS, secure secrets, backups, malware scanning, rate limiting, monitoring, retention/deletion, privacy notices and jurisdiction-specific legal review before public use.
- Do not use real sensitive claim data until the environment and data-processing arrangements have been approved.

## Useful endpoints
- `GET /api/health`
- `GET /api/me`
- `GET|POST /api/claims`
- `GET|PATCH /api/claims/:id`
- `POST /api/claims/:id/documents`
- `POST /api/claims/:id/generate`
- `POST /api/claims/:id/drafts`
