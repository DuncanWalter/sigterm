import {
  Button,
  Block,
  Frame,
  Modal,
  Col,
  Row,
  Shim,
  Material,
} from '../components/utility'
// import { resolver } from '../events/eventResolver'
// import { StartGame } from '../events/startGame'
// // import { withState, dispatch } from '../state'
// import { characters, type CharacterName } from '../character'
import { CardPanel } from '../game/cardPanel'
// import { Entity, toExtractor } from '../utils/entity'
import { registerOverlay, OverlayContext } from '../components/overlay'
import styled from 'styled-components'
import React from 'react'

const Display = Material.extend`
  min-width: 240px;
  min-height: ${props => (props.flat ? '0' : '240px')};
  max-width: 240px;
  max-height: ${props => (props.flat ? '0' : '240px')};
  margin: 12px;
  flex: 0 0 33%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props =>
    props.available !== false ? props.color : '#1a1a24'};
  cursor: ${props => (props.available !== false ? 'pointer' : 'inherit')};
`

const previewCharacter = registerOverlay(({ resolve, character }) => {
  return (
    <Col shim>
      <h1>{character.name}</h1>
      <p>{character.description}</p>
      <CardPanel
        sets={[character.name]}
        cards={[...character.cards()].map(Card => new Card())}
      />
      <Row>
        <Button danger onClick={click => resolve(undefined)}>
          Back
        </Button>
        <Button primary onClick={click => resolve(character)}>
          Confirm
        </Button>
      </Row>
    </Col>
  )
})

const selectCharacter = registerOverlay(({ resolve, character, index }) => {
  return (
    <Col shim style={{ alignItems: 'center' }}>
      <h1>Select Character</h1>
      <Row style={{ flexWrap: 'wrap', maxWidth: '800px' }}>
        {[...characters.values()]
          .filter(
            set =>
              set.playable &&
              (!character.includes(set.name) || character[index] == set.name),
          )
          .map(character => (
            <Display
              available={true}
              color={character.color}
              onClick={click =>
                previewCharacter({ character }).then(confirmed => {
                  if (confirmed) {
                    resolve(character.name)
                  }
                })
              }
            >
              <h3>{character.name}</h3>
            </Display>
          ))}
        {/* TODO: Add The Random Option and confirmation */}
        <Display available={true} color={'#33333d'}>
          <h3>Random</h3>
        </Display>
        <Display flat />
        <Display flat />
      </Row>
      <Row>
        <Button danger onClick={click => resolve(undefined)}>
          Back
        </Button>
      </Row>
    </Col>
  )
})

const CharacterSlot = ({ index, character }) => {
  const available = isAvailable(index, character)
  const set = characters.get(character[index])
  return (
    <Display
      available={available}
      color={set ? set.color : '#777777'}
      onClick={click => {
        if (available) {
          selectCharacter({ index, character }).then(selection => {
            if (selection) {
              dispatch(setCharacter(selection, index))
            }
          })
        }
      }}
    >
      <h3>{available ? character[index] || 'Empty' : ''}</h3>
    </Display>
  )
}

// TODO: modals should only display top child
const $CreateGame = ({ state, setState }) => {
  return (
    <Modal>
      <OverlayContext match={match}>
        <Col shim>
          <h1>Create Game</h1>
          <Shim />
          <Row>
            <CharacterSlot index={0} character={menu.character} />
            <CharacterSlot index={1} character={menu.character} />
            <CharacterSlot index={2} character={menu.character} />
          </Row>
          <Shim />
          <Row>
            <Button
              danger
              onClick={click => {
                history.goBack()
              }}
            >
              Back
            </Button>
            <Button
              primary
              onClick={click => {
                // TODO: Delete the blank
                resolver
                  .processEvent(
                    StartGame(blank, blank, {
                      seed: 100345,
                      character: [...menu.character],
                    }),
                  )
                  .then(val => {
                    history.push('/game/pathSelection')
                  })
              }}
            >
              Begin
            </Button>
          </Row>
        </Col>
      </OverlayContext>
    </Modal>
  )
}

export const CreateGame = withState('state', 'setState', {
  character: ['eve', null, null],
})

function isAvailable(index: number, character: [CharacterName|null, CharacterName|null, CharacterName|null]): boolean {
  return index == 0 || character[index - 1] !== ''
}
