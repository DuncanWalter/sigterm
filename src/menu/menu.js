import { Switch, Case } from '../components/switch'
import { Main } from './main'
// import { CreateGame } from './createGame'
import { withState } from 'recompose'
import React from 'react'

type MenuProps = {
  state: string,
  route: string,
  setState: (state: string) => string,
}

// TODO: pass a way to navigate
const $Menu = ({ setState, state }: MenuProps) => (
  <Switch pattern={state}>
    <Case of="main">
      <Main />
    </Case>
    {/* <Case of="create-game">
      <CreateGame />
    </Case> */}
    <Case default>
      {(() => {
        setState('main')
        return null
      })()}
    </Case>
  </Switch>
)

export const Menu = withState('state', 'setState', ({ route }) => route)($Menu)
