# Kanban Board (Full Stack)

A beginner-friendly, production-aware Kanban Board application with:

- Frontend: HTML, CSS, Vanilla JavaScript
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Features: Multiple boards, custom columns, task CRUD, drag-and-drop task movement, persistent MongoDB storage

## Project Structure

```text
Kanban_Board/
  backend/
    config/
      db.js
    controllers/
      boardController.js
      columnController.js
      taskController.js
    middleware/
      errorHandler.js
    models/
      Board.js
      Column.js
      Task.js
    routes/
      boardRoutes.js
      columnRoutes.js
      taskRoutes.js
    seed/
      sampleData.js
    .env.example
    package.json
    server.js
  frontend/
    index.html
    styles.css
    script.js
  README.md
```

## REST API Endpoints

### Boards

- `GET /api/boards` - Get all boards
- `GET /api/boards/:id` - Get one board with columns and tasks
- `POST /api/boards` - Create board (`{ "name": "Board Name" }`)
- `PUT /api/boards/:id` - Update board name
- `DELETE /api/boards/:id` - Delete board with all related columns/tasks

### Columns

- `GET /api/boards/:boardId/columns` - Get columns in a board
- `POST /api/boards/:boardId/columns` - Create column (`{ "title": "Todo" }`)
- `PUT /api/columns/:id` - Update column title
- `DELETE /api/columns/:id` - Delete column and its tasks

### Tasks

- `GET /api/columns/:columnId/tasks` - Get tasks in a column
- `POST /api/columns/:columnId/tasks` - Create task (`{ "title": "Task", "description": "..." }`)
- `PUT /api/tasks/:id` - Update task title/description
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/move` - Move task (`{ "targetColumnId": "..." }`)

## Setup Instructions

1. Install MongoDB locally (or use MongoDB Atlas).
2. Open terminal in `Kanban_Board/backend`.
3. Install dependencies:

```bash
npm install
```

4. Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

5. Update `MONGODB_URI` inside `.env` if needed.
6. Seed sample data (optional but recommended):

```bash
npm run seed
```

7. Start backend server:

```bash
npm run dev
```

8. Open app in browser:

- Option A: Visit `http://localhost:5050` (frontend served by Express)
- Option B: Open `frontend/index.html` directly (make sure backend is running)

## Task Data Model

Each task stores:

- `title`
- `description`
- `createdDate`
- Board/column references for relationship and drag-drop movement

## Notes on Validation and Error Handling

- Mongoose validation for required and length-based fields
- Centralized Express error middleware (`middleware/errorHandler.js`)
- Friendly API error responses with proper HTTP status codes

## Optional Improvements

- Add user authentication (JWT)
- Add task priorities, due dates, labels
- Add column drag-and-drop ordering
- Replace `prompt`/`confirm` with custom modal UI
- Add integration tests with Jest + Supertest
- Add pagination for large boards

