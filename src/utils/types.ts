type Tail<Ts extends any[]> = ((as: Ts) => any) extends ((
  a: any,
  ...rest: infer U
) => any)
  ? U
  : never

type Head<Ts extends any[]> = ((...as: Ts) => any) extends ((
  a: infer U,
  ...rest: any[]
) => any)
  ? U
  : never

type Unpack<T> = T extends { pack: infer U } ? U : never

interface TupleMapPack<Ts extends any[], M extends <U>(a: U) => any> {
  pack: {
    basis: []
    value: Unpack<TupleMapPack<Tail<Ts>, M>> extends infer T
      ? T extends any[]
        ? ((a: Head<Ts>, ...rest: T) => any) extends ((...as: infer U) => any)
          ? U
          : never
        : never
      : never
  }[Head<Ts> extends [] ? 'basis' : 'value']
}

type Cast<Tuple extends any[], Mapping extends <U>(a: U) => any> = Unpack<
  TupleMapPack<Tuple, Mapping>
>

type Instance<T> = T extends Iterable<infer U> ? U : never

interface ZipPack<Ts extends Iterable<any>[]> {
  pack: {
    basis: []
    value: Unpack<ZipPack<Tail<Ts>>> extends infer T
      ? T extends any[]
        ? ((a: Instance<Head<Ts>>, ...rest: T) => any) extends ((
            ...as: infer U
          ) => any)
          ? U
          : never
        : never
      : never
  }[Head<Ts> extends [] ? 'basis' : 'value']
}

type Zip<Iters extends Iterable<any>[]> = Unpack<ZipPack<Iters>>

const a: Zip<[number[], string[]]> = [3, '']

const b: Head<[number, string, object]> = 3
