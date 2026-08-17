import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Button from '../../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="container state-block" style={{ padding: '96px 20px' }}>
      <Compass size={48} />
      <h1>404 — Page Not Found</h1>
      <p>The page you're looking for doesn't exist or has moved.</p>
      <Link to="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
}
