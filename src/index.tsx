import React from 'react'
import { render } from 'react-dom'

import {
  Button,
  Text,
  DefaultThemeProvider,
  justifyCenter,
  Tooltip,
  joinNames,
  alignCenter,
} from './components'

import { style } from 'typestyle'
import { SpiderRoot } from '@dwalter/spider-hook'
import { Card } from './cards/cardComponent'
import { createTheme, template, datum } from './utils/textTemplate'
import { block } from './effects/block'

console.log('Welcome to the Deck Dawdle client')

const anchor = style({
  overflow: 'hidden',
  width: '100vw',
  height: '100vh',
  backgroundColor: '#13131a',
})

const cardTheme = createTheme({
  background: '#13131a',
  noun: '#4488dd',
  title: '#44ffaa',
  verb: '#ddff66',
  keyword: '#882299',
  numeric: '#fff',
})

const anchorElement = document.getElementById('anchor')

const effect = template`Deal ${datum('damage')} damage and gain ${datum(
  'block',
)} ${block}.`({ damage: 7, block: 7 }, { damage: 7, block: 5 }).text

if (anchorElement) {
  render(
    <SpiderRoot>
      <DefaultThemeProvider>
        <div className={joinNames(anchor, justifyCenter, alignCenter)}>
          <div className={justifyCenter}>
            <Text display>SIGTERM</Text>
            <div>
              <Tooltip
                manual
                size={150}
                content="I'm a helpful tooltip long and drab! Here is my kerning, here is my wrap. What will happen when I overflow? Nobody knows, no, nobody know!"
              >
                <Button text="Press Me" onClick={() => alert('woot')} />
                <Button text="Press Me" primary onClick={() => alert('woot')} />
              </Tooltip>
            </div>
            <Card
              theme={cardTheme}
              title="Foo Bar"
              text={effect}
              color="#334488"
              energy={1}
              rarity={1}
              glow
            />
          </div>
        </div>
      </DefaultThemeProvider>
    </SpiderRoot>,
    anchorElement,
  )
} else {
  console.error('No anchor element provided')
}
