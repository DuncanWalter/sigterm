import { createSelector, tuple } from '@dwalter/spider-hook'
import { getPlayer, getEnemies } from './creatures'
import { Creature } from '../src/creatures/creature'
import { CardGroup, getDiscard, getDeck, getHand, getDraw } from './cards'

export interface Game {
  player: Creature
  enemies: Creature[]
  deck: CardGroup
  hand: CardGroup
  drawPile: CardGroup
  discardPile: CardGroup
  pragmas: number[]
}

export const getGame = createSelector(
  tuple(getPlayer, getEnemies, getHand, getDeck, getDiscard, getDraw),
  (player, enemies, hand, deck, discardPile, drawPile): Game => {
    return {
      player,
      enemies,
      deck,
      hand,
      drawPile,
      discardPile,
      pragmas: [],
    }
  },
)

// export const Game = withGame(({ match, game }) => (
//   <Col shim>
//     <Material>
//       <Row backgroundColor="#474441">
//         <p>
//           <b>SL4M The Adventurer</b> level: {game.path.level}
//         </p>
//         <div style={{ flex: 1 }} />
//         <p>{game.deck.size} cards</p>
//         <p>Settings and Crap</p>
//       </Row>
//     </Material>
//     <Row>
//       {[...game.pragmas].map((pragma) => (
//         <Block style={{ width: '40px', height: '40px', borderRadius: '20px' }}>
//           1
//         </Block>
//       ))}
//     </Row>
//     <Switch>
//       <Route path={`${match.path}/pathSelection`} component={PathSelection} />
//       <Route path={`${match.path}/battle`} component={Battle} />
//       <Route path={`${match.path}/rewards`} component={Rewards} />
//     </Switch>
//   </Col>
// ))
