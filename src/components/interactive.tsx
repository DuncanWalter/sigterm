import React, {
  Children,
  cloneElement,
  ReactElement,
  ComponentClass,
  Component,
} from 'react'
import { Switch, Case } from './switch'

export interface InteractionToken {
  activate: <A, R>(
    Component: ComponentClass,
    resolve: (value: R) => void,
    args: A,
  ) => void
  deactivate: () => void
}

// TODO: not super well typed in terms of dom
// export type Overlay<A: Object, R> = (args: A) => Promise<R>
export function registerInteraction<A extends {}, R>(
  Component: (
    props: A & { resolve: ((value: R) => void) },
  ) => ReactElement<unknown>,
): (context: InteractionToken, args: A) => Promise<R> {
  // const overlay = genKey()
  // overlays.set(overlay, component)
  return (context: InteractionToken, args: A) =>
    new Promise(resolve => context.activate(Component, resolve, args))
}

type InteractionContextProps = {
  Template?: ComponentClass
}

type InteractionContextState = InteractionToken & {
  active: boolean
  args?: unknown
  resolve?: (value: unknown) => void
  Component?: ComponentClass
}

export class InteractionContext extends Component<
  InteractionContextProps,
  InteractionContextState
> {
  constructor(props: InteractionContextProps) {
    super(props)

    const that = this

    this.state = {
      active: false,
      activate<A, R>(
        Component: ComponentClass,
        $resolve: (value: R) => void,
        args: A,
      ) {
        const resolve = (val: R) => {
          that.state.deactivate()
          $resolve(val)
        }
        that.setState({ active: true, args, resolve, Component })
      },
      deactivate() {
        that.setState({
          active: false,
        })
      },
    }
  }

  render() {
    const { Template, children } = this.props
    const { active, resolve, Component } = this.state

    return (
      <Template>
        {cloneElement(Children.only(children), { resolve })}
        <Switch
          pattern={{
            active: true,
            Component: Function,
            resolve: Function,
            args: Object,
          }}
        >
          <Case of={this.props}>
            <InteractionContext>
              <Component {...this.state.args} resolve={resolve} />
            </InteractionContext>
          </Case>
          <Case default>
            {cloneElement(Children.only(children), { resolve })}
          </Case>
        </Switch>
      </Template>
    )
  }
}
