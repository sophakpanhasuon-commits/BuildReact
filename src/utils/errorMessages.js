const AUTH_ERROR_MESSAGES = {
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/user-disabled': 'This account has been disabled. Contact support.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
  'auth/popup-closed-by-user': 'Sign-in was cancelled.',
};

const FIRESTORE_ERROR_MESSAGES = {
  'permission-denied': 'You do not have permission to perform this action.',
  unavailable: 'Service is temporarily unavailable. Please try again.',
  'not-found': 'The requested item could not be found.',
};

export function getAuthErrorMessage(error) {
  const code = error?.code || '';
  return AUTH_ERROR_MESSAGES[code] || 'Something went wrong. Please try again.';
}

export function getFirestoreErrorMessage(error) {
  const code = error?.code || '';
  return FIRESTORE_ERROR_MESSAGES[code] || 'Something went wrong. Please try again.';
}
