import React from "react";

export function BudgetPanel() {
  const budgets = [
    { id: 1, category: "Marketing", used: 4200, limit: 5000 },
    { id: 2, category: "Operacional", used: 8100, limit: 10000 },
    { id: 3, category: "Pessoal", used: 12500, limit: 12000 },
  ];

  return (
    <section className="section">
      <h3>Orçamentos</h3>
      <div className="budgets">
        {budgets.map((b) => {
          const pct = Math.min(100, Math.round((b.used / b.limit) * 100));
          return (
            <div key={b.id} className="budget-item">
              <div className="budget-label">{b.category}</div>
              <div className="budget-bar">
                <div className="budget-progress" style={{ width: `${pct}%` }} />
              </div>
              <div className="budget-meta">{pct}% • R$ {b.used} / R$ {b.limit}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default BudgetPanel;
