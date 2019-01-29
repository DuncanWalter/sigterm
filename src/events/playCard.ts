import { Card } from '../cards/card'
import { defineEvent } from './event'
import { processEvent } from './eventResolver'
import { Game } from '../../game/game'
export const playCard = defineEvent<Card, Game>('playCard', async function({
  data: game,
  subject: card,
  actors,
  cancel,
  dispatch,
}) {
  let energy: number
  const data = card.data

  if (data.energy === null) {
    return cancel()
  } else if (data.energy === 'X') {
    energy = game.player.energy
  } else {
    if (game.player.energy < data.energy) {
      return cancel()
    } else {
      energy = data.energy
    }
  }

  await dispatch(
    processEvent(
      bindEnergy(
        actors,
        game.player,
        {
          energy: -energy,
        },
        playCard,
      ),
    ),
  )

  actors.add(card)

  await card.play({
    actors,
    energy,
    dispatch,
  })
})
