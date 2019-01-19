import { defineEvent } from './event'
import { Effect } from '../effects/effect'

export const bindEffect = defineEvent<
  { effects: Effect[] },
  {
    name: string
    stacks: number
  }
>('bindEffect', async function({ subject, data }) {
  let current = subject.effects.find(effect => effect.name == data.name)

  await updateCreature(() => {
    if (current) {
      current.stacks += data.stacks | 0
    } else {
      subject.effects.push(hydrateEffect(data))
    }
  })
})
