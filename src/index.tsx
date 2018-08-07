import React from 'react'
import { render } from 'react-dom'
// import { withState } from 'recompose'
// import { Game } from './game/game'
// import { loadModules } from './utils/module'
// import { engine } from './engine'
import styled from 'styled-components'

import { Switch, Case } from './components/switch'
import { Button } from './components/button'
import { Text } from './components/text'
// import { Menu } from './menu/menu'

// import '../node_modules/font-awesome/css/font-awesome.min.css'
// import './index.css'
// import { Menu } from './menu/menu'

console.log('Welcome to the Deck Dawdle client')

// loadModules([engine])

const Anchor = styled.div`
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  background-color: black;

  /* display: flex; */
  /* font-size: 1.6rem; */
  /* color: rgba(240, 240, 240, 0.94); */
  /* font-family: Earth; */
`

// type RouterProps = { ready: boolean, path: string }
// const Router = (props: RouterProps) => {
//   return (
//     <Switch pattern={props}>
//       <Case of={{ ready: false }}>{null}</Case>
//       <Case of={{ path: 'menu' }}>
//         <Menu />
//       </Case>
//       <Case of={{ path: 'game' }}>Game</Case>
//       <Case default>Defaulting</Case>
//     </Switch>
//   )
// }

// const $Root = ({ state, setState }) => (
//   <Anchor>
//     <div>
//       <Router path={state.path} ready={state.ready} />
//     </div>
//   </Anchor>
// )

// const Root = withState('state', 'setState', {
//   ready: false,
//   loaded: new Set(),
//   path: 'menu',
// })($Root)

//
;(function bootstrap(anchorElement: HTMLElement | null): void {
  if (anchorElement) {
    render(
      <Anchor>
        <Button text="Press Me" onClick={() => alert('woot')} />
        <Button text="Press Me" primary onClick={() => alert('woot')} />

        <Button text="Press Me" large disabled onClick={() => alert('woot')} />
        <Button text="Press Me" warning onClick={() => alert('woot')} />

        <Text large plain>
          Big
        </Text>
        <Text small link>
          small
        </Text>
        <Text medium disabled>
          justRight
        </Text>
      </Anchor>,
      anchorElement,
    )
  } else {
    console.error('No anchor element provided')
  }
})(document.getElementById('anchor'))
