import * as React from 'react'

type ContainerProps = { router?: Router, store?: Store } & (
  | {
      render: RenderFunction,
      children: null,
    }
  | { children: ValidChildren, render: void }
)

type ContainerState = {}

export class Container extends React.Component<ContainerProps> {
  // constructor(props: ContainerProps){

  // }

  render() {
    const { render, children, store, router } = this.props

    if (render && !children) {
      return

      render(/*make props*/)
    } else {
      return
    }
  }
}
