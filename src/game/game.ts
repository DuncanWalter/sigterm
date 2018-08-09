import { Card } from '../cards'
import { Monster } from '../creatures/monster'
import { Player } from '../creatures/player'

// TODO:
export interface Game {
  // bossSeed: Sequence<number>;

  // root: Path;
  // path: Path;
  // pragmaSequence: PragmaGroup;
  // pragmaSeed: Sequence<number>;

  dummy: Monster
  hand: Card[]
  drawPile: Card[]
  discardPile: Card[]
  enemies: Monster[]
  allies: Monster[]
  player: Player
  deck: Card[]
  activeCards: Card[]

  // pragmas: PragmaGroup;
}
