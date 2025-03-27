import { ICommand } from "@ecoma/common-application";
import { CreateRetentionPolicyCommandDto } from "../../dtos/commands/create-retention-policy.command.dto";

export class CreateRetentionPolicyCommand implements ICommand {
  readonly version = "1.0";

  constructor(public readonly payload: CreateRetentionPolicyCommandDto) {}
}
