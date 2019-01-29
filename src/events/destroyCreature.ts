import { defineEvent, ConsumerArgs } from './event'
import { Creature } from '../creatures/creature'

type Type = {
  subject: Creature
  data: any
}

export const RemoveCreature = defineEvent<Creature, {}>(
  'removeCreature',
  async ({ game, actors, subject, cancel }) => {
    let index
    console.log(subject)
    console.log('killing... something...', game.enemies)
    console.log(game.enemies.entities.includes(subject))
    console.log(
      game.enemies.entities.map(enemy => enemy.id).includes(subject.id),
    )
    switch (true) {
      case game.player == subject: {
        // rip
        pushEvents(new EndCombat(actors, subject, {}))
        return cancel()
      }
      case game.enemies.includes(subject): {
        // check if it all ends
        console.log('killed a foe')
        game.enemies.remove(subject)
        if (!game.enemies.size) {
          pushEvents(new EndCombat(actors, subject, {}))
        }
        return cancel()
      }
      case game.allies.includes(subject): {
        game.allies.remove(subject)
        break
      }
    }
  },
)
