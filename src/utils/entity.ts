import { idGenerator, OpaqueType } from './opaqueType'

const entityId = Symbol('ENTITY_ID')
const generateEntityId = idGenerator(entityId)
export interface EntityId extends OpaqueType<typeof entityId, string> {}

export interface Entity {
  readonly id: EntityId
}

export function asEntity<T>(
  object: T & {
    id?: EntityId
  },
): T & Entity {
  return Object.defineProperty(object, 'id', {
    value: generateEntityId(),
    writable: false,
    configurable: false,
    enumerable: false,
  })
}

export function cloneEntity<T extends Entity>(entity: T): T {
  return asEntity({ ...(entity as any) })
}

export type EntityStore = {
  [id: string]: any
}

// TODO:
// Should have terminal functions that accept the store being used,
// objects to allow nested (evil!) manipulations, and interpret
// arrays as Entity Groups
type HydratorMap<E extends Entity> = {
  [K in keyof E]?: HydratorMap<any> | [HydratorMap<any>]
}

type DryKeys<E extends Entity> = keyof E extends infer K
  ? K extends 'id' ? never : K
  : never

type DryRef<M extends HydratorMap<any>, K extends keyof M> = M[K] extends [
  HydratorMap<any>
]
  ? string[]
  : string

type Dry<E extends Entity, M extends HydratorMap<E>> = {
  [K in DryKeys<E>]: K extends keyof M ? DryRef<M, K> : E[K]
}

export function createEntityHydrator<
  E extends Entity,
  M extends HydratorMap<E>
>(map: M) {
  return (entityStore: EntityStore) => {
    // cache the extracted
    return (id: string): E => {
      // TODO:

      return asEntity(/*Stuff*/)
    }
  }
}

export function createEntitySerializer<
  E extends Entity,
  M extends HydratorMap<E>
>(map: M) {
  return (entityStore: EntityStore) => (entity: E): void => {
    const id: string = OpaqueType.unwrap(entityId, entity.id)
    // TODO:
  }
}

export class EntityGroup<E extends Entity> extends Array {
  [index: number]: E
  constructor(...items: E[]) {
    super(...(items as any[]))
  }
  // TODO: map, filter, reducer out to a transducer
  // TODO: sort, remove, shuffle, add
  // TODO: declare types for includes, push, pop
}
