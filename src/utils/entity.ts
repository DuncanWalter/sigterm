import { idGenerator, OpaqueType } from './opaqueType'

const entityId = Symbol('ENTITY_ID')
const generateEntityId = idGenerator(entityId)

interface EntityId extends OpaqueType<typeof entityId, string> {}

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

type EntityStore = {
  [id: string]: any
}

export function serialize<E extends Entity>(
  entity: E,
  store: EntityStore = Object.create(null),
): EntityStore {
  const id: string = OpaqueType.unwrap(entityId, entity.id)
  if (id in store) {
    return store
  } else {
    return mapEntity(entity, store)
  }
}

// TODO: hydrate

function mapEntity(obj: object, store: EntityStore) {
  return Object.keys(obj).reduce((acc, key) => {
    acc[key] = mapProp(obj[key], store)
    return acc
  }, {})
}

function mapProp(value: unknown, store: EntityStore) {
  if (value instanceof Array) {
    return value.map(child => mapProp(child, store))
  } else if (value instanceof Object) {
    serialize(value, store)
    return OpaqueType.unwrap(entityId, value.id)
  } else {
    return value
  }
}
