import { Consumer, Event } from './event'
import { declareEventDependency } from './orderEvents'

interface ListenerFactory<Subject, Data, Config> {
  (config: Config): Listener<Subject, Data>
}

export interface Header<Subject> {
  tags?: unknown[]
  type?: unknown
  filter?: (event: Event<any, any>) => boolean
  actor?: unknown
  subject?: Subject
}

export interface Listener<Subject = any, Data = any> {
  type: unknown
  name: string
  header: Header<Subject>
  consumer: Consumer<Subject, Data>
}

export function testListener(
  event: Event<any, any>,
  listener: Listener<any, any>,
): string {
  let matched = false
  const h: Header<any> = listener.header
  if (h.type) {
    if ((h.type || h.type) === event.type) {
      matched = true
    } else {
      return 'Wrong Event Type'
    }
  }
  if (h.actor) {
    if (event.actors.has(h.actor)) {
      matched = true
    } else {
      return 'Wrong Actor'
    }
  }
  if (h.subject) {
    if (h.subject === event.subject) {
      matched = true
    } else {
      return 'Wrong Subject'
    }
  }
  if (h.tags) {
    if (h.tags.reduce((acc, tag) => acc && event.tags.has(tag), true)) {
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

export function defineListener<Subject, Data, Config>(
  name: string,
  consumer: Consumer<Subject, Data>,
  header: ((config: Config) => Header<Subject>) | Header<Subject>,
  precedes: unknown[],
  follows: unknown[],
): ListenerFactory<Subject, Data, Config> {
  const factory = {
    [name](config: Config) {
      return {
        type: factory,
        name,
        header: typeof header === 'function' ? header(config) : header,
        consumer,
      }
    },
  }[name]

  for (let follower of precedes) {
    declareEventDependency(factory, follower)
  }

  for (let predecessor of follows) {
    declareEventDependency(predecessor, factory)
  }

  return factory
}
