import {
  AbstractAggregate,
  AbstractId,
  IEntityProps,
} from "@ecoma/common-domain";

export abstract class AbstractAggregateFactory<
  TId extends AbstractId,
  TProps extends IEntityProps<TId>,
  TAggregate extends AbstractAggregate<TId, TProps>
> {
  abstract create(props: Omit<TProps, "id">): TAggregate;
}
