import { Dispatch } from '@dwalter/spider-store'

export interface ConsumerArgs<Subject, Data> {
  data: Data
  subject: Subject
  actors: Set<unknown>
  event: Event<Subject, Data>
  dispatch: Dispatch
  next: () => Promise<void>
  cancel: () => void
}

export interface Consumer<Subject, Data> {
  (args: ConsumerArgs<Subject, Data>): Promise<any>
}

export interface EventFactory<Subject, Data> {
  (
    actors: unknown | Set<unknown>,
    subject: Subject,
    data: Data,
    ...tags: unknown[]
  ): Event<Subject, Data>
}

export interface Event<Subject = any, Data = any> {
  type: EventFactory<Subject, Data>
  name: string
  actors: Set<unknown>
  subject: Subject
  data: Data
  tags: Set<unknown>
  consumer: Consumer<Subject, Data>
}

function asSet<T>(set: T | Set<T>): Set<T> {
  if (set instanceof Set) return set
  const newSet = new Set()
  newSet.add(set)
  return newSet
}

export function defineEvent<Subject, Data>(
  name: string,
  consumer: Consumer<Subject, Data>,
): EventFactory<Subject, Data> {
  const factory = {
    [name](
      actors: unknown | Set<unknown>,
      subject: Subject,
      data: Data,
      ...tags: unknown[]
    ) {
      return {
        type: factory,
        name,
        actors: asSet(actors),
        subject,
        data,
        tags: new Set(tags),
        consumer,
      }
    },
  }[name]
  return factory
}
