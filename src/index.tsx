import React from 'react'
import { render } from 'react-dom'

import { Button, Text, DefaultThemeProvider, justifyCenter } from './components'

import { style } from 'typestyle'
import { SpiderRoot } from '@dwalter/spider-hook'

console.log('Welcome to the Deck Dawdle client')

const anchor = style({
  overflow: 'hidden',
  width: '100vw',
  height: '100vh',
  backgroundColor: '#13131a',
})

const anchorElement = document.getElementById('anchor')

if (anchorElement) {
  render(
    <SpiderRoot>
      <DefaultThemeProvider>
        <div className={anchor}>
          <div className={justifyCenter}>
            <Text display>SIGTERM</Text>
            <div>
              <Button text="Press Me" onClick={() => alert('woot')} />
              <Button text="Press Me" primary onClick={() => alert('woot')} />
            </div>
          </div>

          {/* <Button text="Press Me" large disabled onClick={() => alert('woot')} />
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
        </div>
      </DefaultThemeProvider>
    </SpiderRoot>,
    anchorElement,
  )
} else {
  console.error('No anchor element provided')
}

// const [creatures, setCreatures] = createSettableState(
//   new Map<number, unknown>(),
// )

// function updateCreature(update: () => unknown) {
//   return setCreatures(creatures => {
//     update()
//     return creatures
//   })
// }

// function createCreature(factory: (id: number) => unknown) {}

// const [player, setPlayer] = createSettableState(new Map<number, unknown>())

// const getPlayer = createSelector([player, creatures], p => p)
