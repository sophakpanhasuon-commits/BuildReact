import { useEffect, useState } from 'react';
import { Package } from 'lucide-react';
import { listProducts } from '../../services/productService';
import { LoadingSpinner, EmptyState, ErrorState } from '../../components/common/States';
import { formatPrice } from '../../utils/formatters';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    const { data, error: err } = await listProducts();
    if (err) setError(err);
    else setProducts(data.filter((p) => p.status !== 'unavailable'));
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="section container">
      <div className="section-header">
        <span className="eyebrow">Shop</span>
        <h1>Our Products</h1>
        <p>Browse what we currently have available.</p>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading products…" />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products available yet"
          message="Please check back soon — products will be added shortly."
        />
      ) : (
        <div className="grid grid-4">
          {products.map((p) => (
            <div key={p.id} className="card">
              <div
                style={{
                  height: 170,
                  borderRadius: '16px 16px 0 0',
                  background: p.imageUrl
                    ? `url(${p.imageUrl}) center/cover`
                    : 'linear-gradient(135deg, var(--primary-light), var(--border))',
                }}
              />
              <div className="card-body">
                {p.category && <span className="badge badge-info" style={{ marginBottom: 8 }}>{p.category}</span>}
                <h3 style={{ fontSize: 'var(--fs-base)' }}>{p.name}</h3>
                <p style={{ fontSize: 'var(--fs-sm)' }}>{p.description}</p>
                <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: 'var(--fs-lg)' }}>
                  {formatPrice(p.price)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
