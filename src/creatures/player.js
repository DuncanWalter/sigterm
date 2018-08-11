import { defineCreature } from './creature'
import { Sequence, randomSequence } from '../utils/random'
import { CharacterName } from '../character'

export const Player = defineCreature({
  type: 'player',

  name: '',
  description: '',
  color: '#7788bb',
  size: 0.7,

  data: {
    energy: 0,
    characters: ['Adventurer'], // CharacterType[]
  },
})
