import React from 'react'
import { ThemeContext } from './theme'
import { ReactNode } from 'react'
import { defaultButtonTheme } from './button'
import { defaultPanelTheme } from './panel'
import { defaultTextTheme } from './text'

export const defaultTheme = {
  button: defaultButtonTheme,
  panel: defaultPanelTheme,
  text: defaultTextTheme,
}

export function DefaultThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeContext.Provider value={defaultTheme}>
      {children}
    </ThemeContext.Provider>
  )
}
