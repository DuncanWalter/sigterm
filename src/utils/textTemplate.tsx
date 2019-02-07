import * as React from 'react'
import { ReactNode } from 'react'
import { joinNames } from '../components'
import { style } from 'typestyle'
import { EventFactory } from '../events/event'
import { CardFactory } from '../cards/card'
import { EffectFactory } from '../effects/effect'

// TODO: Do I use preformatted? I think no...

// types of highlighting:

// none (plain text)
// number (numbers)
// variable (effect names)
// function (this like on-damage & events)
// const / keyword (game keywords @Singleton, @Default)
// type (Titles etc)

// `Deal 7 damage. ${onDamage(`Apply 2 ${vulnerable}`)}.`
// Deal 7 damage. on-damage: Apply 2 vulnerable.

// `Deal 7 damage. ${onDamage(x => `gain ${x} block`)}.`
// Deal 7 damage. on-damage(x): gain x block.

// `${singleton}. When a card is ${verb(delete, 'deleted')}, gain ${datum('block')} ${block}.`
// @Singleton. When a card is deleted, gain 4 block.

export interface Template {
  information: { title: string; description: ReactNode }[]
  text: ReactNode
}

interface InterpolationThunk<T> {
  type: undefined
  (data: T, defaultData: T): Interpolation<T>
}

export type Interpolation<T> =
  | Template
  | number
  | string
  | InterpolationThunk<T>
  // | EventFactory
  | EffectFactory
  | CardFactory

function resolveInterpolation<T>(
  interpolation: Interpolation<T>,
  data: T,
  defaultData: T,
): Template {
  if (typeof interpolation === 'string') {
    return { information: [], text: interpolation }
  } else if (typeof interpolation === 'number') {
    return {
      information: [],
      text: <p className={theme.numeric}>interpolation</p>,
    }
  } else if (typeof interpolation === 'function') {
    // TODO: fix type holes

    switch (interpolation.type) {
      case 'card-factory':
        return {
          information: [],
          text: <p className={theme.noun}>{interpolation.title}</p>,
        }
      case 'effect-factory':
        return {
          information: [interpolation],
          text: <p className={theme.noun}>{interpolation.name}</p>,
        }
      default:
        return resolveInterpolation(
          interpolation(data, defaultData),
          data,
          defaultData,
        )
    }
  } else {
    return interpolation
  }
}

export function template<T>(
  literals: TemplateStringsArray,
  ...interpolations: Interpolation<T>[]
) {
  return <U extends T>(data: U, defaultData: U) => {
    const output = []
    const resolvedInterpolations = interpolations.map(interpolation =>
      resolveInterpolation(interpolation, data, defaultData),
    )
    const information = []
    for (let interpolation of resolvedInterpolations) {
      for (let entry of interpolation.information) {
        information.push(entry)
      }
    }
    for (let i = 0; i < literals.length; i++) {
      output.push(literals[i])
      output.push(resolvedInterpolations[i].text)
    }
    return { information, text: <>{output}</> }
  }
}

export function keyword(
  title: string,
  description: Template | (() => Template),
): Template {
  const text = <p className={theme.keyword}>{`@${title}`}</p>

  let effect
  if (typeof description === 'function') {
    effect = description()
  } else {
    effect = description
  }

  const result = {
    text,
    information: [
      {
        title,
        description: effect.text,
      },
      ...effect.information,
    ],
  }

  return result
}

type NumericKeys<T extends Record<string, any>> = (keyof T) extends infer K
  ? K extends string ? (T[K] extends number ? K : never) : never
  : never

export function datum<K extends string, T extends Record<K, number>>(
  propName: NumericKeys<T>,
  covariant: boolean = true,
) {
  return (data: T, defaultData: T): Template => {
    const currentDatum = data[propName]
    if (typeof currentDatum === 'number') {
      const net = currentDatum - defaultData[propName]
      return {
        information: [],
        text: (
          <p
            className={joinNames(theme.numeric, {
              [numericGreen]: covariant ? net > 0 : net < 0,
              [numericRed]: covariant ? net < 0 : net > 0,
            })}
          >
            {currentDatum}
          </p>
        ),
      }
    } else {
      // TODO: consider styling the fallback more
      return { information: [], text: <p>??</p> }
    }
  }
}

const numericRed = style({ color: '#dd2222' })
const numericGreen = style({ color: '#22dd22' })

const theme = {
  verb: style({}),
  noun: style({}),
  title: style({}),
  numeric: style({}),
  background: style({}),
  keyword: style({}),
}

export function createTheme(colors: {
  verb: string
  noun: string
  title: string
  numeric: string
  keyword: string
  background: string
}) {
  return style({
    $nest: {
      [`&.${theme.verb}`]: { color: colors.verb },
      [`&.${theme.noun}`]: { color: colors.noun },
      [`&.${theme.title}`]: { color: colors.title },
      [`&.${theme.numeric}`]: { color: colors.numeric },
      [`&.${theme.keyword}`]: { color: colors.keyword },
      [`&.${theme.background}`]: { color: colors.background },
    },
  })
}
