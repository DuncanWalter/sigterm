import { sortByResolverHook } from './event'
import { Listener } from './listener'
import { Game } from '../game'

export interface Resolver {
  game: Game
  resolve: (event: Event) => Promise<Event>
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

  let listeners = [
    sortByResolverHook([
      // TODO: filter the listeners
      ...this.listeners.values(),
      event,
      ...event.defaultListeners,
    ]),
  ]

  let index: number = -1
  let active: boolean = true

  function cancel() {
    active = false
  }

  async function next() {
    while (++index < listeners.length && active) {
      await listeners[index].consumer({
        ...resolver,
        next,
        cancel,
        subject: event.subject,
        actors: event.actors,
        event,
      })
    }
  }
  await next()
  return event
}

const processQueue = async function processQueue(
  self: EventResolver,
): Promise<void> {
  if (self.processing) return
  self.processing = true
  let next: Event<any>

  while ((next = self.eventQueue.next())) {
    await self.processEvent(next)
    if (!self.simulating) {
      // yield new Promise(resolve => setTimeout(resolve, 300))
    }
  }
  self.processing = false
}

export const resolver = new EventResolver()
