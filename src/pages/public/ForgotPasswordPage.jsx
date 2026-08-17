import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { resetPassword } from '../../services/authService';
import { isValidEmail } from '../../utils/validation';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }

    setLoading(true);
    const { error: resetError } = await resetPassword(email);
    setLoading(false);

    if (resetError) {
      setError(resetError);
      return;
    }
    setSent(true);
  }

  return (
    <AuthLayout title="Reset your password" subtitle="We'll email you a link to reset it.">
      {sent ? (
        <div className="alert alert-success">
          If an account exists for {email}, a reset link has been sent. Check your inbox.
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          {error && <div className="alert alert-error">{error}</div>}
          <Input
            label="Email address"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <Button type="submit" fullWidth loading={loading}>
            Send Reset Link
          </Button>
        </form>
      )}
      <p style={{ textAlign: 'center', marginTop: 20, marginBottom: 0 }}>
        <Link to="/login">Back to sign in</Link>
      </p>
    </AuthLayout>
  );
}
