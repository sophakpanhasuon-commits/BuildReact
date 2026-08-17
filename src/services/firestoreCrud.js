import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { getFirestoreErrorMessage } from '../utils/errorMessages';

export function createCrudService(collectionName) {
  const colRef = collection(db, collectionName);

  return {
    async list(sortField = 'createdAt', sortDir = 'desc') {
      try {
        const q = query(colRef, orderBy(sortField, sortDir));
        const snap = await getDocs(q);
        return { data: snap.docs.map((d) => ({ id: d.id, ...d.data() })), error: null };
      } catch (error) {
        return { data: [], error: getFirestoreErrorMessage(error) };
      }
    },

    async getById(id) {
      try {
        const snap = await getDoc(doc(db, collectionName, id));
        if (!snap.exists()) return { data: null, error: 'Not found.' };
        return { data: { id: snap.id, ...snap.data() }, error: null };
      } catch (error) {
        return { data: null, error: getFirestoreErrorMessage(error) };
      }
    },

    async create(payload) {
      try {
        const ref = await addDoc(colRef, {
          ...payload,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        return { id: ref.id, error: null };
      } catch (error) {
        return { id: null, error: getFirestoreErrorMessage(error) };
      }
    },

    async update(id, payload) {
      try {
        await updateDoc(doc(db, collectionName, id), {
          ...payload,
          updatedAt: serverTimestamp(),
        });
        return { error: null };
      } catch (error) {
        return { error: getFirestoreErrorMessage(error) };
      }
    },

    async remove(id) {
      try {
        await deleteDoc(doc(db, collectionName, id));
        return { error: null };
      } catch (error) {
        return { error: getFirestoreErrorMessage(error) };
      }
    },
  };
}
