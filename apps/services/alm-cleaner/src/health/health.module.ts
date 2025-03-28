/**
 * @fileoverview Module kiểm tra sức khỏe cho ALM Cleaner Service
 * @since 1.0.0
 */

import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { HealthController } from "./health.controller";

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
})
export class HealthModule {} 