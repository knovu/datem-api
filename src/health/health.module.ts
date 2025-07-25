// Imports
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

// Local imports
import { HealthController } from './health.controller';

@Module({
    imports: [TerminusModule, HttpModule],
    controllers: [HealthController],
})
export class HealthModule {}
