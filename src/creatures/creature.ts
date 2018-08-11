import { Effect } from '../effects/effect'
import { Entity, asEntity } from '../utils/entity'
import { randomSequence, Sequence } from '../utils/random'
import { OpaqueType, tokenGenerator } from '../utils/opaqueType'
import { TextTemplate } from '../utils/textTemplate'
import { Behavior } from './behavior'

const creatureType = Symbol('CREATURE_TYPE')
const createCreatureType = tokenGenerator(creatureType)
interface CreatureType extends OpaqueType<typeof creatureType, string> {}

interface CreatureDefinition<Data extends object = {}> {
  type: string

  name: string | TextTemplate<Creature<Data>>
  description: string | TextTemplate<Creature<Data>>
  color: string
  size: number

  health: number

  effects?: Effect[]
  data: Data
}

export type Creature<Data extends object = {}> = Entity &
  Data & {
    type: CreatureType
    currentHealth: number
    maxHealth: number
    effects: Effect[]
  }

const creatureDefinitions: Map<CreatureType, CreatureDefinition> = new Map()

// TODO: Creatures are associated with a random sequence
// and need to be passed it as a param
export function defineCreature<Data extends object>(
  definition: CreatureDefinition<Data>,
): () => Creature<Data> {
  // TODO: implement effects
  const { type, data, health /*effects*/ } = definition
  const newCreatureType = createCreatureType(type)
  creatureDefinitions.set(newCreatureType, definition)

  return {
    [type]() {
      const creature = asEntity(
        Object.assign(
          {
            type: newCreatureType,
            effects: [],
            maxHealth: health,
            currentHealth: health,
          },
          data,
        ),
      )
      // TODO: implement effects
      // if (effects) {
      //   creature.effects.push(...effects.map(effect => cloneEntity(effect)))
      // }
      return creature
    },
  }[type]
}
