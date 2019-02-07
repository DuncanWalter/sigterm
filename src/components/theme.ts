import { createContext, useContext } from 'react'
import { ButtonTheme } from './button'
import { PanelTheme } from './panel'
import { TextTheme } from './text'

export interface Theme {
  button: ButtonTheme
  panel: PanelTheme
  text: TextTheme
}

/**
 * Different themes may be provided to component trees
 * by creating theme provider components.
 */
export const ThemeContext = createContext({
  button: {},
  panel: {},
  text: {},
} as Theme)

export function useTheme(): Theme {
  return useContext(ThemeContext)
}
