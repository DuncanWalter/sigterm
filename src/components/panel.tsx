import * as React from 'react'
import { ReactNode } from 'react'
import { style } from 'typestyle'
import { joinNames, justifyBetween, ClassName } from './styles'
import { Text } from './text'
import { useTheme } from './theme'

export interface PanelTheme {
  panel: string
  flush: string
  header: string
  content: string
}

interface PanelProps {
  className: ClassName
  children: ReactNode
  flush?: boolean
}

interface PanelHeaderProps {
  className: ClassName
  text: string
  children?: ReactNode
}

interface PanelContentProps {
  className: ClassName
  children: ReactNode
  flush?: boolean
}

export function Panel(props: PanelProps) {
  const { children, className } = props
  const { panel: theme } = useTheme()
  return (
    <div
      className={joinNames(className, theme.panel, props.flush && theme.flush)}
    >
      {children}
    </div>
  )
}

export function PanelHeader({ text, children, className }: PanelHeaderProps) {
  const { panel: theme } = useTheme()
  return (
    <div className={joinNames(className, justifyBetween, theme.header)}>
      <Text title>{text}</Text>
      <div>{children}</div>
    </div>
  )
}

export function PanelContent(props: PanelContentProps) {
  const { children, className } = props
  const { panel: theme } = useTheme()
  return (
    <div
      className={joinNames(
        className,
        theme.content,
        props.flush && theme.flush,
      )}
    >
      {children}
    </div>
  )
}

const panel = style({
  borderRadius: 4,
})

const header = style({
  padding: '24px 12px 24px',
})

const content = style({
  padding: '0 12px 24px',
})

const flush = style({
  $nest: {
    [`&.${content}`]: {
      padding: 0,
    },
  },
})

export const defaultPanelTheme = {
  panel,
  header,
  content,
  flush,
}
