import { UpdateRetentionPolicyCommandDto } from '../../dtos/commands';

export class UpdateRetentionPolicyCommand {
  constructor(public readonly payload: UpdateRetentionPolicyCommandDto) {}
}
