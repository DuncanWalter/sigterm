import { defineCard } from '../card'
import { Damage, targeted } from '../../events/damage'
import { blockable } from '../../events/damage'
import { queryEnemy, upgrade } from '../utils'
import { Creature } from '../../creatures/creature'
import { template } from '../../utils/textTemplate'

export const Strike = defineCard({
  type: 'Strike',
  title: 'Strike',
  text: template`Deal ${damage} damage.`,
  color: '#dd2244',

  energy: 1,
  damage: 6,

  async play(self, { game, resolver, actors, energy }) {
    let target = await queryEnemy(game)

    const action = new Damage({
      actors,
      target,

      damage: self.data.damage,

      tags: [targeted, blockable],
    })

    await resolver.processEvent(action)

    return { damage: action.data.damage, energy, ...self }
  },
})

export const StrikeR = upgrade('R', Strike, { damage: 9 })
export const StrikeL = upgrade('L', Strike, { energy: 0 })
