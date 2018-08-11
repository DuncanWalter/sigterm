import {
  EventType,
  Consumer,
  Event,
  ResolverHook,
  registerResolverHook,
  ConsumerArgs,
} from './event'

function testListener<S, D>(
  event: Event<S, D>,
  listener: Listener<any, any>,
): string {
  let matched = false
  const h: Header<unknown, unknown> = listener.header
  if (h.type) {
    if ((h.type || h.type) === event.type) {
      matched = true
    } else {
      return 'Wrong Event Type'
    }
  }
  if (h.actors) {
    const headerIds = [...h.actors].map(actor => actor.id)
    const actorIds = [...event.actors].map(actor => actor.id)
    if (
      headerIds.reduce((acc, actor) => acc || actorIds.includes(actor), false)
    ) {
      matched = true
    } else {
      return 'Wrong Actor'
    }
  }
  if (h.subjects) {
    if (h.subjects.includes(event.subject)) {
      matched = true
    } else {
      return 'Wrong Subject'
    }
  }
  if (h.tags) {
    let tags = h.tags.map(tag => {
      if (typeof tag == 'string') {
        return tag
      } else {
        return tag.type
      }
    })
    if (tags.reduce((a, t) => event.tags.includes(t) && a, true)) {
      matched = true
    } else {
      return 'Wrong Tags'
    }
  }
  if (h.filter) {
    if (h.filter(event)) {
      matched = true
    } else {
      return 'Filtered Out'
    }
  }
  return matched ? 'Passed' : 'No Header'
}

export interface ListenerType extends EventType<never, never> {}

type EventConfiguration<Subject, Data> = {
  actors: Set<unknown> | unknown
  subject: Subject
  tags?: unknown[]
} & Data

type ListenerDefinition<Subject, Data, Config> = {
  type: string
  consumer: (args: ConsumerArgs<Subject, Data>, config: Config) => Promise<void>
  follows?: ResolverHook[]
  precedes?: ResolverHook[]
  header: Header<Subject, Data> | ((config: Config) => Header<Subject, Data>)
}

interface ListenerFactory<Subject, Data, Config> extends ListenerType {
  (configuration: Config): Listener<Subject, Data>
}

export interface Listener<Subject = unknown, Data = unknown> {
  consume: Consumer<Subject, Data>
  type: ListenerType
  header: Header<Subject, Data>
}

interface Header<S, D> {
  tags?: unknown[]
  type?: EventType<S, D>
  filter?: (event: Event<S, D>) => boolean
  actor?: unknown
  subject?: S
}

export function defineListener<S, D, C>({
  type,
  consumer,
  precedes,
  follows,
  header,
}: ListenerDefinition<S, D, C>): ListenerFactory<S, D, C> {
  const registeredType = registerResolverHook(type, follows, precedes)
  const Factory = {
    [type](config: C) {
      return Object.create(Factory.prototype, {
        config: { value: config },
        header: {
          value: header instanceof Function ? header(config) : header,
        },
      })
    },
  }[type]
  Factory.prototype = Object.create(null)
  Factory.prototype.constructor = Factory
  Factory.prototype.type = Factory
  Factory.prototype.consume = (args: ConsumerArgs<S, D>) =>
    consumer(args, this.config)
  return Object.assign(Factory, registeredType)
}

// import type { EventResolver } from './eventResolver'
// import type { Game } from '../game/battle/battleState'
// import type { Player } from '../creatures/player'
// import type { EventDefinition, Tag, Event } from './event'
// import { synchronize } from '../utils/async'
// import { Entity } from '../utils/entity'

// export interface EventContent {
//   subject: Entity<any>;
//   data: Object;
// }

// // TODO: major refactor including define listener function
// export opaque type ListenerType<T: EventContent>: string = string

// export type Header<T: EventContent> = {
//   +actors?: Entity<any>[],
//   +subjects?: Subject<T>[],
//   +tags?: Tag[],
//   +filter?: (event: Event<T>) => boolean,
//   +type?: { +type: ListenerType<any> } | ListenerType<any> | string, // TODO: Event Type
// }

// export type Subject<T> = $PropertyType<T, 'subject'>

// export type Data<T> = $PropertyType<T, 'data'>

// export type ListenerGroup =
//   | Listener<any>
//   | Iterable<ListenerGroup>
//   | { +listener: ListenerGroup }

// export interface ConsumerArgs<T = any> {
//   data: Data<T>;
//   subject: Subject<T>;
//   actors: Set<Entity<any>>;
//   resolver: EventResolver;
//   event: Event<T>;
//   next: () => Promise<void>;
//   cancel: () => void;
//   game: Game;
//   internal: () => Promise<void>;
// }

// export type Consumer<T: EventContent> = (
//   args: ConsumerArgs<T>
// ) => Generator<Promise<any>, void, any>

// // TODO: give owner and self types?
// export class Listener<T: EventContent> {
//   id: ListenerType<T>
//   internal: ListenerType<T>
//   consumer: (args: ConsumerArgs<T>) => Promise<void>
//   header: Header<T>

//   constructor(
//     id: ListenerType<T>,
//     header: Header<T>,
//     consumer: Consumer<T>,
//     isWrapper: boolean
//   ) {
//     ;(this.header = header), (this.consumer = synchronize(consumer))
//     if (!isWrapper) this.id = id
//     if (isWrapper) this.internal = id
//   }
// }

// export const reject: Header<any> = { filter: (a) => false }
// export const deafListener: Listener<any> = new Listener(
//   'DEAF_LISTENER',
//   reject,
//   function*() {},
//   false
// )
