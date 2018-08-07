// import type { Card } from './cards/card'
// import type { Pragma } from './pragmas/pragma'
// import { Sequence } from './utils/random'
import { CardPool } from './cards/cardPool'
import { tokenGenerator, OpaqueType } from './utils/opaqueType'

const characterName = Symbol('CHARACTER_NAME')
const registerCharacterName = tokenGenerator(characterName)
export interface CharacterName
  extends OpaqueType<typeof characterName, string> {}

export type Upgrade = (upgraded: void | 'L' | 'R') => void | Card<any>

export const characters: Map<CharacterName, Character> = new Map()

function any(any: any): any {
  return any
}

export class Character {
  color: string
  name: CharacterName
  playable: boolean
  cardPool: CardPool
  pragmaPool: Set<() => Pragma>
  members: Map<
    string,
    {
      rarity: Rarity
      color: string
      upgrades: Upgrade[]
    }
  >
  description: string

  addCard(rarity: Rarity, CC: () => Card<>, ...upgrades: Upgrade[]) {
    this.cardPool.add(rarity, CC)
    this.members.set(new CC().type, {
      rarity,
      color: this.color,
      upgrades,
    })
  }

  addPragma(factory: () => Pragma) {
    this.pragmaPool.add(factory)
  }

  sample(
    count: number,
    distro: Distro,
    seed: Sequence<number>,
  ): (() => Card<>)[] {
    return this.cardPool.sample(count, any(distro), seed)
  }

  cards(): Iterable<() => Card<>> {
    return this.cardPool.members()
  }

  constructor(
    name: string,
    playable: boolean,
    color: string,
    description: string,
  ) {
    this.members = new Map()
    this.name = CharacterName(name)
    this.playable = playable
    this.color = color
    this.description = description
    this.cardPool = new CardPool(name, color, 'A', 'B', 'C', 'D', 'F')
    this.pragmaPool = new Set()
    characters.set(this.name, this)
  }
}
