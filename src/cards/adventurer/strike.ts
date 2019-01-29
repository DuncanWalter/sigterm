import { defineCard } from '../card'
import { targeted, damageCreature } from '../../events/damage'
import { blockable } from '../../events/damage'
import { template } from '../../utils/textTemplate'
import { processEvent } from '../../events/eventResolver'

export const Strike = defineCard('@adventurer/strike', {
  title: data => 'Strike',
  text: data => template`Deal ${card => card.damage} damage.`,
  color: '#dd2244',

  data: {
    energy: 1,
    damage: 6,
  },

  async play({ actors, damage, energy, dispatch }) {
    let target = await queryEnemy(game)

    const { damage } = await dispatch(
      processEvent(
        damageCreature(
          [card, ...actors],
          target,
          { damage: card.damage },
          targeted,
          blockable,
        ),
      ),
    )

    return { damage, energy }
  },
})

export const StrikeR = upgrade('R', Strike, { damage: 9 })
export const StrikeL = upgrade('L', Strike, { energy: 0 })
