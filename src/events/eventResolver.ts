import { orderEvents } from './orderEvents'
import { Event } from './event'
import { Dispatch } from '@dwalter/spider-store'

// TODO: this logic seems convoluted, so it's worth taking a second look.
// It may actually just be this hard, though...

let simulating = 0
let processing = null as null | Promise<void>
let queue = [] as {
  event: Event
  resolve: (event: Event) => unknown
}[]

// TODO: allow this to return a promise which only resolves
// when the queue empties.
// TODO: allow the processingQueue to be paused and restarted
async function processQueue(dispatch: Dispatch): Promise<void> {
  return (
    processing ||
    (processing = new Promise(async resolveQueue => {
      while (queue.length !== 0) {
        const { event, resolve } = queue.pop()!
        await dispatch(await processEvent(event))
        resolve(event)
      }
      resolveQueue()
      processing = null
    }))
  )
}

export function enqueueEvent<Subject, Data>(event: Event<Subject, Data>) {
  if (simulating != 0) return () => Promise.resolve(event)
  return async function(dispatch: Dispatch) {
    const promise = new Promise<Event<Subject, Data>>(
      resolve => (queue = [{ event, resolve }, ...queue]),
    )
    processQueue(dispatch)
    return promise
  }
}

export function pushEvent<Subject, Data>(event: Event<Subject, Data>) {
  if (simulating != 0) return () => Promise.resolve(event)
  return async function(dispatch: Dispatch) {
    const promise = new Promise<Event<Subject, Data>>(resolve =>
      queue.push({ event, resolve }),
    )
    processQueue(dispatch)
    return promise
  }
}

export function simulateEvent(event: Event) {
  return async function(dispatch: Dispatch) {
    simulating += 1
    dispatch(await processEvent(event))
    simulating -= 1
    return event
  }
}

export async function processEvent<Subject, Data>(event: Event<Subject, Data>) {
  return async function fooBar(dispatch: Dispatch) {
    // const game = self.game

    if (simulating === 0) {
      console.log(event.name, event /*game*/)
    }

    let executionQueue = orderEvents([
      // TODO: how do I get the listeners through?
      ...this.listeners.values(),
      event,
      ...event.defaultListeners,
    ])

    let index: number = -1
    let active: boolean = true

    function cancel() {
      active = false
      if (simulating === 0) {
        console.log('Cancelled event', event)
      }
    }

    async function next() {
      while (++index < executionQueue.length && active) {
        await executionQueue[index].consumer({
          data: event.data,
          next,
          cancel,
          subject: event.subject,
          actors: event.actors,
          processEvent: async e => dispatch(await processEvent(e)),
          pushEvent: async e => dispatch(pushEvent(e)),
          enqueueEvent: async e => dispatch(enqueueEvent(e)),
          simulateEvent: async e => dispatch(await simulateEvent(e)),
          event,
        })
      }
    }

    await next()
    return event
  }
}
