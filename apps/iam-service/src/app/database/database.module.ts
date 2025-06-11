import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { MongodbConfig } from "../config/mongodb.config";
import { OTP, OTPSchema, Permission, PermissionSchema, Role, RoleSchema, Session, SessionSchema, User, UserSchema } from "./schemas";
import { OTPRepository, PermissionRepository, RoleRepository, SessionRepository, UserRepository } from "./repositories";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get<MongodbConfig>("mongodb"),
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: Session.name, schema: SessionSchema },
      { name: OTP.name, schema: OTPSchema },
    ]),
  ],
  controllers: [],
  providers: [
    OTPRepository,
    PermissionRepository,
    RoleRepository,
    SessionRepository,
    UserRepository
  ],
  exports: [
    OTPRepository,
    PermissionRepository,
    RoleRepository,
    SessionRepository,
    UserRepository
  ]
})
export class DatabaseModule { }
