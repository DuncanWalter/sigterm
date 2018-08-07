import { ResolverHook, sortByResolverHook } from './event'
import { Listener } from './listener'
import { State } from '../state'
import { Game } from '../game/battle/battleState'
import { ConsumerArgs, reject, EventContent } from './listener'
import { LL } from '../utils/linkedList'
import { topologicalSort } from '../utils/topologicalSort'
import { getMaxListeners } from 'cluster'
import { Entity } from '../utils/entity'

export class EventResolver {
  game: Game
  processing: boolean
  simulating: boolean
  eventQueue: LL<Event<any>>
  listeners: Map<unknown, Listener>

  constructor(game: Game) {
    this.game = game
    this.listeners = new Map()
    this.processing = false
    this.simulating = false
    this.eventQueue = new LL()
  }

  processEvent<A extends Event<any>>(event: A): Promise<A> {
    return processEvent(this, event)
  }

  processQueue(): Promise<void> {
    return processQueue(this)
  }

  enqueueEvents(...events: Event<any>[]): void {
    if (this.simulating) return
    events.forEach(event => this.eventQueue.append(event))
    if (!this.processing) this.processQueue()
  }

  pushEvents(...events: Event<any>[]): void {
    if (this.simulating) return
    events.reverse().forEach(event => this.eventQueue.push(event))
    if (!this.processing) this.processQueue()
  }

  simulate<R>(use: (trap: EventResolver, game: Game) => R): R {
    this.simulating = true
    const r: R = use(this, this.game)
    this.simulating = false
    return r
  }

  addListeners(owner: unknown, listeners: Listener[]) {
    this.listeners.set(owner, listeners)
  }
  removeListeners(owner: unknown) {
    this.listeners.delete(owner)
  }
}

// function aggregate(
//   ls: ListenerGroup,
//   event: Event<any>,
//   simulating: boolean,
// ): LL<Listener<any>> {
//   // $FlowFixMe
//   if (ls[Symbol.iterator]) {
//     // $FlowFixMe
//     return [...ls].reduce((a: LL<Listener<any>>, ls: ListenerGroup) => {
//       a.appendList(aggregate(ls, event, simulating))
//       return a
//     }, new LL())
//   } else if (ls instanceof Listener) {
//     let test = testListener(event, ls)
//     if (test == 'Passed') {
//       return new LL(ls)
//     } else {
//       if (!simulating) {
//         // console.log(test, ls.id, ls.header)
//       }
//       return new LL()
//     }
//   } else {
//     // $FlowFixMe
//     return aggregate(ls.listener, event, simulating)
//   }
// }

const processEvent = async function processEvent(
  self: EventResolver,
  event: Event<any>,
): Promise<> {
  const game = self.game

  if (!self.simulating) {
    console.log(event.id, event, game)
  }

  let activeListeners = [
    sortByResolverHook([
      ...this.listeners.values(),
      event,
      ...event.defaultListeners,
    ]),
  ]

  let index: number = -1
  let active: boolean = true

  function cancel() {
    active = false
    if (!self.simulating) {
      console.log('Cancelled event', event)
    }
  }

  async function next() {
    while (++index < executionQueue.length && active) {
      await executionQueue[index].consumer({
        data: event.data,
        next,
        cancel,
        resolver: self,
        subject: event.subject,
        actors: event.actors,
        event,
        game,
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
