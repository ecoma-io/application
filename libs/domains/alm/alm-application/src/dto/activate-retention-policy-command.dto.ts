import { DataTransferObject } from "@ecoma/common-application";
import { IsString } from "class-validator";

export class ActivateRetentionPolicyCommandDto extends DataTransferObject {
  @IsString()
  id!: string;
}
