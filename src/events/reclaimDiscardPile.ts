import { defineEvent } from './event'
import { consumeRandom } from '../../game/random'
import { shuffleDrawPile } from './shuffleDrawPile'

export const reclaimDiscardPile = defineEvent(
  '@reclaim-discard',
  async ({ actors, dispatch, game, processEvent }) => {
    // TODO: use the addCard and removeCard Events?

    dispatch([
      ...game.discardPile.cards.map(game.discardPile.remove),
      ...game.discardPile.cards.map(game.drawPile.add),
    ])

    await processEvent(shuffleDrawPile(actors, null, null))
  },
)
