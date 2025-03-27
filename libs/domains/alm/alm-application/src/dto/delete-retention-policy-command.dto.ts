import { DataTransferObject } from "@ecoma/common-application";
import { IsString } from "class-validator";

export class DeleteRetentionPolicyCommandDto extends DataTransferObject {
  @IsString()
  id!: string;
}
