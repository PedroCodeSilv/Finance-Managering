import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Wallet, Bell, LogOut } from "lucide-react";
import { NotificationPanel } from "./NotificationPanel";
import { getUnreadCount } from "../api/notifications";

export function Topbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    getUnreadCount()
      .then((res) => setUnreadCount(res.data))
      .catch(() => {});

    const interval = setInterval(() => {
      getUnreadCount()
        .then((res) => setUnreadCount(res.data))
        .catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <header className="topbar">
        <div className="topbar-brand">
          <Wallet size={22} color="#fff" />
          <h1>Finance Manager</h1>
        </div>
        <div className="topbar-actions">
          <button
            className="btn-notification"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={18} color="#fff" />
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </button>
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={16} />
            <span>Sair</span>
          </button>
        </div>
      </header>
      {showNotifications && (
        <NotificationPanel
          onClose={() => {
            setShowNotifications(false);
            getUnreadCount()
              .then((res) => setUnreadCount(res.data))
              .catch(() => {});
          }}
        />
      )}
    </>
  );
}
