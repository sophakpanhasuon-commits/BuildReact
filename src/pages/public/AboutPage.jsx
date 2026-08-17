import { Target, Eye, HeartHandshake } from 'lucide-react';

const VALUES = [
  { icon: Target, title: 'Our Mission', text: 'To deliver dependable, high-quality service that helps our clients succeed, every single time.' },
  { icon: Eye, title: 'Our Vision', text: 'To be the most trusted name in our industry across Cambodia, known for integrity and excellence.' },
  { icon: HeartHandshake, title: 'Our Values', text: 'Honesty, accountability, and genuine care for every customer we serve.' },
];

export default function AboutPage() {
  return (
    <>
      <section style={{ background: 'var(--primary-light)', padding: '64px 0' }}>
        <div className="container" style={{ maxWidth: 720, textAlign: 'center' }}>
          <span className="eyebrow">About Us</span>
          <h1>Who We Are</h1>
          <p style={{ fontSize: 'var(--fs-lg)' }}>
            BuildTrust has been serving the local community with dedication and
            professionalism. We believe great business is built on trust, quality work, and
            long-term relationships.
          </p>
        </div>
      </section>

      <section className="section container">
        <div className="grid grid-3">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card">
              <div className="card-body">
                <Icon size={28} color="var(--primary)" />
                <h3 style={{ marginTop: 12 }}>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container grid grid-2" style={{ alignItems: 'center' }}>
          <img src="https://img.freepik.com/premium-photo/business-people-meeting-discusion-generative-ai_1002555-811.jpg" alt="AboutPhoto" 
            style={{ height: 320, borderRadius: 'var(--radius-lg)', background:'linear-gradient(135deg, var(--primary), var(--secondary))' }}/>
          <div>
            <span className="eyebrow">Our Story</span>
            <h2>Growing With Our Community</h2>
            <p>
              What started as a small local operation has grown into a business trusted by
              hundreds of customers. We're proud of our roots and committed to serving our
              community with the same care we started with.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
