import React from 'react'
import { Responsive, Layout } from './responsive'
import { injectGlobal } from 'styled-components'

injectGlobal`
  div {
    color: #ffffff
  }
  .justify-center {
    display: flex
    justify-content: center
  }
  .p-x-compact {
    padding: 0 24px 0
  }
`

export function Page({ children }: { children: any }) {
  return (
    <Responsive>
      <Layout width={[0, 652]}>
        <div>{children}</div>
      </Layout>
      <Layout width={[652, 700]}>
        <div className="justify-center">
          <div style={{ flexBasis: '652px' }}>{children}</div>
        </div>
      </Layout>
      <Layout width={[700, 1048]}>
        <div className="p-x-compact">
          <div style={{ flexGrow: 1 }}>{children}</div>
        </div>
      </Layout>
      <Layout width={[1048, 1048 / 0.7]}>
        <div className="justify-center">
          <div style={{ flexBasis: '1000px' }}>{children}</div>
        </div>
      </Layout>
      <Layout>
        <div className="justify-center">
          <div style={{ flexBasis: '70%' }}>{children}</div>
        </div>
      </Layout>
    </Responsive>
  )
}
