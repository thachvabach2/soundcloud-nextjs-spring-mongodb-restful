# SoundCloud Next.js Spring MongoDB RESTful

This project is a mini SoundCloud clone system, built with a separated architecture: backend (Spring Boot + MongoDB) and frontend (Next.js, Vite, Material-UI). The system provides RESTful APIs and a modern UI for both users and admins.

## Architecture & Technology

- **Backend**: Java Spring Boot, MongoDB, RESTful API
- **Frontend**: Next.js (React), Vite, Material-UI
- **Authentication**: JWT, supports social login (Github, Google) and credentials
- **Media Management**: Upload music files and images via API
- **Authorization**: User/Admin roles, secured with Spring Security

## Main Features

### Backend (Spring Boot)
- Register, login, authentication (JWT, social network)
- User management, role-based access, profile update
- Track management: upload, listing, top tracks by category, search, delete, statistics (play/like count)
- Like/Dislike tracks, like count
- Comment on tracks: create, list, pagination, delete
- File upload management (music, images), file format validation

### Frontend (Next.js, Vite)
- Login, registration, social login UI
- User dashboard: listen to music, search, manage personal playlist
- Admin dashboard: manage users, approve/delete tracks, statistics
- Waveform visualization when playing music
- Responsive UI with Material-UI

## Installation

### Requirements
- Node.js >= 18
- Java 17+
- MongoDB

### Backend Setup

```bash
cd backend-spring/soundcloud
# Edit 'application.properties' to configure MongoDB connection
./mvnw spring-boot:run
```

### Frontend Setup

#### User app (Next.js + Material-UI):

```bash
cd frontend-nextjs/user-nextjs-mui-soundcloud
npm install
npm run dev
```

#### Admin app (Vite):

```bash
cd frontend-nextjs/admin-vite-soundcloud
npm install
npm run dev
```

## Usage

- Access `http://localhost:3000` for user, `http://localhost:5173` for admin (default)
- Register an account or log in with Github/Google
- Upload music, manage playlist, comment, like/dislike, etc.
- Admin logs in to the admin dashboard to manage/delete users, tracks

## Example API Endpoints (Backend)

- `POST /api/v1/auth/login` — Login (username/password)
- `POST /api/v1/auth/social-login` — Social login (Github/Google)
- `POST /api/v1/tracks` — Create/Upload a new track
- `POST /api/v1/tracks/top` — Get top tracks by category
- `POST /api/v1/likes` — Like/Dislike a track
- `POST /api/v1/comments` — Comment on a track

## Notes

- File upload supports format checking (accepts only mp3 for music, jpg/png for images)
- Supports role-based access: regular user, admin
- Backend APIs protected by JWT, you must include token in the `Authorization: Bearer <token>` header

---

## Contribution

Pull Requests, Issues, and feedback are welcome!

---

**Author**: [thachvabach2](https://github.com/thachvabach2)
