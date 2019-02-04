import * as React from 'react'
import { joinNames, ClassName, readOption } from './styles'
import { style } from 'typestyle'

const types = ['body', 'caption', 'display', 'title', 'button']

type TextProps = {
  className?: ClassName
  body?: boolean
  caption?: boolean
  display?: boolean
  title?: boolean
  button?: boolean
  type?: 'body' | 'caption' | 'display' | 'title' | 'button'
  children?: string
}

export function Text(props: TextProps) {
  const { children, className } = props
  const type = readOption(types, props)
  if (type == 'title' || type == 'display') {
    return (
      <h1
        className={joinNames(text, className, {
          [textDisplay]: type === 'display',
          [textTitle]: type === 'title',
        })}
      >
        {children}
      </h1>
    )
  } else {
    return (
      <p
        className={joinNames(text, className, {
          [textBody]: type === 'body',
          [textCaption]: type === 'caption',
          [textButton]: type === 'button',
        })}
      >
        {children}
      </p>
    )
  }
}

const text = style({
  borderRadius: 4,
  fontFamily: 'sans-serif',
  color: '#000000',
  transition: '0.2s',
  margin: '8px 12px 8px 12px',
})

const textBody = style({
  $nest: {
    [`&.${text}`]: { fontSize: 16 },
  },
})

const textCaption = style({
  $nest: {
    [`&.${text}`]: { fontSize: 12 },
  },
})

const textDisplay = style({
  $nest: {
    [`&.${text}`]: { fontSize: 88 },
  },
})

const textTitle = style({
  $nest: {
    [`&.${text}`]: { fontSize: 44 },
  },
})

const textButton = style({
  $nest: {
    [`&.${text}`]: { fontSize: 20 },
  },
})
