import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, Award, ArrowRight, Wrench } from 'lucide-react';
import { listServices } from '../../services/serviceService';
import { LoadingSpinner } from '../../components/common/States';
import Button from '../../components/common/Button';

const WHY_US = [
  { icon: ShieldCheck, title: 'Trusted & Reliable', text: 'Years of experience serving customers with consistent quality.' },
  { icon: Clock, title: 'On-Time Delivery', text: 'We respect your time and deliver exactly when promised.' },
  { icon: Award, title: 'Quality Guaranteed', text: 'Every project is backed by our commitment to excellence.' },
];

const STATS = [
  { value: '500+', label: 'Happy Clients' },
  { value: '10+', label: 'Years Experience' },
  { value: '50+', label: 'Projects Completed' },
  { value: '24/7', label: 'Support Available' },
];

export default function HomePage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await listServices();
      setServices(data.filter((s) => s.status !== 'inactive').slice(0, 3));
      setLoading(false);
    })();
  }, []);

  return (
    <>
      {/* Hero */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))',
          color: '#fff',
          padding: '96px 0',
        }}
      >
        <div className="container" style={{ maxWidth: 720, textAlign: 'center' }}>
          <span className="eyebrow" style={{ color: '#c9e4d8' }}>Welcome to BuildTrust</span>
          <h1 style={{ color: '#fff', fontSize: 'var(--fs-4xl)' }}>
            Quality Service You Can Trust
          </h1>
          <p style={{ color: '#dcebe4', fontSize: 'var(--fs-lg)' }}>
            We help businesses and individuals in Phnom Penh get things done right — on time,
            on budget, every time.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 24 }}>
            <Link to="/services"><Button variant="secondary">Explore Services</Button></Link>
            <Link to="/contact"><Button variant="outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)' }}>Get in Touch</Button></Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container" style={{ marginTop: -40 }}>
        <div className="card grid grid-4" style={{ padding: 0 }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ padding: 28, textAlign: 'center', borderRight: '1px solid var(--border)' }}>
              <div style={{ fontSize: 'var(--fs-3xl)', fontWeight: 800, color: 'var(--primary)' }}>{s.value}</div>
              <div className="text-muted" style={{ fontSize: 'var(--fs-sm)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services preview */}
      <section className="section container">
        <div className="section-header">
          <span className="eyebrow">What We Offer</span>
          <h2>Our Services</h2>
          <p>A quick look at what we do best. See the full list on our services page.</p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : services.length === 0 ? (
          <div className="state-block">
            <Wrench size={40} />
            <p>Services will appear here once added from the admin dashboard.</p>
          </div>
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
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link to="/services" className="btn btn-outline">
            View All Services <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Why us */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Why Choose Us</span>
            <h2>Built On Trust & Results</h2>
          </div>
          <div className="grid grid-3">
            {WHY_US.map(({ icon: Icon, title, text }) => (
              <div key={title} style={{ textAlign: 'center', padding: 16 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  <Icon size={26} />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container" style={{ padding: '64px 24px' }}>
        <div
          className="card"
          style={{
            background: 'var(--secondary)',
            color: '#fff',
            textAlign: 'center',
            padding: '48px 24px',
            border: 'none',
          }}
        >
          <h2 style={{ color: '#fff' }}>Ready to Get Started?</h2>
          <p style={{ color: '#fff5e6' }}>Reach out today and let's discuss how we can help.</p>
          <Link to="/contact"><Button variant="primary">Contact Us</Button></Link>
        </div>
      </section>
    </>
  );
}
