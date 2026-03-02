import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      token: '',
      isCollapse: false,
      sideWidth: '140px',
      routeActiveIndex: '1-1'
    };
  },
  actions: {
    loginOut() {
      this.token = '';
      this.isCollapse = false;
      this.sideWidth = '140px';
      this.routeActiveIndex = '1-1';
    },
  },
  persist: {
    key: 'USER',
    storage: sessionStorage,
    paths: ['token', 'isCollapse', 'sideWidth', 'routeActiveIndex']
  }
});