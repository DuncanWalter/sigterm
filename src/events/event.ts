import { ListenerGroup, ListenerType } from './listener'
import { Consumer } from './listener'
import { Entity } from '../utils/entity'
import { EventContent, Subject, Data } from './listener'
import { Creature } from '../creatures/creature'
import { Listener, reject } from './listener'
import { EventResolver, resolver } from './eventResolver'
import { tokenGenerator, OpaqueType } from '../utils/opaqueType'
import { OrderedTokenContext } from '../utils/orderedTokenContext'

const resolverHook = Symbol('RESOLVER_HOOK')
const createResolverHook = tokenGenerator(resolverHook)
const resolverHookOrdering = new OrderedTokenContext()
export function registerResolverHook(
  token: string,
  follows?: ResolverHook[],
  precedes?: ResolverHook[],
) {
  resolverHookOrdering.registerToken(
    token,
    new Set(follows.map(hook => OpaqueType.unwrap(resolverHook, hook))),
    new Set(precedes.map(hook => OpaqueType.unwrap(resolverHook, hook))),
  )
  return createResolverHook(token)
}

export function sortByResolverHook(
  consumers: (Listener<any, any> | Event<any, any>)[],
): (Listener<any, any> | Event<any, any>)[] {
  const ranks: number[] = resolverHookOrdering.getRanks(
    consumers.map(consumer => OpaqueType.unwrap(resolverHook, consumer.type)),
  )
  return [...zip(ranks, consumers)]
    .sort(([a], [b]) => a - b)
    .map(([_, consumer]) => consumer)
}

function* zip<S extends Iterable<any>[]>(...streams: S) {
  const iters = streams.map(stream => stream[Symbol.iterator]())
  let done = false
  let value
  while (!done) {
    const nexts = iters.map(iter => iter.next())
    done = nexts.every(({ done }) => done)
    yield nexts.map(({ value }) => value)
  }
}

export interface ResolverHook extends OpaqueType<typeof resolverHook, string> {}

export interface EventType<Subject, Data> extends ResolverHook {
  subject?: Subject
  data?: Data
}
// export const startTurn = createEventType('startTurn')
// export const startCombat = createEventType('startCombat')
// export const endTurn = createEventType('endTurn')

export interface ConsumerArgs<Subject, Data> {
  data: Data
  subject: Subject
  // TODO:
  actors: Set<never>
  resolver: EventResolver
  event: Event<Subject, Data>
  next: () => Promise<void>
  cancel: () => void
  game: Game
}

export type Consumer<Subject, Data> = (
  args: ConsumerArgs<Subject, Data>,
) => Promise<any>

type EventConfiguration<Subject, Data> = {
  actors: Set<unknown> | unknown
  subject: Subject
  tags?: unknown[]
} & Data

type EventDefinition<Subject, Data> = {
  type: string
  consumer: (args: ConsumerArgs<Subject, Data>) => Promise<void>
}

interface EventFactory<Subject, Data> extends EventType<Subject, Data> {
  (configuration: EventConfiguration<Subject, Data>): Event<Subject, Data> &
    Data
}

export interface Event<Subject, Data> {
  actors: Set<unknown>
  subject: Subject
  tags: Set<unknown>
  consume: Consumer<Subject, Data>
  type: EventType<Subject, Data>
}

function cleanConfiguration<S, D>(configuration: EventConfiguration<S, D>) {
  if (!!configuration.actors && !(configuration.actors instanceof Set)) {
    configuration.actors = new Set([configuration.actors])
  }
  configuration.tags = new Set(configuration.tags || [])
  return configuration
}

export function defineEvent<S, D>({
  type,
  consumer,
}: EventDefinition<S, D>): EventFactory<S, D> {
  const registeredType = registerResolverHook(type)
  const Factory = {
    [type](configuration: EventConfiguration<S, D>) {
      return Object.assign(
        Object.create(Factory.prototype),
        cleanConfiguration(configuration),
      )
    },
  }[type]
  Factory.prototype = Object.create(null)
  Factory.prototype.constructor = Factory
  Factory.prototype.type = Factory
  Factory.prototype.consume = consumer
  return Object.assign(Factory, registeredType)
}

// // export type Tag = { +type: ListenerType<any> } | string | ListenerType<any>

// export class Event<T: EventContent> extends Listener<T> {
//   id: ListenerType<T>
//   actors: Set<Entity<any>>
//   subject: Subject<T>
//   tags: string[]
//   data: Data<T>
//   defaultListeners: Listener<any>[]

//   constructor(
//     id: ListenerType<T>,
//     consumer: Consumer<T>,
//     actor: Entity<any> | Set<Entity<any>>,
//     subject: Subject<T>,
//     data: Data<T>,
//     ...tags: Tag[]
//   ) {
//     super(id, reject, consumer, false)
//     this.data = data
//     this.subject = subject
//     this.defaultListeners = []
//     this.tags = tags.map((tag) => {
//       if (tag instanceof Object) {
//         return tag.type
//       } else {
//         return tag.toString()
//       }
//     })

//     if (actor instanceof Set) {
//       this.actors = actor
//     } else {
//       this.actors = new Set()
//       this.actors.add(actor)
//     }
//   }
// }

// export type EventDefinition<T: EventContent> = { +type: ListenerType<T> } & ((
//   actor: Set<Entity<any>> | Entity<any>,
//   subject: Subject<T>,
//   data: Data<T>,
//   ...tags: Tag[]
// ) => Event<T>)

// export function defineEvent<T: EventContent>(
//   type: string,
//   consumer: Consumer<T>
// ): EventDefinition<T> {
//   const eventType = resolver.registerListenerType(type)

//   let factory = function(actors, subject, data, ...tags) {
//     return new Event(eventType, consumer, actors, subject, data, ...tags)
//   }

//   factory.type = eventType
//   return factory
// }
