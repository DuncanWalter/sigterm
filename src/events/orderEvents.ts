import { topologicalSort } from '../utils/topologicalSort'
import { Event } from './event'

const edges = [] as [unknown, unknown][]
let ranking = new Map<unknown, number>()
let dirty = true

export function declareEventDependency(parent: unknown, child: unknown) {
  dirty = true
  edges.push([parent, child])
}

function getRank(event: Event) {
  if (dirty) {
    ranking = new Map()
    topologicalSort(edges).forEach((value, key) => ranking.set(value, key))
  }
  return ranking.get(event.type) || Infinity
}

export function orderEvents(events: Event[]): Event[] {
  events.sort((a, b) => {
    const ra = getRank(a)
    const rb = getRank(b)
    if (Object.is(ra, rb)) return 0
    return ra - rb
  })
  return events
}
