import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { AuthenticateModule } from './auth/authenticate.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    HealthModule,
    AuthenticateModule,
    PermissionModule,
    RoleModule,
    UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
