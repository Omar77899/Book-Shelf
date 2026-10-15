import { useEffect, useReducer, useState } from 'react';
import BookForm from './components/BookForm.jsx';
import BookList from './components/BookList.jsx';
import * as api from './api.js';

const initialState = {
  books: [],
  loading: true,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_BOOKS':
      return {
        books: action.payload,
        loading: false,
      };

    case 'ADD_BOOK':
      return {
        ...state,
        books: [action.payload, ...state.books],
      };

    case 'MARK_READ':
      return {
        ...state,
        books: state.books.map((book) =>
          book.id === action.payload.id
            ? action.payload
            : book
        ),
      };

    case 'DELETE_BOOK':
      return {
        ...state,
        books: state.books.filter(
          (book) => book.id !== action.payload
        ),
      };

    case 'LOAD_FAILED':
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}

function StatCard({ label, value, description }) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg sm:p-6">
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {value}
      </p>

      <p className="mt-2 text-sm leading-5 text-slate-500">
        {description}
      </p>

      <div className="mt-5 h-1 w-12 rounded-full bg-indigo-600 transition-all duration-300 group-hover:w-20" />
    </div>
  );
}

export default function App() {
  const [{ books, loading }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getBooks()
      .then((data) => {
        dispatch({
          type: 'SET_BOOKS',
          payload: data,
        });
      })
      .catch((err) => {
        setError(
          err.message || 'Unable to load your books.'
        );

        dispatch({ type: 'LOAD_FAILED' });
      });
  }, []);

  const handleAdd = async (title, author) => {
    setError('');

    try {
      const book = await api.addBook(title, author);

      dispatch({
        type: 'ADD_BOOK',
        payload: book,
      });

      return true;
    } catch (err) {
      setError(err.message || 'Unable to add this book.');
      return false;
    }
  };

  const handleMarkRead = async (id) => {
    setError('');

    try {
      const book = await api.markAsRead(id);

      dispatch({
        type: 'MARK_READ',
        payload: book,
      });
    } catch (err) {
      setError(
        err.message || 'Unable to update this book.'
      );
    }
  };

  const handleDelete = async (id) => {
    setError('');

    try {
      await api.deleteBook(id);

      dispatch({
        type: 'DELETE_BOOK',
        payload: id,
      });
    } catch (err) {
      setError(
        err.message || 'Unable to delete this book.'
      );
    }
  };

  const readCount = books.filter(
    (book) => book.status === 'read'
  ).length;

  const unreadCount = books.length - readCount;

  const readPercentage =
    books.length > 0
      ? Math.round((readCount / books.length) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="relative isolate overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-28 -z-10 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-20 -z-10 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl"
        />

        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-100">
              Personal Reading Dashboard
            </p>

            <h1 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Omar's{' '}
              <span className="text-indigo-300">
                BookShelf
              </span>
              <br className="hidden sm:block" />
              <span className="text-white">
                {' '}Manager
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-indigo-100/90 sm:text-base md:text-lg">
              Your personal space for every great story.
              Organize your books, track your progress, and
              make time for your next favorite read.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#add-book"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-950 shadow-lg transition hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-900"
              >
                Add a new book
              </a>

              <a
                href="#my-books"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                View my collection
              </a>
            </div>
          </div>

          <div className="mt-10 border-t border-white/15 pt-5 sm:mt-12">
            <p className="text-sm text-indigo-100/80">
              Every page brings a new perspective. Keep
              reading, keep growing.
            </p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* Dashboard heading */}
        <section>
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
              Your dashboard
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Reading overview
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              Keep track of your collection and celebrate
              every book you finish.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              label="Total books"
              value={books.length}
              description="Books in your collection"
            />

            <StatCard
              label="Books completed"
              value={readCount}
              description="Books you have finished reading"
            />

            <StatCard
              label="To be read"
              value={unreadCount}
              description="Books waiting for your attention"
            />
          </div>
        </section>

        {/* Reading progress */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Your reading progress
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Keep going, one book at a time.
              </p>
            </div>

            <p className="text-2xl font-bold text-indigo-700">
              {readPercentage}%
            </p>
          </div>

          <div
            className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-label="Reading completion"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={readPercentage}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 transition-all duration-500"
              style={{ width: `${readPercentage}%` }}
            />
          </div>

          <p className="mt-3 text-xs text-slate-500 sm:text-sm">
            {readCount} completed out of {books.length} books
          </p>
        </section>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <div className="min-w-0 flex-1">
              <p className="font-semibold">
                Something went wrong
              </p>

              <p className="mt-1 break-words leading-6">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setError('')}
              aria-label="Dismiss error"
              className="shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Add book section */}
        <section
          id="add-book"
          className="scroll-mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="border-b border-slate-100 bg-gradient-to-r from-white to-indigo-50/70 px-5 py-6 sm:px-7 sm:py-7">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
              Grow your library
            </p>

            <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Add a new book
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Enter the book details below to add it to
              your collection.
            </p>
          </div>

          <div className="p-5 sm:p-7">
            <BookForm onAdd={handleAdd} />
          </div>
        </section>

        {/* Book collection */}
        <section id="my-books" className="scroll-mt-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                Your personal library
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Omar's Books
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                All your saved books, in one place.
              </p>
            </div>

            {!loading && (
              <div className="flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {books.length} {books.length === 1 ? 'book' : 'books'}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <BookList
              books={books}
              loading={loading}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 py-6 text-center">
          <p className="text-sm font-medium text-slate-600">
            Omar's BookShelf Manager
          </p>

          <p className="mt-2 text-xs leading-5 text-slate-400">
            A little reading today, a world of knowledge tomorrow.
          </p>
        </footer>
      </main>
    </div>
  );
}