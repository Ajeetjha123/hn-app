# HN Digest — Hacker News Scraper App

A full-stack MERN application that scrapes the top 10 Hacker News stories, stores them in MongoDB, and provides a clean UI to browse, read details, and bookmark your favourite stories.

## Tech Stack

- **Frontend**: React 18 + Vite, React Router v6, CSS Modules
- **Backend**: Node.js, Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT (JSON Web Tokens)
- **Scraping**: Axios + Cheerio

---

## Project Structure

```
hn-app/
├── backend/
│   ├── controllers/      # Route handler logic
│   │   ├── authController.js
│   │   ├── storiesController.js
│   │   └── scraperController.js
│   ├── middleware/
│   │   └── auth.js       # JWT protect middleware
│   ├── models/
│   │   ├── User.js
│   │   └── Story.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── stories.js
│   │   └── scraper.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js        # Axios instance with interceptors
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── StoryCard.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx  # Global auth state (React Context)
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Bookmarks.jsx
    │   │   └── StoryDetail.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## Prerequisites

- Node.js ≥ 18
- MongoDB ([MongoDB Atlas](https://www.mongodb.com/atlas))
- npm or yarn

---

## Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/Ajeetjha123/hn-app.git
cd hn-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/hn_scraper
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

Start the backend:

```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

> The server will auto-scrape Hacker News on startup.

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=https://hn-backend-bakc.onrender.com

Start the frontend:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## API Reference

### Auth

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user + bookmarks | Yes |

**Register / Login body:**
```json
{ "username": "john", "email": "john@example.com", "password": "secret123" }
```

**Response includes:**
```json
{ "token": "eyJ...", "user": { "id": "...", "username": "john", ... } }
```

### Stories

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/stories` | Get all stories (sorted by points) | No |
| GET | `/api/stories?page=1&limit=10` | Paginated stories | No |
| GET | `/api/stories/:id` | Get single story | No |
| POST | `/api/stories/:id/bookmark` | Toggle bookmark | Yes |

### Scraper

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/scrape` | Trigger manual scrape | No |

---

## Environment Variables

### Backend

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | — |
| `JWT_SECRET` | Secret key for JWT signing | — |
| `NODE_ENV` | Environment | `development` |
| `CLIENT_URL` | Frontend URL for CORS | `https://hn-app-one.vercel.app` |

### Frontend

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | CLIENT_URL=https://hn-app-one.vercel.app | `http://localhost:5000` |

---

## Features

- **Web Scraper** — Scrapes top 10 HN stories on server start and via `POST /api/scrape`
- **JWT Auth** — Register, login, protected routes
- **Stories API** — Full CRUD with pagination
- **Bookmark Toggle** — Persisted via backend, requires login
- **Protected Bookmarks Page** — Redirects to login if unauthenticated
- **React Context** — Global auth state management
- **Pagination** — `?page=1&limit=10` query support
- **Clean UI** — Dark editorial design, responsive, animated

---

## Deployment

### Backend (Render / Railway)

1. Push backend to GitHub
2. Create a new Web Service on Render/Railway
3. Set environment variables in the dashboard
4. Set build command: `npm install`
5. Set start command: `npm start`

### Frontend (Vercel / Netlify)

1. Push frontend to GitHub
2. Import project in Vercel
3. Set environment variable: `VITE_API_URL=https://hn-backend-bakc.onrender.com
4. Deploy

---

## License

MIT
