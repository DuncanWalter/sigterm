import { Dispatch } from '@dwalter/spider-store'
import { Game } from '../../game/game'

export interface ConsumerArgs<Subject, Data, Mutating extends boolean = false> {
  readonly data: Data
  readonly subject: Readonly<Subject>
  readonly actors: Set<unknown>

  readonly processEvent: <D>(event: Event<D>) => Promise<D>
  readonly enqueueEvent: <D>(event: Event<D>) => void
  readonly pushEvent: <D>(event: Event<D>) => void

  readonly dispatch: Mutating extends true ? Dispatch : unknown

  readonly simulating: boolean
  readonly game: Readonly<Game>

  readonly next: () => Promise<void>
  readonly cancel: () => void
}

export interface Consumer<Subject, Data, Mutating extends boolean = false> {
  (args: ConsumerArgs<Subject, Data, Mutating>): Promise<any>
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
  consumer: Consumer<Subject, Data, true>
}

function asSet<T>(set: T | Set<T>): Set<T> {
  if (set instanceof Set) return set
  const newSet = new Set()
  newSet.add(set)
  return newSet
}

export function defineEvent<Subject, Data>(
  name: string,
  consumer: Consumer<Subject, Data, true>,
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
