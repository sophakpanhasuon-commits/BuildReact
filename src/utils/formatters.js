export function formatDate(timestamp) {
  if (!timestamp) return '—';
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(timestamp) {
  if (!timestamp) return '—';
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatPrice(price, currency = '$') {
  const num = Number(price);
  if (Number.isNaN(num)) return `${currency}0.00`;
  return `${currency}${num.toFixed(2)}`;
}

export function truncateText(text, maxLength = 100) {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}…` : text;
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
}
