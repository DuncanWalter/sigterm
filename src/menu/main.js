import { Button, Block, Frame, Modal, Col, Shim } from '../components/utility'
// import { resolver } from '../events/eventResolver'
// import { StartGame } from '../events/startGame'
// import { reset } from './menuState'
// import { dispatch } from '../state'
import styled from 'styled-components'
import React from 'react'

export const Main = ({}) => (
  <Col shim>
    <Shim />
    <Block fill>
      <h1>Deck Dawdle</h1>
    </Block>
    {/* <Route
      render={({ history }) => (
        <Button
          onClick={() => {
            dispatch(reset())
            history.push('/menu/createGame/')
          }}
        >
          Begin
        </Button>
      )}
    /> */}
    <Shim />
  </Col>
)
