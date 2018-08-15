import React, { Component, ComponentClass, RefObject } from 'react'

type AnimatedProps<Comp = Component, Props = {}> = {
  throttle?: number
  Target: new (props: Props) => Comp
  update: (this: Comp, delta: number) => void
  innerProps: Props
}

interface AnimatedState<Comp = Component> {
  token: Symbol
  lastUpdate: number
  target: RefObject<Comp>
}

const registeredComponents: Map<Symbol, Animated> = new Map()

function registerComponent(comp: Animated<any, any>) {
  registeredComponents.set(comp.state.token, comp)
}

function unregisterComponent(comp: Animated<any, any>) {
  registeredComponents.delete(comp.state.token)
}

function updateComponents() {
  const now = Date.now()
  registeredComponents.forEach((comp: Animated) => {
    const { throttle, update }: AnimatedProps = comp.props
    const { lastUpdate, target }: AnimatedState = comp.state
    const delta = now - lastUpdate
    if (target.current && (!throttle || throttle <= delta)) {
      comp.setState({
        lastUpdate: now,
      })
      update.call(target.current, delta)
    }
  })
}

class Animated<
  Comp extends Component<any, any> = Component,
  Props = {}
> extends Component<AnimatedProps<Comp, Props>, AnimatedState<Comp>> {
  constructor(props: AnimatedProps<Comp, Props>) {
    super(props)
    this.state = {
      lastUpdate: Date.now(),
      token: Symbol('ANIMATED_TOKEN'),
      target: React.createRef(),
    }
  }

  shouldComponentUpdate(newProps: AnimatedProps<Comp, Props>) {
    return newProps !== this.props
  }

  componentDidMount() {
    registerComponent(this)
  }

  componentWillUnmount() {
    unregisterComponent(this)
  }

  render() {
    const { Target, innerProps } = this.props
    const { target } = this.state
    return <Target ref={target} {...innerProps} />
  }
}

;(function animationLoop() {
  updateComponents()
  requestAnimationFrame(animationLoop)
})()

export function animate<Props, State, Comp extends Component<Props, State>>(
  Target: new (props: Props) => Comp,
  update: (this: Comp, delta: number) => void,
  throttle?: number,
) {
  return (props: Props) => (
    <Animated<Comp, Props>
      throttle={throttle}
      Target={Target}
      update={update}
      innerProps={props}
    />
  )
}
