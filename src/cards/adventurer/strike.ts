import { defineCard } from '../card'
import { Damage, targeted, blockable } from '../../events/damage'
import { queryEnemy, upgrade } from '../utils'
import { template } from '../../utils/textTemplate'

export const Strike = defineCard<{ damage: number }>({
  type: 'Strike',
  title: 'Strike',
  text: template`Deal ${card => card.damage} damage.`,
  color: '#dd2244',

  data: {
    energy: 1,
    damage: 6,
  },

  async play(card, { game, resolver, actors, energy }) {
    let target = await queryEnemy(game)

    const { damage } = await resolver.processEvent(
      Damage({
        actors: [card, ...actors],
        subject: target,
        damage: card.damage,
        tags: [targeted, blockable],
      }),
    )

    return { damage, energy }
  },
})

export const StrikeR = upgrade('R', Strike, { damage: 9 })
export const StrikeL = upgrade('L', Strike, { energy: 0 })
