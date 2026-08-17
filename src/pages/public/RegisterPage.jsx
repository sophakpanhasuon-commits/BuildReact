import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { registerUser } from '../../services/authService';
import { isValidEmail, validatePassword, validateRequired } from '../../utils/validation';

export default function RegisterPage() {
  const [values, setValues] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  }

  function validate() {
    const next = {};
    if (!validateRequired(values.name)) next.name = 'Full name is required.';
    if (!isValidEmail(values.email)) next.email = 'Enter a valid email address.';
    if (!validatePassword(values.password)) next.password = 'Password must be at least 6 characters.';
    if (values.confirmPassword !== values.password) next.confirmPassword = 'Passwords do not match.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    setLoading(true);
    const { error } = await registerUser(values);
    setLoading(false);

    if (error) {
      setFormError(error);
      return;
    }
    navigate('/', { replace: true });
  }

  return (
    <AuthLayout title="Create an account" subtitle="Join us to get started.">
      {formError && <div className="alert alert-error">{formError}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Full name"
          name="name"
          value={values.name}
          onChange={handleChange}
          error={errors.name}
          autoComplete="name"
          required
        />
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
          hint="At least 6 characters."
          autoComplete="new-password"
          required
        />
        <Input
          label="Confirm password"
          type="password"
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          autoComplete="new-password"
          required
        />
        <Button type="submit" fullWidth loading={loading}>
          Create Account
        </Button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 20, marginBottom: 0 }}>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
