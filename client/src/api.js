const BASE = '/books';

async function request(url, options) {
  let res;
  try {
    res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error('Cannot reach the server. Is the backend running?');
  }

  let body = null;
  try {
    body = await res.json();
  } catch {
    // non-JSON response
  }

  if (!res.ok) {
    throw new Error(body?.error || `Request failed (${res.status})`);
  }
  return body.data;
}

export const getBooks = () => request(BASE);

export const addBook = (title, author) =>
  request(BASE, { method: 'POST', body: JSON.stringify({ title, author }) });

export const markAsRead = (id) => request(`${BASE}/${id}`, { method: 'PUT' });

export const deleteBook = (id) => request(`${BASE}/${id}`, { method: 'DELETE' });
