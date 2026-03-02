
import { useUserStore } from "@/stores/user";

const InterceptResult = {
  Pass: false,
  Abort: true
};
// 路由拦截类
class InterceptControl {
  // 登录拦截
  login(to: any, from: any, next: any) {
    const userStore = useUserStore();
    const token = userStore.token;
    if (token) {
      return InterceptResult.Pass;
    } else {
      next({
        name: 'login'
      });
      return InterceptResult.Abort;
    }
  }
}

// 拦截方法类型, 对应上面拦截类中的所有方法的字符串形式
type InterceptMethods = 'login'

const interceptControl = new InterceptControl();

export default function (router: any) {
  router.beforeEach(async (to: any, from: any, next: any) => {
    try {
      const checkList = to.meta.intercept;
      // 路由是否可以继续
      let isComplete;
      if (checkList && checkList.length > 0) {
        let checkType: InterceptMethods;
        for (checkType of checkList) {
          // 根据meta中的不同拦截需求，用不同的handler按照(顺序！！！)进行处理，有一个handler拦截，则abort
          const isAbort = await interceptControl[checkType](to, from, next);
          if (isAbort) {
            isComplete = false;
            break;
          }
        }
      }
      next(isComplete);
    } catch (error) {
      console.log('没有这个路由拦截判断方法', error);
    }
  });
}