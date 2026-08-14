import React from "react";

export function AnomaliesPanel() {
  const anomalies = [
    { id: 1, text: "Transação atípica R$ 25.000,00", flaggedAt: "2h" },
    { id: 2, text: "Volume incomum de despesas em Marketing", flaggedAt: "1d" },
  ];

  return (
    <section className="section">
      <h3>Anomalias</h3>
      <ul className="anomalies-list">
        {anomalies.map((a) => (
          <li key={a.id} className="anomaly-item">
            <div className="anomaly-text">{a.text}</div>
            <div className="anomaly-meta">{a.flaggedAt}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default AnomaliesPanel;
