import { DeleteRetentionPolicyCommandDto } from '../../dtos/commands';

export class DeleteRetentionPolicyCommand {
  constructor(public readonly payload: DeleteRetentionPolicyCommandDto) {}
}
