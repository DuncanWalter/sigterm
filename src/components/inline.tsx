import React, { Children, cloneElement } from 'react'
import { Button, getButtonSize } from './button'
import { Text, getTextSize } from './text'

type InlineProps = {}

function interpretProps(props: any): any {
  return props
}

export const Inline = (props: InlineProps) => {
  const { children, textSize, buttonSize } = interpretProps(props)

  const sizedChildren = Children.map(children, child => {
    switch (true) {
      case typeof child === 'string': {
        return <Text size={textSize}>{child}</Text>
      }
      case child.type === Button: {
        const size = getButtonSize(child.props)
        if (size) {
          return child
        } else {
          return cloneElement(child, { size: buttonSize })
        }
      }
      case child.type === Text: {
        const size = getTextSize(child.props)
        if (size) {
          return child
        } else {
          return cloneElement(child, { size: textSize })
        }
      }
      default:
        return child
    }
  })

  return <div>{sizedChildren}</div>
}
