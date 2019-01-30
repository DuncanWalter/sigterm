import { PlayArgs } from '../cards/card'
import { Creature } from './creature'
import { hydrate } from 'react-dom'

export type Intent =
  | AggressiveIntent
  | DefensiveIntent
  | MalineIntent
  | SadisticIntent
  | BenevolentIntent
  | UnknownIntent
  | IntentList

interface IntentList extends Array<Intent> {}

interface AggressiveIntent {
  type: 'aggressive'
  damage: number
  times?: number
}

interface DefensiveIntent {
  type: 'defensive'
}

interface MalineIntent {
  type: 'maline'
}

interface BenevolentIntent {
  type: 'benevolent'
}

interface SadisticIntent {
  type: 'sadistic'
}

interface UnknownIntent {
  type: 'unknown'
}

interface BehaviorFactory<Data = {}> {
  (data?: Data): Behavior<Data>
}

interface SerializedBehavior<Data = any> {
  name: string
  data: Data
}

export interface Behavior<Data = any> extends SerializedBehavior<Data> {
  type: BehaviorFactory<Data>
  play(args: PlayArgs<Data>): Promise<Intent>
  next(): Behavior
}

interface BehaviorDefinition<Data> {
  data?: Data
  play(args: PlayArgs<Data>): Promise<Intent>
  next(): Behavior
}

const behaviors = new Map<string, BehaviorFactory>()

export function defineBehavior<Data = {}>(
  name: string,
  { data: defaultData = {} as Data, play, next }: BehaviorDefinition<Data>,
): BehaviorFactory<Data> {
  function factory(data = {}) {
    return {
      name,
      type: factory,
      data: { ...defaultData, ...data },
      play,
      next,
    }
  }
  behaviors.set(name, factory)
  return factory
}

export function hydrateBehavior(behavior: SerializedBehavior) {
  return (behaviors.get(behavior.name) || fallbackBehavior)(behavior.data)
}

export const cloneBehavior = hydrateBehavior

export const fallbackBehavior = defineBehavior('fallbackBehavior', {
  async play() {
    return { type: 'unknown' }
  },
  next(): Behavior {
    return fallbackBehavior()
  },
})

// type Props = {
//   data: Intent
// }

// export const primeBehavior: BehaviorState = defineBehavior(
//   'PRIME_BEHAVIOR',
//   function*() {
//     return {}
//   },
// )

// // TODO: needs a revamp
// export const renderBehavior = ({ data }: { data: Intent }) => {
//   return (
//     <div style={renderData(data).container}>
//       <p>{data.damage || ''}</p>
//     </div>
//   )
// }

// function renderData(data: Intent) {
//   let innerColor = '#000000',
//     outerColor = '#ffffff'

//   switch (true) {
//     case data.damage != undefined: {
//       innerColor = '#996655'
//       outerColor = '#ff7766'
//       break
//     }
//     case data.isDefending: {
//       innerColor = '#556699'
//       outerColor = '#6677ff'
//       break
//     }
//     case data.isDebuffing: {
//       innerColor = '#669955'
//       outerColor = '#77ff66'
//       break
//     }
//     case data.isMajorDebuffing: {
//       innerColor = '#771177'
//       outerColor = '#992299'
//       break
//     }
//     case data.isMiscBehavior: {
//       innerColor = '#99aa11'
//       outerColor = '#bbff22'
//       break
//     }
//   }

//   return {
//     container: {
//       flex: 1,
//       width: '38px',
//       height: '38px',
//       display: 'flex',
//       border: `solid ${outerColor} 2px`,
//       backgroundColor: innerColor,
//       color: '#ffeedd',
//       borderRadius: '19px',
//       justifyContent: 'center',
//       alignItems: 'center',
//       margin: '3px',
//     },
//   }
// }
