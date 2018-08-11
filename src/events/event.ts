import { Listener } from './listener'
import {
  ResolverHook,
  registerResolverHook,
  Consume,
  Consumer,
} from './resolver'
import { tokenGenerator, OpaqueType } from '../utils/opaqueType'
import { OrderedTokenContext } from '../utils/orderedTokenContext'
import { Game } from '../game'

export interface EventType<Subject, Data> extends ResolverHook {
  subject?: Subject
  data?: Data
}

type EventConfiguration<Subject, Data> = {
  actors: unknown[] | unknown
  subject: Subject
  tags?: unknown[]
} & Data

type EventDefinition<Subject, Data> = {
  type: string
  consume: Consume<Subject, Data>
}

export type Event<Subject = unknown, Data = unknown> = {
  // TODO: why is data not defined?
  type: EventType<Subject, Data>
  actors: unknown[]
  subject: Subject
  tags: unknown[]
  listeners: Listener[]
  data: Data
}

export function defineEvent<Subject, Data>({
  type,
  consume,
}: EventDefinition<Subject, Data>): Consumer &
  ((config) => Event<Subject, Data>) {
  const registeredType = registerResolverHook(type, consume)
  const createEvent = {
    [type]({ tags, actors, subject, listeners, ...data }) {
      return {
        type: registeredType,
        actors: Array.isArray(actors) ? actors : [actors],
        subject,
        tags: tags || [],
        listeners: listeners || [],
        data: data,
      }
    },
  }[type]
  createEvent.type = registeredType
  return createEvent
}
