import React, {
  type Element,
  type ChildrenArray,
  Children,
  cloneElement,
} from 'react'
import { Switch, Case } from './switch'

export opaque type InteractionToken = {
  activate: (Component: mixed, resolve: mixed, args: mixed) => void,
  deactivate: () => void,
}

// TODO: not super well typed in terms of dom
// export type Overlay<A: Object, R> = (args: A) => Promise<R>
export function registerInteraction<A: Object, R>(
  Component: (props: { ...A, resolve: R => void }) => Element<any>,
): (context: InteractionToken, args: A) => Promise<R> {
  // const overlay = genKey()
  // overlays.set(overlay, component)
  return (context: InteractionToken, args: A) =>
    new Promise($resolve => context.activate(Component, $resolve, args))
}

type InteractiveProps = {
  state: mixed,
  setState: mixed,
  children: Element<any>,
  template?: any,
}
const $Interactive = ({
  children,
  setState,
  state: { Component, resolve, args, active },
  template,
}: InteractiveProps) => {
  // TODO: title text and exit button?
  // TODO: back/confirm?

  const context = {
    activate(Component, $resolve, args) {
      const resolve = val => {
        context.deactivate()
        $resolve(val)
      }
      setState(state => ({ active: true, args, resolve, Component }))
    },
    deactivate() {
      setState(state => ({
        active: false,
        args: null,
        resolve: null,
        Component: null,
      }))
    },
  }

  console.log('Overlay Begin')
  return (
    <Switch pattern={active}>
      <Case of={true}>
        <Interactive>
          <Component {...args} resolve={resolve} />
        </Interactive>
      </Case>
      <Case default>{cloneElement(Children.only(children), { resolve })}</Case>
    </Switch>
  )
}

export const Interactive = withState('state', 'setState', {
  active: false,
  Component: false,
  resolve: null,
  args: null,
})($Interactive)
