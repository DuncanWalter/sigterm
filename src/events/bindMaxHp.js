import { defineEvent } from './event'
import { ConsumerArgs } from './listener'

export const BindMaxHp = defineEvent('bindMaxHp', function*({
  data,
  subject,
  cancel,
}: ConsumerArgs<Type>) {
  subject.health += Math.floor(data.points)
  subject.inner.maxHealth += Math.floor(data.points)
})
