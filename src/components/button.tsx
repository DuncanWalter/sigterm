import * as React from 'react'

import { Text } from './text'
import { readOption, ClassName, joinNames } from './styles'
import { style } from 'typestyle'

// TODO: &:focus styles

const types = ['primary', 'secondary', 'danger']

interface ButtonProps {
  className?: ClassName
  disabled?: boolean
  primary?: boolean
  secondary?: boolean
  danger?: boolean
  type?: 'primary' | 'secondary' | 'danger'
  text?: string
  onClick?: () => unknown
  children?: never
}

export function Button(props: ButtonProps) {
  const { text, onClick, children, className, disabled } = props
  if (children) {
    console.error('Use the "text" prop of Button instead of passing children')
  }
  const type = readOption(types, props, 'secondary')
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={joinNames(button, className, {
        [buttonPrimary]: type === 'primary',
        [buttonSecondary]: type === 'secondary',
        [buttonDanger]: type === 'danger',
        [buttonDisabled]: disabled,
      })}
    >
      <Text button>{text}</Text>
    </div>
  )
}

const button = style({
  borderRadius: 4,
  color: '#ffffff',
  cursor: 'pointer',
  display: 'inline-block',
  padding: '8px 16px 8px',
  transition: '0.2s',
})

const buttonDisabled = style({
  $nest: {
    [`&.${button}`]: {
      backgroundColor: '#9999a3',
      color: '#222233',
      cursor: 'not-allowed',
      $nest: {
        '&:hover': {
          backgroundColor: '#9999a3',
          color: '#222233',
        },
      },
    },
  },
})

const buttonPrimary = style({
  $nest: {
    [`&.${button}`]: {
      backgroundColor: 'rgb(56, 72, 221)',
      $nest: {
        '&:hover': {
          backgroundColor: 'rgba(56, 72, 221, 0.8)',
        },
      },
    },
  },
})

const buttonDanger = style({
  $nest: {
    [`&.${button}`]: {
      backgroundColor: 'rgb(221, 72, 56)',
      $nest: {
        '&:hover': {
          backgroundColor: 'rgba(221, 72, 56, 0.8)',
        },
      },
    },
  },
})

const buttonSecondary = style({
  $nest: {
    [`&.${button}`]: {
      color: '#222299',
      padding: 8,
      $nest: {
        '&:hover': {
          color: '#5555aa',
        },
      },
    },
  },
})
