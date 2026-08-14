import React from "react";

export function StoragePanel() {
  const stats = { buckets: 3, objects: 1245, usedMb: 512 }; 

  return (
    <section className="section">
      <h3>Storage (MinIO)</h3>
      <div className="storage-stats">
        <div className="stat">
          <div className="stat-value">{stats.buckets}</div>
          <div className="stat-label">Buckets</div>
        </div>
        <div className="stat">
          <div className="stat-value">{stats.objects}</div>
          <div className="stat-label">Objetos</div>
        </div>
        <div className="stat">
          <div className="stat-value">{stats.usedMb} MB</div>
          <div className="stat-label">Usado</div>
        </div>
      </div>
    </section>
  );
}

export default StoragePanel;
