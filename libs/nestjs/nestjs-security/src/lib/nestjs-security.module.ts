import { Module } from "@nestjs/common";
import { AuthGuard } from "./decorators/auth.guard";

@Module({
  providers: [AuthGuard],
  exports: [AuthGuard],
})
export class NestjsSecurityModule {}
