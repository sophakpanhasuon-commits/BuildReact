import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { createCrudService } from './firestoreCrud';
import { getFirestoreErrorMessage } from '../utils/errorMessages';

const crud = createCrudService('users');

export const listUsers = crud.list;
export const getUser = crud.getById;

export async function setUserRole(uid, role) {
  try {
    await updateDoc(doc(db, 'users', uid), { role });
    return { error: null };
  } catch (error) {
    return { error: getFirestoreErrorMessage(error) };
  }
}
