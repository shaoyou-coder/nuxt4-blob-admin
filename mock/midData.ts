import { MockMethod } from 'vite-plugin-mock';
import Mock from 'mockjs';

export default [
  {
    url: '/mockApi/table/list',
    method: 'get',
    response: () => {
      return {
        code: '0000',
        message: 'success',
        data: Mock.mock({
          'list|10': [
            {
              'id|+1': 1,
              'name': '@cname',
              'age|18-60': 18,
              'avatar': Mock.Random.image('200x100', '#50B347', '#FFF', 'Mock.js')
            }
          ]
        })
      };
    }
  }
] as MockMethod[];