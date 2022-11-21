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

  // !! TODO !!
  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Healthcheck API status and uptime' })
  check() {
    return this.health.check([
      () => this.http.pingCheck('APP', `http://localhost:${process.env.PORT}`), // this is internal docker address
      () =>
        this.http.pingCheck('DOCS', `http://localhost:${process.env.PORT}/api`),
      // () =>
      //   this.http.responseCheck(
      //     'USER',
      //     `http://localhost:${process.env.PORT}/user`,
      //     (res) => res.status === 204,
      //   ),
      // () =>
      //   this.http.responseCheck(
      //     'POLL',
      //     `http://localhost:${process.env.PORT}/poll`,
      //     (res) => res.status === 204,
      //   ),
      // () =>
      //   this.http.responseCheck(
      //     'SECTION',
      //     `http://localhost:${process.env.PORT}/section`,
      //     (res) => res.status === 204,
      //   ),
      // () =>
      //   this.http.responseCheck(
      //     'QUESTION',
      //     `http://localhost:${process.env.PORT}/question`,
      //     (res) => res.status === 204,
      //   ),
      // () => this.db.pingCheck('database'),
      () => ({
        UPTIME: {
          status: 'up',
          started: this.startTime.format(),
          uptime: this.startTime.fromNow(),
          timestamp: dayjs().format(),
        },
      }),
    ]);
  }
}
