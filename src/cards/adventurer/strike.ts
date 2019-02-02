import { defineCard } from '../card'
import { targeted, damageCreature } from '../../events/damage'
import { blockable } from '../../events/damage'
import { processEvent } from '../../events/eventResolver'

export const strike = defineCard('@adventurer/strike', {
  title: () => 'Strike',
  text: ({ damage }) => `Deal ${damage} damage.`,
  color: '#dd2244',

  data: {
    energy: 1,
    damage: 6,
  },

  async play({ actors, data, energy, dispatch, game }) {
    let target = await queryEnemy(game)

    const { damage } = await dispatch(
      processEvent(damageCreature(actors, target, data, targeted, blockable)),
    )

    return { damage, energy }
  },
})

// export const StrikeR = upgrade('R', Strike, { damage: 9 })
// export const StrikeL = upgrade('L', Strike, { energy: 0 })
