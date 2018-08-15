import * as React from 'react'
import { render } from 'react-dom'
import styled from 'styled-components'

import { Switch, Case } from './components/switch'
import { Button } from './components/button'
import { Text } from './components/text'
import { TileWrapper, TileSection, TileHeader } from './components/tile'
import { Responsive, Layout } from './components/responsive'
import { Page } from './components/page'
import { InteractionContext } from './components/interactive'

console.log('Welcome to the Deck Dawdle client')

const Anchor = styled.div`
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  background-color: #191923;

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
        {/* <Button text="Press Me" onClick={() => alert('woot')} />
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
        </Text> */}

        <Page>
          <TileWrapper>
            <TileHeader title="SIGTERM" />
          </TileWrapper>
          <TileWrapper>
            <TileSection>
              <Button primary text="New Game" />
              <br />
              <Button primary disabled text="Continue Game" />
              <br />
              <Button secondary text="Settings" />
            </TileSection>
          </TileWrapper>
        </Page>
      </Anchor>,
      anchorElement,
    )
  } else {
    console.error('No anchor element provided')
  }
})(document.getElementById('anchor'))
