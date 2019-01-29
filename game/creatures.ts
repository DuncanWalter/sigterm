import { createSettableState } from '@dwalter/spider-store'
import { Creature } from '../src/creatures/creature'

const [getCreatures, setCreatures] = createSettableState(
  '@creatures',
  new Map<number, Creature>(),
  false,
)

export { getCreatures }

export function updateCreature(
  id: number,
  update: (creature: Creature) => unknown,
) {
  return setCreatures(creatures => {
    update(creatures.get(id)!)
    return creatures
  })
}

export function destroyCreature(id: number) {
  return setCreatures(creatures => {
    creatures.delete(id)
    destroyId(id)
    return creatures
  })
}

export function addCreature(creature: Creature) {
  return setCreatures(creatures => {
    creatures.set(creature.id, creature)
    return creatures
  })
}
