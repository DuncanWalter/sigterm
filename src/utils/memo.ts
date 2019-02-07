export function memo<A, R>(fun: (a: A) => R) {
  let lastArg = {} as A
  let lastRet = {} as R
  return (a: A) => {
    if (a === lastArg) {
      return lastRet
    } else {
      return (lastRet = fun((lastArg = a)))
    }
  }
}
