import React, {
  Element,
  ChildrenArray,
  Component,
  StatelessFunctionalComponent,
  Children,
} from 'react'

type $Component = Component<any, any> | StatelessFunctionalComponent<any>

type CaseProps<T, C extends Element<any> | null | string> = {
  of?: T
  default?: boolean
  children: C
}
// TODO: add a function prop for rendering cases (for efficiency and reduced logic)
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
export const Switch = <T, C>({ pattern, children }: SwitchProps<T, C>) => {
  if (Array.isArray(children)) {
    return (
      children
        .map(child => Switch({ children: child, pattern }))
        .filter(i => i)[0] || null
    )
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
