# Kanban Board (Auth + Multi-User)

This project upgrades the existing single-user Kanban app into a multi-user application with JWT authentication and strict per-user data isolation.

## Updated Folder Structure

```text
Kanban_Board/
  backend/
    config/
      db.js
    controllers/
      authController.js                 # NEW
      boardController.js                # UPDATED
      columnController.js               # UPDATED
      taskController.js                 # UPDATED
    middleware/
      authMiddleware.js                 # NEW
      errorHandler.js
    models/
      User.js                           # NEW
      Board.js                          # UPDATED
      Column.js                         # UPDATED
      Task.js                           # UPDATED
    routes/
      authRoutes.js                     # NEW
      boardRoutes.js                    # UPDATED (protected)
      columnRoutes.js                   # UPDATED (protected)
      taskRoutes.js                     # UPDATED (protected)
    seed/
      sampleData.js                     # UPDATED
      migrateAssignUser.js              # NEW (migration helper)
    .env.example                        # UPDATED
    package.json                        # UPDATED
    server.js                           # UPDATED
  frontend/
    index.html                          # UPDATED
    script.js                           # UPDATED
    styles.css                          # UPDATED
    login.html                          # NEW
    signup.html                         # NEW
    auth.js                             # NEW
    auth.css                            # NEW
  .gitignore
  README.md
```

## Authentication API

### Register
- `POST /api/auth/register`
- Body:

```json
{
  "name": "Atharv",
  "email": "atharv@example.com",
  "password": "password123"
}
```

### Login
- `POST /api/auth/login`
- Body:

```json
{
  "email": "atharv@example.com",
  "password": "password123"
}
```

### Current user
- `GET /api/auth/me`
- Header: `Authorization: Bearer <JWT_TOKEN>`

## Protected Resource Example (JWT)

`GET /api/boards`

```bash
curl -X GET http://localhost:5050/api/boards \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Key Backend Changes

- Added `User` model with hashed password (`bcryptjs`)
- Added JWT-based auth flow (`jsonwebtoken`)
- Added `protect` middleware to secure Boards/Columns/Tasks routes
- Added `userId` to Board, Column, Task schemas
- Refactored all queries to filter by authenticated user
- Added token-expiry/invalid-token handling

## Frontend Changes

- Added `login.html` and `signup.html`
- Added `auth.js` for register/login flow
- Stores token and user info in `localStorage`
- Adds `Authorization: Bearer <token>` in API calls
- Redirects unauthenticated users to login page
- Added logout button (client-side token removal)
- Loads only the logged-in user's boards/tasks

## Setup Instructions

1. Go to backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create env file:

```bash
cp .env.example .env
```

4. Update `.env`:

```env
PORT=5050
MONGODB_URI=mongodb://127.0.0.1:27017/kanban_board
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
```

5. Optional sample seed:

```bash
npm run seed
```

- Demo credentials after seed:
  - Email: `demo@example.com`
  - Password: `password123`

6. Start backend:

```bash
npm run dev
```

7. Open app:
- `http://localhost:5050/login.html`

## Migration Strategy (Single-User -> Multi-User)

### Option A: Fresh start (simplest)
- Run `npm run seed` to initialize data with a demo user.

### Option B: Keep existing data
- Use migration helper to assign legacy records to one owner account:

```bash
npm run migrate:assign-user
```

Optional env vars for migration user:
- `MIGRATION_USER_EMAIL`
- `MIGRATION_USER_PASSWORD`

## Security Practices Included

- Password hashing with bcrypt
- JWT verification middleware
- Route protection for all board/column/task APIs
- User ownership checks in queries and write operations
- Basic input validation on frontend and backend
- Expired/invalid token handling with login redirect

## Testing Checklist

1. Register two users.
2. Login as User A and create board/columns/tasks.
3. Login as User B and confirm User A data is not visible.
4. Try calling protected APIs without token and confirm 401.
5. Try invalid token and confirm 401 + frontend redirect.
6. Drag/drop task between columns for authenticated user.

## Git Workflow

### Create branch

```bash
git checkout -b feature/auth-multi-user
```

### Commit logically

```bash
git add backend/models/User.js backend/controllers/authController.js backend/middleware/authMiddleware.js backend/routes/authRoutes.js backend/server.js backend/package.json backend/.env.example

git commit -m "add user model and JWT auth endpoints"

git add backend/models/Board.js backend/models/Column.js backend/models/Task.js backend/controllers/boardController.js backend/controllers/columnController.js backend/controllers/taskController.js backend/routes/boardRoutes.js backend/routes/columnRoutes.js backend/routes/taskRoutes.js backend/seed/sampleData.js backend/seed/migrateAssignUser.js

git commit -m "scope boards columns tasks to authenticated users"

git add frontend/index.html frontend/script.js frontend/styles.css frontend/login.html frontend/signup.html frontend/auth.js frontend/auth.css README.md

git commit -m "add frontend login signup flow and auth-aware API calls"
```

### Push branch

```bash
git push -u origin feature/auth-multi-user
```

## Sample Pull Request

### Title
`feat: add JWT auth and multi-user isolation to Kanban app`

### Description
- Added registration/login using JWT
- Added User model with hashed passwords
- Protected Kanban APIs with auth middleware
- Added user ownership (`userId`) to Board/Column/Task
- Refactored controllers to prevent cross-user data access
- Added login/signup UI and logout flow
- Updated docs and migration strategy for existing data

### Testing Instructions
- Run backend, register two users, verify isolated data
- Validate protected endpoints return 401 without/invalid token
- Validate drag-and-drop still works after authentication
