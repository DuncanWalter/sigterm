import { defineEffect } from './effect'
import { blockable, damageCreature } from '../events/damage'
import { bindEffect } from '../events/bindEffect'
import { defineListener } from '../events/listener'
import { Creature } from '../creatures/creature'

const blockListener = defineListener<Creature, { damage: number }, Creature>(
  '@block',
  async ({ data, subject, actors, cancel, simulating, processEvent }) => {
    if (simulating) return
    if (typeof data.damage == 'number') {
      if (data.damage <= subject.stacksOf(block)) {
        await processEvent(
          bindEffect(actors, subject, block(-data.damage), block),
        ),
          (data.damage = 0)
        cancel()
      } else {
        data.damage -= subject.stacksOf(block)
        await processEvent(
          bindEffect(actors, subject, block(-subject.stacksOf(block)), block),
        )
      }
    } else {
      cancel()
    }
  },
  owner => ({
    subject: owner,
    tags: [blockable],
    type: damageCreature,
  }),
  [],
  [],
)

export const block = defineEffect(
  'block',
  {
    appearance: {
      name: 'Block',
      innerColor: '#6688ee',
      outerColor: '#2233bb',
      description:
        'Until the start of your next turn, avoid the next #{stacks} damage you would take.',
      sides: 5,
      rotation: 0.5,
    },
    stackBehavior: {
      stacked: true,
      delta: x => 0,
      on: startTurn,
      min: 1,
      max: 999,
    },
  },
  blockListener,
)
