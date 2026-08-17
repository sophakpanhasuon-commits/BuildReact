import { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { listServices, createService, updateService, deleteService } from '../../services/serviceService';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ServiceForm from '../../components/admin/ServiceForm';
import SearchBar from '../../components/common/SearchBar';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { ErrorState } from '../../components/common/States';
import { useToast } from '../../context/ToastContext';
import { formatDate, truncateText } from '../../utils/formatters';

export default function ServicesManagementPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  async function load() {
    setLoading(true);
    setError('');
    const { data, error: err } = await listServices();
    if (err) setError(err);
    else setServices(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return services;
    return services.filter(
      (s) => s.title?.toLowerCase().includes(q) || s.category?.toLowerCase().includes(q)
    );
  }, [services, search]);

  async function handleSubmit(values) {
    setSubmitting(true);
    const result = editing ? await updateService(editing.id, values) : await createService(values);
    setSubmitting(false);

    if (result.error) {
      showToast(result.error, 'error');
      return;
    }
    showToast(editing ? 'Service updated.' : 'Service created.', 'success');
    setFormOpen(false);
    setEditing(null);
    load();
  }

  async function handleDelete() {
    setDeleting(true);
    const { error: err } = await deleteService(deleteTarget.id);
    setDeleting(false);

    if (err) {
      showToast(err, 'error');
      return;
    }
    showToast('Service deleted.', 'success');
    setDeleteTarget(null);
    load();
  }

  if (error) return <ErrorState message={error} onRetry={load} />;

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category', render: (r) => r.category || '—' },
    { key: 'description', label: 'Description', render: (r) => truncateText(r.description, 60) },
    {
      key: 'status',
      label: 'Status',
      render: (r) => <Badge variant={r.status === 'inactive' ? 'neutral' : 'success'}>{r.status || 'active'}</Badge>,
    },
    { key: 'createdAt', label: 'Created', render: (r) => formatDate(r.createdAt) },
    {
      key: 'actions',
      label: '',
      render: (r) => (
        <div className="table-actions">
          <Button variant="outline" size="sm" icon={Pencil} onClick={() => { setEditing(r); setFormOpen(true); }}>
            Edit
          </Button>
          <Button variant="danger" size="sm" icon={Trash2} onClick={() => setDeleteTarget(r)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search services…" />
        <Button icon={Plus} onClick={() => { setEditing(null); setFormOpen(true); }}>
          Add Service
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        loading={loading}
        getRowKey={(r) => r.id}
        emptyMessage="Create your first service to see it here."
      />

      <Modal
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        title={editing ? 'Edit Service' : 'Add Service'}
      >
        <ServiceForm
          initialValues={editing}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={() => { setFormOpen(false); setEditing(null); }}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Service"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
