import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { getAuthErrorMessage } from '../utils/errorMessages';

const USERS_COLLECTION = 'users';
export async function registerUser({ name, email, password }) {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });

    await setDoc(doc(db, USERS_COLLECTION, credential.user.uid), {
      uid: credential.user.uid,
      name,
      email,
      role: 'user',
      createdAt: serverTimestamp(),
    });

    return { user: credential.user, error: null };
  } catch (error) {
    return { user: null, error: getAuthErrorMessage(error) };
  }
}

export async function loginUser({ email, password }) {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return { user: credential.user, error: null };
  } catch (error) {
    return { user: null, error: getAuthErrorMessage(error) };
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: getAuthErrorMessage(error) };
  }
}

export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error) {
    return { error: getAuthErrorMessage(error) };
  }
}

/** Fetches the users/{uid} document (contains role, name, etc). */
export async function getUserProfile(uid) {
  try {
    const snap = await getDoc(doc(db, USERS_COLLECTION, uid));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  } catch {
    return null;
  }
}

/** Subscribes to Firebase auth state changes. Returns the unsubscribe function. */
export function subscribeToAuthChanges(callback) {
  return onAuthStateChanged(auth, callback);
}
