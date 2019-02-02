import { orderConsumers } from './orderConsumers'
import { Event } from './event'

import { Dispatch, createSettableState } from '@dwalter/spider-store'
import {
  createSelector,
  createSideEffect,
  wrapThunk,
} from '@dwalter/spider-hook'
import { getGame } from '../../game/game'

function name(tag: string) {
  return `@event-resolver/${tag}`
}

const [getSimulating, setSimulating] = createSettableState(
  name('simulating'),
  0,
)

const [getEventStack, setEventStack] = createSettableState(
  name('event-stack'),
  [] as Event[],
)

export function processEvent<Data extends {}>(event: Event<any, Data>) {
  return wrapThunk((dispatch, resolve) => {
    const game = resolve(getGame)
    const listeners = resolve(getListeners)
    const simulating = resolve(getSimulating)

    if (simulating === 0) {
      console.log(event.name, event /*game*/)
    }

    dispatch(pushEvent(event))

    const executionQueue = orderConsumers(listeners, event) as Event[]

    let index: number = 0
    let active: boolean = true

    function cancel() {
      active = false
      if (simulating === 0) {
        console.log('Cancelled event', event.name)
      }
    }

    const boundProcessEvent = <D>(boundEvent: Event<D>) =>
      dispatch(processEvent(boundEvent))
    const boundPushEvent = (boundEvent: Event) =>
      dispatch(pushEvent(boundEvent))
    const boundEnqueueEvent = (boundEvent: Event) =>
      dispatch(enqueueEvent(boundEvent))

    const consumerArgs = {
      data: event.data,
      next,
      cancel,
      subject: event.subject,
      actors: event.actors,
      dispatch,
      game,

      processEvent: boundProcessEvent,
      pushEvent: boundPushEvent,
      enqueueEvent: boundEnqueueEvent,

      simulating: !!simulating,
    }

    async function next() {
      for (; index < executionQueue.length && active; index++) {
        await executionQueue[index].consumer(consumerArgs)
      }
    }

    return next().then(_ => {
      if (event !== dispatch(popEvent())) {
        throw new Error('Event processing detected partial overlap of 2 events')
      }
      return event.data
    })
  })
}

// const getNextEvent = createSelector(
//   [getEventStack, getEventQueue],
//   (stack, queue) => (!stack.length && queue.length ? queue[0] : null),
// )

// export const manageEventQueue = createSideEffect(
//   getNextEvent,
//   (nextEvent, dispatch) => {
//     if (nextEvent) {
//       // TODO: still broken...
//       dispatch(processEvent(nextEvent))
//     }
//   },
// )

// export function enqueueEvent<Subject, Data>(event: Event<Subject, Data>) {
//   return createCustomAction([getSimulating], (dispatch, simulating) => {
//     if (!simulating) {
//       dispatch(setEventQueue(queue => [...queue, event]))
//     }
//   })
// }

// export function pushEvent<Subject, Data>(event: Event<Subject, Data>) {
//   return createCustomAction([getSimulating], (dispatch, simulating) => {
//     if (!simulating) {
//       dispatch(setEventQueue(queue => [event, ...queue]))
//     }
//   })
// }

function pushEvent(event: Event) {
  return setEventStack(stack => [event, ...stack])
}

function popEvent() {
  return setEventStack(([, ...rest]) => rest, ([head]) => head)
}

function enqueueEvent() {}

function nextEvent() {}

const [getEventQueue, setEventQueue] = createSettableState(
  name('event-queue'),
  [] as Event[],
)

createSideEffect(getEventStack, (stack, dispatch) => {
  if (!stack.length) {
    dispatch((_, resolve) => {
      const queue = resolve(getEventQueue)
      if (!queue.length) {
        dispatch(processEvent(dispatch(nextEvent())))
      }
    })
  }
})

export function simulateEvent(event: Event) {
  return async function(dispatch: Dispatch) {
    dispatch(setSimulating(s => s + 1))
    await dispatch(processEvent(event))
    dispatch(setSimulating(s => s - 1))
    return event
  }
}
