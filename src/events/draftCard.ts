import type { Event } from '../events/event'
import type { Creature } from '../creatures/creature'
import type { Card } from '../cards/card'
import { defineEvent } from './event'
import { ConsumerArgs } from './listener'
import { CardStack } from '../cards/cardStack'

type Type = {
  data: {},
  subject: Card<>,
}

export const draftCard = defineEvent('draftCard', function*({
  game,
  subject,
}: ConsumerArgs<Type>) {
  game.deck.add(subject)
})
