/**
 * @fileoverview Interface định nghĩa repository
 * @since 1.0.0
 */

import { AbstractAggregate } from "../../aggregates";
import { AbstractId } from "../../value-object";
import { IReadRepository } from "./read-repository";
import { IWriteRepository } from "./write-repository";

/**
 * Interface định nghĩa repository
 */
export interface IRepository<
  TId extends AbstractId,
  TAggregateRoot extends AbstractAggregate<TId>
> extends IReadRepository<TId, TAggregateRoot>,
    IWriteRepository<TId, TAggregateRoot> {}
