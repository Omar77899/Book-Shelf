import BookItem from './BookItem.jsx';

export default function BookList({ books, loading, onMarkRead, onDelete }) {
  if (loading) {
    return <p className="py-10 text-center text-slate-500">Loading your books…</p>;
  }

  if (books.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-slate-300 py-10 text-center text-slate-500">
        Your shelf is empty. Add your first book above!
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {books.map((book) => (
        <BookItem key={book.id} book={book} onMarkRead={onMarkRead} onDelete={onDelete} />
      ))}
    </ul>
  );
}
