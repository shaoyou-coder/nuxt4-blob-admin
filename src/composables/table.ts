const defaultTableHeight = 350;
export function useTableHeight() {
  const setTableHeight = (dom: any) => {
    if (dom) {
      let h: number;
      h = window.innerHeight - dom.value.$el.offsetTop - 90;
      h = h < defaultTableHeight ? defaultTableHeight : h;
      return h;
    }
  };
  return { setTableHeight };
}

