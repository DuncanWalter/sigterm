import { Effect, SerializedEffect, cloneEffect } from '../effects/effect'
import { Dispatch } from '@dwalter/spider-store'
import {
  dataOf,
  stacksOf,
  getListeners,
  Effectable,
} from '../effects/effectable'
import { Game } from '../../game/game'
import { createId } from '../utils/id'
import { Interpolation } from '../utils/textTemplate'

export type PlayArgs<Data> = {
  actors: Set<unknown>
  dispatch: Dispatch
  energy: number
  data: Data
  game: Game
}

interface BaseData {
  energy: 'X' | number | null
}

interface CardDefinition<Data extends BaseData> {
  title: string
  text: Interpolation<Data>
  color: string
  effects?: Effect[]
  data: Data
  play(args: PlayArgs<Data>): Promise<Partial<Data>>
}

export interface CardFactory<Data extends BaseData = BaseData> {
  (data?: Partial<Data>, effects?: SerializedEffect<Card>[]): Card<Data>
  readonly type: 'card-factory'
  readonly text: Interpolation<Data>
  readonly title: string
}

const cards = new Map<
  string,
  (data: any, effects?: SerializedEffect[]) => Card<any>
>()

interface SerializedCard<Data> {
  id: number
  name: string
  effects: SerializedEffect<Card>[]
  data: Data
}

export interface Card<Data extends BaseData = BaseData> extends Effectable {
  id: number
  name: string
  type: CardFactory<Data>
  title: string
  text: Interpolation<Data>
  color: string

  data: Data

  play(this: Card<Data>, args: PlayArgs<Data>): Promise<Partial<Data>>
}

export function defineCard<Data extends BaseData>(
  name: string,
  {
    title,
    text,
    color,
    data: defaultData,
    play: playCard,
    effects: defaultEffects,
  }: CardDefinition<Data>,
): CardFactory<Data> {
  function factory(
    data: Partial<Data> = {},
    effects: SerializedEffect<Card>[] = [],
  ): Card<Data> {
    return {
      name,
      id: createId(),
      type: factory,
      title,
      text,
      color,
      data: { ...defaultData, ...data },
      effects: (effects || defaultEffects || []).map(cloneEffect),
      stacksOf,
      dataOf,
      getListeners,
      play(this: Card<Data>, playArgs: PlayArgs<Data>) {
        return playCard({
          data: this.data,
          ...playArgs,
        })
      },
    }
  }

  factory.type = 'card-factory' as 'card-factory'
  factory.text = text
  factory.title = title

  cards.set(name, factory)

  return factory
}

export function hydrateCard<Data extends BaseData>(card: SerializedCard<Data>) {
  const factory = (cards.get(card.name) || fallback) as CardFactory<Data>
  return factory(card.data, card.effects)
}

export const cloneCard = hydrateCard

const fallback = defineCard('fallback', {
  title: 'Fallback',
  text: '.',
  color: '#000000',
  data: { energy: null },
  async play() {
    return {}
  },
})
