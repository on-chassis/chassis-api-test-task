import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { AppService } from './app.service';
import { AllowAny } from './decorators/allow-all.decorator';

@ApiTags('APP')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @AllowAny()
  @ApiOperation({ summary: 'Default greeting route' })
  getAppName(): string {
    return this.appService.getAppName();
  }
}
