import React from "react";

export function NotificationsPanel() {
  const notifications = [
    { id: 1, text: "Arquivo CNAB processado com sucesso", time: "2m" },
    { id: 2, text: "Fatura vencida em conta Corrente", time: "1h" },
    { id: 3, text: "Nova empresa adicionada: ACME Ltda.", time: "1d" },
  ];

  return (
    <section className="section">
      <h3>Notificações</h3>
      <ul className="notifications-list">
        {notifications.map((n) => (
          <li key={n.id} className="notification-item">
            <span className="notification-text">{n.text}</span>
            <span className="notification-time">{n.time}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default NotificationsPanel;
