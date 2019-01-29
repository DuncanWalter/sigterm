import { Effect, SerializedEffect, hydrateEffect } from '../effects/effect'
import { Dispatch } from '@dwalter/spider-store'
import { ReactElement } from 'react'

export type PlayArgs<
  Data extends BasicCardDefinitionData = BasicCardDefinitionData
> = Data & {
  actors: Set<unknown>
  dispatch: Dispatch
  energy: number
}

interface BasicCardDefinitionData {
  energy: 'X' | number | null
  // keywords: Keyword[]
}

interface CardDefinition<Data extends BasicCardDefinitionData> {
  title: ((data: Data) => ReactElement<any>)
  text: ((data: Data) => ReactElement<any>)
  color: string
  effects: Effect[]
  data: Data
  play(args: PlayArgs<Data>): Promise<Partial<Data>>
}

export interface Card<
  Data extends BasicCardDefinitionData = BasicCardDefinitionData
> extends CardDefinition<Data> {
  id: number
  name: string
}

interface SerializedCard<Data> {
  id: number
  name: string
  effects: SerializedEffect[]
  data: Data
}

const cards = new Map<
  string,
  (data: any, effects?: SerializedEffect[]) => Card<any>
>()

export function defineCard<Data extends BasicCardDefinitionData>(
  name: string,
  {
    title,
    text,
    color,
    data: defaultData,
    play: playCard,
    effects: defaultEffects,
  }: CardDefinition<Data>,
): () => Card<Data> {
  const prototype = {
    title,
    text,
    color,
    // TODO:
    play(this: Card<Data>, playArgs: PlayArgs<Data>) {
      return playCard({
        ...this.data,
        ...playArgs,
      })
    },
  }

  const factory = {
    [name](data: Partial<Data> = {}, effects?: SerializedEffect[]) {
      const card = Object.create(prototype)
      Object.assign(card, {
        name,
        id: createId(),
        data: { ...defaultData, data },
        effects: (effects || defaultEffects).map(hydrateEffect),
      })
      return card
    },
  }[name]

  cards.set(name, factory)

  return factory
}

export function hydrateCard<Data extends BasicCardDefinitionData>(
  card: SerializedCard<Data>,
) {
  const factory = cards.get(card.name)! // TODO: fallback card
  return factory(card.data, card.effects)
}

export const cloneCard = hydrateCard
