import { AbstractValueObject } from '@ecoma/common-domain';

export interface IInitiatorProps {
  type: string; // 'User', 'System', 'API', 'ScheduledTask', 'Integration'
  id: string | null;
  name: string;
}

export class Initiator extends AbstractValueObject<IInitiatorProps> {
  private constructor(props: IInitiatorProps) {
    super(props);
  }

  public static create(props: Partial<IInitiatorProps>): Initiator {
    if (!props.type) {
      throw new Error('Type is required');
    }
    if (!props.name) {
      throw new Error('Name is required');
    }

    return new Initiator({
      type: props.type,
      id: props.id ?? null,
      name: props.name
    });
  }

  get type(): string {
    return this.props.type;
  }

  get id(): string | null {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }
}
