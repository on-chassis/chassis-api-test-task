import { User } from '../entities/user.entity';

export class UserCreatedEvent {
  userId: string;
  payload: User;
}
