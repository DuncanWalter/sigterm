let maxId = 0
const freeIds = [] as number[]

export function createId() {
  if (!freeIds.length) {
    return maxId++
  } else {
    return freeIds.pop()!
  }
}

export function destroyId(id: number) {
  freeIds.push(id)
}
