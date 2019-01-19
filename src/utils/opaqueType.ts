// export class OpaqueType<S extends symbol, V extends string> {
//   private __symbol__: S
//   private __value__: V
//   static unwrap<M extends symbol, S extends symbol, V extends string>(
//     symbol: M,
//     opaqueValue: OpaqueType<S, V>,
//   ): M extends S ? V : null {
//     // TODO:
//     // @ts-ignore https://github.com/Microsoft/TypeScript/issues/17445
//     if (opaqueValue.__symbol__ === symbol) {
//       // TODO:
//       // @ts-ignore https://github.com/Microsoft/TypeScript/issues/17445
//       return opaqueValue.__value__
//     } else {
//       return null
//     }
//   }
//   constructor(symbol: S, value: V) {
//     this.__symbol__ = symbol
//     this.__value__ = value
//   }
// }

// function generateUniqueString(): string {
//   // TODO: make an id generator
//   return ''
// }

// export function idGenerator<S extends symbol>(symbol: S) {
//   return function generateId() {
//     return new OpaqueType(symbol, generateUniqueString())
//   }
// }

// export function tokenGenerator<S extends symbol>(symbol: S) {
//   const members = new Set()
//   return function generateToken<V extends string>(value: V): OpaqueType<S, V> {
//     if (members.has(value)) {
//       console.error(
//         new Error(
//           `Duplicate tokens created of type '${symbol}' and value '${value}'`,
//         ),
//       )
//     } else {
//       members.add(value)
//     }
//     return new OpaqueType(symbol, value)
//   }
// }

// // TODO: id generation from antiquity
// // const entityIds = (function*(entropy): Generator<ID<any>, void, any> {
// //   let i = 1
// //   while (true) {
// //     yield `id:${entropy.toString(36)}:${(++i).toString(36)}`
// //   }
// // })(Date.now())
