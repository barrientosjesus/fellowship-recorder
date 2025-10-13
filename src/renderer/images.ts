import { WoWCharacterClassType } from 'main/constants';

import spec0 from '../../assets/specs/0.png';
import spec103 from '../../assets/specs/103.png';
import spec105 from '../../assets/specs/105.png';
import spec1468 from '../../assets/specs/1468.png';
import spec250 from '../../assets/specs/250.png';
import spec252 from '../../assets/specs/252.png';
import spec254 from '../../assets/specs/254.png';
import spec256 from '../../assets/specs/256.png';
import spec258 from '../../assets/specs/258.png';
import spec260 from '../../assets/specs/260.png';
import spec262 from '../../assets/specs/262.png';
import spec264 from '../../assets/specs/264.png';
import spec266 from '../../assets/specs/266.png';
import spec268 from '../../assets/specs/268.png';
import spec270 from '../../assets/specs/270.png';
import spec581 from '../../assets/specs/581.png';
import spec63 from '../../assets/specs/63.png';
import spec65 from '../../assets/specs/65.png';
import spec70 from '../../assets/specs/70.png';
import spec72 from '../../assets/specs/72.png';
import spec102 from '../../assets/specs/102.png';
import spec104 from '../../assets/specs/104.png';
import spec1467 from '../../assets/specs/1467.png';
import spec1473 from '../../assets/specs/1473.png';
import spec251 from '../../assets/specs/251.png';
import spec253 from '../../assets/specs/253.png';
import spec255 from '../../assets/specs/255.png';
import spec257 from '../../assets/specs/257.png';
import spec259 from '../../assets/specs/259.png';
import spec261 from '../../assets/specs/261.png';
import spec263 from '../../assets/specs/263.png';
import spec265 from '../../assets/specs/265.png';
import spec267 from '../../assets/specs/267.png';
import spec269 from '../../assets/specs/269.png';
import spec577 from '../../assets/specs/577.png';
import spec62 from '../../assets/specs/62.png';
import spec64 from '../../assets/specs/64.png';
import spec66 from '../../assets/specs/66.png';
import spec71 from '../../assets/specs/71.png';
import spec73 from '../../assets/specs/73.png';

import deathknight from '../../assets/class/deathknight.png';
import druid from '../../assets/class/druid.png';
import hunter from '../../assets/class/hunter.png';
import mage from '../../assets/class/mage.png';
import monk from '../../assets/class/monk.png';
import paladin from '../../assets/class/paladin.png';
import priest from '../../assets/class/priest.png';
import rogue from '../../assets/class/rogue.png';
import shaman from '../../assets/class/shaman.png';
import warlock from '../../assets/class/warlock.png';
import warrior from '../../assets/class/warrior.png';
import evoker from '../../assets/class/evoker.png';
import demonhunter from '../../assets/class/demonhunter.png';

import { HeroType } from 'main/constants';

import TankIcon from '../../assets/roles/tank.png';
import HealerIcon from '../../assets/roles/healer.png';
import DamageIcon from '../../assets/roles/damage.png';

import affix2 from '../../assets/affixes/2.png';
import affix3 from '../../assets/affixes/3.png';
import affix4 from '../../assets/affixes/4.png';
import affix5 from '../../assets/affixes/5.png';
import affix6 from '../../assets/affixes/6.png';
import affix8 from '../../assets/affixes/8.png';
import affix9 from '../../assets/affixes/9.png';
import affix10 from '../../assets/affixes/10.png';
import affix11 from '../../assets/affixes/11.png';
import affix12 from '../../assets/affixes/12.png';
import affix13 from '../../assets/affixes/13.png';
import affix14 from '../../assets/affixes/14.png';
import affix15 from '../../assets/affixes/15.png';
import affix16 from '../../assets/affixes/16.png';
import affix19 from '../../assets/affixes/19.png';

