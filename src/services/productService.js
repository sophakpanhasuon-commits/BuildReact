import { createCrudService } from './firestoreCrud';

const crud = createCrudService('products');

export const listProducts = crud.list;
export const getProduct = crud.getById;
export const createProduct = crud.create;
export const updateProduct = crud.update;
export const deleteProduct = crud.remove;
