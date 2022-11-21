import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getAppName(): string {
    return 'Hello, I am Chassis API Test Task!';
  }
}
