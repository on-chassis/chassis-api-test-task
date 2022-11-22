import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import * as dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

@ApiTags('APP')
@Controller('health')
export class HealthController {
  startTime: dayjs.Dayjs;

  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
  ) {
    this.startTime = dayjs();
  }

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Healthcheck API status and uptime' })
  check() {
    return this.health.check([
      () => this.http.pingCheck('APP', `http://localhost:${process.env.PORT}`), // this is internal docker address
      () =>
        this.http.pingCheck('DOCS', `http://localhost:${process.env.PORT}/api`),
      () =>
        this.http.responseCheck(
          'USERS',
          `http://localhost:${process.env.PORT}/users`,
          (res) => res.status === 200,
        ),
      () =>
        this.http.responseCheck(
          'POLLS',
          `http://localhost:${process.env.PORT}/polls`,
          (res) => res.status === 200,
        ),
      () =>
        this.http.responseCheck(
          'SECTIONS',
          `http://localhost:${process.env.PORT}/sections`,
          (res) => res.status === 200,
        ),
      () =>
        this.http.responseCheck(
          'QUESTIONS',
          `http://localhost:${process.env.PORT}/questions`,
          (res) => res.status === 200,
        ),
      () => this.db.pingCheck('DB'),
      () => ({
        INFO: {
          status: 'up',
          started: this.startTime.format(),
          uptime: this.startTime.fromNow(),
          timestamp: dayjs().format(),
        },
      }),
    ]);
  }
}
