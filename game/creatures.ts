import { createSettableState } from '@dwalter/spider-store'
import { Creature } from '../src/creatures/creature'
import { destroyId } from '../src/utils/id'

const [getCreatures, setCreatures] = createSettableState(
  '@creatures',
  new Map<number, Creature>(),
  false,
)

export { getCreatures }

export function updateCreatures() {
  return setCreatures(creatures => creatures)
}

export function destroyCreature(creature: Creature) {
  return setCreatures(creatures => {
    creatures.delete(creature.id)
    destroyId(creature.id)
    return creatures
  })
}

export function addCreature(creature: Creature) {
  return setCreatures(creatures => {
    creatures.set(creature.id, creature)
    return creatures
  })
}
