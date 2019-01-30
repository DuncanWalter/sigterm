import { Effect } from '../effects/effect'
import {
  stacksOf,
  dataOf,
  getListeners,
  Effectable,
} from '../effects/effectable'
import { Behavior } from './behavior'

// TODO: Serializable Creatures

export interface Creature extends Effectable {
  id: number
  name: string
  health: number
  maxHealth: number
  setHealth(x: number): void
  behavior: Behavior
}

export interface CreatureFactory {
  (health: number, effects: Effect[]): Creature
}

function setHealth(this: Creature, x: number): void {
  this.health = Math.max(0, x)
}

export function defineCreature(
  name: string,
  behavior: () => Behavior,
): CreatureFactory {
  return function factory(health: number, effects: Effect[] = []) {
    return {
      id: createId(),
      name,
      behavior: behavior(),
      health,
      maxHealth: health,
      setHealth,
      effects,
      stacksOf,
      dataOf,
      getListeners,
    }
  }
}

// export class Creature {
//   get effects(): Effect<any>[] {
//     return this.inner.effects
//   }

//   get type(): CreatureType {
//     return this.inner.type
//   }

//   set health(value: number) {
//     this.inner.health = Math.floor(
//       Math.max(0, Math.min(this.inner.maxHealth, value))
//     )
//   }

//   get health(): number {
//     return this.inner.health
//   }

//   set maxHealth(value: number) {
//     this.inner.maxHealth = Math.floor(Math.max(0, value))
//   }
//   get maxHealth(): number {
//     return this.inner.maxHealth
//   }

//   get listener(): ListenerGroup {
//     return this.effects.map((effect) => toListener(this, effect))
//   }

//   get seed(): Sequence<number> {
//     const self = this
//     return {
//       next(): number {
//         let rand = randomSequence(self.inner.seed)
//         let ret = rand.next()
//         self.inner.seed = rand.last()
//         return ret
//       },
//       fork() {
//         return randomSequence(self.inner.seed)
//       },
//       last() {
//         return self.inner.seed
//       },
//     }
//   }

//   set seed(seed: Sequence<number>) {
//     this.inner.seed = seed.last()
//   }

//   stacksOf(effectType: EffectType | { +type: EffectType }): number {
//     let effects: Effect<Creature<>>[] = [...this.effects].filter((effect) => {
//       if (effectType instanceof Object) {
//         return effect.type === effectType.type
//       } else {
//         return effect.type === effectType
//       }
//     })
//     if (effects.length === 0) {
//       return 0
//     } else {
//       return effects[0].stacks
//     }
//   }
// }
