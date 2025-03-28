/**
 * @fileoverview Module kiểm tra sức khỏe của service
 * @since 1.0.0
 */

import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TerminusModule } from "@nestjs/terminus";
import { HealthController } from "./health.controller";

@Module({
  imports: [TerminusModule, MongooseModule],
  controllers: [HealthController],
})
export class HealthModule {}
