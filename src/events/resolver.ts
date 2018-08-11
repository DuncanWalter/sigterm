import { Event } from './event'
import { Listener } from './listener'
import { Game } from '../game'
import { OpaqueType, tokenGenerator } from '../utils/opaqueType'
import { OrderedTokenContext } from '../utils/orderedTokenContext'

export interface ResolverHook extends OpaqueType<typeof resolverHook, string> {}

export interface Consumer {
  type: ResolverHook
}

export type ConsumeArgs<Subject = unknown, Data = unknown> = {
  [K in keyof Resolver]: Resolver[K]
} & {
  next: () => Promise<void>
  cancel: () => void
  game: Game
} & Event<Subject, Data>

export type Consume<Subject = unknown, Data = unknown> = (
  args: ConsumeArgs<Subject, Data>,
) => Promise<any>

const resolverHook = Symbol('RESOLVER_HOOK')
const createResolverHook = tokenGenerator(resolverHook)
const resolverHookOrdering = new OrderedTokenContext()
const consumerDefinitions: Map<ResolverHook, Consume> = new Map()
export function registerResolverHook(
  token: string,
  consume: Consume,
  follows?: Consumer[],
  precedes?: Consumer[],
) {
  resolverHookOrdering.registerToken(
    token,
    new Set(follows.map(hook => OpaqueType.unwrap(resolverHook, hook.type))),
    new Set(precedes.map(hook => OpaqueType.unwrap(resolverHook, hook.type))),
  )
  const newToken = createResolverHook(token)
  consumerDefinitions.set(newToken, consume)
}

export function sortByResolverHook(
  consumers: (Consumer)[],
): (Listener | Event)[] {
  const ranks: number[] = resolverHookOrdering.getRanks(
    consumers.map(consumer => OpaqueType.unwrap(resolverHook, consumer.type)),
  )
  return [...zip(ranks, consumers)]
    .sort(([a], [b]) => a - b)
    .map(([_, consumer]) => consumer)
}

function* zip<Iters extends Iterable<any>[]>(...streams: Iters) {
  const iters = streams.map(stream => stream[Symbol.iterator]())
  let done = false
  while (!done) {
    const nexts = iters.map(iter => iter.next())
    done = nexts.every(({ done }) => done)
    yield nexts.map(({ value }) => value)
  }
}

export interface Resolver {
  game: Game
  resolve: <E extends Event>(event: E) => Promise<E>
  addListeners: (owner: unknown, ...newListeners: Listener[]) => void
  removeListeners: (owner: unknown) => void
  // TODO: simulate and simulating
}

export function createResolver(game: Game): Resolver {
  let listeners: Map<unknown, Listener[]> = new Map()

  const resolver = {
    game,

    async resolve(event: Event) {
      return processEvent(event, resolver, false)
    },

    addListeners(owner: unknown, ...newListeners: Listener[]) {
      listeners.set(owner, newListeners)
    },

    removeListeners(owner: unknown) {
      listeners.delete(owner)
    },

    // async simulate(trap: (resolver) => Promise<void>){
    //   trap(Object.create(simulator, {
    //     simulating: {
    //       get(){
    //         return true
    //       }
    //     }
    //   }))
    // },

    // simulating: false,
  }

  // const simulator = Object.assign({}, resolver, {
  //   async resolve(event: Event) {
  //     return processEvent(game, event, true)
  //   },
  //   simulating: true,
  // })

  return { ...resolver }
}

const processEvent = async function processEvent<E extends Event>(
  event: E,
  resolver: Resolver,
  simulating: boolean,
): Promise<E> {
  if (!simulating) {
    console.log(event.type.__value__, event, game)
  }

  let consumers: Consumer[] = [
    sortByResolverHook([
      // TODO: filter the listeners
      ...resolver.listeners.values(),
      event,
      ...event.listeners,
    ]),
  ]

  let index: number = -1

  function cancel() {
    args.cancelled = true
  }

  const args = Object.assign(
    { next, cancel, cancelled: false },
    event,
    resolver,
  )

  async function next() {
    while (++index < consumers.length && !args.cancelled) {
      await consumerDefinitions.get(consumers[index].type)!(args)
    }
  }
  await next()
  return event
}

// const processQueue = async function processQueue(
//   self: EventResolver,
// ): Promise<void> {
//   if (self.processing) return
//   self.processing = true
//   let next: Event<any>

//   while ((next = self.eventQueue.next())) {
//     await self.processEvent(next)
//     if (!self.simulating) {
//       // yield new Promise(resolve => setTimeout(resolve, 300))
//     }
//   }
//   self.processing = false
// }
