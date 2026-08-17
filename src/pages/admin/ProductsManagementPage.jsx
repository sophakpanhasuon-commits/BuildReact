import { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { listProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ProductForm from '../../components/admin/ProductForm';
import SearchBar from '../../components/common/SearchBar';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { ErrorState } from '../../components/common/States';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../utils/formatters';

export default function ProductsManagementPage() {
  const [products, setProducts] = useState([]);
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
    const { data, error: err } = await listProducts();
    if (err) setError(err);
    else setProducts(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) => p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q)
    );
  }, [products, search]);

  async function handleSubmit(values) {
    setSubmitting(true);
    const result = editing ? await updateProduct(editing.id, values) : await createProduct(values);
    setSubmitting(false);

    if (result.error) {
      showToast(result.error, 'error');
      return;
    }
    showToast(editing ? 'Product updated.' : 'Product created.', 'success');
    setFormOpen(false);
    setEditing(null);
    load();
  }

  async function handleDelete() {
    setDeleting(true);
    const { error: err } = await deleteProduct(deleteTarget.id);
    setDeleting(false);

    if (err) {
      showToast(err, 'error');
      return;
    }
    showToast('Product deleted.', 'success');
    setDeleteTarget(null);
    load();
  }

  if (error) return <ErrorState message={error} onRetry={load} />;

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category', render: (r) => r.category || '—' },
    { key: 'price', label: 'Price', render: (r) => formatPrice(r.price) },
    { key: 'stock', label: 'Stock', render: (r) => r.stock ?? 0 },
    {
      key: 'status',
      label: 'Status',
      render: (r) => <Badge variant={r.status === 'unavailable' ? 'neutral' : 'success'}>{r.status || 'available'}</Badge>,
    },
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
        <SearchBar value={search} onChange={setSearch} placeholder="Search products…" />
        <Button icon={Plus} onClick={() => { setEditing(null); setFormOpen(true); }}>
          Add Product
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        loading={loading}
        getRowKey={(r) => r.id}
        emptyMessage="Create your first product to see it here."
      />

      <Modal
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        title={editing ? 'Edit Product' : 'Add Product'}
      >
        <ProductForm
          initialValues={editing}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={() => { setFormOpen(false); setEditing(null); }}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
