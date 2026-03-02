import { createRouter, createWebHistory } from 'vue-router';
import interceptor from './interceptor';
import Login from '../views/Login.vue';
import BasePage from '../layout/BasePage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: BasePage,
      redirect: '/track',
      meta: {
        title: '首页'
      },
      children: [
        {
          path: '/track',
          name: 'track',
          component: () => import('../views/track/index.vue'),
          meta: {
            title: '数据展示',
            intercept: ['login']
          },
        },
        {
          path: '/site',
          name: 'site',
          component: () => import('../views/site/index.vue'),
          meta: {
            title: '网站配置管理',
            intercept: ['login']
          },
        },
        {
          path: '/column',
          name: 'column',
          component: () => import('../views/column/index.vue'),
          meta: {
            title: '专栏管理',
            intercept: ['login']
          },
        },
        {
          path: '/type',
          name: 'type',
          component: () => import('../views/type/index.vue'),
          meta: {
            title: '文章类型管理',
            intercept: ['login']
          },
        },
        {
          path: '/article',
          name: 'article',
          component: () => import('../views/article/index.vue'),
          meta: {
            title: '文章管理',
            intercept: ['login']
          },
        },
        {
          path: '/bookmark',
          name: 'bookmark',
          meta: {
            title: '书签管理',
            intercept: ['login']
          },
          redirect: '/bookmark/col',
          children: [
            {
              path: '/bookmark/col',
              name: 'col',
              component: () => import('../views/bookmark/col/index.vue'),
              meta: {
                title: '书签栏管理'
              },
            },
            {
              path: '/bookmark/info',
              name: 'info',
              component: () => import('../views/bookmark/info/index.vue'),
              meta: {
                title: '书签内容管理'
              },
            },
          ]
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
});

interceptor(router);

export default router;
