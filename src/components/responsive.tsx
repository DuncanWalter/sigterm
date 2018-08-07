import React, {
  Component,
  type ChildrenArray,
  type ElementRef,
  type Element,
  Children,
} from 'react'
import { Animated } from './animated'

const responsiveFrame = {
  display: 'contents',
}

type ResponsiveProps = {
  children: ChildrenArray<Element<Layout>>,
}

type ResponsiveState = {
  width: number,
  height: number,
} | null

export class Responsive extends Component<ResponsiveProps, ResponsiveState> {
  frame: ElementRef<any> = React.createRef()

  constructor(props) {
    super(props)
    this.state = null
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.children === this.props.children) {
      const layoutCutoffs = Children.map(
        this.props.children,
        child => child.props,
      )
    }
  }

  render() {
    return (
      <Animated
        state={null}
        render={this.handleRender}
        update={this.handleUpdate}
      />
    )
  }

  handleUpdate = state => {
    if (this.frame.current) {
      const frame = this.frame.current
      if (frame.width === state.width && frame.height === frame.height) {
        return state
      } else {
        return {
          width: frame.width,
          height: frame.height,
        }
      }
    } else {
      return state
    }
  }

  handleRender = size => (
    <div ref={this.frame} style={responsiveFrame}>
      {this.state
        ? this.selectLayout(this.state).props.children
        : this.defaultLayout().props.children}
    </div>
  )

  selectLayout(size: ResponsiveState) {
    const { children } = this.props
  }

  defaultLayout() {
    const { children } = this.props
  }
}

type LayoutProps = {
  strict?: true,
  width?: number,
  height?: number,
}

export class Layout extends Component<LayoutProps> {
  render() {
    throw new Error(
      'Layouts should not be rendered outside of a Responsive component.',
    )
  }
}
