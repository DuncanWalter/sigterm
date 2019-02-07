import { Listener, defineListener } from '../events/listener'
import { bindEffect } from '../events/bindEffect'
import { EventFactory } from '../events/event'
import { Effectable } from './effectable'
import { Interpolation } from '../utils/textTemplate'
import { memo } from '../utils/memo'

export interface SerializedEffect<Data = any> {
  stacks: number
  name: string
  data: Data
}

export interface Effect<Owner = any, Data = {}> extends SerializedEffect<Data> {
  type: EffectFactory
  appearance?: Appearance
  getListeners(owner: Owner): Listener[]
}

export interface EffectFactory<Owner = any, Data = any> {
  (stacks: number, config?: Data): Effect<Owner, Data>
  readonly type: 'effect-factory'
  readonly description: Interpolation<Data>
  readonly title: string
}

interface StackBehavior {
  stacked: boolean
  delta: (current: number) => number
  min: number
  max: number
  on: EventFactory<any, any>
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

export const cloneEffect = hydrateEffect

export function defineEffect<Owner extends Effectable, Data>(
  name: string,
  config: {
    appearance?: Appearance
    stackBehavior?: StackBehavior
    data?: Data
  } = {},
  ...listeners: ((owner: Owner) => Listener)[]
): EffectFactory<Owner, Data> {
  if (config.stackBehavior) {
    const { min, max, delta, stacked, on } = config.stackBehavior
    const listenerFactory = defineListener<Owner, unknown, Owner>(
      `@effect/${name}/stack-behavior`,
      async ({ subject, processEvent }) => {
        const stacks = subject.stacksOf(factory)
        const change = delta(stacks) - stacks
        if (change) {
          await processEvent(
            bindEffect(subject, subject, factory(stacks), factory),
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
    listeners.push(listenerFactory)
  }

  const prototype = {
    factory,
    appearance: config.appearance,
    stackBehavior: config.stackBehavior || {
      stacked: false,
      min: 1,
      max: 1,
      delta: i => i,
      on: fallback,
    },
  }

  function factory(stacks: number) {
    const effect = Object.create(prototype)
    Object.assign(effect, {
      type: name,
      stacks,
      getListeners(owner: Owner): Listener[] {
        return listeners.map(createListener => createListener(owner))
      },
      data: { ...config.data } || {},
    })
    effect.getListeners = memo(effect.getListeners)
    return effect
  }

  effects.set(name, factory)

  const appearance = config.appearance || { name, description: '' }

  factory.type = 'effect-factory' as 'effect-factory'
  factory.description = appearance.description
  factory.title = appearance.name

  return factory
}

// TODO: move to utils

const fallback = defineEffect('Fallback', {})
