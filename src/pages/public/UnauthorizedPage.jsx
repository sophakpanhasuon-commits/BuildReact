import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import Button from '../../components/common/Button';

export default function UnauthorizedPage() {
  return (
    <div className="container state-block" style={{ padding: '96px 20px' }}>
      <ShieldAlert size={48} color="var(--danger)" />
      <h1>Access Denied</h1>
      <p>You don't have permission to view this page.</p>
      <Link to="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
}
