import React from 'react'
import { ThemeContext } from './theme'
import { ReactNode } from 'react'
import { defaultButtonTheme } from './button'
import { defaultPanelTheme } from './panel'
import { defaultTextTheme } from './text'
import { defaultTooltipTheme } from './tooltip'

export const defaultTheme = {
  button: defaultButtonTheme,
  panel: defaultPanelTheme,
  text: defaultTextTheme,
  tooltip: defaultTooltipTheme,
}

export function DefaultThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeContext.Provider value={defaultTheme}>
      {children}
    </ThemeContext.Provider>
  )
}
