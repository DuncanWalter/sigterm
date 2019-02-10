import { Effect, EffectFactory } from './effect'
import { Listener } from '../events/listener'

export interface Effectable {
  effects: Effect[]
  stacksOf(this: Effectable, effect: EffectFactory): number
  getListeners(this: Effectable): Listener[]
  dataOf<Data>(this: Effectable, type: EffectFactory<any, Data>): null | Data
}

export function stacksOf(this: Effectable, type: EffectFactory) {
  const selectedEffect = this.effects.find(effect => effect.type === type)
  if (selectedEffect) {
    return selectedEffect.stacks
  } else {
    return 0
  }
}

export function dataOf<Data>(this: Effectable, type: EffectFactory<any, Data>) {
  const selectedEffect = this.effects.find(effect => effect.type === type)
  if (selectedEffect) {
    return selectedEffect.data as Data
  } else {
    return null
  }
}

export function getListeners<E>(this: Effectable) {
  return this.effects.map(effect => effect.getListeners(this)) as any
}
