import { ICommand } from "@ecoma/common-application";
import { DeleteRetentionPolicyCommandDto } from "../../dtos/commands/delete-retention-policy.command.dto";

export class DeleteRetentionPolicyCommand implements ICommand {
  readonly version = "1.0";

  constructor(public readonly payload: DeleteRetentionPolicyCommandDto) {}
}
