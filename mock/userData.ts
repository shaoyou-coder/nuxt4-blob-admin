// test.ts

import { MockMethod } from 'vite-plugin-mock';
export default [
  {
    url: '/mockApi/user/login',
    method: 'post',
    response: {
      code: '0000',
      message: 'success',
      data: {
        token: 'sadasdxdcas213sad'
      }
    }
  }
] as MockMethod[];