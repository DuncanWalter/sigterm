import React, {
  Component,
  Children,
  ReactElement,
  RefObject,
  ReactChild,
} from 'react'
import { animate } from './animated'
import { ChildArray } from './utils'
import { Transducer } from '../utils/transducer'

type ResponsiveProps = {
  children: ChildArray<ReactElement<Layout>>
}

type ResponsiveState = {
  layout: number
  width: number
  frame: RefObject<HTMLDivElement>
}

function shallowEqual<O extends { [prop: string]: unknown }>(a: O, b: O) {
  return (
    a === b ||
    Object.keys(a).reduce((equal, key) => equal && a[key] === b[key], true)
  )
}

class Responsive extends Component<ResponsiveProps, ResponsiveState> {
  constructor(props: ResponsiveProps) {
    super(props)
    this.state = {
      width: 0,
      layout: -1,
      frame: React.createRef(),
    }
  }

  filterChild = (width: number) => (child: ReactChild) => {
    if (typeof child !== 'string' && typeof child !== 'number') {
      if (child.type === Layout) {
        if (child.props.width === undefined) {
          return true
        } else if (child.props.width instanceof Array) {
          const [min, max] = child.props.width
          return width >= min && width < max
        } else {
          return child.props.width > width
        }
      }
    }
    return false
  }

  selectChild(width: number): number {
    const { children } = this.props
    const childArray = Children.toArray(children)
    const child = new Transducer(childArray)
      .filter<ReactElement<Layout>>(this.filterChild(width))
      .collect()[0]
    if (child !== undefined) {
      return childArray.indexOf(child)
    } else {
      return -1
    }
  }

  getContent(layout: number) {
    const { children } = this.props
    const childArray = Children.toArray(children)
    const child = childArray[layout]
    if (child && typeof child !== 'string' && typeof child !== 'number') {
      return child.props.children
    } else {
      return null
    }
  }

  render() {
    const { frame, layout } = this.state
    return <div ref={frame}>{this.getContent(layout)}</div>
  }
}

function update(this: Responsive) {
  const { width, frame } = this.state
  if (frame.current) {
    const div = frame.current
    console.log(div.scrollWidth)
    if (div.scrollWidth !== width) {
      console.log(
        'need to change',
        width,
        div.scrollWidth,
        this.selectChild(div.scrollWidth),
      )
      this.setState({
        width: div.scrollWidth,
        layout: this.selectChild(div.scrollWidth),
      })
    }
  }
}

const AnimatedResponsive = animate(Responsive, update, 100)
export { AnimatedResponsive as Responsive }

type LayoutProps = {
  width?: number | [number, number]
}

export class Layout extends Component<LayoutProps> {
  render() {
    throw new Error(
      'Layouts should not be rendered outside of a Responsive component.',
    )
    return null
  }
}
