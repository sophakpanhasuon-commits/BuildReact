import { createCrudService } from './firestoreCrud';

const crud = createCrudService('services');

export const listServices = crud.list;
export const getService = crud.getById;
export const createService = crud.create;
export const updateService = crud.update;
export const deleteService = crud.remove;
