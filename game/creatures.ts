import { Creature } from '../src/creatures/creature'
import { createSelector, tuple, wrapThunk } from '@dwalter/spider-hook'
import {
  createReducer,
  entityTable,
  settable,
  arraylike,
} from '@dwalter/create-reducer'

const [getCreatures, creatureActions] = createReducer(
  'creature',
  {},
  entityTable<Creature>(creature => creature.id),
)

const [getPlayerId, playerIdActions] = createReducer('player', NaN, {
  ...settable<number>(),
})

const [getEnemyIds, enemyIdsActions] = createReducer('enemies', [], {
  ...arraylike<number>(),
})

export function addEnemy(enemy: Creature) {
  return [creatureActions.add(enemy), enemyIdsActions.add(enemy.id)]
}

export function removeEnemy(enemy: Creature) {
  return [creatureActions.remove(enemy), enemyIdsActions.remove(enemy.id)]
}

export function setPlayer(player: Creature) {
  return wrapThunk((dispatch, resolve) => {
    const playerId = resolve(getPlayerId)
    dispatch([
      creatureActions.delete(playerId),
      creatureActions.add(player),
      playerIdActions.set(player.id),
    ])
  })
}

export const updateCreature = creatureActions.update

export const getPlayer = createSelector(
  tuple(getCreatures, getPlayerId),
  (creatures, playerId) => creatures[playerId].entity,
)

export const getEnemies = createSelector(
  tuple(getCreatures, getEnemyIds),
  (creatures, enemyIds) => enemyIds.map(enemyId => creatures[enemyId].entity),
)
