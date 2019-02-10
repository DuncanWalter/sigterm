import React, { ReactNode } from 'react'

export function Responsive({ children }: { children: ReactNode }) {
  return (
    <div>
      <div
        style={{
          width: '75%',
          minWidth: '600px',
        }}
      >
        {children}
      </div>
    </div>
  )
}
