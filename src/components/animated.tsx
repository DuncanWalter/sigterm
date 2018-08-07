import React, { Children, Component } from 'react'

type AnimatedProps<State, Initial = void> = {
  throttle?: number,
  update?: (state: Initial | State, delta: number) => State,
  render: (state: Initial | State) => any,
  state: Initial,
}

type AnimatedState<State, Initial = void> = {
  token: Symbol,
  lastUpdate: number,
  state: Initial,
}

function animationLoop() {
  requestAnimationFrame(animationLoop)
}

const registeredComponents: Map<Symbol, Animated<any>> = new Map()

function registerComponent(comp: Animated<any, any>) {
  registeredComponents.set(comp.state.token, comp)
}

function unregisterComponent(comp: Animated<any, any>) {
  registeredComponents.delete(comp.state.token)
}

function updateComponents() {
  const now = Date.now()
  registeredComponents.forEach((comp: Animated<any, any>) => {
    const { lastUpdate, state }: AnimatedState<any, any> = comp.state
    const { update, throttle }: AnimatedProps<any, any> = comp.props
    const delta = now - comp.state.lastUpdate
    if (!throttle || throttle <= delta) {
      comp.setState({
        lastUpdate: now,
        state: update ? update(state, delta) : state,
      })
    }
  })
}

export class Animated<State: Object, Initial = void> extends Component<
  AnimatedProps<State, Initial>,
  AnimatedState<State, Initial>,
> {
  constructor(props: AnimatedProps<State, Initial>) {
    super(props)
    this.state = {
      lastUpdate: Date.now(),
      state: props.state,
      token: Symbol('AnimatedToken'),
    }
  }

  onComponentDidMount() {
    registerComponent(this)
  }

  onComponentWillUnmount() {
    unregisterComponent(this)
  }

  render() {
    return this.props.render(this.state.state)
  }
}
