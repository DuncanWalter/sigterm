import { createSettableState } from '@dwalter/spider-store'
import { createSelector, tuple } from '@dwalter/spider-hook'
import { getCreatures, addCreature } from './creatures'
import { Creature } from '../src/creatures/creature'

const [getPlayerId, setPlayerId] = createSettableState('@player-id', NaN)

export { getPlayerId }

export const getPlayer = createSelector(
  tuple(getPlayerId, getCreatures),
  (playerId, creatures) => creatures.get(playerId)!,
  false,
)

export const getPlayerListeners = createSelector([getPlayer], player =>
  player.getListeners(),
)

export function setPlayer(player: Creature) {
  return [addCreature(player), setPlayerId(player.id)]
}
