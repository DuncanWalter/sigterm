export type ChildArray<T> = T[] | T

export function readOption<Props extends {}, Option extends keyof Props>(
  props: Props,
  option: Option,
  flags: (keyof Props & Props[Option])[],
): Props[Option] | null {
  let value = null
  for (const flag of flags) {
    if (props[flag]) {
      if (value !== undefined)
        console.error(
          new Error(
            `Conflicting flags ${value} and ${flag} set for option ${option}.`,
          ),
        )
      value = flag
    }
  }
  if (props[option]) {
    if (value !== undefined)
      console.error(
        new Error(`Unnecessary flag ${value} set for the option ${option}.`),
      )
    value = props[option]
  }
  return value
}
