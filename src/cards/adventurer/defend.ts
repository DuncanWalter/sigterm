import { defineCard } from '../card'
import { block } from '../../effects/block'
import { processEvent } from '../../events'
import { bindEffect } from '../../events/bindEffect'
import { targeted } from '../../events/damage'

export const defend = defineCard('@adventurer/Defend', {
  title: () => 'Defend',
  text: data => `Gain ${data.block} block.`,
  color: '#223399',

  data: {
    block: 4,
    energy: 1,
  },

  async play({ actors, data, energy, dispatch }) {
    const { stacks } = await dispatch(
      processEvent(
        bindEffect(actors, game.player, block(data.block), block, targeted),
      ),
    )
    return { stacks, energy }
  },
})

// export const DefendL = upgrade('L', Defend, { energy: 0 })
// export const DefendR = upgrade('R', Defend, { block: 7 })
