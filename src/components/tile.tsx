import * as React from 'react'
import styled from 'styled-components'
import { Inline } from './inline'
import { Text } from './text'

interface TileWrapperProps {
  title?: string
  tolls?: any
  children?: any
  className?: string
}

interface TileSectionProps {
  flush?: boolean
  className?: string
  children?: any
}

interface TileHeaderProps {
  title?: string
  toolbar?: never
  className?: string
}

const TileFrame = styled.div<TileWrapperProps>`
  border-radius: 4px;
  background-color: #373745;
  color: #ffffff;
  margin: 24px 0 0;
`

const TileSectionFrame = styled.div<TileSectionProps>`
  padding: ${props => (props.flush ? '24px 0 24px' : '24px')};
`

export const TileWrapper = (props: TileWrapperProps) => {
  return <TileFrame {...props}>{props.children}</TileFrame>
}

export const TileSection = (props: TileSectionProps) => {
  return <TileSectionFrame {...props}>{props.children}</TileSectionFrame>
}

export const TileHeader = (props: TileHeaderProps) => {
  return (
    <TileSection {...props}>
      {/* <Inline large> */}
      <Text large>{props.title}</Text>
      {/* <Shim /> */}
      {props.toolbar}
      {/* </Inline> */}
    </TileSection>
  )
}
