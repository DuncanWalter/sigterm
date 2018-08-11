import { defineCreature } from './creature'

// TODO: types
export function defineMonster({ behavior, ...rest }) {
  return defineCreature({
    ...rest,
    data: {
      behavior,
    },
  })
}
