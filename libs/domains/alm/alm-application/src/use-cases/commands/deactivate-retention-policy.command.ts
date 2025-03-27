import { DeactivateRetentionPolicyCommandDto } from '../../dtos/commands/deactivate-retention-policy.command.dto';

export class DeactivateRetentionPolicyCommand {
  constructor(public readonly payload: DeactivateRetentionPolicyCommandDto) {}
}
