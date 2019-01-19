import { Event } from '../events/event'
import { Creature } from '../creatures/creature'
import { defineEvent } from './event'
import { ConsumerArgs } from './listener'

type Type = {
  data: {
    healing: number
  }
  subject: Creature<>
}

export const Heal = defineEvent('heal', async function({
  data,
  subject,
  cancel,
}) {
  data.healing = Math.floor(data.healing)
  if (data.healing <= 0) {
    cancel()
    return
  } else {
    subject.health += data.healing
  }
})
