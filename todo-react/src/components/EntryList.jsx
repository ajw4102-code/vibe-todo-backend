export default function EntryList({ entries, onEdit, onDelete }) {
  if (entries.length === 0) {
    return <div className="entry-list-empty">No entries yet. Add one to get started!</div>;
  }

  return (
    <table className="entry-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Category</th>
          <th>Note</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {entries.map(entry => (
          <tr key={entry._id} className={entry.type === 'income' ? 'income' : 'expense'}>
            <td>{entry.date}</td>
            <td>
              <span className={`type-badge ${entry.type}`}>
                {entry.type === 'income' ? '💰 Income' : '💸 Expense'}
              </span>
            </td>
            <td className="amount">{entry.amount.toLocaleString()}</td>
            <td>{entry.category}</td>
            <td>{entry.note}</td>
            <td>
              <button className="btn-edit" onClick={() => onEdit(entry)}>Edit</button>
              <button className="btn-delete" onClick={() => onDelete(entry._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
