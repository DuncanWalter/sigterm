export interface SampleSet<T, W, O> {
  add: (item: T, weight: W) => void
  sample: (count: number, options: O, acceptDuplicates?: boolean) => Iterable<T>
}

type SampleSetNode<T, W, O> =
  | RootNode<T, W, O>
  | LinkNode<T, W, O>
  | ContentNode<T, W, O>
  | EmptyNode<T, W, O>

interface RootNode<T, W, O> extends SampleSet<T, W, O> {
  left: SampleSetNode<T, W, O>
  right: SampleSetNode<T, W, O>
}

// constructor(aggragator: (accumulator: W, addition: W) => W, selector: (left: W, right: W, options: O) => W | null, empty: W){

// }
