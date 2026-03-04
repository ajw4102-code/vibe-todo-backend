export default function Summary({ summary }) {
  if (!summary) return null;
  const { totalIncome, totalExpense, net } = summary;
  
  return (
    <div className="summary">
      <strong>📊 Monthly Summary</strong>
      <div>
        <span>💰 Income</span>
        <span>{totalIncome.toLocaleString()}</span>
      </div>
      <div>
        <span>💸 Expense</span>
        <span>{totalExpense.toLocaleString()}</span>
      </div>
      <div>
        <span>📈 Net</span>
        <span className={net >= 0 ? 'positive' : 'negative'}>{net.toLocaleString()}</span>
      </div>
    </div>
  );
}
