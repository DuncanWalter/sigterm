import { defineEvent } from './event'
import { RemoveCreature } from './destroyCreature'
import { Creature } from '../creatures/creature'

export const blockable = 'blockable'
export const targeted: string = 'targeted'

export const Damage = defineEvent<Creature, { damage: number }>({
  type: 'damage',
  consumer: async ({ resolve, actors, subject, cancel }) => {
    data.damage = Math.floor(data.damage)
    if (data.damage <= 0 || subject.currentHealth <= 0) {
      cancel()
      return
    } else if (data.damage >= subject.currentHealth) {
      data.damage = subject.currentHealth
      subject.currentHealth = 0
      await new Promise(resolve => setTimeout(resolve, 100))
      await resolve(RemoveCreature(actors, subject, {}, Damage))
    } else {
      subject.currentHealth -= data.damage
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  },
})
