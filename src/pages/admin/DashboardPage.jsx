import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Package, Users, MessageSquare } from 'lucide-react';
import StatCard from '../../components/admin/StatCard';
import { listServices } from '../../services/serviceService';
import { listProducts } from '../../services/productService';
import { listUsers } from '../../services/userService';
import { listMessages } from '../../services/messageService';
import { LoadingSpinner } from '../../components/common/States';
import { formatDateTime, truncateText } from '../../utils/formatters';
import Badge from '../../components/common/Badge';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [services, products, users, messages] = await Promise.all([
        listServices(),
        listProducts(),
        listUsers(),
        listMessages(),
      ]);

      setStats({
        services: services.data.length,
        products: products.data.length,
        users: users.data.length,
        unreadMessages: messages.data.filter((m) => !m.isRead).length,
      });
      setRecentMessages(messages.data.slice(0, 5));
      setLoading(false);
    })();
  }, []);

  if (loading) return <LoadingSpinner fullPage label="Loading dashboard…" />;

  return (
    <div>
      <div className="grid grid-4" style={{ marginBottom: 32 }}>
        <StatCard icon={Wrench} label="Total Services" value={stats.services} accent="var(--primary)" />
        <StatCard icon={Package} label="Total Products" value={stats.products} accent="var(--secondary)" />
        <StatCard icon={Users} label="Total Users" value={stats.users} accent="var(--info)" />
        <StatCard icon={MessageSquare} label="Unread Messages" value={stats.unreadMessages} accent="var(--danger)" />
      </div>

      <div className="card">
        <div className="card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0 }}>Recent Messages</h3>
            <Link to="/admin/messages" className="btn btn-outline btn-sm">View All</Link>
          </div>

          {recentMessages.length === 0 ? (
            <p className="text-muted">No messages yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recentMessages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 12,
                    padding: '12px 0',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <div>
                    <strong>{m.name}</strong> — {truncateText(m.subject, 40)}
                    <div className="text-muted" style={{ fontSize: 'var(--fs-xs)' }}>
                      {formatDateTime(m.createdAt)}
                    </div>
                  </div>
                  {!m.isRead && <Badge variant="danger">New</Badge>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
