type Predicate<I, O extends I> = (item: I) => I extends O ? boolean : false
type Filtered<P> = P extends Predicate<infer I, infer O> ? O : never

export class Transducer<T> {
  private iter: Iterable<T>
  constructor(iter: Iterable<T>) {
    this.iter = iter
  }

  collect(): T[] {
    return [...this.iter]
  }

  thru<O>(binding: (self: Transducer<T>) => O): O {
    return binding(this)
  }

  filter<O extends T>(
    predicate: Predicate<T, O>,
  ): Transducer<Filtered<typeof predicate>> {
    return new Transducer(filter(this.iter, predicate))
  }

  map<O>(mapping: (item: T) => O): Transducer<O> {
    return new Transducer(map(this.iter, mapping))
  }
}

function* filter<T, O>(
  iter: Iterable<T>,
  predicate: (item: T) => boolean,
): Iterable<O> {
  for (const item of iter) {
    if (predicate(item)) {
      yield item as any
    }
  }
}

function* map<T, O>(iter: Iterable<T>, mapping: (item: T) => O): Iterable<O> {
  for (const item of iter) {
    yield mapping(item)
  }
}
