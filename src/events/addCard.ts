import { defineEvent } from './event'
import { CardGroup } from '../../game/cards'
import { Card } from '../cards/card'

export const addCard = defineEvent<Card, { to: CardGroup }>(
  '@add-card',
  async ({ dispatch, data: { to: cardGroup }, subject }) => {
    dispatch(cardGroup.add(subject))
  },
)
