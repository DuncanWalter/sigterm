import {
  Element,
  ChildrenArray,
  Component,
  StatelessFunctionalComponent,
  Children,
} from 'react'

// type $Component = Component<any, any> | StatelessFunctionalComponent<any>
type CaseProps<T, C extends Element<any> | null | string> = {
  of?: T
  default?: boolean
  children: C
}

export const Case = <T, C extends Element<any> | null | string>({
  of,
  children,
}: CaseProps<T, C>) => {
  return Children.only(children)
}

type SwitchProps<T, C> = {
  pattern: T
  children: ChildrenArray<
    Element<StatelessFunctionalComponent<CaseProps<T, C>>>
  >
}
// TODO: add a pattern matching function to handle object props and object types
export function Switch<T, C>({
  pattern,
  children,
}: SwitchProps<T, C>): C | null {
  if (Array.isArray(children)) {
    return children.find(child => Switch({ children: child, pattern })) || null
  } else {
    if (children.props.default) {
      return children
    } else if (checkPattern(pattern, children.props.of)) {
      return children
    } else {
      return null
    }
  }
}

function checkPattern(pattern: never, target: never): boolean {
  if (pattern == target) {
    return true
  } else if (typeof pattern === 'object' && typeof target === 'object') {
    if (pattern === null || target === null) {
      return pattern === null && target === null
    } else if (target instanceof pattern) {
      return true
    } else {
      return Object.keys(pattern).reduce(
        (acc, key) =>
          acc && key in target && checkPattern(pattern[key], target[key]),
        true,
      )
    }
  } else {
    return false
  }
}
