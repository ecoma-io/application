import { AggregateRoot, DomainEvent } from '@ecoma/common-domain'; // Adjust path
import { Guard } from '@ecoma/common-utils'; // Adjust path
import { PermissionScope } from '../value-objects/permission-scope.vo';

export interface IPermissionDefinitionProps {
  value: string; // Unique permission string, e.g., "Product:Create:Organization"
  description?: string;
  scope: PermissionScope;
  parentPermissionId?: string; // ID of the parent PermissionDefinition for hierarchy
  createdAt: Date;
  // No updatedAt needed if definitions are immutable after creation, or add if they can be updated
}

export class PermissionDefinition extends AggregateRoot<IPermissionDefinitionProps> {
  private constructor(props: IPermissionDefinitionProps, id?: string) {
    super(props, id);
  }

  public static create(props: Omit<IPermissionDefinitionProps, 'createdAt'>, id?: string): PermissionDefinition {
    Guard.againstNullOrEmpty(props.value, 'value');
    Guard.againstNullOrUndefined(props.scope, 'scope');

    const definition = new PermissionDefinition({
      ...props,
      createdAt: new Date(),
    }, id);
    // TODO: Add PermissionDefinitionCreatedEvent
    return definition;
  }

  public static hydrate(props: IPermissionDefinitionProps, id: string): PermissionDefinition {
    return new PermissionDefinition(props, id);
  }

  get value(): string { return this.props.value; }
  get description(): string | undefined { return this.props.description; }
  get scope(): PermissionScope { return this.props.scope; }
  get parentPermissionId(): string | undefined { return this.props.parentPermissionId; }
  get createdAt(): Date { return this.props.createdAt; }

  // If definitions can be updated, add methods like:
  // public updateDescription(description: string): void { /* ... */ }
  public defineParentPermission(parentPermissionId: string): void {
    // Potentially check for circular dependencies or if parent exists/has same scope
    // This logic might be better in a domain service if complex
    Guard.againstNullOrEmpty(parentPermissionId, 'parentPermissionId');
    if (this.id === parentPermissionId) {
        throw new Error('Permission definition cannot be its own parent.'); // DomainError
    }
    this.props.parentPermissionId = parentPermissionId;
    // TODO: Add event if this is a significant change, or if updatedAt is tracked
  }
}
