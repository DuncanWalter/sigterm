import { createSettableState, Dispatch } from '@dwalter/spider-store'
import { createSelector, tuple } from '@dwalter/spider-hook'
import { getCreatures, addCreature } from './creatures'
import { Creature } from '../src/creatures/creature'

const [getEnemyIds, setEnemyIds] = createSettableState(
  '@enemy-ids',
  [] as number[],
)

export { getEnemyIds }

export const getEnemies = createSelector(
  tuple(getEnemyIds, getCreatures),
  (enemyIds, creatures) =>
    enemyIds
      .filter(enemyId => creatures.has(enemyId))
      .map(enemyId => creatures.get(enemyId)!),
)

export const getEnemyListeners = createSelector([getEnemies], enemies =>
  // TODO: add a listener that watches for removeCreature
  flatmap(enemies, enemy => enemy.getListeners()),
)

export function setEnemies(enemies: Creature[]) {
  return (dispatch: Dispatch) => {
    enemies.forEach(enemy => dispatch(addCreature(enemy)))
    return dispatch(setEnemyIds(enemies.map(enemy => enemy.id)))
  }
}
