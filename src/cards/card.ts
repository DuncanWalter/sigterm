import { Effect, SerializedEffect, cloneEffect } from '../effects/effect'
import { Dispatch } from '@dwalter/spider-store'
import { ReactElement } from 'react'
import {
  dataOf,
  stacksOf,
  getListeners,
  Effectable,
} from '../effects/effectable'
import { Game } from '../../game/game'
import { createId } from '../utils/id'

export type PlayArgs<Data> = {
  actors: Set<unknown>
  dispatch: Dispatch
  energy: number
  data: Data
  game: Game
}

interface BaseData {
  energy: 'X' | number | null
  // keywords: Keyword[]
}

interface CardDefinition<Data extends BaseData> {
  title: ((data: Data) => string | ReactElement<any>)
  text: ((data: Data) => string | ReactElement<any>)
  color: string
  effects?: Effect[]
  // keywords?: Keyword[]
  data: Data
  play(args: PlayArgs<Data>): Promise<Partial<Data>>
}

interface CardFactory<Data extends BaseData> {
  (data?: Partial<Data>, effects?: SerializedEffect<Card>[]): Card<Data>
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
  title: ((data: Data) => string | ReactElement<any>)
  text: ((data: Data) => string | ReactElement<any>)
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

  cards.set(name, factory)

  return factory
}

export function hydrateCard<Data extends BaseData>(card: SerializedCard<Data>) {
  const factory = (cards.get(card.name) || fallback) as CardFactory<Data>
  return factory(card.data, card.effects)
}

export const cloneCard = hydrateCard

const fallback = defineCard('fallback', {
  title() {
    return 'Fallback'
  },
  text() {
    return '.'
  },
  color: '#000000',
  data: { energy: null },
  async play() {
    return {}
  },
})
