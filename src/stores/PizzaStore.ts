import { defineStore } from 'pinia';

export const usePizzaStore = defineStore({
  id: 'pizza',
  state: () => ({
    count: 1,
    size: '',
    style: '',
    dough: '',
  }),
  actions: {
    setSize(size: string) {
      this.size = size;
    },
    setStyle(style: string) {
      this.style = style;
    },
    setDough(dough: string) {
      this.dough = dough;
    },
    setCount(count: number) {
      this.count = count;
    },
  },
});
