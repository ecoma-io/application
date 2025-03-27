import { CreateRetentionPolicyCommandDto } from '../../dtos/commands/create-retention-policy.command.dto';

export class CreateRetentionPolicyCommand {
  constructor(public readonly payload: CreateRetentionPolicyCommandDto) {}
}
