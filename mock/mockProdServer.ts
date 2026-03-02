import { createProdMockServer } from 'vite-plugin-mock/client';
import userData from './userData';
import midData from './midData';

export function setupProdMockServer() {
  createProdMockServer([...userData, ...midData]);
}