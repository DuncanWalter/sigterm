import { createSettableState } from '@dwalter/spider-store'

const modulo = 1245842437
const scalar = 4829294781
const offset = 8758744959

function randomSeed() {
  return (Math.random() * modulo) | 0
}

const [, setRandom] = createSettableState('@random', randomSeed())

export function consumeRandom() {
  return setRandom(
    rand => (rand * scalar + offset) % modulo,
    rand => rand / modulo,
  )
}

export function resetRandom() {
  return setRandom(randomSeed())
}

export function seedRandom(seed: number) {
  return setRandom(seed)
}
