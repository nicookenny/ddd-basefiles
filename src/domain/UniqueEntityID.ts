/** @format */

import { Identifier } from './Identifier'
import { createId } from '@paralleldrive/cuid2'

export class UniqueEntityID extends Identifier<string | number> {
  constructor(id?: string | number) {
    super(id ? id : createId())
  }
}
