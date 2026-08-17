export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

export function isValidPhone(phone) {
  if (!phone) return true; // phone often optional
  return /^[0-9+\-\s()]{6,20}$/.test(phone.trim());
}

export function validateRequired(value) {
  return String(value ?? '').trim().length > 0;
}

export function validatePassword(password) {
  return String(password || '').length >= 6;
}

// Generic validator: pass a rules object, get back an errors object.
// rules = { fieldName: [{ test: fn, message: 'text' }, ...] }
export function runValidation(values, rules) {
  const errors = {};
  Object.keys(rules).forEach((field) => {
    for (const rule of rules[field]) {
      if (!rule.test(values[field], values)) {
        errors[field] = rule.message;
        break;
      }
    }
  });
  return errors;
}
