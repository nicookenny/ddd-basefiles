/** @format */

import { Entity } from './Entity'
import { IDomainEvent } from '../events/IDomainEvent'

/**
 * @description
 * An aggregate root is an entity that is the root of an aggregate.
 *
 * should implements this interface on your AggregateRoot, and extends with Entity<T>.
 */
export interface IAggregateRoot<T> extends Entity<T> {
  events: IDomainEvent[]

  addDomainEvent(event: IDomainEvent): void
  clearEvents(): void
  dispatchDomainEvents(): void
}
