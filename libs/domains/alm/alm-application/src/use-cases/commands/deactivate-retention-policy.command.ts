import { ICommand } from "@ecoma/common-application";
import { DeactivateRetentionPolicyCommandDto } from "../../dtos/commands/deactivate-retention-policy.command.dto";

export class DeactivateRetentionPolicyCommand implements ICommand {
  readonly version = "1.0";

  constructor(public readonly payload: DeactivateRetentionPolicyCommandDto) {}
}
