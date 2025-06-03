import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    HealthModule,
    AuthModule,
    PermissionModule,
    RoleModule,
    UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
