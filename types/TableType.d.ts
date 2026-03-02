// 列属性类型，可增加
export type colConfigType = {
  width?: string | number, // 列宽度
  align?: string, // 对齐方式
  slot?: string, // 是否使用插槽
  isImg?: boolean, // 是否是图片资源
  prop: string, // 字段名称
  label: string, // 字段标题
};

// 表头属性类型，可增加
export type TablePropsType = {
  colConfigs: Array<colConfigType>; // 表头
  data: Array<object>; // 表格数据
  width: string; // 表格宽度
};


