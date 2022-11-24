// https://medium.com/@sascha.wolff/advanced-nestjs-how-to-have-access-to-the-current-user-in-every-service-without-request-scope-2586665741f
import { AsyncLocalStorage } from 'async_hooks';

export interface AuthUser {
  id: string;
}

export const UserStorage = {
  storage: new AsyncLocalStorage<AuthUser>(),
  get() {
    return this.storage.getStore();
  },
  set(user: AuthUser) {
    return this.storage.enterWith(user);
  },
};
