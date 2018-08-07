type Topological<T> = {
  item: T
  dependents: Set<T>
  dependencies: Set<T>
}

// Why do thing like a sane, normal person
// when you can do things this way instead?
function* scansert<T>(
  items: Iterable<Topological<T>>,
  newItem: Topological<T>,
): Iterable<Topological<T>> {
  let inserted = false
  let gatheredItems = []
  const dependencies = newItem.dependencies
  const dependents = new Set([...newItem.dependents])
  for (const item of items) {
    if (inserted) {
      yield item
    } else if (dependencies.size > 0) {
      yield newItem
      yield* gatheredItems
    }
    // if in dependents, gather and don't yield
    else if (dependents.has(newItem.item)) {
      gatheredItems.push(item)
      // TODO: make a fresh dependents set for this to preserve sane/readable orders
      for (const dependent of item.dependents) {
        dependents.add(dependent)
      }
      // more stuff
    } else if (dependencies.has(newItem.item)) {
      dependencies.delete(newItem.item)
    } else {
      yield item
    }
  }
}

export class OrderedTokenContext {
  private tokenRanks: Map<string, number>
  private tokens: Iterable<Topological<string>>
  private ranksAreValid: boolean
  private stackSize: number

  constructor() {}

  registerToken(
    token: string,
    dependencies: Set<string> = new Set(),
    dependents: Set<string> = new Set(),
  ) {
    this.stackSize += 1
    this.ensureNoOverflow()
    this.ensureNoDuplicate(token)
    this.tokens = scansert(this.tokens, {
      item: token,
      dependencies,
      dependents,
    })
    this.tokenRanks.set(token, -1)
    this.ranksAreValid = false
  }

  sortTokens(tokens: string[]): string[] {
    this.ensureCurrentRanks()
    return tokens
      .map(token => ({
        rank: this.tokenRanks.get(token),
        token,
      }))
      .sort((a, b) => a.rank - b.rank)
      .map(({ token }) => token)
  }

  getRanks(tokens: string[]): number[] {
    this.ensureCurrentRanks()
    return tokens.map(token => this.tokenRanks.get(token))
  }

  private ensureNoOverflow() {
    if (this.stackSize > 500) {
      this.tokens = [...this.tokens]
      this.stackSize = 0
    }
  }

  private ensureCurrentRanks() {
    if (this.ranksAreValid) {
      return
    } else {
      const tokens = [...this.tokens]
      this.tokens = tokens
      this.stackSize = 0
      tokens.forEach((token, index) => {
        this.tokenRanks.set(token.item, index)
      })
      this.ranksAreValid = true
    }
  }

  private ensureNoDuplicate(token: string) {
    if (this.tokenRanks.has(token)) {
      console.error(new Error(`Duplicate token declaration`))
    }
  }
}