import ardeos from '../../assets/heroes/7.jpg';
import elarion from '../../assets/heroes/2.jpg';
import gunde from '../../assets/heroes/9.jpg';
import helena from '../../assets/heroes/22.jpg';
import mara from '../../assets/heroes/11.jpg';
import meiko from '../../assets/heroes/13.jpg';
import rime from '../../assets/heroes/17.jpg';
import sylvie from '../../assets/heroes/14.jpg';
import tariq from '../../assets/heroes/10.jpg';
import vigour from '../../assets/heroes/20.jpg';

import demonicritual from '../../assets/dungeons/5.png';
import desertdunes from '../../assets/dungeons/6.png';
import frozenkingdom from '../../assets/dungeons/7.png';
import icecave from '../../assets/dungeons/8.png';
import mysticforest from '../../assets/dungeons/11.png';
import nightpatrol from '../../assets/dungeons/12.png';
import pirateraid from '../../assets/dungeons/13.png';
import shipgraveyard from '../../assets/dungeons/15.png';
import urrakmarkets from '../../assets/dungeons/21.png';
import vikingvillage from '../../assets/dungeons/23.png';
import spiderforest from '../../assets/dungeons/24.png';
import crystalmines from '../../assets/dungeons/25.png';

import contender from '../../assets/leagues/contender.png';
import adept from '../../assets/leagues/adept.png';
import champion from '../../assets/leagues/champion.png';
import paragon from '../../assets/leagues/paragon.png';
import eternal from '../../assets/leagues/eternal.png';

const roleImages = {
  tank: TankIcon,
  healer: HealerIcon,
  damage: DamageIcon,
};

const affixImages = {
  2: affix2,
  3: affix3,
  4: affix4,
  5: affix5,
  6: affix6,
  8: affix8,
  9: affix9,
  10: affix10,
  11: affix11,
  12: affix12,
  13: affix13,
  14: affix14,
  15: affix15,
  16: affix16,
  19: affix19,
};

const dungeonImages = {
  5: demonicritual,
  6: desertdunes,
  7: frozenkingdom,
  8: icecave,
  11: mysticforest,
  12: nightpatrol,
  13: pirateraid,
  15: shipgraveyard,
  21: urrakmarkets,
  23: vikingvillage,
  24: spiderforest,
  25: crystalmines,
};

const leagueImages = {
  CONTENDER: contender,
  ADEPT: adept,
  CHAMPION: champion,
  PARAGON: paragon,
  ETERNAL: eternal,
}

const heroImages: Record<HeroType, string> = {
  ARDEOS: ardeos,
  ELARION: elarion,
  HELENA: helena,
  MARA: mara,
  MEIKO: meiko,
  RIME: rime,
  SYLVIE: sylvie,
  TARIQ: tariq,
  VIGOUR: vigour,
};

const specImages = {
  0: spec0,
  103: spec103,
  105: spec105,
  1468: spec1468,
  250: spec250,
  252: spec252,
  254: spec254,
  256: spec256,
  258: spec258,
  260: spec260,
  262: spec262,
  264: spec264,
  266: spec266,
  268: spec268,
  270: spec270,
  581: spec581,
  63: spec63,
  65: spec65,
  70: spec70,
  72: spec72,
  102: spec102,
  104: spec104,
  1467: spec1467,
  1473: spec1473,
  251: spec251,
  253: spec253,
  255: spec255,
  257: spec257,
  259: spec259,
  261: spec261,
  263: spec263,
  265: spec265,
  267: spec267,
  269: spec269,
  577: spec577,
  62: spec62,
  64: spec64,
  66: spec66,
  71: spec71,
  73: spec73,
};

const classImages: Record<WoWCharacterClassType, string> = {
  DEATHKNIGHT: deathknight,
  DRUID: druid,
  HUNTER: hunter,
  MAGE: mage,
  MONK: monk,
  PALADIN: paladin,
  PRIEST: priest,
  ROGUE: rogue,
  SHAMAN: shaman,
  WARLOCK: warlock,
  WARRIOR: warrior,
  EVOKER: evoker,
  DEMONHUNTER: demonhunter,
  UNKNOWN: spec0,
};

export { roleImages, specImages, affixImages, classImages, heroImages, dungeonImages, leagueImages };
