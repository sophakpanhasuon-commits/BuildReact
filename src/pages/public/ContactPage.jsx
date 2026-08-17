import { useState } from 'react';
import { MapPin, Phone, Mail, CheckCircle2 } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { submitMessage } from '../../services/messageService';
import { isValidEmail, isValidPhone, validateRequired } from '../../utils/validation';

const initialValues = { name: '', email: '', phone: '', subject: '', message: '' };

export default function ContactPage() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [formError, setFormError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  }

  function validate() {
    const next = {};
    if (!validateRequired(values.name)) next.name = 'Name is required.';
    if (!isValidEmail(values.email)) next.email = 'Enter a valid email address.';
    if (!isValidPhone(values.phone)) next.phone = 'Enter a valid phone number.';
    if (!validateRequired(values.subject)) next.subject = 'Subject is required.';
    if (!validateRequired(values.message)) next.message = 'Message is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    if (status === 'loading') return; // prevent duplicate submissions
    if (!validate()) return;

    setStatus('loading');
    const { error } = await submitMessage(values);

    if (error) {
      setFormError(error);
      setStatus('error');
      return;
    }
    setStatus('success');
    setValues(initialValues);
  }

  return (
    <section className="section container">
      <div className="section-header">
        <span className="eyebrow">Get In Touch</span>
        <h1>Contact Us</h1>
        <p>Have a question or want to work with us? Send a message below.</p>
      </div>

      <div className="grid grid-2" style={{ alignItems: 'start', gap: 40 }}>
        <div className="card">
          <div className="card-body">
            {status === 'success' ? (
              <div className="state-block" style={{ padding: 24 }}>
                <CheckCircle2 size={40} color="var(--success)" />
                <h3>Message Sent</h3>
                <p>Thanks for reaching out — we'll get back to you as soon as possible.</p>
                <Button variant="outline" onClick={() => setStatus('idle')}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {formError && <div className="alert alert-error">{formError}</div>}
                <div className="grid grid-2">
                  <Input label="Full Name" name="name" value={values.name} onChange={handleChange} error={errors.name} required />
                  <Input label="Email" type="email" name="email" value={values.email} onChange={handleChange} error={errors.email} required />
                </div>
                <div className="grid grid-2">
                  <Input label="Phone (optional)" name="phone" value={values.phone} onChange={handleChange} error={errors.phone} />
                  <Input label="Subject" name="subject" value={values.subject} onChange={handleChange} error={errors.subject} required />
                </div>
                <Input
                  as="textarea"
                  label="Message"
                  name="message"
                  value={values.message}
                  onChange={handleChange}
                  error={errors.message}
                  required
                />
                <Button type="submit" loading={status === 'loading'}>
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div className="card-body" style={{ display: 'flex', gap: 14 }}>
              <MapPin color="var(--primary)" />
              <div><strong>Address</strong><p>Phnom Penh, Cambodia</p></div>
            </div>
          </div>
          <div className="card">
            <div className="card-body" style={{ display: 'flex', gap: 14 }}>
              <Phone color="var(--primary)" />
              <div><strong>Phone</strong><p>+855 86 77 41 321</p></div>
            </div>
          </div>
          <div className="card">
            <div className="card-body" style={{ display: 'flex', gap: 14 }}>
              <Mail color="var(--primary)" />
              <div><strong>Gmail</strong><p>admin@gmail.com</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
