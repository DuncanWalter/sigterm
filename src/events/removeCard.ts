import { Card } from '../cards/card'
import { defineEvent } from './event'
import { CardGroup } from '../../game/cards'

export const removeCard = defineEvent<Card, { from: CardGroup }>(
  '@remove-card',
  async ({ dispatch, data: { from: cardGroup }, subject }) => {
    dispatch(cardGroup.remove(subject))
  },
)
