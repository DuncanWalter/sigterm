import { Event } from './event'
import { Creature } from '../creatures/creature'
import { defineEvent } from './event'

export const SpawnEnemy = defineEvent<Creature, { isAlly?: boolean }>({
  type: 'spawnCreature',
  consumer: async function({ data, game, subject, resolver }) {
    // TODO: add listeners
    if (data.isAlly) {
      game.allies.add(subject)
    } else {
      game.enemies.add(subject)
    }
  },
})
