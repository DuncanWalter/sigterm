import React, { StatelessFunctionalComponent } from 'react'
import styled, { css } from 'styled-components'

type TextSize = 'small' | 'medium' | 'large'

type TextType = 'link' | 'plain' | 'disabled'

type TextProps = {
  size?: TextSize
  small?: true
  medium?: true
  large?: true
  type?: TextType
  link?: true
  plain?: true
  disabled?: boolean
  children: string | string[]
}

type DefaultedTextProps = {
  size: TextSize
  type: TextType
  children: string | string[]
}

export function getTextSize(props: TextProps): TextSize | null {
  switch (true) {
    case !!props.small || props.size === 'small':
      return 'small'
    case !!props.medium || props.size === 'medium':
      return 'medium'
    case !!props.large || props.size === 'large':
      return 'large'
    default:
      return null
  }
}

export function getTextType(props: TextProps): TextType | null {
  switch (true) {
    case !!props.link || props.type === 'link':
      return 'link'
    case !!props.disabled || props.type === 'disabled':
      return 'disabled'
    case !!props.plain || props.type === 'plain':
      return 'plain'
    default:
      return null
  }
}

export function interpretTextProps(props: TextProps): DefaultedTextProps {
  return {
    size: getTextSize(props) || 'small',
    type: getTextType(props) || 'plain',
    children: props.children,
  }
}

const type = css`
  ${(props: DefaultedTextProps) => {
    switch (props.type) {
      case 'link': {
        return 'color: rgba(40, 40, 255, 0.9);'
      }
      case 'plain': {
        return 'color: rgba(244, 244, 244, 0.9);'
      }
      case 'disabled': {
        return 'color: rgba(80, 80, 80, 0.9);'
      }
    }
  }};
`

const size = css`
  ${(props: DefaultedTextProps) => {
    switch (props.size) {
      case 'small': {
        return 'font-size: 1.8rem; margin: 8px;'
      }
      case 'medium': {
        return 'font-size: 2.4rem; margin: 16px;'
      }
      case 'large': {
        return 'font-size: 4.2rem; margin: 24px;'
      }
    }
  }};
`

const TextFrame = styled.div`
  display: inline-block;
  ${() => size};
  ${() => type};
`

export const Text: StatelessFunctionalComponent<TextProps> = (
  props: TextProps,
) => {
  const options = interpretTextProps(props)
  return <TextFrame {...options}>{props.children}</TextFrame>
}
