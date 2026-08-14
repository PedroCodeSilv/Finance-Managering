import React from "react";

export function CnabMonitor() {
  const stats = {
    processed: 124,
    errors: 3,
    avgTimeSec: 4.2,
  };

  return (
    <section className="section">
      <h3>CNAB Monitor</h3>
      <div className="cnab-stats">
        <div className="stat">
          <div className="stat-value">{stats.processed}</div>
          <div className="stat-label">Processados</div>
        </div>
        <div className="stat">
          <div className="stat-value error">{stats.errors}</div>
          <div className="stat-label">Erros</div>
        </div>
        <div className="stat">
          <div className="stat-value">{stats.avgTimeSec}s</div>
          <div className="stat-label">Tempo médio</div>
        </div>
      </div>
    </section>
  );
}

export default CnabMonitor;
