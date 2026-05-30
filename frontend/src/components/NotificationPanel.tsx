import { useEffect, useState } from "react";
import {
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
  type NotificationResponse,
} from "../api/notifications";

interface Props {
  onClose: () => void;
}

export function NotificationPanel({ onClose }: Props) {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    getUnreadNotifications()
      .then((res) => setNotifications(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleMarkRead = async (id: number) => {
    await markAsRead(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAll = async () => {
    await markAllAsRead();
    setNotifications([]);
  };

  return (
    <div className="notification-panel">
      <div className="notification-panel-header">
        <h4>Notificações</h4>
        <div>
          {notifications.length > 0 && (
            <button className="btn-mark-all" onClick={handleMarkAll}>
              Marcar todas como lidas
            </button>
          )}
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
      </div>
      <div className="notification-list">
        {loading ? (
          <p className="notification-empty">Carregando...</p>
        ) : notifications.length === 0 ? (
          <p className="notification-empty">Nenhuma notificação nova.</p>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="notification-item" onClick={() => handleMarkRead(n.id)}>
              <strong>{n.title}</strong>
              <p>{n.message}</p>
              <span className="notification-date">
                {new Date(n.createdAt).toLocaleString("pt-BR")}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
