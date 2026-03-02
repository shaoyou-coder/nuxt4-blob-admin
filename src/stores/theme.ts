import { defineStore } from 'pinia';

export type ThemeMode = 'light' | 'dark';

export const useThemeStore = defineStore('theme', {
  state: () => {
    return {
      theme: 'light' as ThemeMode
    };
  },
  actions: {
    setTheme(theme: ThemeMode) {
      this.theme = theme;
      this.applyTheme(theme);
    },
    toggleTheme() {
      const newTheme = this.theme === 'light' ? 'dark' : 'light';
      this.setTheme(newTheme);
    },
    applyTheme(theme: ThemeMode) {
      const html = document.documentElement;
      if (theme === 'dark') {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    },
    initTheme() {
      this.applyTheme(this.theme);
    }
  },
  persist: {
    key: 'THEME',
    storage: localStorage,
    paths: ['theme']
  }
});

