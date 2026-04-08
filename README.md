# Kanban Board

A full-stack Kanban Board web application for planning and tracking work with a clean drag-and-drop UI, secure authentication, and email-powered account workflows.

The project is beginner-friendly to read and run, while using production-aware patterns such as JWT auth, protected APIs, password hashing, token-based password reset, and per-user data isolation.

## Features

### Core Features
- Create and manage multiple boards
- Add, edit, and delete columns
- Add, edit, and delete tasks
- Drag and drop tasks between columns
- Dynamic UI updates without page reload

### Authentication
- User signup and login with JWT
- Auth session stored client-side and sent via `Authorization: Bearer <token>`
- Protected backend routes for boards, columns, and tasks
- Multi-user data isolation (users can access only their own boards/data)

### Password Management
- Forgot password request flow (`/api/auth/forgot-password`)
- Secure reset token generation and hashing
- Token expiration checks (time-bound reset links)
- Password reset endpoint (`/api/auth/reset-password/:token`)

### Email System
- Welcome email on successful registration
- Modern HTML reset-password email template (CTA + fallback link + security note)
- Nodemailer integration with SMTP and development fallback transport

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT (`jsonwebtoken`), `bcryptjs` |
| Email | Nodemailer |
| Dev Tools | Nodemon |

## Project Structure

```text
Kanban_Board/
  backend/
    config/
      db.js
    controllers/
      authController.js
      boardController.js
      columnController.js
      taskController.js
    middleware/
      authMiddleware.js
      errorHandler.js
    models/
      Board.js
      Column.js
      Task.js
      User.js
    routes/
      authRoutes.js
      boardRoutes.js
      columnRoutes.js
      taskRoutes.js
    seed/
      sampleData.js
      migrateAssignUser.js
    utils/
      sendEmail.js
      sendWelcomeEmail.js
      emailTemplates.js
    .env.example
    package.json
    server.js
  frontend/
    index.html
    login.html
    signup.html
    forgot-password.html
    reset-password.html
    script.js
    auth.js
    password-reset.js
    styles.css
    auth.css
  .gitignore
  README.md
```

## Setup Instructions

### Prerequisites
- Node.js (LTS recommended)
- MongoDB local or MongoDB Atlas

### 1. Clone and install

```bash
git clone <your-repo-url>
cd Kanban_Board/backend
npm install
```

### 2. Configure environment

Copy env template:

```bash
cp .env.example .env
```

Update values in `.env`:

```env
PORT=5050
MONGODB_URI=mongodb://127.0.0.1:27017/kanban_board
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=7d

# Frontend URL for email links
FRONTEND_URL=http://localhost:5050
CLIENT_URL=http://localhost:5050

# Email sender
EMAIL_FROM=no-reply@kanban.local

# SMTP (primary)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

# Alternate SMTP keys (supported aliases)
EMAIL_USER=
EMAIL_PASS=
```

Notes:
- The project uses `MONGODB_URI` (commonly referred to as `MONGO_URI` in other projects).
- If SMTP variables are empty, email falls back to development mode and logs payload in server console.

### 3. Optional seed data

```bash
npm run seed
```

Demo account after seeding:
- Email: `demo@example.com`
- Password: `password123`

### 4. Run the app

```bash
npm run dev
```

Open in browser:
- `http://localhost:5050/login.html`

## Usage Guide

1. Sign up or log in.
2. Create your first board.
3. Add columns (for example: Todo, In Progress, Done).
4. Create tasks with title and description.
5. Drag tasks across columns to track progress.
6. Use forgot-password flow if you need to reset credentials.

## API Overview

### Auth Routes
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (protected)
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password/:token`

### Board Routes (protected)
- `GET /api/boards`
- `GET /api/boards/:id`
- `POST /api/boards`
- `PUT /api/boards/:id`
- `DELETE /api/boards/:id`

### Column Routes (protected)
- `GET /api/boards/:boardId/columns`
- `POST /api/boards/:boardId/columns`
- `PUT /api/columns/:id`
- `DELETE /api/columns/:id`

### Task Routes (protected)
- `GET /api/columns/:columnId/tasks`
- `POST /api/columns/:columnId/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `PATCH /api/tasks/:id/move`

### Example Request With JWT

```bash
curl -X GET http://localhost:5050/api/boards \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Screenshots

Add screenshots in your repository (for example under `docs/screenshots/`) and update links below.

### Login Page
![Login Page Placeholder](https://via.placeholder.com/1200x700?text=Login+Page)

### Board UI
![Board UI Placeholder](https://via.placeholder.com/1200x700?text=Kanban+Board+UI)

### Drag and Drop
![Drag and Drop Placeholder](https://via.placeholder.com/1200x700?text=Drag+and+Drop)

## Security Highlights

- Password hashing with `bcryptjs`
- JWT authentication and protected API middleware
- User-scoped DB queries to prevent cross-user data access
- Token-based password reset with hashed reset tokens and expiry
- Generic forgot-password responses to reduce user enumeration risk
- Basic input validation on frontend and backend

## Migration Strategy (Single-User to Multi-User)

### Option A: Fresh start
Run seed to initialize a clean multi-user-compatible dataset:

```bash
npm run seed
```

### Option B: Assign legacy data to an owner

```bash
npm run migrate:assign-user
```

Optional migration env vars:
- `MIGRATION_USER_EMAIL`
- `MIGRATION_USER_PASSWORD`

## Future Improvements

- Real-time collaboration with WebSockets
- Role-based access control (RBAC)
- Push/email in-app notifications
- Board and task activity history
- Native mobile application

## Contributing

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feature/your-feature-name
```

3. Make focused commits with clear messages.
4. Run and test the app locally.
5. Push your branch and open a Pull Request.

## Quick Troubleshooting

- `EADDRINUSE`: change `PORT` in `.env` or stop the process using that port.
- Cannot connect to DB: verify `MONGODB_URI` and ensure MongoDB is running/reachable.
- No email received: verify SMTP credentials and check spam; in dev mode inspect server logs.

## License

This project is for educational and learning purposes. Add your preferred license if distributing publicly.
