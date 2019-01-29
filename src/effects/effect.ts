import { Listener, defineListener } from '../events/listener'

export interface SerializedEffect {
  stacks: number
  name: string
}

export interface Effect<Owner = any> {
  name: string
  stacks: number
  appearance?: Appearance
  getListeners(owner: Owner): Listener[]
}

interface StackBehavior {
  stacked: boolean
  delta: (current: number) => number
  min: number
  max: number
  on: unknown
}

interface Appearance {
  innerColor: string
  outerColor: string
  name: string
  description: string
  sides: number
  rotation?: number
}

const effects = new Map<string, (stacks: number) => Effect>()

export function hydrateEffect({ name, stacks }: SerializedEffect): Effect {
  const factory = effects.get(name) || fallback
  return factory(stacks)
}

export function defineEffect<Owner, Data>(
  name: string,
  config: {
    appearance?: Appearance
    stackBehavior?: StackBehavior
  },
  ...listeners: ((owner: Owner) => Listener)[]
) {
  // TODO: Create tick listener factory
  if (config.stackBehavior) {
    const { min, max, delta, stacked, on } = config.stackBehavior
    const listenerFactory = defineListener<Owner, Data, Owner>(
      `@effect/${name}/stack-behavior`,
      async ({ subject, dispatch }) => {
        const stacks = subject.stacksOf(name)
        const change = delta(stacks) - stacks
        if (change) {
          await dispatch(
            processEvent(
              bindEffect(
                owner,
                owner,
                {
                  name,
                  stacks: change,
                },
                { type: tick },
                def.effectFactory,
              ),
            ),
          )
        }
      },
      owner => ({
        subject: owner,
        type: on,
      }),
      [],
      [on],
    )
  }

  const prototype = {
    factory,
    appearance: config.appearance,
  }

  function factory(stacks: number) {
    const effect = Object.create(prototype)
    Object.assign(effect, {
      type: name,
      stacks,
      getListeners(owner: Owner): Listener[] {
        return listeners.map(createListener => createListener(owner))
      },
    })
    effect.getListeners = memo(effect.getListeners)
    return effect
  }

  effects.set(name, factory)

  return factory
}

const fallback = defineEffect('Fallback', {
  appearance: {
    description: 'Could not find the ',
  },
})
