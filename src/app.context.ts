// https://medium.com/@sascha.wolff/advanced-nestjs-how-to-have-access-to-the-current-user-in-every-service-without-request-scope-2586665741f
// https://github.com/nestjs/nest/issues/6012
import { RequestContext } from '@medibloc/nestjs-request-context';

export interface AuthUser {
  id: string;
}

export class AppContext extends RequestContext {
  user: AuthUser;
}
