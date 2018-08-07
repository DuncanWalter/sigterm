import { ListenerGroup, ListenerType } from '../events/listener'
import { EventResolver } from '../events/eventResolver'
import { Event } from '../events/event'
import { Game } from '../game/battle/battleState'
import { PlayCard } from '../events/playCard'
import { synchronize } from '../utils/async'
import { resolver } from '../events/eventResolver'
import { Effect } from '../effects/effect'
import { TextTemplate } from '../utils/textTemplate'
import { Entity, asEntity } from '../utils/entity'
import { characters, CharacterName, Character } from '../character'
import { OpaqueType, tokenGenerator } from '../utils/opaqueType'

const cardType = Symbol('CARD_TYPE')
const createCardType = tokenGenerator(cardType)
interface CardType extends OpaqueType<typeof cardType, string> {}

export interface PlayArgs {
  actors: Set<unknown>
  resolver: EventResolver
  game: Game
  energy: number // energy actually spent to play, regardless of data cost
}

// // TODO: clean this mass up
// type Strip<K> = ('type' | 'id') extends K ? K : never
// type Bla<C extends Card, K extends keyof C> = { [P in K]: C[P] }
// type CardInstanceData<C extends Card> = Bla<C, Strip<keyof C>>

type CardDefinition<C extends Card> = {
  type: string
  title: string | TextTemplate<C>
  text: string | TextTemplate<C>

  play: (card: C, ctx: PlayArgs) => Promise<C>

  color: string

  effects?: Effect[]
} & CardInstanceData<C>

type Card = Entity & {
  type: CardType
  energy?: 'X' | number
  // upgraded?: bla
  effects?: Effect[]
}

const cardDefinitions: Map<CardType, CardDefinition<any>> = new Map()

export function defineCard<D>(definition: CardDefinition & D): () => Card & D {
  const {
    type,
    title,
    text,
    play,
    effects,
    color,
    // TODO:
    // @ts-ignore https://github.com/Microsoft/TypeScript/issues/13557
    ...rest
  } = definition
  const newCardType = createCardType(type)
  cardDefinitions.set(newCardType, definition)

  return {
    // TODO: test to see if this actually renames functions
    [type]() {
      return asEntity({
        type: newCardType,
        effects: effects ? [...effects] : [],
        ...rest,
        // upgraded
      })
    },
  }[type]
}

// const cards: Map<
//   string,
//   (self: Card<any>, PlayArgs) => Promise<any>
// > = new Map()

// function registerCard(
//   type: string,
//   play: (self: Card<any>, args: PlayArgs) => Promise<any>
// ): void {
//   cards.set(type, play)
// }

// export interface CardState<+Data: BasicCardData = BasicCardData> {
//   type: string;
//   appearance: {
//     color: string,
//     text: string,
//     title: string,
//   };
//   +data: Data;
//   effects: Effect<Card<>>[];
// }

// export interface BasicCardData {
//   energy: number | void | 'X';
//   upgraded?: void | 'L' | 'R';
// }

// // TODO: play args should have data and use another type argument
// export class Card<+Data: BasicCardData = BasicCardData> extends Entity<
//   CardState<Data>,
//   CardState<Data>
// > {
//   get appearance(): * {
//     return this.inner.appearance
//   }

//   get data(): Data {
//     return this.inner.data
//   }

//   get effects(): Effect<Card<>>[] {
//     return this.inner.effects
//   }

//   get type(): string {
//     return this.inner.type
//   }

//   get listener(): ListenerGroup {
//     return this.effects.map((effect) => toListener(this, effect))
//   }

//   get energy(): number | void | 'X' {
//     return this.data.energy
//   }

//   get playable(): boolean {
//     return this.data.energy !== undefined
//   }

//   wrap(state: CardState<>, extract: Extractor) {
//     return state
//   }

//   unwrap(inner: CardState<any>, bundle: Bundler): CardState<Data> {
//     return {
//       ...inner,
//       data: { ...inner.data },
//       appearance: { ...inner.appearance },
//       effects: inner.effects.map((effect: Effect<any>) => ({ ...effect })),
//     }
//   }

//   play(ctx: PlayArgs): Promise<Data> {
//     const cardBehavior = cards.get(this.type)
//     if (cardBehavior) {
//       return cardBehavior(this, ctx)
//     } else {
//       throw new Error(`Unrecognized card type ${this.type}`)
//     }
//   }

//   simulate({
//     actors,
//     resolver,
//   }: PlayArgs): {
//     text: string,
//     color: string,
//     title: string,
//     energy: string | number | void,
//   } {
//     let meta: Data = this.data

//     if (meta.energy !== 'X') {
//       let e = meta.energy
//       resolver.simulate((resolver, game) => {
//         this.play({
//           actors,
//           resolver,
//           game,
//           energy: e === undefined ? game.player.energy : e,
//         }).then((v) => (meta = v))
//       })
//     }

//     const ctx = createInterpolationContext(this.data, meta, {})

//     return {
//       energy: meta.energy,
//       title: interpolate(this.appearance.title, ctx),
//       text: interpolate(this.appearance.text, ctx),
//       color: this.appearance.color,
//     }
//   }

//   upgrades(sets: CharacterName[]): Card<>[] {
//     return [
//       ...new Set(
//         sets
//           .map((set) => characters.get(set))
//           .filter((i) => i)
//           .map((character: any) => character.members.get(this.type))
//           .filter((i) => i)
//           .map((membership) => membership.upgrades)
//           .reduce((acc, ups) => acc.concat(ups), [])
//       ),
//     ]
//       .map((upgrade) => upgrade(this.data.upgraded))
//       .filter((i) => i)
//   }

//   stacksOf(effectType: EffectType | { +type: EffectType }): number {
//     let effects: Effect<any>[] = [...this.effects].filter((effect) => {
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

// export function defineCard<D: BasicCardData>(
//   type: string, // unique string id
//   play: (self: Card<D>, ctx: PlayArgs) => Generator<Promise<any>, D, any>,
//   data: $ReadOnly<D>,
//   appearance: {
//     color: string,
//     text: string,
//     title: string,
//   },
//   ...effects: [(stacks: number) => Effect<Card<>>, number][]
// ): () => Card<D> {
//   registerCard(type, synchronize(play))
//   return function() {
//     return new Card(
//       {
//         appearance,
//         effects: effects.map(([E, s]) => new E(s)),
//         type,
//         data: { ...data },
//       },
//       toExtractor({})
//     )
//   }
// }
