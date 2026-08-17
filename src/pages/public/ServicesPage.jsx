import { useEffect, useState } from 'react';
import { Wrench } from 'lucide-react';
import { listServices } from '../../services/serviceService';
import { LoadingSpinner, EmptyState, ErrorState } from '../../components/common/States';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    const { data, error: err } = await listServices();
    if (err) setError(err);
    else setServices(data.filter((s) => s.status !== 'inactive'));
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="section container">
      <div className="section-header">
        <span className="eyebrow">What We Offer</span>
        <h1>Our Services</h1>
        <p>Explore the full range of services we provide.</p>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading services…" />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : services.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No services available yet"
          message="Please check back soon — services will be added shortly."
        />
      ) : (
        <div className="grid grid-3">
          {services.map((s) => (
            <div key={s.id} className="card">
              <div
                style={{
                  height: 180,
                  borderRadius: '16px 16px 0 0',
                  background: s.imageUrl
                    ? `url(${s.imageUrl}) center/cover`
                    : 'linear-gradient(135deg, var(--primary-light), var(--border))',
                  objectFit: 'cover',
                }}
              />
              <div className="card-body">
                {s.category && <span className="badge badge-info" style={{ marginBottom: 8 }}>{s.category}</span>}
                <h3>{s.title}</h3>
                <p>{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
