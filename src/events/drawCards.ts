import { defineEvent } from './event'
import { reclaimDiscardPile } from './reclaimDiscardPile'
import { removeCard } from './removeCard'
import { addCard } from './addCard'

export const drawCards = defineEvent<unknown, { count: number }>(
  '@draw-cards',
  async ({ actors, processEvent, data: { count }, game }) => {
    let remaining = count
    while (
      remaining-- &&
      game.discardPile.cards.length + game.drawPile.cards.length
    ) {
      if (!game.drawPile.cards.length) {
        await processEvent(
          reclaimDiscardPile(actors, game.player, {}, drawCards),
        )
      }
      const topCard = game.drawPile.cards[game.drawPile.cards.length - 1]
      await processEvent(
        removeCard(actors, topCard, { from: game.drawPile }, drawCards),
      )
      await processEvent(addCard(actors, topCard, { to: game.hand }, drawCards))
    }
  },
)
