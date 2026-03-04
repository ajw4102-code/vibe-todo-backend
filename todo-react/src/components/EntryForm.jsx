import { useState, useEffect } from 'react';

export default function EntryForm({ initialData = {}, onSubmit, onCancel }) {
  const [date, setDate] = useState(initialData.date || '');
  const [type, setType] = useState(initialData.type || 'expense');
  const [amount, setAmount] = useState(initialData.amount || '');
  const [category, setCategory] = useState(initialData.category || '');
  const [note, setNote] = useState(initialData.note || '');

  useEffect(() => {
    setDate(initialData.date || '');
    setType(initialData.type || 'expense');
    setAmount(initialData.amount || '');
    setCategory(initialData.category || '');
    setNote(initialData.note || '');
  }, [initialData]);

  const handleSubmit = e => {
    e.preventDefault();
    const entry = { date, type, amount: Number(amount), category, note };
    onSubmit(entry);
  };

  return (
    <form onSubmit={handleSubmit} className="entry-form">
      <h2>{Object.keys(initialData).length > 0 ? '✏️ Edit Entry' : '➕ Add New Entry'}</h2>
      <div className="form-group">
        <label>📅 Date</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>📊 Type</label>
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="expense">💸 Expense</option>
          <option value="income">💰 Income</option>
        </select>
      </div>
      <div className="form-group">
        <label>💵 Amount</label>
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required min="0" step="0.01" />
      </div>
      <div className="form-group">
        <label>🏷️ Category</label>
        <input value={category} onChange={e => setCategory(e.target.value)} required placeholder="e.g., Food, Transport, Salary" />
      </div>
      <div className="form-group">
        <label>📝 Note</label>
        <input value={note} onChange={e => setNote(e.target.value)} placeholder="Optional note..." />
      </div>
      <div className="buttons">
        <button type="submit">{Object.keys(initialData).length > 0 ? 'Update' : 'Save'}</button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="cancel">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
