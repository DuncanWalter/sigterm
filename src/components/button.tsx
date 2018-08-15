import React from 'react'
import styled, { css } from 'styled-components'

import { Text } from './text'

type ButtonType = 'primary' | 'secondary' | 'warning'

type ButtonSize = 'small' | 'large'

type ButtonProps = {
  disabled?: boolean
  size?: ButtonSize
  type?: ButtonType
  text?: string
  onClick?: () => unknown
  small?: true
  large?: true
  primary?: true
  secondary?: true
  warning?: true
}

type DefaultedButtonProps = {
  disabled: boolean
  size: ButtonSize
  type: ButtonType
  text: string
  onClick: () => unknown
}

export function getButtonSize(props: ButtonProps): ButtonSize | null {
  switch (true) {
    case !!props.small || props.size === 'small':
      return 'small'
    case !!props.large || props.size === 'large':
      return 'large'
    default:
      return null
  }
}

export function getButtonType(props: ButtonProps): ButtonType | null {
  switch (true) {
    case !!props.primary || props.type === 'primary':
      return 'primary'

    case !!props.secondary || props.type === 'secondary':
      return 'secondary'

    case !!props.warning || props.type === 'warning':
      return 'warning'

    default:
      return null
  }
}

export function interpretButtonProps(props: ButtonProps): DefaultedButtonProps {
  return {
    text: props.text || '',
    onClick: !props.disabled && props.onClick ? props.onClick : () => undefined,
    type: getButtonType(props) || 'secondary',
    disabled: !!props.disabled,
    size: getButtonSize(props) || 'small',
  }
}

const size = css`
  ${(props: DefaultedButtonProps) => {
    switch (props.size) {
      case 'small': {
        return `
          padding: 0 16px 0;
        `
      }
      case 'large': {
        return `
          padding: 8px 32px 8px;
        `
      }
    }
  }};
`

const type = css`
  cursor: pointer;
  color: #aaaaaa;
  background-color: ${(props: DefaultedButtonProps) => {
    switch (props.type) {
      case 'primary':
        return '#88aa66'
      case 'secondary':
        return '#557799'
      case 'warning':
        return '#cc3366'
    }
  }};
  &:hover {
    background-color: ${(props: DefaultedButtonProps) => {
      switch (props.type) {
        case 'primary':
          return '#aacc88'
        case 'secondary':
          return '#7799aa'
        case 'warning':
          return '#ee5588'
      }
    }};
  }
`

const disabled = css`
  color: #222222;
  background-color: #aaaaaa;
`

const ButtonFrame = styled.div`
  border-radius: 4px;
  display: inline-block;
  margin: 16px;
  ${() => size};
  ${(props: DefaultedButtonProps) => (props.disabled ? disabled : type)};
`

export const Button: StatelessFunctionalComponent<ButtonProps> = (
  props: ButtonProps,
) => {
  const options = interpretButtonProps(props)
  return (
    <ButtonFrame {...options}>
      <Text
        size={options.size === 'large' ? 'medium' : 'small'}
        disabled={options.disabled}
      >
        {options.text}
      </Text>
    </ButtonFrame>
  )
}
