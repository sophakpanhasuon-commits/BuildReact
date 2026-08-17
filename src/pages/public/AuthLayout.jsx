export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div
      className="container"
      style={{
        minHeight: 'calc(100vh - var(--header-height) - 200px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '56px 20px',
      }}
    >
      <div className="card" style={{ width: '100%', maxWidth: 420 }}>
        <div className="card-body">
          <h1 style={{ fontSize: 'var(--fs-2xl)', marginBottom: 4 }}>{title}</h1>
          {subtitle && <p style={{ marginBottom: 24 }}>{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}
