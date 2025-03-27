import { ICommand } from "@ecoma/common-application";
import { UpdateRetentionPolicyCommandDto } from "../../dtos/commands/update-retention-policy.command.dto";

export class UpdateRetentionPolicyCommand implements ICommand {
  readonly version = "1.0";

  constructor(public readonly payload: UpdateRetentionPolicyCommandDto) {}
}
