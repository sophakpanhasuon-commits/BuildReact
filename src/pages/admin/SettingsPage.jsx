import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db, auth } from '../../config/firebase';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/States';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../hooks/useAuth';

const SETTINGS_DOC = doc(db, 'settings', 'general');

export default function SettingsPage() {
  const [business, setBusiness] = useState({ businessName: '', phone: '', email: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const { showToast } = useToast();
  const { profile, refreshProfile } = useAuth();

  useEffect(() => {
    (async () => {
      const snap = await getDoc(SETTINGS_DOC);
      if (snap.exists()) setBusiness((b) => ({ ...b, ...snap.data() }));
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (profile?.name) setDisplayName(profile.name);
  }, [profile]);

  async function handleBusinessSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(SETTINGS_DOC, { ...business, updatedAt: serverTimestamp() }, { merge: true });
      showToast('Business settings saved.', 'success');
    } catch {
      showToast('Failed to save settings.', 'error');
    }
    setSaving(false);
  }

  async function handleProfileSave(e) {
    e.preventDefault();
    setSavingProfile(true);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName });
      }
      await refreshProfile();
      showToast('Profile updated.', 'success');
    } catch {
      showToast('Failed to update profile.', 'error');
    }
    setSavingProfile(false);
  }

  if (loading) return <LoadingSpinner label="Loading settings…" />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 640 }}>
      <div className="card">
        <div className="card-body">
          <h3>Business Information</h3>
          <p>Shown across the public site (footer, contact page).</p>
          <form onSubmit={handleBusinessSave}>
            <Input
              label="Business Name"
              value={business.businessName}
              onChange={(e) => setBusiness((b) => ({ ...b, businessName: e.target.value }))}
            />
            <Input
              label="Phone"
              value={business.phone}
              onChange={(e) => setBusiness((b) => ({ ...b, phone: e.target.value }))}
            />
            <Input
              label="Email"
              value={business.email}
              onChange={(e) => setBusiness((b) => ({ ...b, email: e.target.value }))}
            />
            <Input
              label="Address"
              value={business.address}
              onChange={(e) => setBusiness((b) => ({ ...b, address: e.target.value }))}
            />
            <Button type="submit" loading={saving}>Save Business Info</Button>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h3>Your Profile</h3>
          <form onSubmit={handleProfileSave}>
            <Input label="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            <Button type="submit" loading={savingProfile}>Save Profile</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
