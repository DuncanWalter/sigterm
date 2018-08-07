export const TileWrapper = () => {
  return <TileFrame>{children}</TileFrame>
}

export const TileSection = () => {
  return <TileSectionFrame>{children}</TileSectionFrame>
}

export const TileHeader = () => {
  return (
    <TileSection>
      <Inline large>
        {props.title}
        <Shim />
        {props.tools}
      </Inline>
    </TileSection>
  )
}
