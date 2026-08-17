import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { createCrudService } from './firestoreCrud';
import { getFirestoreErrorMessage } from '../utils/errorMessages';

const crud = createCrudService('messages');

export const listMessages = crud.list;
export const getMessage = crud.getById;
export const deleteMessage = crud.remove;

export async function submitMessage(payload) {
  return crud.create({ ...payload, isRead: false });
}

export async function setMessageReadState(id, isRead) {
  try {
    await updateDoc(doc(db, 'messages', id), { isRead });
    return { error: null };
  } catch (error) {
    return { error: getFirestoreErrorMessage(error) };
  }
}
