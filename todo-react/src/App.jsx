import { useState, useEffect } from 'react';
import './App.css';
import { getEntries, createEntry, updateEntry, deleteEntry, getSummary } from './api';
import EntryForm from './components/EntryForm';
import EntryList from './components/EntryList';
import Summary from './components/Summary';

function App() {
  const today = new Date();
  const defaultMonth = today.toISOString().slice(0, 7); // YYYY-MM

  const [month, setMonth] = useState(defaultMonth);
  const [entries, setEntries] = useState([]);
  const [summary, setSummary] = useState(null);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (m) => {
    setLoading(true);
    try {
      const data = await getEntries(m);
      setEntries(data);
      const sum = await getSummary(m);
      setSummary(sum);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(month);
  }, [month]);

  const handleAdd = async (entry) => {
    try {
      await createEntry(entry);
      fetchData(month);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleUpdate = async (entry) => {
    try {
      await updateEntry(editing._id, entry);
      setEditing(null);
      fetchData(month);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    try {
      await deleteEntry(id);
      fetchData(month);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="App">
      <h1>Ledger</h1>
      <div>
        <label>
          Month: {' '}
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </label>
      </div>

      {error && <div className="error">{error}</div>}
      <Summary summary={summary} />
      {loading && <div>Loading...</div>}

      <EntryForm
        initialData={editing || {}}
        onSubmit={editing ? handleUpdate : handleAdd}
        onCancel={() => setEditing(null)}
      />

      <EntryList
        entries={entries}
        onEdit={(entry) => setEditing(entry)}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;
