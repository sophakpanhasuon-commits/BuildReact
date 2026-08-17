import { useEffect, useMemo, useState } from 'react';
import { Eye, Trash2 } from 'lucide-react';
import { listMessages, deleteMessage, setMessageReadState } from '../../services/messageService';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import SearchBar from '../../components/common/SearchBar';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { ErrorState } from '../../components/common/States';
import { useToast } from '../../context/ToastContext';
import { formatDateTime, truncateText } from '../../utils/formatters';

export default function MessagesManagementPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [viewing, setViewing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  async function load() {
    setLoading(true);
    setError('');
    const { data, error: err } = await listMessages();
    if (err) setError(err);
    else setMessages(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return messages;
    return messages.filter(
      (m) =>
        m.name?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.subject?.toLowerCase().includes(q)
    );
  }, [messages, search]);

  async function openMessage(m) {
    setViewing(m);
    if (!m.isRead) {
      await setMessageReadState(m.id, true);
      setMessages((prev) => prev.map((msg) => (msg.id === m.id ? { ...msg, isRead: true } : msg)));
    }
  }

  async function handleDelete() {
    setDeleting(true);
    const { error: err } = await deleteMessage(deleteTarget.id);
    setDeleting(false);

    if (err) {
      showToast(err, 'error');
      return;
    }
    showToast('Message deleted.', 'success');
    setDeleteTarget(null);
    setViewing(null);
    load();
  }

  if (error) return <ErrorState message={error} onRetry={load} />;

  const columns = [
    {
      key: 'status',
      label: '',
      render: (r) => (!r.isRead ? <Badge variant="danger">New</Badge> : <Badge variant="neutral">Read</Badge>),
    },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'subject', label: 'Subject', render: (r) => truncateText(r.subject, 40) },
    { key: 'createdAt', label: 'Received', render: (r) => formatDateTime(r.createdAt) },
    {
      key: 'actions',
      label: '',
      render: (r) => (
        <div className="table-actions">
          <Button variant="outline" size="sm" icon={Eye} onClick={() => openMessage(r)}>
            View
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
      <div style={{ marginBottom: 20 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search messages…" />
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        loading={loading}
        getRowKey={(r) => r.id}
        emptyMessage="Messages submitted through your contact form will appear here."
      />

      <Modal isOpen={!!viewing} onClose={() => setViewing(null)} title="Message Details">
        {viewing && (
          <div>
            <p><strong>From:</strong> {viewing.name} ({viewing.email})</p>
            {viewing.phone && <p><strong>Phone:</strong> {viewing.phone}</p>}
            <p><strong>Subject:</strong> {viewing.subject}</p>
            <p><strong>Received:</strong> {formatDateTime(viewing.createdAt)}</p>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 12 }}>
              <p style={{ whiteSpace: 'pre-wrap' }}>{viewing.message}</p>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Message"
        message={`Delete the message from "${deleteTarget?.name}"? This cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
