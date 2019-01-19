const leafNode = { children: [] }

export function topologicalSort<T>(edges: [T, T][]): T[] {
  const nodes = new Map<T, { children: T[] }>()

  for (let [parent, child] of edges) {
    const node = nodes.get(parent) || { children: [] }
    node.children.push(child)
    nodes.set(parent, node)
  }

  const postVisitOrdering = [] as T[]

  const visited = new Set<T>()

  nodes.forEach(function visit({ children }, parent) {
    if (visited.has(parent)) return

    visited.add(parent)

    for (let child of children) {
      visit(nodes.get(child) || leafNode, child)
    }

    postVisitOrdering.push(parent)
  })

  return postVisitOrdering.reverse()
}
