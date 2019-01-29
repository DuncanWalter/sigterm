import { Creature } from '../creatures/creature'
import { defineEvent } from './event'
import { destroyCreature } from './destroyCreature'
import { processEvent } from './eventResolver'

export const blockable = 'blockable'
export const targeted: string = 'targeted'

export const damageCreature = defineEvent<Creature, { damage: number }>(
  'damageCreature',
  async function damageCreatureConsumer({ actors, data, subject, cancel }) {
    data.damage = Math.floor(data.damage)
    if (data.damage <= 0) {
      cancel()
      return
    } else if (data.damage >= subject.health || subject.health <= 0) {
      data.damage = subject.health
      // TODO: use actions to make this safe
      subject.health = 0
      await new Promise(resolve => setTimeout(resolve, 100))
      await processEvent(destroyCreature(actors, subject, {}, damageCreature))
    } else {
      // TODO: use actions to make this safe
      subject.health -= data.damage
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  },
)
