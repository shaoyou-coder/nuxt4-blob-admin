/**
 * 合并对象 合并obj2 -> obj1
 * @param obj1 对象1
 * @param obj2 对象2
 * @returns
 */
export const mergeObj = (obj1: any, obj2: any) => {
  const keys = Object.keys(obj2);
  keys.forEach((key) => {
    if (typeof obj2[key] === 'object' && obj2[key] !== null) {
      if (typeof obj1[key] === 'undefined') {
        obj1[key] = {};
      }
      mergeObj(obj1[key], obj2[key]);
    } else {
      obj1[key] = obj2[key];
    }
  });
  return obj1;
};

// 判断是否是移动端
export const isMobile = () => {
  const reg = /iPhone|iPad|iPod|Android/i;
  return reg.test(navigator.userAgent);
};

/**
 * 格式化时间
 * @param isoString
 * @returns
 */
export const formatDate = (isoString: string | undefined, hasTime = true) => {
	if (!isoString) return;
	const date = new Date(isoString);

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');
	if (!hasTime) {
		return `${year}-${month}-${day}`;
	}
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};