import { defineEvent } from './event'
import { consumeRandom } from '../../game/random'

export const shuffleDrawPile = defineEvent<null, null>(
  '@shuffle',
  async ({ dispatch, game }) => {
    const seed = dispatch(consumeRandom())
    dispatch(game.drawPile.shuffle(seed))
  },
)
