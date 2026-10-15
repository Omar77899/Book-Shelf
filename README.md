# BookShelf Manager

A MERN-stack app for managing a personal reading list.

- **Frontend:** React (Vite) + Tailwind CSS, state via `useReducer`
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose

## Project structure

```
bookshelf/
├── server/
│   ├── models/Book.js        # Mongoose schema (id mapping in toJSON)
│   ├── routes/books.js       # CRUD routes + validation
│   ├── server.js             # Express app, middleware, error handler, DB connect
│   └── .env.example
└── client/
    └── src/
        ├── App.jsx           # useReducer state, API calls
        ├── api.js            # fetch helpers
        └── components/
            ├── BookForm.jsx  # title + author + button
            ├── BookList.jsx  # renders the list / empty / loading states
            └── BookItem.jsx  # mark as read + delete
```

## Setup

You need Node 18+ and MongoDB (local or Atlas).

### 1. Backend

```bash
cd server
npm install
cp .env.example .env      # set MONGO_URI (local or Atlas)
npm run dev               # http://localhost:5000
```

### 2. Frontend

```bash
cd client
npm install
npm run dev               # http://localhost:5173
```

The Vite dev server proxies `/books` to `http://localhost:5000`, so no extra config is needed.

## API

Every book is returned as `{ id, title, author, status, createdAt }` (`_id` is exposed as `id`).
Responses are `{ success: true, data }` on success and `{ success: false, error }` on failure.

| Method | Endpoint     | Description        | Success | Errors        |
|--------|--------------|--------------------|---------|---------------|
| GET    | /books       | List all books     | 200     | 500           |
| POST   | /books       | Add a book         | 201     | 400           |
| PUT    | /books/:id   | Mark book as read  | 200     | 400, 404      |
| DELETE | /books/:id   | Delete a book      | 200     | 400, 404      |

### Postman / Insomnia test cases

1. `POST /books` with `{ "title": "Atomic Habits", "author": "James Clear" }` → **201**, returns `id`, `status: "unread"`.
2. `POST /books` with `{ "title": "   ", "author": "X" }` → **400** (empty title).
3. `POST /books` with `{ "title": "X" }` → **400** (missing author).
4. `POST /books` with malformed JSON → **400**.
5. `GET /books` → **200**, array newest first.
6. `PUT /books/<id>` → **200**, `status: "read"`.
7. `PUT /books/not-an-id` → **400** (invalid id).
8. `PUT /books/64b7f0f2f0f0f0f0f0f0f0f0` (valid but non-existent) → **404**.
9. `DELETE /books/<id>` → **200**; deleting again → **404**.
10. Restart the server, `GET /books` → remaining books are still there (persistence).
