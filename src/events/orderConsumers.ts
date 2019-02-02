import { topologicalSort } from '../utils/topologicalSort'
import { Event } from './event'
import { Listener } from './listener'

const edges = [] as [unknown, unknown][]
let ranking = new Map<unknown, number>()
let dirty = true

export function declareEventDependency(parent: unknown, child: unknown) {
  dirty = true
  edges.push([parent, child])
}

function getRank(event: Event | Listener) {
  if (dirty) {
    ranking = new Map()
    topologicalSort(edges).forEach((value, key) => ranking.set(value, key))
  }
  return ranking.get(event.type) || Infinity
}

interface ConsumerList extends Array<Event | Listener> {}

export function orderConsumers(...events: ConsumerList): (Event | Listener)[] {
  events.sort((a, b) => {
    const ra = getRank(a)
    const rb = getRank(b)
    if (Object.is(ra, rb)) return 0
    return ra - rb
  })
  return events
}
