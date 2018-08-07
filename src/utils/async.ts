// const empty = Symbol('EMPTY')

// // TODO: make the api as true to form as possible
// // So... we need to be able to run tasks that MAY be async synchronously if possible
// export class SyncPromise<V> extends Promise<V> {
//   private result: Symbol | V
//   private awaiting: ((value: V) => void)[]
//   then(onResolve, onReject) {
//     return new SyncPromise(resolve => {
//       if (this.result === empty) {
//         this.awaiting.push(value => resolve(onResolve(value)))
//       } else {
//         resolve(onResolve(this.result))
//       }
//     })
//   }
//   constructor(
//     resolver: (
//       resolve: (value: V) => void,
//       reject?: (rejection: any) => void,
//     ) => void,
//   ) {
//     super(resolve => undefined)
//     const unit = () => undefined
//     this.result = empty
//     this.awaiting = []

//     resolver(value => {
//       this.result = value
//       this.awaiting.forEach(callBack => callBack(value))
//     })
//   }
// }

// const GeneratorFunction = function* gen() {
//   return
// }.constructor

// function next(
//   gen: IterableIterator<any>,
//   resolve: (v: any) => void,
//   prev?: any,
// ): void {
//   const { value, done } = gen.next(prev)

//   if (done) return resolve(value)

//   if (value instanceof Promise) {
//     let isSynced = true
//     value.then(value => {
//       if (isSynced) {
//         next(gen, resolve, value)
//       } else {
//         setImmediate(() => next(gen, resolve, value))
//       }
//     })
//     isSynced = false
//   } else {
//     throw new Error(`Yielded a non-promise in async function ${value}`)
//   }
// }

// export function synchronize<As extends any[], R>(
//   fun: (...args: As) => R,
// ): (...args: As) => Promise<R> {
//   return (...args: As) => {
//     if (fun instanceof GeneratorFunction) {
//       return new SyncPromise(resolve => next(fun(...args) as any, resolve))
//     } else {
//       return new SyncPromise(resolve => resolve(fun(...args)))
//     }
//   }
// }
