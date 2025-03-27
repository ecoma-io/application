import { DataTransferObject } from "@ecoma/common-application";
import { IsString } from "class-validator";

export class DeactivateRetentionPolicyCommandDto extends DataTransferObject {
  @IsString()
  id!: string;
}
