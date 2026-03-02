import { http } from "@/request/request";

class User {
  /** 登录 */
  login(data: any) {
    return http.post('/mockApi/user/login', data);
  }
}

export default new User();