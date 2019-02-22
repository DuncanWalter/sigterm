import { createReducer, entityTable, arraylike } from '@dwalter/create-reducer'
import { Card } from '../src/cards/card'
import { tuple, createSelector, Action } from '@dwalter/spider-hook'
import { createRandom } from './random'

export interface CardGroup {
  add(card: Card): Action[]
  remove(card: Card): Action[]
  shuffle(seed: number): Action
  cards: Card[]
}

const initialCards = {}
const [getCards, cardActions] = createReducer('card', initialCards, {
  ...entityTable<Card>(card => card.id),
})

export const updateCard = cardActions.update

function shuffle(state: number[], seed: number) {
  const random = createRandom(seed)
  const newState = [...state]
  for (let i = 0; i < newState.length; i++) {
    const j = random()
    ;[newState[i], newState[j]] = [newState[j], newState[i]]
  }
  return newState
}

const [getHandIds, handActions] = createReducer('hand', [], {
  ...arraylike<number>(),
  shuffle,
})

function addToHand(card: Card) {
  return [cardActions.add(card), handActions.add(card.id)]
}

function removeFromHand(card: Card) {
  return [cardActions.remove(card), handActions.remove(card.id)]
}

export const getHand = createSelector(
  tuple(getCards, getHandIds),
  (cards, handIds): CardGroup => {
    return {
      add: addToHand,
      remove: removeFromHand,
      shuffle: handActions.shuffle,
      cards: handIds.map(id => cards[id].entity),
    }
  },
)

const [getDiscardIds, discardActions] = createReducer('discard', [], {
  ...arraylike<number>(),
  shuffle,
})

function addToDiscard(card: Card) {
  return [cardActions.add(card), discardActions.add(card.id)]
}

function removeFromDiscard(card: Card) {
  return [cardActions.remove(card), discardActions.remove(card.id)]
}

export const getDiscard = createSelector(
  tuple(getCards, getDiscardIds),
  (cards, discardIds): CardGroup => {
    return {
      add: addToDiscard,
      remove: removeFromDiscard,
      shuffle: discardActions.shuffle,
      cards: discardIds.map(id => cards[id].entity),
    }
  },
)

const [getDeckIds, deckActions] = createReducer('deck', [], {
  ...arraylike<number>(),
  shuffle,
})

function addToDeck(card: Card) {
  return [cardActions.add(card), deckActions.add(card.id)]
}

function removeFromDeck(card: Card) {
  return [cardActions.remove(card), deckActions.remove(card.id)]
}

export const getDeck = createSelector(
  tuple(getCards, getDeckIds),
  (cards, discardIds): CardGroup => {
    return {
      add: addToDeck,
      remove: removeFromDeck,
      shuffle: deckActions.shuffle,
      cards: discardIds.map(id => cards[id].entity),
    }
  },
)

const [getDrawIds, drawActions] = createReducer('draw', [], {
  ...arraylike<number>(),
  shuffle,
})

function addToDraw(card: Card) {
  return [cardActions.add(card), drawActions.add(card.id)]
}

function removeFromDraw(card: Card) {
  return [cardActions.remove(card), drawActions.remove(card.id)]
}

export const getDraw = createSelector(
  tuple(getCards, getDrawIds),
  (cards, drawIds): CardGroup => {
    return {
      add: addToDraw,
      remove: removeFromDraw,
      shuffle: drawActions.shuffle,
      cards: drawIds.map(id => cards[id].entity),
    }
  },
)
