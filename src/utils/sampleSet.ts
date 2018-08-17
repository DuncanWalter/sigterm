export interface SampleSetNode<T = any, W = any, O = any> {
  add: (item: T, weight: W) => SampleSetNode<T, W, O>
  sample: (
    count: number,
    options: O,
    acceptDuplicates?: boolean,
  ) => IterableIterator<T>
  count: number
}

interface ContentNode<T = any, W = any, O = any>
  extends SampleSetNode<T, W, O> {
  add(item: T, weight: W): LinkNode<T, W, O>
  content: T
  weight: W
}

interface LinkNode<T = any, W = any, O = any> extends SampleSetNode<T, W, O> {
  add(item: T, weight: W): LinkNode<T, W, O>
  left: LinkNode<T, W, O> | ContentNode<T, W, O>
  right: LinkNode<T, W, O> | ContentNode<T, W, O>
  weight: W
}

export function createSampleSet<T, W, O>(
  aggregator: (accumulator: W, addition: W) => W,
  selector: (left: W, right: W, options: O) => number,
): SampleSetNode<T, W, O> {
  let root: SampleSetNode<T, W, O> = {
    count: 0,
    *sample(): IterableIterator<T> {},
    add(content: T, weight: W) {
      return createContentNode(content, weight)
    },
  }

  return {
    get count() {
      return root.count
    },
    add(content: T, weight: W) {
      root = root.add(content, weight)
      return this
    },
    sample(count: number, options: O, acceptDuplicates?: boolean) {
      return root.sample(count, options, acceptDuplicates)
    },
  }

  function createContentNode(content: T, weight: W): ContentNode<T, W> {
    return {
      content,
      weight,
      count: 1,
      sample: contentNodeSample,
      add: contentNodeAdd,
    }
  }

  function createLinkNode(
    left: LinkNode<T, W, O> | ContentNode<T, W, O>,
    right: LinkNode<T, W, O> | ContentNode<T, W, O>,
  ): LinkNode<T, W, O> {
    return {
      left,
      right,
      weight: aggregator(left.weight, right.weight),
      count: left.count + right.count,
      sample: linkNodeSample,
      add: linkNodeAdd,
    }
  }

  function* contentNodeSample(
    this: ContentNode<T, W, O>,
    count: number,
    options: unknown,
    acceptDuplicates?: boolean,
  ) {
    let i = 0
    do {
      yield this.content
    } while (++i < count && acceptDuplicates)
  }

  function contentNodeAdd(
    this: ContentNode<T, W, O>,
    item: T,
    weight: W,
  ): LinkNode<T, W, O> {
    return createLinkNode(this, createContentNode(item, weight))
  }

  function* linkNodeSample(
    this: LinkNode<T, W, O>,
    count: number,
    options: O,
    acceptDuplicates?: boolean,
  ) {
    const bias = selector(this.left.weight, this.right.weight, options)
    const rCount = Math.round(bias * count)
    const lCount = count - rCount
    yield* this.left.sample(lCount, options, acceptDuplicates)
    yield* this.right.sample(lCount, options, acceptDuplicates)
  }

  function linkNodeAdd(
    this: LinkNode<T, W, O>,
    item: T,
    weight: W,
  ): LinkNode<T, W, O> {
    this.count++

    this.weight = aggregator(this.weight, weight)
    if (this.left.count <= this.right.count) {
      this.left = this.left.add(item, weight)
    } else {
      this.right = this.right.add(item, weight)
    }
    return this
  }
}
