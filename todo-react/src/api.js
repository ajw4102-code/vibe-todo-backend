const BASE_URL = 'http://localhost:5000/ledger';

async function getEntries(month) {
  const url = new URL(BASE_URL);
  if (month) url.searchParams.set('month', month);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to fetch entries: ${res.status}`);
  return res.json();
}

async function createEntry(entry) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error(`Failed to create entry: ${res.status}`);
  return res.json();
}

async function updateEntry(id, updates) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error(`Failed to update entry: ${res.status}`);
  return res.json();
}

async function deleteEntry(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (res.status === 204) return;
  if (!res.ok) throw new Error(`Failed to delete entry: ${res.status}`);
}

async function getSummary(month) {
  const url = new URL(`${BASE_URL}/summary`);
  if (month) url.searchParams.set('month', month);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to fetch summary: ${res.status}`);
  return res.json();
}

export { getEntries, createEntry, updateEntry, deleteEntry, getSummary };