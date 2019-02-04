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
  information: { name: ReactNode; description: ReactNode }[]
  text: ReactNode
}

export type Interpolation<T> =
  | Template
  | number
  | string
  | ((data: T, defaultData: T) => Interpolation<T>)
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
    return { information: [], text: <p className={numeric}>interpolation</p> }
  } else if (typeof interpolation === 'function') {
    // TODO: fix type holes
    return resolveInterpolation(
      interpolation(data, defaultData),
      data,
      defaultData,
    )
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
    const foo = interpolations.map(interpolation =>
      resolveInterpolation(interpolation, data, defaultData),
    )
    const information = flatmap(foo, foo => foo.information)
    for (let i = 0; i < literals.length; i++) {
      output.push(literals[i])
      output.push(foo[i].text)
    }
    return { information, text: <>{output}</> }
  }
}

export function keyword(
  name: string,
  description: Template | (() => Template),
): Template {
  const text = <p className={keywordStyle}>{`@${name}`}</p>

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
        name,
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

export function datum<T>(propName: NumericKeys<T>, covariant: boolean = true) {
  return (data: T, defaultData: T): Template => {
    const currentDatum = data[propName]
    if (typeof currentDatum === 'number') {
      const net = currentDatum - defaultData[propName]
      return {
        information: [],
        text: (
          <p
            className={joinNames(numeric, {
              [numericGreen]: covariant ? net > 0 : net < 0,
              [numericRed]: covariant ? net < 0 : net > 0,
            })}
          >
            {currentDatum}
          </p>
        ),
      }
    } else if (typeof currentDatum === 'string') {
      return resolveInterpolation(currentDatum, data, defaultData)
    } else {
      // TODO: consider styling the fallback more
      return { information: [], text: <p>??</p> }
    }
  }
}

const numericRed = style({ color: '#dd2222' })
const numericGreen = style({ color: '#22dd22' })

const verb = style({})
const noun = style({})
const title = style({})
const numeric = style({})
const background = style({})
const keywordStyle = style({})

export function createTheme(theme: {
  verb: string
  noun: string
  title: string
  numeric: string
  keyword: string
  background: string
}) {
  return style({
    $nest: {
      [`&.${verb}`]: { color: theme.verb },
      [`&.${noun}`]: { color: theme.noun },
      [`&.${title}`]: { color: theme.title },
      [`&.${numeric}`]: { color: theme.numeric },
      [`&.${keywordStyle}`]: { color: theme.keyword },
      [`&.${background}`]: { color: theme.background },
    },
  })
}
