import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { HealthCheckService, HttpHealthIndicator, HealthCheck } from '@nestjs/terminus';
import { Public } from '@src/decorators';

/**
 * https://docs.nestjs.com/recipes/terminus
 */
@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
    ) {}

    @Public()
    @Get()
    @HealthCheck()
    @ApiExcludeEndpoint(true)
    public async check() {
        return this.health.check([() => this.http.pingCheck('dns', 'https://1.1.1.1')]);
    }
}
