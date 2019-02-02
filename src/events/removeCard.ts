import { Card } from '../cards/card'
import { defineEvent } from './event'

export const RemoveCard = defineEvent<Card, { from: Card[] }>(
  '@remove-card',
  async ({ dispatch, data: { from }, subject }) => {
    if (from.find(card => card === subject)) {
      const index = from.indexOf(subject)
      // TODO:
    }
  },
)
