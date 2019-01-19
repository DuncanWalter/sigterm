import { EventResolver } from '../events/eventResolver'
import { Game } from '../game/battle/battleState'
import { Effect } from '../effects/effect'
import { TextTemplate } from '../utils/textTemplate'
import { Entity, asEntity } from '../utils/entity'
import { OpaqueType, tokenGenerator } from '../utils/opaqueType'

// const cardType = Symbol('CARD_TYPE')
// const createCardType = tokenGenerator(cardType)
// interface CardType extends OpaqueType<typeof cardType, string> {}

export interface PlayArgs {
  actors: Set<unknown>
  resolver: EventResolver
  game: Game
  energy: number // energy actually spent to play, regardless of data cost
}

interface BasicCardDefinitionData {
  energy?: 'X' | number
  upgraded?: never
}

interface CardDefinition<Data extends BasicCardDefinitionData> {
  type: string

  title: string | TextTemplate<Card<Data>>
  text: string | TextTemplate<Card<Data>>
  color: string

  play: (card: Card<Data>, ctx: PlayArgs) => Promise<Partial<Card<Data>>>

  effects?: Effect[]
  data: Data

  // TODO: Targeting and pre-play hooks
}

type Card<Data extends BasicCardDefinitionData> = Entity &
  Data & {
    type: CardType
    energy: null | 'X' | number
    upgraded: null | 'L' | 'R'
    effects: Effect[]
  }

const cardDefinitions: Map<CardType, CardDefinition<any>> = new Map()

export function defineCard<Data>(
  definition: CardDefinition<Data & BasicCardDefinitionData>,
): () => Card<Data> {
  // TODO: implement effects
  const { type, data /*effects*/ } = definition
  const newCardType = createCardType(type)
  cardDefinitions.set(newCardType, definition)

  return {
    [type]() {
      const card = asEntity(
        Object.assign(
          { type: newCardType },
          { effects: [], energy: null, upgraded: null },
          data,
        ),
      )
      // TODO: implement effects
      // if (effects) {
      //   card.effects.push(...effects.map(effect => cloneEntity(effect)))
      // }
      return card
    },
  }[type]
}

export async function playCard<Data>(
  card: Card<Data>,
  ctx: PlayArgs,
): Promise<Data> {
  const definition: CardDefinition<Data> = cardDefinitions.get(card.type)!
  const playData = await definition.play(card, ctx)
  return Object.assign({}, card, playData)
}
