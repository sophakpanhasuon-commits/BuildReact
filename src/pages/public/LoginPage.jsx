import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { loginUser } from '../../services/authService';
import { isValidEmail, validateRequired } from '../../utils/validation';

export default function LoginPage() {
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  }

  function validate() {
    const next = {};
    if (!isValidEmail(values.email)) next.email = 'Enter a valid email address.';
    if (!validateRequired(values.password)) next.password = 'Password is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    setLoading(true);
    const { error } = await loginUser(values);
    setLoading(false);

    if (error) {
      setFormError(error);
      return;
    }

    const redirectTo = location.state?.from?.pathname || '/';
    navigate(redirectTo, { replace: true });
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your account to continue.">
      {formError && <div className="alert alert-error">{formError}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Email address"
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
          required
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
          required
        />
        <div style={{ textAlign: 'right', marginBottom: 16 }}>
          <Link to="/forgot-password" style={{ fontSize: 'var(--fs-sm)' }}>
            Forgot password?
          </Link>
        </div>
        <Button type="submit" fullWidth loading={loading}>
          Sign In
        </Button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 20, marginBottom: 0 }}>
        Don't have an account? <Link to="/register">Create one</Link>
      </p>
    </AuthLayout>
  );
}
