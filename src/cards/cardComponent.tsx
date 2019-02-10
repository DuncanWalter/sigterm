// import type { Rarity } from '../character'
// import type { Card as CardObject } from './card'
// import type { State } from '../state'
// import type { Game } from '../game/battle/battleState'
import React from 'react'
import { ReactNode } from 'react'
// import styled from 'styled-components'
import { style } from 'typestyle'
import { joinNames, column } from '../components'
import { textTemplateTheme } from '../utils/textTemplate'

const cardBack = style({
  minWidth: '280px',
  minHeight: '440px',
  maxWidth: '280px',
  maxHeight: '440px',
  position: 'relative',
  cursor: 'pointer',
  color: '#eeeeff',
})

// const CardDivider = styled.div`
//   width: 100%;
//   height: 8px;
//   background-color: #1a1a1a;
// `

// TODO: border radius troubles
const titleBar = style({
  height: '40px',
  backgroundColor: '#333333',
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
  fontStyle: 'bold',
})

// TODO: border radius troubles
const textBox = style({
  height: '190px',
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
  padding: '5px 23px 5px',
  textAlign: 'center',
  fontSize: '1.3rem',
})

// const CardVignette = styled.div`
//   flex: 1;
//   width: 100%;
//   height: 100%;
//   mask: url(${window.location + '/../' + mask}) center center no-repeat;
//   background-color: ${props => props.color};
// `

const imageBox = style({
  flex: 1,
  backgroundColor: '#ccc9bf',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  height: '200px',
})

// const CardEffects = styled.div`
//   position: absolute;
//   top: 48px;
//   left: -20px;
//   display: flex;
//   flex-direction: column;
// `

// const CardCost = styled.div`
//   position: absolute;
//   ${props =>
//     props.playable
//       ? `
//             left: -8px;
//             top: -8px;
//             width: 56px;
//             height: 56px;
//             border-radius: 28px;
//         `
//       : `
//             left: 0;
//             top: 0;
//             width: 40px;
//             height: 40px;
//             border-radius: 0;
//         `} transition: 0.7s;
//   background-color: ${props =>
//     props.energy === undefined ? '#1a1a1a' : '#eeeeee'};
//   justify-content: center;
//   align-items: center;
//   display: flex;
//   font-size: 2rem;
//   box-shadow: ${props =>
//     props.playable
//       ? `
//             0 4px 12px rgba(0, 0, 0, 0.25),
//             0 2px 8px rgba(0, 0, 0, 0.25),
//             0 0 4px rgba(0, 0, 0, 0.50)
//         `
//       : 'none'};
//   color: ${props => props.membership.color};
// `

// const CardRarity = styled.div`
//   position: absolute;
//   right: -3px;
//   bottom: 186px;
//   width: 20px;
//   height: 20px;
//   background-color: ${props => colorRarity(props.membership.rarity)};
//   box-shadow: ${props =>
//     `
//             0px 3px 0px rgba(0, 0, 0, 0.35),
//             0px 0px 12px ${colorRarity(props.membership.rarity)};
//         `};
//   border-radius: 10px;
// `

// const CardEffectWrapper = styled.div`
//   max-width: 16px;
//   height: 40px;
//   text-align: center;
//   vertical-align: middle;
//   white-space: nowrap;
//   transition: 0.4s;
//   border-radius: 20px;
//   margin-bottom: 4px;
//   background-color: ${props => props.effect.appearance.color};
//   overflow: hidden;
//   padding: 0 16px 0;
//   & p.internal {
//     display: none;
//   }
//   & p.preview {
//     display: inline;
//   }
//   &:hover {
//     max-width: 280px;
//     p.internal {
//       display: inline;
//     }
//     p.preview {
//       display: none;
//     }
//   }
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25), 0 2px 8px rgba(0, 0, 0, 0.25),
//     0 0 4px rgba(0, 0, 0, 0.5);
// `

interface CardProps {
  title: string
  text: ReactNode
  color: string

  energy: string | number
  rarity: number

  glow: boolean
  theme: string
}

export function Card({ title, text, color, energy, rarity, theme }: CardProps) {
  // const actors = new Set()
  // actors.add(game.player)
  // actors.add(card)

  // // TODO: need to rework the energy part to check for price and playability
  // let { energy, color, text, title } = card.simulate({
  //   actors,
  //   subject: card,
  //   resolver,
  //   data: card.data,
  //   game,
  // })

  // // TODO: get the color fade for multiple ownerships
  // let membership = CardLibrary.getCardMembership(sets || [], card)

  return (
    <div className={joinNames(theme, cardBack, textTemplateTheme.background)}>
      <div className={column}>
        {/* <CardBase membership={membership} > */}
        <div className={titleBar}>
          <p className={textTemplateTheme.title}>{title}</p>
          {/* <CardCost
            membership={membership}
            energy={energy}
            playable={playEnergy >= energy}
          >
            <b>{energy}</b>
          </CardCost> */}
        </div>
        {/* <CardAccent membership={membership}/> */}
        {/* <CardDivider/> */}
        <div className={imageBox} style={{ backgroundColor: color }} />
        {/* <CardAccent membership={membership}/> */}
        {/* <CardDivider/> */}
        <div className={textBox}>{text}</div>
        {/* <CardAccent membership={membership}/> */}
        {/* </CardBase> */}
        {/* <CardCost membership={membership}>
            <b>{energy}</b>
        </CardCost> */}
        {/* <CardRarity membership={membership}/> */}
      </div>
      {/* <ToolTips effects={card.effects} /> */}
      {/* <CardEffects>
        {[...card.effects].map(effect => (
          <CardEffect effect={effect} />
        ))}
      </CardEffects> */}
    </div>
  )
}

// function colorRarity(rarity: Rarity) {
//   switch (rarity) {
//     case 'A':
//       return '#ffa305'
//     case 'B':
//       return '#ce54ff'
//     case 'C':
//       return '#54a9ff'
//     case 'D':
//       return '#59ff54'
//     case 'F':
//       return '#46464f'
//     default:
//       return '#ffffff'
//   }
// }
