import { Character, F, D, C, B, A } from '../../character'
import { CardLibrary } from '../cardLibrary'
import { Penetrate } from './penetrate'
import { Strike } from '../adventurer/strike'

// Strength, Self Damage, Healing

// apply Vengeant to self. When damage is dealt to a vengeant,
// the damage dealer gains stacks of ______. When damage is dealt to
// a creature with _____, the damage dealer heals for the amount of
// damage dealt up to the amount of _____.

// Temporary hitpoints as the replacement for blockade, certain
// vampirish abilities can trade the two out.

let alonzo = new Character(
  'Alonzo',
  true,
  '#3086ff',
  'A scientific tool intended to solve complex problems efficiently using its own understanding of mathematics. Usually used to study topics ranging from protein folding and traffic alleviation to macroeconomics and beyond.',
)

alonzo.addCard(F, Strike)

alonzo.addCard(B, Penetrate)

CardLibrary.register(alonzo)
