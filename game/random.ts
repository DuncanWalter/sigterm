import { wrapThunk } from '@dwalter/spider-hook'
import { createReducer, settable } from '@dwalter/create-reducer'

const modulo = 1245842437
const scalar = 4829294781
const offset = 8758744959

export function createRandom(seed: number) {
  let state = seed % 1 !== 0 ? modulo * seed : seed
  return () => {
    state = (state * scalar + offset) % modulo
    return state / modulo
  }
}

function randomSeed() {
  return (Math.random() * modulo) | 0
}

const [getRandom, randomActions] = createReducer('random', randomSeed(), {
  ...settable<number>(),
})

export function consumeRandom() {
  return wrapThunk((dispatch, resolve) => {
    const random = resolve(getRandom)

    dispatch(randomActions.set((random * scalar + offset) % modulo))

    return random / modulo
  })
}

export function resetRandom() {
  return randomActions.set(randomSeed())
}

export function seedRandom(seed: number) {
  return randomActions.set(seed)
}
