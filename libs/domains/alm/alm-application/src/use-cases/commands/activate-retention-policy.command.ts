import { ActivateRetentionPolicyCommandDto } from '../../dtos/commands/activate-retention-policy.command.dto';

export class ActivateRetentionPolicyCommand {
  constructor(public readonly payload: ActivateRetentionPolicyCommandDto) {}
}
