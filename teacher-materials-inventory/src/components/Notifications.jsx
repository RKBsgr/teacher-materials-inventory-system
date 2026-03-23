import { useState, useEffect } from 'react';

export default function Notifications({ API, token }) {
  const [notifications, setNotifications] = useState([]);

  async function loadNotifications() {
    try {
      const res = await fetch(`${API}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <div className="admin-panel-container">
      <div className="admin-header">
        <h2>🔔 Notifications</h2>
        <button className="secondary" onClick={loadNotifications}>
          Refresh
        </button>
      </div>
      <div className="admin-form-card">
        <div className="notifications-list">
          {notifications.map(notif => (
            <div key={notif._id} className="notification-card">
              <div className="notif-message">
                Material <strong>{notif.title}</strong> for <strong>{notif.subject}</strong> is <strong>{notif.action}</strong> by <strong>{notif.username}</strong>.
              </div>
              <div className="notif-time">
                {new Date(notif.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
            <p>No notifications yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
