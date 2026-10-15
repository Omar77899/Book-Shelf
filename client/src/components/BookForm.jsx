import { useState } from 'react';

export default function BookForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) {
      setFieldError('Both title and author are required.');
      return;
    }
    setFieldError('');
    setSubmitting(true);
    const ok = await onAdd(title.trim(), author.trim());
    setSubmitting(false);
    if (ok) {
      setTitle('');
      setAuthor('');
    }
  };

  const inputClass =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200';

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-6"
      noValidate
    >
      <h2 className="mb-4 text-lg font-semibold">Add a new book</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium text-slate-600">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Atomic Habits"
            maxLength={200}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="author" className="mb-1 block text-sm font-medium text-slate-600">
            Author
          </label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="e.g. James Clear"
            maxLength={120}
            className={inputClass}
          />
        </div>
      </div>
      {fieldError && <p className="mt-2 text-sm text-red-600">{fieldError}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="mt-4 w-full rounded-lg bg-indigo-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {submitting ? 'Adding…' : 'Add Book'}
      </button>
    </form>
  );
}
