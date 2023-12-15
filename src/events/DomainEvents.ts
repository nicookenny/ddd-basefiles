/** @format */

import { IDomainEvent } from './IDomainEvent'
import { UniqueEntityID } from '../domain/UniqueEntityID'
import { IAggregateRoot } from '../domain/AggregateRoot'

type Handler = (event: IDomainEvent) => void
type HandlersMap = Map<string, Array<Handler>>

export class DomainEvents {
  private handlers: HandlersMap = new Map()

  private markedAggregates: IAggregateRoot<any>[] = []

  private dispatchAggregateEvents(aggregate: IAggregateRoot<any>): void {
    const domainEvents = aggregate.events
    domainEvents.forEach((event: IDomainEvent) => {
      this.dispatch(event)
    })
  }

  private removeAggregateFromMarkedDispatchList(
    aggregate: IAggregateRoot<any>
  ): void {
    const index = this.markedAggregates.findIndex((a) => a.equals(aggregate))
    this.markedAggregates = this.markedAggregates.splice(index, 1)
  }

  private findMarkedAggregateByID(
    id: UniqueEntityID
  ): IAggregateRoot<any> | null {
    const found =
      this.markedAggregates.find((aggregate) => aggregate.id.equals(id)) || null
    return found
  }

  public markAggregateForDispatch(aggregate: IAggregateRoot<any>): void {
    const aggregateFound = !!this.findMarkedAggregateByID(aggregate.id)
    if (!aggregateFound) {
      this.markedAggregates.push(aggregate)
    }
  }

  public dispatchEventsForAggregate(id: UniqueEntityID): void {
    const aggregate = this.findMarkedAggregateByID(id)
    if (aggregate) {
      this.dispatchAggregateEvents(aggregate)
      aggregate.clearEvents()
      this.removeAggregateFromMarkedDispatchList(aggregate)
    }
  }

  public register(
    handlerMethod: (event: IDomainEvent) => void,
    eventName: string
  ): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, [])
    } else {
      const handlers = this.handlers.get(eventName)!
      handlers.push(handlerMethod)
      this.handlers.set(eventName, handlers)
    }
  }

  public dispatch(event: IDomainEvent): void {
    const eventName: string = event.constructor.name

    if (this.handlers.has(eventName)) {
      const handlers = this.handlers.get(eventName)!

      handlers.forEach((handler) => {
        console.info(`[Domain Event Dispatched]: ${eventName}`)
        console.info(`[Domain Event Handler]: ${handler.name}`)

        handler(event)
      })
    }
  }

  public clearHandlers(): void {
    this.handlers = new Map()
  }

  public clearMarkedAggregates(): void {
    this.markedAggregates = []
  }
}
