import { Effect } from '../effects/effect'
import {
  stacksOf,
  dataOf,
  getListeners,
  Effectable,
} from '../effects/effectable'
import { Behavior } from './behavior'
import { createId } from '../utils/id'

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
