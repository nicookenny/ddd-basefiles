/** @format */

import { UniqueEntityID } from '../domain/UniqueEntityID'

export interface IDomainEvent {
  dateTimeOccurred: Date
  aggregateId: UniqueEntityID
  eventType: string
  payload: any
}
