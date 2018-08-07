import { Event } from '../events/event'
import { Creature } from '../creatures/creature'
import { defineEvent } from './event'
import { ConsumerArgs } from './listener'
import { RemoveCreature } from './destroyCreature'
import { Creature } from '../creatures/creature'

export const blockable = 'blockable'
export const targeted: string = 'targeted'

export const Damage = defineEvent<{ health: number }, { damage: number }>({
  type: 'damage',
  consumer: async ({ resolver, actors, data, subject, cancel }) => {
    data.damage = Math.floor(data.damage)
    if (data.damage <= 0 || subject.health <= 0) {
      cancel()
      return
    } else if (data.damage >= subject.health) {
      data.damage = subject.health
      subject.health = 0
      await new Promise(resolve => setTimeout(resolve, 100))
      await resolver.processEvent(
        new RemoveCreature(actors, subject, {}, Damage),
      )
    } else {
      subject.health -= data.damage
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  },
})
