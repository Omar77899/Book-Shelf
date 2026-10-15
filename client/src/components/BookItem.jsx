export default function BookItem({ book, onMarkRead, onDelete }) {
  const isRead = book.status === 'read';
  const added = new Date(book.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <li
      className={`flex flex-col gap-3 rounded-xl p-4 shadow-sm ring-1 transition sm:flex-row sm:items-center sm:justify-between ${
        isRead ? 'bg-green-50 ring-green-200' : 'bg-white ring-slate-200'
      }`}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className={`break-words font-semibold ${
              isRead ? 'text-slate-400 line-through' : 'text-slate-800'
            }`}
          >
            {book.title}
          </h3>
          {isRead && (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
              ✓ Read
            </span>
          )}
        </div>
        <p className="mt-0.5 break-words text-sm text-slate-500">by {book.author}</p>
        <p className="mt-0.5 text-xs text-slate-400">Added {added}</p>
      </div>

      <div className="flex shrink-0 gap-2">
        {!isRead && (
          <button
            onClick={() => onMarkRead(book.id)}
            className="flex-1 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-green-700 sm:flex-none"
          >
            Mark as read
          </button>
        )}
        <button
          onClick={() => onDelete(book.id)}
          className="flex-1 rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 sm:flex-none"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
