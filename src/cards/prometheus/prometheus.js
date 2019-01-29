import { Character, D, C } from '../../character'
import { CardLibrary } from '../cardLibrary'
import { Daemon } from './daemon'
import { MarkForDeath } from './markForDeath'

// orb- similar
//  => passive damage to weakest foe
//  => evoke for increased targeted damage (and 1 vuln?)

// dark- similar mechanic, used "poison" instead of damage. Darkform
// activates poison after evokes
//  =>

// plasma- similar, but maybe remove? or switch to card draw?
// channel- lose 1 energy and draw 1 card
// passive- draw one card
// evoke- gain 2 energy

// frost- similar
// on evoke, apply 1 weak? or gain 1 thorns?

// focus orb thingy (channel- gain 2 focus, evoke lose 1 focus and gain 1 orb slot)

// block cards can't evoke, channel, or remove orb slots due to
// evoked orbs requiring a target, so I need to be creative on the
// defensive side...

// 5 block, trigger all dark passives
// 5 block, evoke orb at each foe
// gain 3 block per channeled orb
// consume an orb slot, deal 13 damage

// recursion
// zap
// double-cast => multicast
// fusion
// impulse (trigger all passives once)
//
//

let prometheus = new Character(
  'Prometheus',
  true,
  '#2b990a',
  'A recently discovered entity emergent from the complexity of the global network. Capable of completing complicated tasks using computing primitives in novel ways, and therefore a subject of much study. Unsettlingly, also seems capable of some agency.',
)

prometheus.addCard(D, Daemon)

prometheus.addCard(C, MarkForDeath)

CardLibrary.register(prometheus)
