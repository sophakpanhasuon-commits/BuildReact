import { useEffect, useMemo, useState } from 'react';
import { ShieldCheck, ShieldOff } from 'lucide-react';
import { listUsers, setUserRole } from '../../services/userService';
import DataTable from '../../components/admin/DataTable';
import SearchBar from '../../components/common/SearchBar';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { ErrorState } from '../../components/common/States';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/formatters';

export default function UsersManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleTarget, setRoleTarget] = useState(null); // { user, nextRole }
  const [updating, setUpdating] = useState(false);
  const { showToast } = useToast();
  const { user: currentUser } = useAuth();

  async function load() {
    setLoading(true);
    setError('');
    const { data, error: err } = await listUsers();
    if (err) setError(err);
    else setUsers(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
  }, [users, search]);

  async function confirmRoleChange() {
    setUpdating(true);
    const { error: err } = await setUserRole(roleTarget.user.id, roleTarget.nextRole);
    setUpdating(false);

    if (err) {
      showToast(err, 'error');
      return;
    }
    showToast('User role updated.', 'success');
    setRoleTarget(null);
    load();
  }

  if (error) return <ErrorState message={error} onRetry={load} />;

  const columns = [
    { key: 'name', label: 'Name', render: (r) => r.name || '—' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Role',
      render: (r) => <Badge variant={r.role === 'admin' ? 'info' : 'neutral'}>{r.role || 'user'}</Badge>,
    },
    { key: 'createdAt', label: 'Joined', render: (r) => formatDate(r.createdAt) },
    {
      key: 'actions',
      label: '',
      render: (r) =>
        r.id === currentUser?.uid ? (
          <span className="text-muted" style={{ fontSize: 'var(--fs-xs)' }}>You</span>
        ) : r.role === 'admin' ? (
          <Button
            variant="outline"
            size="sm"
            icon={ShieldOff}
            onClick={() => setRoleTarget({ user: r, nextRole: 'user' })}
          >
            Revoke Admin
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            icon={ShieldCheck}
            onClick={() => setRoleTarget({ user: r, nextRole: 'admin' })}
          >
            Make Admin
          </Button>
        ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search users…" />
      </div>

      <DataTable columns={columns} rows={filtered} loading={loading} getRowKey={(r) => r.id} emptyMessage="No registered users yet." />

      <ConfirmDialog
        isOpen={!!roleTarget}
        title={roleTarget?.nextRole === 'admin' ? 'Grant Admin Access' : 'Revoke Admin Access'}
        message={`${roleTarget?.nextRole === 'admin' ? 'Grant' : 'Revoke'} admin access for "${roleTarget?.user?.name || roleTarget?.user?.email}"?`}
        confirmLabel="Confirm"
        loading={updating}
        onConfirm={confirmRoleChange}
        onCancel={() => setRoleTarget(null)}
      />
    </div>
  );
}
