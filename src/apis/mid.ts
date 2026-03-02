import { http } from "@/request/request";
import type { AxiosRequestConfig } from 'axios';

class MidApi {
  /** 公共接口 */
  login(params: any) {
    return http.post('/admin/login', params);
  }
  uploadFile(data: object, config: AxiosRequestConfig) {
    return http.post('/common/uploadByOss', data, config);
  }
  getSiteConfig() {
    return http.get('/common/getSite');
  }
  setSiteConfig(data: any) {
    return http.post('/common/saveSite', data);
  }

  /** 专栏接口 */
  // 新增专栏
  addColumn(data: any) {
    return http.post('/column/add', data);
  }
  // 获取专栏
  getAllColumn() {
    return http.get('/column/get');
  }
  // 修改专栏
  updateColumn(data: any) {
    return http.post('/column/update', data);
  }
  // 修改专栏状态
  updateColumnStatus(data: any) {
    return http.post('/column/status', data);
  }
  // 删除专栏
  delColumn(id: number) {
    const params = { id };
    return http.get('/column/delete', {params});
  }

  /** 文章类型接口 */
  // 获取文章类型列表
  getAllArticleType() {
    return http.get('/type/get');
  }
  // 通过col获取文章类型
  getArticleTypeByCol(params: object) {
    return http.get('/type/getBycol', { params });
  }
  // 新增文章类型
  addArticleType(data: any) {
    return http.post('/type/add', data);
  }
  // 更新文章类型
  updateArticleType(data: any) {
    return http.post('/type/update', data);
  }
  // 更新文章类型状态
  updateArticleTypeStatus(data: any) {
    return http.post('/type/status', data);
  }
  // 删除文章类型
  delArticleType(id: number) {
    const params = { id };
    return http.get('/type/delete', {params});
  }

  /** 文章接口 */
  // 获取文章列表
  getAllArticle(params: object) {
    console.log(params);
    return http.get('/article/get', { params });
  }
  // 条件获取文章列表
  getArticleByType(type_id: number) {
    const params = { type_id };
    return http.get('/article/query', {params});
  }
  // 新增文章
  addArticle(data: any) {
    return http.post('/article/add', data);
  }
  // 更新文章
  updateArticle(data: any) {
    return http.post('/article/update', data);
  }
  // 更新文章状态
  updateArticleStatus(data: any) {
    return http.post('/article/status', data);
  }
  // 删除文章
  delArticle(id: number) {
    const params = { id };
    return http.get('/article/delete', {params});
  }

  /** 埋点数据接口 */
  // 查询总的pv、uv、w文章数
  getAllCount() {
    return http.get('/track/getAllCount');
  }
  // 查询每种文章类型的阅读数
  getArticleNumByType() {
    return http.get('/track/getArticleNumByType');
  }
  // 查询每天的pv、uv、文章阅读数
  getLookNumByDay() {
    return http.get('/track/getLookNumByDay');
  }

  /** 书签栏接口 */
  // 新增书签栏
  addCol(data: any) {
    return http.post('/bookmark/col/add', data);
  }
  // 获取书签栏
  getAllCol() {
    return http.get('/bookmark/col/get');
  }
  // 修改书签栏
  updateCol(data: any) {
    return http.post('/bookmark/col/update', data);
  }
  // 删除书签栏
  delCol(id: number) {
    const params = { id };
    return http.get('/bookmark/col/del', {params});
  }

  /** 书签内容接口 */
  // 新增书签内容
  addMark(data: any) {
    return http.post('/bookmark/info/add', data);
  }
  // 获取书签内容
  getAllMark(params: any) {
    return http.get('/bookmark/info/get', { params });
  }
  // 修改书签内容
  updateMark(data: any) {
    return http.post('/bookmark/info/update', data);
  }
  // 删除书签内容
  delMark(id: number) {
    const params = { id };
    return http.get('/bookmark/info/del', {params});
  }
}

export default new MidApi();