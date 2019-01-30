import { orderEvents } from './orderEvents'
import { Event } from './event'

import { Dispatch, createSettableState } from '@dwalter/spider-store'
import {
  createSelector,
  tuple,
  createSideEffect,
  createCustomAction,
} from '@dwalter/spider-hook'
import { getGame } from '../../game/game'

// TODO: this logic seems convoluted, so it's worth taking a second look.
// It may actually just be this hard, though...

interface EnqueuedEvent {
  event: Event
  resolve: (event: Event) => unknown
}

function name(tag: string) {
  return `@event-resolver/${tag}`
}

const [getSimulating, setSimulating] = createSettableState(
  name('simulating'),
  0,
)

const [getProcessing, setProcessing] = createSettableState(
  name('processing'),
  0,
)

// const [getEventQueue, setEventQueue] = createSettableState(
//   name('event-queue'),
//   [] as EnqueuedEvent[],
// )

// const [getEvent, setEvent] = createSettableState(
//   name('event'),
//   null as null | Event,
// )

// const getEventContext = createSelector(
//   tuple(getSimulating, getProcessing, getEvent, getListeners, getGame),
//   (simulating, processing, event, listeners, game) => ({
//     simulating,
//     processing,
//     event,
//     listeners,
//     game,
//   }),
//   (a, b) => a.event === b.event,
// )

export function processEvent<Data extends {}>(
  event: Event<any, Data>,
): (d: Dispatch) => Promise<Data> {
  return createCustomAction(
    tuple(getGame, getListeners, getSimulating),
    (dispatch, game, listeners, simulating) => {
      if (simulating === 0) {
        console.log(event.name, event /*game*/)
      }

      let executionQueue = orderEvents([...listeners, event])

      let index: number = 0
      let active: boolean = true

      function cancel() {
        active = false
        if (simulating === 0) {
          console.log('Cancelled event', event.name)
        }
      }

      async function next() {
        for (; index < executionQueue.length && active; index++) {
          await executionQueue[index].consumer({
            data: event.data,
            next,
            cancel,
            subject: event.subject,
            actors: event.actors,
            dispatch,
            game,
            listeners,
            event,
          })
        }
      }

      return next().then(_ => event.data)
    },
  )
}

const getNextEvent = createSelector(
  tuple(getProcessing, getEventQueue),
  (processing, queue) => {
    return processing === 0 ? queue[0] : undefined
  },
  // TODO: do I need to make this dedup here?
)

createSideEffect(getNextEvent, nextEvent => {
  if (nextEvent) {
    setEvent(nextEvent.event)
  }
})

// let simulating = 0
// let processing = null as null | Promise<void>
// let queue = [] as {
//   event: Event
//   resolve: (event: Event) => unknown
// }[]

// TODO: allow this to return a promise which only resolves
// when the queue empties.
// TODO: allow the processingQueue to be paused and restarted
// async function processQueue(dispatch: Dispatch): Promise<void> {
//   return (
//     processing ||
//     (processing = new Promise(async resolveQueue => {
//       while (queue.length !== 0) {
//         const { event, resolve } = queue.pop()!
//         await dispatch(await processEvent(event))
//         resolve(event)
//       }
//       resolveQueue()
//       processing = null
//     }))
//   )
// }

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
    dispatch(setSimulating(s => s + 1))
    await dispatch(processEvent(event))
    dispatch(setSimulating(s => s - 1))
    return event
  }
}
