import { ICommand } from "@ecoma/common-application";
import { ActivateRetentionPolicyCommandDto } from "../../dtos/commands/activate-retention-policy.command.dto";

export class ActivateRetentionPolicyCommand implements ICommand {
  readonly version = "1.0";

  constructor(public readonly payload: ActivateRetentionPolicyCommandDto) {}
}
