import * as React from 'react'
import { ReactNode } from 'react'
import { style } from 'typestyle'
import { joinNames, justifyBetween, ClassName } from './styles'
import { Text } from './text'

const panel = style({
  padding: '0 12px 0',
  borderRadius: 4,
})

const panelFlush = style({
  $nest: {
    [`&.${panel}`]: {
      padding: 0,
    },
  },
})

interface PanelProps {
  className: ClassName
  children: ReactNode
  flush?: boolean
}

export function Panel({ children, flush, className }: PanelProps) {
  return (
    <div className={joinNames(className, panel, flush && panelFlush)}>
      {children}
    </div>
  )
}

const panelHeader = style({
  padding: '24px 12px 24px',
})

interface PanelHeaderProps {
  className: ClassName
  text: string
  children?: ReactNode
}

export function PanelHeader({ text, children, className }: PanelHeaderProps) {
  return (
    <div className={joinNames(className, justifyBetween, panelHeader)}>
      <Text title>{text}</Text>
      <div>{children}</div>
    </div>
  )
}

const panelContent = style({
  padding: '0 12px 24px',
})

interface PanelContentProps {
  className: ClassName
  children: ReactNode
}

export function PanelContent({ children, className }: PanelContentProps) {
  return <div className={joinNames(className, panelContent)}>{children}</div>
}
