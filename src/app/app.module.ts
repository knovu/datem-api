import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { config } from '@src/config';
import { DatabaseModule, GqlModule } from '@src/providers';
import { HealthModule } from '@src/health';
import { AuthModule, JwtAuthGuard } from '@src/auth';
import { UsersModule } from '@src/users';
import { OrganizationsModule } from '@src/organizations';
import { DeviceInfoMiddleware } from '@src/middlewares';

@Module({
    imports: [
        // Provider Modules
        ConfigModule.forRoot({
            isGlobal: true,
            load: [config],
        }),
        DatabaseModule,
        GqlModule,

        // API Modules
        HealthModule,
        AuthModule,
        UsersModule,
        OrganizationsModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        // Apply the middlewares
        consumer.apply(DeviceInfoMiddleware).forRoutes('*'); // Apply to all routes
    }
}
