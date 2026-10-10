require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder
} = require('discord.js');
const path = require('path');

const config = {
  guildId: process.env.GUILD_ID || '',
  ticketChannelId: process.env.TICKET_CHANNEL_ID || '',
  embedColor: process.env.EMBED_COLOR || '#00cfff'
};

if (!process.env.DISCORD_TOKEN) {
  console.error('Missing DISCORD_TOKEN in .env');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const PREFIX = '!';
const TICKET_URL = 'https://discord.com/channels/1554939641507872778/1554959741724131348';

const categories = {
  armor: {
  "title": "💠 Armor",
  "products": [
    [
      "Primitive Tek Suit [300 Dura]",
      "1x Full set = $2.79\n6x Full sets = $13.99",
      "You need Tek engrams to use Tek suits."
    ],
    [
      "Decent Tek Suit [300–1000 Dura]",
      "1x Full set = $6.29\n6x Full sets = $31.49",
      "**OUT OF STOCK**\n\nYou need Tek engrams to use Tek suits."
    ],
    [
      "Capped Tek Suit [1000–1500 Dura]",
      "1x Full set = $10.49\n6x Full sets = $52.49",
      "**OUT OF STOCK**\n\nYou need Tek engrams to use Tek suits."
    ],
    [
      "Cursed Capped Tek Suit [1949 Dura]",
      "1x Full set = $12.25\n6x Full sets = $66.49",
      "**OUT OF STOCK**\n\nYou need Tek engrams to use Tek suits."
    ],
    [
      "Flak Sets",
      "1x Set = $0.35\n6x Sets = $1.75\n30x Sets = $6.99\n70x Sets [1 full vault] = $13.99\n140x Sets [2 full vaults] = $24.49\n280x Sets [3 full vaults] = $34.99\n420x Sets [4 full vaults] = $45.49\n560x Sets [5 full vaults] = $52.49",
      "All Flak has 1000+ durability."
    ]
  ]
},
  pvpkit: {
  "title": "💠 PvP Kit",
  "products": [
    [
      "Cap 298% dmg Fabricated Sniper",
      "1 = $0.62\n6 = $3.14\n12 = $4.89\n25 = $7.87\n50 = $12.59\n100 = $22.39\n200 = $39.89\n350 = $62.99",
      ""
    ],
    [
      "Ammo for Fabricated Sniper Rifle",
      "100 = $0.62\n1000 = $3.14\n10000 = $15.74\n20000 = $27.99\n30000 = $38.49",
      ""
    ],
    [
      "Cap 298% dmg Shotgun",
      "1 = $0.62\n6 = $3.14\n12 = $4.89\n25 = $7.87\n50 = $12.59\n100 = $22.39\n200 = $39.89\n350 = $62.99",
      ""
    ],
    [
      "Ammo for Shotgun",
      "100 = $0.62\n1000 = $3.14\n10000 = $15.74\n20000 = $27.99\n30000 = $38.49",
      ""
    ],
    [
      "Cap 298% dmg Compound Bow",
      "1 = $0.62\n6 = $3.14\n12 = $4.89\n25 = $7.87\n50 = $12.59\n100 = $22.39\n200 = $39.89\n350 = $62.99",
      ""
    ],
    [
      "Ammo for Compound Bow",
      "100 = $0.62\n1000 = $3.14\n10000 = $15.74\n20000 = $27.99\n30000 = $38.49",
      ""
    ],
    [
      "Cap 298% dmg Crossbow",
      "1 = $0.62\n6 = $3.14\n12 = $4.89\n25 = $7.69\n50 = $12.59\n100 = $22.39",
      ""
    ],
    [
      "Ammo for Crossbow [Grappling Hook]",
      "100 = $0.62\n1000 = $3.14\n10000 = $15.74\n20000 = $27.99\n30000 = $38.49",
      ""
    ],
    [
      "Ammo for Crossbow [Tranq Arrow]",
      "100 = $0.34\n1000 = $2.44",
      ""
    ],
    [
      "Best 229%+ dmg Whip [243+Dura]",
      "1 = $0.34\n6 = $1.39\n12 = $2.09\n25 = $3.14\n50 = $5.59\n100 = $9.79\n200 = $16.79\n350 = $27.99",
      ""
    ],
    [
      "Cap 298% dmg Hatchet",
      "1 = $0.34\n6 = $1.39\n12 = $2.09\n25 = $3.14\n50 = $5.59\n100 = $9.79",
      ""
    ],
    [
      "Cap 298% dmg Metal Sword",
      "1 = $1.39\n6 = $6.99",
      ""
    ],
    [
      "Cap 298% dmg Chainsaw",
      "1 = $1.39\n6 = $6.99",
      ""
    ],
    [
      "Cap 159% dmg Tek Rifle",
      "1 = $3.14\n6 = $16.79",
      ""
    ],
    [
      "Primitive 100% dmg Tek Rifle",
      "1 = $0.90\n6 = $4.89",
      ""
    ],
    [
      "Primitive Tek Sword",
      "1 = $0.90\n6 = $4.89",
      ""
    ],
    [
      "Capped Tek Sword",
      "1 = $3.14\n6 = $16.79",
      ""
    ],
    [
      "Tek Shields",
      "1 = $0.62\n6 = $3.14",
      ""
    ],
    [
      "Best Tek Shields",
      "1 = $3.14\n6 = $16.79",
      ""
    ],
    [
      "Best Riot Shields",
      "1 = $0.62\n10 = $3.49\n25 = $7.69\n50 = $12.59\n100 = $20.99\n300 = $48.99",
      ""
    ],
    [
      "Primitive Tek Grenade Launcher",
      "1 = $0.90\n6 = $4.89\n12 = $9.09\n25 = $17.49\n50 = $31.49\n100 = $55.99",
      ""
    ],
    [
      "Primitive 100% dmg Flamethrower",
      "1 = $0.62\n6 = $3.14\n12 = $4.89\n25 = $7.69\n50 = $12.59\n100 = $18.89",
      ""
    ],
    [
      "Ammo for Flamethrower",
      "10 = $0.62\n90 = $3.14\n270 = $6.29\n500 = $10.49",
      ""
    ],
    [
      "C4 Detonator",
      "1 = $0.12\n6 = $0.62\n12 = $1.04\n25 = $1.74\n50 = $2.79\n100 = $4.89\n200 = $8.39\n350 = $12.59",
      ""
    ],
    [
      "C4 Charges",
      "100 = $0.62\n1000 = $4.68\n10000 = $25.19\n20000 = $45.49\n30000 = $62.99",
      ""
    ],
    [
      "Rocket Launcher",
      "1 = $0.12\n6 = $0.62\n12 = $1.04\n25 = $1.74\n50 = $2.79\n100 = $4.89\n200 = $8.39\n350 = $12.59",
      ""
    ],
    [
      "Rockets",
      "100 = $0.62\n1000 = $4.68\n10000 = $25.19\n20000 = $45.49\n30000 = $62.99",
      ""
    ],
    [
      "Tek Grenades",
      "1 Slot = $0.62\n10 Slots = $4.68\n25 Slots = $9.79\n50 Slots = $16.09\n100 Slots = $25.19",
      ""
    ],
    [
      "Tek Gravity Grenades",
      "1 Slot = $0.53\n10 Slots = $3.98\n25 Slots = $8.32\n50 Slots = $13.64\n100 Slots = $21.34",
      ""
    ],
    [
      "Gamma Weapons Kit",
      "1 Kit = $8.92",
      "x2 Cap 298% dmg Fabricated Sniper Rifle + 200 Ammo\nx2 Cap 298% dmg Shotgun + 200 Ammo\nx2 Cap 298% dmg Compound Bow + 200 Ammo\nx2 Primitive 100% dmg Flamethrower + 10 Ammo\nx2 Cap 298% dmg Crossbow + 100 Grappling Hooks\nx2 Best 229%+ dmg Whip [243+Dura]\nx2 Cap 298% dmg Hatchet\nx2 C4 Detonator + 100 C4\nx2 Rocket Launcher + 40 Rockets"
    ],
    [
      "Beta Weapons Kit",
      "1 Kit = $35.69",
      "x12 Cap 298% dmg Fabricated Sniper Rifle + 1200 Ammo\nx12 Cap 298% dmg Shotgun + 1200 Ammo\nx12 Cap 298% dmg Compound Bow + 1200 Ammo\nx12 Primitive 100% dmg Flamethrower + 60 Ammo\nx12 Cap 298% dmg Crossbow + 600 Grappling Hooks\nx12 Best 229%+ dmg Whip [243+Dura]\nx12 Cap 298% dmg Hatchet\nx12 C4 Detonator + 1200 C4\nx12 Rocket Launcher + 240 Rockets"
    ],
    [
      "Alpha Weapons Kit [Full Vault]",
      "1 Kit = $89.24",
      "x50 Cap 298% dmg Fabricated Sniper Rifle + 5000 Ammo\nx50 Cap 298% dmg Shotgun + 5000 Ammo\nx50 Cap 298% dmg Compound Bow + 5000 Ammo\nx50 Primitive 100% dmg Flamethrower + 100 Ammo\nx50 Cap 298% dmg Crossbow + 2500 Grappling Hooks\nx50 Best 229%+ dmg Whip [243+Dura]\nx50 Cap 298% dmg Hatchet\nx50 C4 Detonator + 5000 C4\nx50 Rocket Launcher + 1000 Rockets"
    ]
  ]
},
  pvp: {
    title: '💠 PvP Dinos',
    products: [
            ['Cap Unicorn', 'Male or Female $3.99\nPair $6.39', '48 HP • 50+230 DMG'],
      ['Cap Carcharodontosaurus', 'Male or Female $6.00\nPair $10.00', '51 HP • 51+254 DMG'],
      ['Cap Therizinosaur', 'Male or Female $3.99\nPair $6.39', '53+42 HP • 59+230 DMG'],
      ['Cap Thylacoleo', 'Male or Female $3.99\nPair $6.39', '54+254 HP'],
      ['Cap Rexs', 'Male or Female $3.99\nPair $6.39', '61+80 HP • 56+192 DMG'],
      ['Cap Pyromanes', 'Male or Female $3.99\nPair $6.39', '52+16 HP • 53+200 DMG'],
      ['Cap Basilisk', 'Male or Female $3.99\nPair $6.39', '58+40 HP • 62+192 DMG'],
      ['Cap Dreadmare', 'Male or Female $3.99\nPair $6.39', '50+200 HP • 50+38 Weight'],
      ['Cap Aber Megalosaurus', 'Male or Female $3.99\nPair $6.39', '52+70 HP • 53+73 DMG'],
      ['Cap Aber Carnotaurus', 'Male or Female $3.99\nPair $6.39', '45+200 HP'],
      ['Cap Aberrant Spino', 'Male or Female $3.99\nPair $6.39', '54+24 HP • 48+124 DMG'],
      ['Cap Velonasaurs', 'Male or Female $3.99\nPair $6.39', '49 HP • 44 STAM • 58+232 DMG'],
      ['Cap Managarmrs', 'Male or Female $3.99\nPair $6.39', '55+0 HP • 54+20 STAM • 55+200 DMG'],
      ['Karkinos', 'Male or Female $3.99\nPair $6.39', '62+100 HP'],
      ['Ossidon', 'Male or Female $3.99\nPair $6.39', '49+60 HP • 49+60 DMG'],
      ['Cap Wyverns', 'Male or Female $6.00\nPair $10.00', 'Fire Wyvern: 48+150 HP • 41 STAM • 46+12 DMG\n\nPoison Wyvern: 43+94 HP • 41 STAM • 44+156 DMG\n\nLightning Wyvern: 56+62 HP • 45 STAM • 51+136 DMG\n\nAggro Lightning Wyvern: 56+74 HP • 51+208 DMG'],
    ]
  },

  water: {
    title: '💠 Water Dinos',
    products: [
      ['Plesiosaur', 'Male or Female $3.99\nPair $6.39', '62+130 HP'],
      ['Shastasaurus', 'Male or Female $6.00\nPair $10.00', '51+254 HP Clone\n58+88 HP'],
      ['Cap Xiphactinus [387 LvL]', 'Male or Female $3.99\nPair $6.39', '24390 Health • 839% Damage'],
      ['Cap Basilosaurus', 'Male or Female $3.99\nPair $6.39', '69+254 HP'],
      ['Cap Megalodon', 'Male or Female $3.99\nPair $6.39', '68+254 HP'],
      ['Cap Baryonyx [364 LvL]', 'Male or Female $3.99\nPair $6.39', '65+254 HP'],
      ['Cap Tuso [376 LvL]', 'Male or Female $6.00\nPair $10.00', '62+38 HP • 69+186 DMG'],
      ['Cap Deinosuchus', 'Male or Female $3.99\nPair $6.39', '55+22 HP • 65+218 DMG'],
    ]
  },

  flyers: {
    title: '💠 Flyers',
    products: [
      ['Cap Quetzal [378 LvL]', 'Male or Female $6.00\nPair $10.00', '63240 Health • 305 pts'],
      ['Cap Tapejara', 'Male or Female $3.99\nPair $6.39', '53+254 HP'],
      ['Cap Pteranodons', 'Male or Female $2.39\nPair $3.99', '2 variants available'],
      ['Cap Wyverns', 'Male or Female $6.00\nPair $10.00', 'Fire Wyvern: 48+150 HP • 41 STAM • 46+12 DMG\n\nPoison Wyvern: 43+94 HP • 41 STAM • 44+156 DMG\n\nLightning Wyvern: 56+62 HP • 45 STAM • 51+136 DMG\n\nAggro Lightning Wyvern: 56+74 HP • 51+208 DMG'],
      ['Cap Griffins', 'Male or Female $3.99\nPair $6.39', '45+40 HP • 54+152 DMG'],
      ['Cap Desmodus', 'Male or Female $3.99\nPair $6.39', 'V1: 53+254 HP • V2: 53+50 HP / 62+142 DMG'],
      ['Gigadesmodus', 'Male or Female $6.00\nPair $10.00', '14585 • 429%'],
      ['Aureliax', 'Male or Female $3.99\nPair $6.39', '42160 Health'],
      ['Argentavis', 'Male or Female $2.39\nPair $3.99', '49+20 HP • 49+14 STAM • 59+14 Weight • 58+16 DMG']
    ]
  },

  farm: {
    title: '💠 Farm Dinos',
    products: [
      ['Cap Mantis', 'Male or Female $2.39\nPair $3.99', '54 HP • 52+202 DMG'],
      ['Cap Ankylosaurus', 'Male or Female $2.39\nPair $3.99', '51+254 DMG'],
      ['Karkinos', 'Male or Female $3.99\nPair $6.39', '62+100 HP'],
      ['Cap Ovis', 'Male or Female $2.39\nPair $3.99', '51+254 HP'],
      ['Gachas', 'Male or Female $2.39\nPair $3.99', 'Multiple variants available'],
    ]
  },

  support: {
    title: '💠 Supports',
    products: [
      ['Reaper', '1 clone $3.99\n6 clones $7.99\n20 clones $23.99', '59 HP • 36 DMG'],
      ['Maeguana', 'Male or Female $2.39\nPair $3.99', '64+26 HP • 62+102 Food'],
      ['Gloon', 'Male or Female $3.99\nPair $6.39', '44 HP • 51+200 DMG'],
      ['Cap Yutyrannus [384 LvL]', 'Male or Female $3.99\nPair $6.39', '58+254 HP'],
      ['Cap Yi Ling [389 LvL]', 'Male or Female $3.99\nPair $6.39', '51+254 HP'],
      ['Cap Arthropluera', 'Male or Female $3.99\nPair $6.39', '62+254 DMG'],
      ['Cap Veilwyn', 'Male or Female $3.99\nPair $6.39', '57+96 HP • 52+118 DMG'],
      ['Cap Deinonychus', 'Male or Female $3.99\nPair $6.39', '34+254 HP • 36+28 DMG'],
      ['Cap Daeodon', 'Male or Female $3.99\nPair $6.39', '61+254 Food'],
      ['Cap Terror Bird', 'Male or Female $2.39\nPair $3.99', '53+254 HP'],
      ['Cap Drakeling', 'Male or Female $3.99\nPair $6.39', '55+102 HP'],
      ['Tideup', 'Male or Female $3.19\nPair $5.59', '43 Food'],
    ]
  },

  soakers: {
    title: '💠 Soakers',
    products: [
      ['Cap Carbonemys', 'Male or Female $2.39\nPair $3.99', '40950 Health [66+254=320p]'],
      ['Cap Stegosaurus', 'Male or Female $3.99\nPair $6.39', '63+254 HP'],
      ['Cap Paraceratherium', 'Male or Female $3.99\nPair $6.39', '60+254 HP'],
      ['Cap Gasbags', 'Male or Female $3.99\nPair $6.39', '32370 Health [50+194=244p]\n9550 Oxygen [41+54=95p]\n3060 Stamina [41p]'],
      ['Dreadnoughtus', 'Male or Female $6.00\nPair $10.00', 'V1: 50+254 HP\n\nV2: 50+152 HP • 51+124 DMG']
    ]
  },
    mix: {
    title: '💠 Mix / Random',
    products: [
      ['Dung Beetle [Random LvL]', '1x $1.59'],
      ['Achatina [Random LvL]', '1x $1.59'],
      ['Giant Bee [Random LvL]', '1x $1.59'],
      ['Iguanodon [Random LvL]', '1x $1.59'],
      ['Beelzebufo [Random LvL]', '1x $1.59'],
      ['Diplocaulus [Random LvL]', '1x $1.59'],
      ['Armadoggo [Random LvL]', '1x $1.59'],
      ['Mammoth [Random LvL]', '1x $1.59'],
      ['Otter [Random LvL]', '1x $1.59'],
      ['Gachas', 'Male or Female $2.39\nPair $3.99', 'Multiple variants available'],
      ['Maeguana', 'Male or Female $2.39\nPair $3.99', '64+26 HP • 62+102 Food'],
      ['Oviraptor [338 LvL]', 'Male or Female $2.39\nPair $3.99', '262 Weight'],
      ['Pegomastax [343 LvL]', 'Male or Female $2.39\nPair $3.99', '139 Weight'],
      ['Procoptodon', 'Male or Female $2.39\nPair $3.99', '1199 Weight'],
      ['Pelagornis', 'Male or Female $2.39\nPair $3.99', '475% Damage'],
      ['Dunkleosteus', 'Male or Female $2.39\nPair $3.99', '2 variants available'],
      ['Anglerfish', 'Male or Female $2.39\nPair $3.99', '851% Damage'],
      ['Fasolasuchus', 'Male or Female $2.39\nPair $3.99', '972 Weight • 425% Damage'],
      ['Doedicurus', 'Male or Female $2.39\nPair $3.99', '704% Damage'],
      ['Deinotherium', 'Male or Female $2.39\nPair $3.99', '16450 Health']
    ]
  },

  eggs: {
    title: '💠 Eggs & Embryos',
    products: [
      ['Eggs — 30', '30 Eggs $5.99', '3x Different dinos'],
      ['Eggs — 50', '50 Eggs $7.99', '5x Different dinos'],
      ['Eggs — 100', '100 Eggs $10.00', '10x Different dinos'],
      ['Eggs — 200', '200 Eggs $20.00', '20x Different dinos'],
      ['Eggs — 300', '300 Eggs $30.00', '30x Different dinos'],
      ['Embryos — 10', '10 Embryos $11.25', '1x Dino'],
      ['Embryos — 30', '30 Embryos $26.25', '3x Different dinos'],
      ['Embryos — 50', '50 Embryos $37.50', '5x Different dinos'],
      ['Embryos — 100', '100 Embryos $15.00', '10x Different dinos'],
      ['Embryos — 200', '200 Embryos $30.00', '20x Different dinos'],
      ['Embryos — 300', '300 Embryos $40.00', '30x Different dinos']
    ]
  },

  cloners: {
    title: '💠 Cloners',
    products: [
      ['Phoenix', '1 clone $3.99\n6 clones $14.00\n20 clones $39.99', '6 LvL • Purple'],
      ['Karkinos', '1 clone $3.99\n6 clones $7.99\n20 clones $23.99', '1 LvL'],
      ['Reaper', '1 clone $3.99\n6 clones $7.99\n20 clones $23.99', '3 LvL'],
      ['Tek Giga Female', '1 clone $3.99\n6 clones $7.99\n20 clones $23.99', '1 LvL']
    ]
  },

  ffa: {
    title: '💠 FFA Cryofridges',
    products: [
      ['Fridges of Flyers', 'Pteras $27.99\nTapejaras $31.99\nQuetzals $39.99\nWyverns $35.99\nSnow Owl $27.99\nGriffin $31.99\nDesmodus $31.99', 'Top Stats'],
      ['Fridges of DPS', 'Gigas $47.99\nCarchas $47.99\nTherizino $27.99\nThyla $35.99\nRex $27.99\nPyro $27.99\nBasilisk $31.99\nMegalos $27.99\nCarno $27.99\nSpino $35.99\nMana $39.99\nKarki $43.99', 'Top Stats'],
      ['Fridges of Supports', 'Yuty $43.99\nYi Ling $19.99\nDaeodon $39.99\nArthro $31.99\nDimorph $27.99\nDeinonychus $27.99\nBeelzebufo $27.99\nOvis $23.99', 'Top Stats'],
      ['Fridges of Waters', 'Plesio $43.99\nShasta $71.99\nXipha $23.99\nBasilo $35.99\nMegalodon $35.99\nBary $31.99\nTuso $39.99', 'Top Stats'],
      ['Fridges of Soakers', 'Carbo $19.99\nStego $23.99\nParacer $35.99\nDread $47.99', 'Top Stats'],
      ['Fridges of Mixs', 'Random $39.99', 'Top Stats'],
      ['Small Dinos', '1x FFA $0.79\n12x FFAs $4.79\n36x FFAs $10.00', '1 imprint during the event'],
      ['Large Dinos', '1x FFA $1.59\n12x FFAs $11.99\n36x FFAs $19.60', '2–3 imprints during the event']
    ]
  },


  soon: {
    title: '⏳ Soon',
    products: [
      ['Create ticket for price list', '', '']
    ]
  },
  resources: {
    title: '💠 Resources',
    products: [
      [' Blue | Green Gems ', '30000 [300 slots] $3.19\n180000 [1800 slots] $7.99', ''],
      [' Sulfur ', '10000 [100 slots] $3.19\n30000 [300 slots] $7.19', ''],
      [' Chitin ', '180000 [1800 slots] $2.39', ''],
      [' Silk ', '10000 [100 slots] $2.39\n30000 [300 slots] $7.19', ''],
      [' Oil ', '30000 [300 slots] $3.19\n180000 [1800 slots] $11.19', ''],
      [' Sap ', '3000 [100 slots] $1.59\n9000 [300 slots] $3.99', ''],
      [' Hide ', '60000 [300 slots] $1.59\n360000 [1800 slots] $3.99', ''],
      [' Silica Pearls ', '30000 [300 slots] $1.59\n180000 [1800 slots] $5.59', ''],
      [' Electronics ', '30000 [300 slots] $3.99\n180000 [1800 slots] $15.99', ''],
      [' Crystal ', '30000 [300 slots] $1.59\n180000 [1800 slots] $4.79', ''],
      [' Cementing Paste ', '30000 [300 slots] $2.39\n180000 [1800 slots] $7.99', ''],
      [' Black Pearls ', '60000 [300 slots] $3.99\n360000 [1800 slots] $15.99', ''],
      [' Hard Polymer ', '30000 [300 slots] $3.99\n180000 [1800 slots] $11.99', ''],
      [' Metal Ingots ', '90000 [300 slots] $1.59\n540000 [1800 slots] $7.99', '']
    ]
  },

  structures: {
    title: '💠 Structures',
    products: [
      [' Metal Foundations ', '100x = $2.07', ''],
      [' Metal Walls ', '100x = $1.03', ''],
      [' Metal Ceilings ', '100x = $1.55', ''],
      [' Metal Triangle Foundations ', '100x = $1.03', ''],
      [' Metal Pilars ', '100x = $1.03', ''],
      [' Metal Gateways ', '100x = $5.19', ''],
      [' Metal Cliff Platforms ', '3x = $1.86', ''],
      [' Industrial Forges ', '1x = $0.51', ''],
      [' Chemistry Benchs ', '1x = $0.51', ''],
      [' Industrial Cookers ', '1x = $0.51', ''],
      [' Industrial Grinders ', '1x = $0.51', ''],
      [' Industrial Grills ', '1x = $0.10', ''],
      [' Refrigerators ', '1x = $0.10', ''],
      [' Vaults ', '1x = $0.26', ''],
      [' Air Conditioners ', '1x = $0.09', ''],
      [' Electrical Generators ', '1x = $0.09', ''],
      [' Cryofridges ', '1x = $0.09', ''],
      [' Motorboats ', '1x = $1.55', ''],
      [' Zeppelins ', '1x = $0.72', ''],
      [' Clockfaces ', '1x = $0.72', ''],
      [' Linked Storage Boxs ', '1x = $0.72', ''],
      [' Steam Forges ', '1x = $1.55', ''],
      [' Makeshift Megalab ', '1x = $0.72', ''],
      [' Embryo Incubators ', '1x = $0.72', ''],
      [' Sir5RM8 ', '1x = $1.03', ''],
      [' Gene Scanners ', '1x = $0.72', ''],
      [' Gene Storages ', '1x = $0.72', ''],
      [' Industrial Preserving Bins ', '1x = $0.72', ''],
      [' Tinkering Desks ', '1x = $0.72', ''],
      [' Bio Grinder ', '1x = $0.72', ''],
      [' Library Storage ', '1x = $0.72', ''],
      [' Battlerig Garage ', '1x = $0.72', '']
    ]
  },

  tekstructures: {
    title: '💠 Tek Structures',
    products: [
      [' Tek Foundations ', '100x = $1.59'],
      [' Tek Walls ', '100x = $0.79'],
      [' Tek Ceilings ', '100x = $1.19'],
      [' Tek Triangle Foundations ', '100x = $0.79'],
      [' Tek Pillars ', '100x = $0.79'],
      [' Tek Gateways ', '100x = $3.99'],
      [' Vacuum Compartments ', '5x = $1.59'],
      [' Tek Troughs ', '1x = $1.19'],
      [' Small Tek Teleporters ', '1x = $1.19'],
      [' Medium Tek Teleporters ', '1x = $1.99'],
      [' Large Tek Teleporters ', '1x = $3.59'],
      [' Tek Generators ', '1x = $1.99'],
      [' Tek Replicators ', '1x = $3.59'],
      [' Tek Transmiters ', '1x = $2.79'],
      [' Tek Forcefields ', '1x = $3.59'],
      [' Cloning Chambers ', '1x = $3.59'],
      [' Tek Dedicated Storages ', '10x = $0.79'],
      [' Tek Sleeping Pods ', '1x = $0.15'],
      [' Behemoth Tek Cellar Doors ', '100x = $2.39'],
      [' Tek Crop Plots ', '10x = $0.79'],
      [' Tek Sensor ', '1x = $0.39'],
      [' Tek Hover Skiff ', '1x = $3.99'],
      [' Tek Jump Pad ', '1x = $0.39']
    ]
  },

  turrets: {
    title: '💠 Turrets',
    products: [
      [' Auto Turrets ', '1x = $0.15\n10x = $1.19\n100x = $7.99\n300x = $19.99'],
      [' Bladewasp Hive Turrets ', '1x = $0.71\n10x = $6.39\n100x = $55.99\n300x = $143.99'],
      [' Heavy Turrets ', '1x = $0.36\n10x = $3.59\n100x = $10.79\n300x = $28.79'],
      [' Tek Turrets ', '1x = $0.36\n10x = $3.59\n100x = $10.79\n300x = $23.99'],
      [' Tesla Turrets ', '1x = $0.36\n10x = $3.59\n100x = $21.59\n300x = $50.39']
    ]
  },

  breeder: {
    title: '💠 Breeder Packs',
    products: [
      ['Gamma PvP Pack', 'Pair $31.99\nMale only $19.60', 'Carcha or Giga • Thylacoleo • Therizinosaur • Pyromane'],
      ['Beta PvP Pack', 'Pair $47.99\nMale only $30.00', 'Carcha or Giga • Thylacoleo • Basilisk • Velonasaur • Rex • Pyromane • Therizinosaur • Managarmr'],
      ['Alpha PvP Pack', 'Pair $79.99\nMale only $46.39', 'Carcha • Thylacoleo • Basilisk • Velonasaur • Spino • Rex • Pyromane • Therizinosaur • Managarmr • Karkinos • Giga • Woolly Rhino • Aber Megalosaurus • Carnotaurus • Dreadmare']
    ]
  }
};

// Shop emoji names match the uploaded Flex Market PNG filenames.
const SHOP_EMOJIS = {
  armor: {
  "Scuba — Tank + Flippers": "flex_market_scuba",
  "Hazard — Helmet": "flex_market_hazard",
  "Fur": "flex_market_fur",
  "Riot": "flex_market_riot",
  "Ghillie": "flex_market_ghillie",
  "Primitive Tek Suit [300 Dura]": "flex_market_tek_chest",
  "Decent Tek Suit [300–1000 Dura]": "flex_market_tek_chest",
  "Capped Tek Suit [1000–1500 Dura]": "flex_market_tek_chest",
  "Cursed Capped Tek Suit [1949 Dura]": "flex_market_tek_chest",
  "Flak Sets": "flex_market_flak_chest"
},
  pvpkit: {
  "Cap 298% dmg Fabricated Sniper": "flex_market_fabricated_sniper",
  "Ammo for Fabricated Sniper Rifle": "flex_market_sniper_ammo",
  "Cap 298% dmg Shotgun": "flex_market_shotgun",
  "Ammo for Shotgun": "flex_market_shotgun_ammo",
  "Cap 298% dmg Compound Bow": "flex_market_compound_bow",
  "Ammo for Compound Bow": "flex_market_metal_arrow",
  "Cap 298% dmg Crossbow": "flex_market_crossbow",
  "Ammo for Crossbow [Grappling Hook]": "flex_market_grappling_hook",
  "Ammo for Crossbow [Tranq Arrow]": "flex_market_tranq_arrow",
  "Best 229%+ dmg Whip [243+Dura]": "flex_market_whip",
  "Cap 298% dmg Hatchet": "flex_market_hatchet",
  "Cap 298% dmg Metal Sword": "flex_market_metal_sword",
  "Cap 298% dmg Chainsaw": "flex_market_chainsaw",
  "Cap 159% dmg Tek Rifle": "flex_market_tek_rifle",
  "Primitive 100% dmg Tek Rifle": "flex_market_tek_rifle",
  "Primitive Tek Sword": "flex_market_tek_sword",
  "Capped Tek Sword": "flex_market_tek_sword",
  "Tek Shields": "flex_market_tek_shield",
  "Best Tek Shields": "flex_market_tek_shield",
  "Best Riot Shields": "flex_market_riot_shield",
  "Primitive Tek Grenade Launcher": "flex_market_tek_grenade_launcher",
  "Primitive 100% dmg Flamethrower": "flex_market_flamethrower",
  "Ammo for Flamethrower": "flex_market_flamethrower_ammo",
  "C4 Detonator": "flex_market_c4_detonator",
  "C4 Charges": "flex_market_c4",
  "Rocket Launcher": "flex_market_rocket_launcher",
  "Rockets": "flex_market_rocket",
  "Tek Grenades": "flex_market_tek_grenade",
  "Tek Gravity Grenades": "flex_market_tek_gravity_grenade",
  "Gamma Weapons Kit": "flex_market_gamma_weapons_kit",
  "Beta Weapons Kit": "flex_market_beta_weapons_kit",
  "Alpha Weapons Kit [Full Vault]": "flex_market_alpha_weapons_kit"
},
  "resources": {
    "Blue | Green Gems": "flex_market_blue_gem",
    "Sulfur": "flex_market_sulfur",
    "Chitin": "flex_market_chitin",
    "Oil": "flex_market_oil",
    "Sap": "flex_market_sap",
    "Hide": "flex_market_hide",
    "Silica Pearls": "flex_market_silica_pearls",
    "Electronics": "flex_market_electronics",
    "Crystal": "flex_market_crystal",
    "Cementing Paste": "flex_market_cementing_paste",
    "Black Pearls": "flex_market_black_pearls",
    "Hard Polymer": "flex_market_polymer",
    "Metal Ingots": "flex_market_metal_ingot"
  },
  "structures": {
    "Metal Foundations": "flex_market_metal_foundation",
    "Metal Walls": "flex_market_metal_wall",
    "Metal Ceilings": "flex_market_metal_ceiling",
    "Metal Triangle Foundations": "flex_market_metal_tri_foundation",
    "Metal Pilars": "flex_market_metal_pillar",
    "Metal Gateways": "flex_market_metal_gate",
    "Metal Cliff Platforms": "flex_market_metal_cliff",
    "Industrial Forges": "flex_market_ind_forge",
    "Chemistry Benchs": "flex_market_chemistry_bench",
    "Industrial Cookers": "flex_market_ind_cooker",
    "Industrial Grinders": "flex_market_ind_grinder",
    "Industrial Grills": "flex_market_industrial_grill",
    "Refrigerators": "flex_market_refrigerator",
    "Vaults": "flex_market_vault",
    "Air Conditioners": "flex_market_air_conditioner",
    "Electrical Generators": "flex_market_electric_generator",
    "Cryofridges": "flex_market_cryofridge",
    "Motorboats": "flex_market_motorboat",
    "Zeppelins": "flex_market_zeppelin",
    "Linked Storage Boxs": "flex_market_linked_storage",
    "Steam Forges": "flex_market_steam_forge",
    "Makeshift Megalab": "flex_market_makeshift_megalab",
    "Embryo Incubators": "flex_market_embryo_incubator",
    "Sir5RM8": "flex_market_sir_5rm8",
    "Gene Scanners": "flex_market_gene_scanner",
    "Gene Storages": "flex_market_gene_storage",
    "Industrial Preserving Bins": "flex_market_ind_preserving_bin",
    "Tinkering Desks": "flex_market_tinkering_desk"
  },
  "tekstructures": {
    "Tek Foundations": "flex_market_tek_foundation",
    "Tek Walls": "flex_market_tek_wall",
    "Tek Ceilings": "flex_market_tek_ceiling",
    "Tek Triangle Foundations": "flex_market_tek_tri_found",
    "Tek Pillars": "flex_market_tek_pillar",
    "Tek Gateways": "flex_market_tek_gateway",
    "Vacuum Compartments": "flex_market_vacuum_comp",
    "Tek Troughs": "flex_market_tek_trough",
    "Small Tek Teleporters": "flex_market_tek_teleporter",
    "Medium Tek Teleporters": "flex_market_tek_teleporter",
    "Large Tek Teleporters": "flex_market_tek_teleporter",
    "Tek Generators": "flex_market_tek_generator",
    "Tek Replicators": "flex_market_tek_replicator",
    "Tek Transmiters": "flex_market_tek_transmitter",
    "Tek Forcefields": "flex_market_tek_forcefield",
    "Cloning Chambers": "flex_market_cloning_chamber",
    "Tek Dedicated Storages": "flex_market_tek_dedi",
    "Tek Sleeping Pods": "flex_market_tek_sleeping_pod",
    "Behemoth Tek Cellar Doors": "flex_market_tek_cellar",
    "Tek Crop Plots": "flex_market_tek_crop_plot",
    "Tek Sensor": "flex_market_tek_sensor",
    "Tek Hover Skiff": "flex_market_hover_skiff",
    "Tek Jump Pad": "flex_market_tek_jump_pad"
  },
  "turrets": {
    "Auto Turrets": "flex_market_auto_turret",
    "Heavy Turrets": "flex_market_heavy_turret",
    "Tek Turrets": "flex_market_tek_turret"
  },
  "dust": {
    "Dust": "flex_market_element_dust"
  }
};

function getArbEmoji(guild) {
  if (!guild) return "";
  for (const name of ["flex_market_arb", "arb", "ARB", "flex_market_rifle_bullet"]) {
    const emoji = guild.emojis.cache.find(item => item.name === name && item.available !== false);
    if (emoji) return emoji.toString();
  }
  return "";
}

const PVP_KIT_EMOJI_ALIASES = {
  "flex_market_fabricated_sniper": [
    "S_"
  ],
  "flex_market_sniper_ammo": [
    "ASniper"
  ],
  "flex_market_shotgun": [
    "Shotgunk"
  ],
  "flex_market_shotgun_ammo": [
    "AShotgun"
  ],
  "flex_market_compound_bow": [
    "Bow"
  ],
  "flex_market_metal_arrow": [
    "AmmoBow"
  ],
  "flex_market_crossbow": [
    "Crossbow"
  ],
  "flex_market_grappling_hook": [
    "Grapghook"
  ],
  "flex_market_tranq_arrow": [
    "Tranqarrow"
  ],
  "flex_market_whip": [
    "Whip"
  ],
  "flex_market_hatchet": [
    "Hatchet"
  ],
  "flex_market_metal_sword": [
    "MetalSword"
  ],
  "flex_market_chainsaw": [
    "Chainsaw"
  ],
  "flex_market_tek_rifle": [
    "TekRifle"
  ],
  "flex_market_tek_sword": [
    "T_~5"
  ],
  "flex_market_tek_shield": [
    "T_~4"
  ],
  "flex_market_riot_shield": [
    "Shield~1"
  ],
  "flex_market_tek_grenade_launcher": [
    "GrenadeL"
  ],
  "flex_market_flamethrower": [
    "Flamethrower"
  ],
  "flex_market_flamethrower_ammo": [
    "AmmoFlame"
  ],
  "flex_market_c4_detonator": [
    "C4Det"
  ],
  "flex_market_c4": [
    "C4"
  ],
  "flex_market_rocket_launcher": [
    "RocketLau"
  ],
  "flex_market_rocket": [
    "Rockets"
  ],
  "flex_market_tek_grenade": [
    "TekGrenade"
  ],
  "flex_market_tek_gravity_grenade": [
    "TekGravityGrenade"
  ],
  "flex_market_gamma_weapons_kit": [
    "A8_"
  ],
  "flex_market_beta_weapons_kit": [
    "A8_"
  ],
  "flex_market_alpha_weapons_kit": [
    "A8_"
  ]
};

function getShopEmoji(guild, categoryKey, productName) {
  const name = SHOP_EMOJIS[categoryKey]?.[productName.trim()];
  if (!name || !guild) return "";
  const emoji = guild.emojis.cache.find(item => (item.name === name || (PVP_KIT_EMOJI_ALIASES[name] || []).includes(item.name)) && item.available !== false);
  if (emoji) return emoji.toString();
  if (categoryKey === 'armor') {
    return '🛡️';
  }
  return "";
}

const BASE_KITS = [
  {
    "name": "GAMMA BASE KIT",
    "price": "8.40",
    "items": [
      [
        "150x Metal Structures Of Choice (Foundation, Ceiling, Pillar etc.)",
        "structures",
        "Metal Foundations"
      ],
      [
        "3x Generator With 100x Gasoline",
        "structures",
        "Electrical Generators"
      ],
      [
        "15x Heavy Auto Turret",
        "turrets",
        "Heavy Turrets"
      ],
      [
        "12000x ARB",
        "arb",
        ""
      ],
      [
        "2x Refrigerator",
        "structures",
        "Refrigerators"
      ],
      [
        "2x Smithy",
        "",
        ""
      ],
      [
        "2x Industrial Forge",
        "structures",
        "Industrial Forges"
      ],
      [
        "1x Industrial Grill",
        "structures",
        "Industrial Grills"
      ],
      [
        "2x Chemistry Bench",
        "structures",
        "Chemistry Benchs"
      ],
      [
        "1x Embryo Incubator",
        "structures",
        "Embryo Incubators"
      ],
      [
        "1x Egg Incubator",
        "",
        ""
      ],
      [
        "2x Feeding Trough",
        "",
        ""
      ],
      [
        "2x Vault",
        "structures",
        "Vaults"
      ],
      [
        "2x Fabricator",
        "",
        ""
      ],
      [
        "5x Bed",
        "",
        ""
      ],
      [
        "2x Cryofridge",
        "structures",
        "Cryofridges"
      ],
      [
        "3x FFA Dinos Of Your Choice",
        "",
        ""
      ],
      [
        "20x Empty Cryos",
        "",
        ""
      ]
    ]
  },
  {
    "name": "BETA BASE KIT",
    "price": "21.00",
    "items": [
      [
        "350x Metal Structures Of Choice (Foundation, Ceiling, Pillar etc.)",
        "structures",
        "Metal Foundations"
      ],
      [
        "2x Tek Generator",
        "tekstructures",
        "Tek Generators"
      ],
      [
        "2x Small Teleporter",
        "tekstructures",
        "Small Tek Teleporters"
      ],
      [
        "1x Replicator",
        "tekstructures",
        "Tek Replicators"
      ],
      [
        "1x Transmitter",
        "tekstructures",
        "Tek Transmiters"
      ],
      [
        "300,000x Dust",
        "dust",
        "Dust"
      ],
      [
        "2x Generator and 100x Gasoline",
        "structures",
        "Electrical Generators"
      ],
      [
        "20x Dedis",
        "",
        ""
      ],
      [
        "10x Tesla",
        "",
        ""
      ],
      [
        "7,500x Crystal",
        "resources",
        "Crystal"
      ],
      [
        "20x Heavy Auto Turret",
        "turrets",
        "Heavy Turrets"
      ],
      [
        "20,000x ARB",
        "arb",
        ""
      ],
      [
        "20x Tek Turret",
        "turrets",
        "Tek Turrets"
      ],
      [
        "5x Refrigerator",
        "structures",
        "Refrigerators"
      ],
      [
        "1x Embryo Incubator",
        "structures",
        "Embryo Incubators"
      ],
      [
        "1x Egg Incubator",
        "",
        ""
      ],
      [
        "1x Steam Forge",
        "structures",
        "Steam Forges"
      ],
      [
        "3x Industrial Forge",
        "structures",
        "Industrial Forges"
      ],
      [
        "2x Industrial Grill",
        "structures",
        "Industrial Grills"
      ],
      [
        "2x Industrial Cooker",
        "structures",
        "Industrial Cookers"
      ],
      [
        "2x Chemistry Bench",
        "structures",
        "Chemistry Benchs"
      ],
      [
        "2x Makeshift Megalab",
        "structures",
        "Makeshift Megalab"
      ],
      [
        "5x Vault",
        "structures",
        "Vaults"
      ],
      [
        "3x Fabricator",
        "",
        ""
      ],
      [
        "2x Tek Trough",
        "tekstructures",
        "Tek Troughs"
      ],
      [
        "10x Bed",
        "",
        ""
      ],
      [
        "1x Tek Sleeping Pod",
        "tekstructures",
        "Tek Sleeping Pods"
      ],
      [
        "8x Cryofridge",
        "structures",
        "Cryofridges"
      ],
      [
        "8x FFA Dinos",
        "",
        ""
      ],
      [
        "40x Empty Cryopods",
        "",
        ""
      ]
    ]
  },
  {
    "name": "ALPHA BASE KIT",
    "price": "42.00",
    "items": [
      [
        "600x Metal Structures Of Choice (Foundation, Ceiling, Pillar etc.)",
        "structures",
        "Metal Foundations"
      ],
      [
        "6x Tek Generator",
        "tekstructures",
        "Tek Generators"
      ],
      [
        "6x Small Teleporter",
        "tekstructures",
        "Small Tek Teleporters"
      ],
      [
        "2x Replicator",
        "tekstructures",
        "Tek Replicators"
      ],
      [
        "2x Transmitter",
        "tekstructures",
        "Tek Transmiters"
      ],
      [
        "900,000x Dust",
        "dust",
        "Dust"
      ],
      [
        "40x Dedis",
        "",
        ""
      ],
      [
        "25x Tesla",
        "",
        ""
      ],
      [
        "20,000x Crystal",
        "resources",
        "Crystal"
      ],
      [
        "50x Heavy Auto Turret",
        "turrets",
        "Heavy Turrets"
      ],
      [
        "75,000 ARB",
        "arb",
        ""
      ],
      [
        "50x Tek Turret",
        "turrets",
        "Tek Turrets"
      ],
      [
        "10x Refrigerator",
        "structures",
        "Refrigerators"
      ],
      [
        "4x Embryo Incubator",
        "structures",
        "Embryo Incubators"
      ],
      [
        "4x Egg Incubator",
        "",
        ""
      ],
      [
        "4x Steam Forge",
        "structures",
        "Steam Forges"
      ],
      [
        "2x Industrial Forge",
        "structures",
        "Industrial Forges"
      ],
      [
        "6x Industrial Grill",
        "structures",
        "Industrial Grills"
      ],
      [
        "4x Industrial Cooker",
        "structures",
        "Industrial Cookers"
      ],
      [
        "6x Chemistry Bench",
        "structures",
        "Chemistry Benchs"
      ],
      [
        "3x Makeshift Megalab",
        "structures",
        "Makeshift Megalab"
      ],
      [
        "15x Vault",
        "structures",
        "Vaults"
      ],
      [
        "5x Tek Trough",
        "tekstructures",
        "Tek Troughs"
      ],
      [
        "10x Bed",
        "",
        ""
      ],
      [
        "6x Tek Sleeping Pod",
        "tekstructures",
        "Tek Sleeping Pods"
      ],
      [
        "40x Cryofridge",
        "structures",
        "Cryofridges"
      ],
      [
        "15x FFA Dinos Of Your Choice",
        "",
        ""
      ]
    ]
  }
];

async function sendKitImages(message, type) {
  const folder = type === 'base' ? 'base-kits' : 'pvp-kits';
  for (const tier of ['gamma', 'beta', 'alpha']) {
    const filename = `flex_market_${tier}_${type}_kit.png`;
    const image = new AttachmentBuilder(path.join(__dirname, 'assets', folder, filename), { name: filename });
    if (type === 'pvp') {
      const prices = { gamma: '6.99', beta: '17.49', alpha: '31.49' };
      const embed = new EmbedBuilder()
        .setColor(config.embedColor)
        .setAuthor({ name: 'ARK FLEX MARKET' })
        .setTitle(`${tier.toUpperCase()} PvP Kit`)
        .setDescription(`**Price:** ${prices[tier]} 🪙`)
        .setImage(`attachment://${filename}`)
        .setFooter({ text: 'ARK FLEX MARKET' });
      await message.channel.send({ embeds: [embed], files: [image] });
    } else {
      await message.channel.send({ files: [image] });
    }
  }
}

function makeButtonRow() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel('Open ticket')
      .setStyle(ButtonStyle.Link)
      .setURL(TICKET_URL || 'https://discord.com/channels/@me')
  );
}

// ARK creature artwork. We use the ARK Official Community Wiki
// file redirect so Discord receives the actual creature image.
const IMAGE_ALIASES = {
  // ONLY original ARK dossier-book files. No creature-art fallbacks.
  'Tek Giganotosaurus': 'Dossier Giganotosaurus.png',
  'Cap Carcharodontosaurus': 'Dossier Carcharodontosaurus.png',
  'Cap Therizinosaur': 'Dossier Therizinosaur.png',
  'Cap Thylacoleo': 'Dossier Thylacoleo.png',
  'Cap Rexs': 'Dossier Rex.png',
  'Cap Woolly Rhino': 'Dossier Woolly Rhino.png',
  'Chalicotheriums': 'Dossier Chalicotherium.png',
  'Cap Basilisk': 'Dossier Basilisk.png',
  'Cap Aber Megalosaurus': 'Dossier Megalosaurus.png',
  'Cap Aber Carnotaurus': 'Dossier Carnotaurus.png',
  'Cap Aberrant Spino': 'Dossier Spino.png',
  'Megatherium': 'Dossier Megatherium.png',
  'Cap Velonasaurs': 'Dossier Velonasaur.png',
  'Cap Managarmrs': 'Dossier Managarmr.png',
  'Karkinos': 'Dossier Karkinos.png',
  'Deinotherium': 'Dossier Deinotherium.png',
  'Cap Ankylosaurus': 'Dossier Ankylosaurus.png',
  'Cap Beelzebufo': 'Dossier Beelzebufo.png',
  'Cap Mantis': 'Dossier Mantis.png',
  'Phoenix': 'Dossier Phoenix.png',
  'Tek Giga Female': 'Dossier Giganotosaurus.png',
  'Moschops': 'Dossier Moschops.png',
  'Cap Yutyrannus': 'Dossier Yutyrannus.png',
  'Cap Deinonychus': 'Dossier Deinonychus.png',
  'Cap Gigantopithecus': 'Dossier Gigantopithecus.png',
  'Cap Kentrosaurus': 'Dossier Kentrosaurus.png',
  'Cap Terror Bird': 'Dossier Terror Bird.png',
  'Cap Daeodon': 'Dossier Daeodon.png',
  'Dimorphodon': 'Dossier Dimorphodon.png',
  'Oviraptor': 'Dossier Oviraptor.png',
  'Pegomastax': 'Dossier Pegomastax.png',
  'Procoptodon': 'Dossier Procoptodon.png',
  'Pelagornis': 'Dossier Pelagornis.png',
  'Dunkleosteus': 'Dossier Dunkleosteus.png',
  'Iguanodon': 'Dossier Iguanodon.png',
  'Dung Beetle': 'Dossier Dung Beetle.png',
  'Brontosaurus': 'Dossier Brontosaurus.png',
  'Doedicurus': 'Dossier Doedicurus.png',
  'Ovis': 'Dossier Ovis.png',
  'Otter': 'Dossier Otter.png',
  'Mammoth': 'Dossier Mammoth.png',
  'Diplocaulus': 'Dossier Diplocaulus.png',
  'Cap Unicorn': 'Dossier Equus.png',
  'Plesiosaur': 'Dossier Plesiosaur.png',
  'Mosasaurus': 'Dossier Mosasaurus.png',
  'Cap Basilosaurus': 'Dossier Basilosaurus.png',
  'Cap Megalodon': 'Dossier Megalodon.png',
  'Cap Baryonyx': 'Dossier Baryonyx.png',
  'Cap Tuso': 'Dossier Tusoteuthis.png',
  'Cap Quetzal': 'Dossier Quetzal.png',
  'Cap Tapejara': 'Dossier Tapejara.png',
  'Cap Pteranodons': 'Dossier Pteranodon.png',
  'Argentavis': 'Dossier Argentavis.png',
  'Cap Wyverns': 'Dossier Wyvern.png',
  'Cap Snow Owl': 'Dossier Snow Owl.png',
  'Cap Griffins': 'Dossier Griffin.png',
  'Cap Arthropluera': 'Dossier Arthropluera.png',
  'Cap Ovis': 'Dossier Ovis.png',
  'Cap Brontosaurus': 'Dossier Brontosaurus.png',
  'Achatina': 'Dossier Achatina.png',
  'Giant Bee': 'Dossier Giant Bee.png',
  'Beelzebufo': 'Dossier Beelzebufo.png',
  'Armadoggo': 'Dossier Armadoggo.png',
  'Gachas': 'Dossier Gacha.png',
  'Anglerfish': 'Dossier Angler.png',
  'Reaper': 'Dossier Reaper.png',
  'Rock Drake': 'Dossier Rock Drake.png',
  'Yi Ling': 'Dossier Yi Ling.png',
  'Cryolophosaurus': 'Mod ARK Additions Dossier Cryolophosaurus.png',
  'Acrocanthosaurus': 'Mod ARK Additions Dossier Acrocanthosaurus.png',
  'Cap Deinosuchus': 'Mod ARK Additions Dossier Deinosuchus.png',
  'Cap Xiphactinus': 'Mod ARK Additions Dossier Xiphactinus.png',
  'Cap Helicoprion': 'ARK Additions Dossier Helicoprion.png',
  'Gigadesmodus': 'Dossier Desmodus.png',
  'Cap Desmodus': 'Dossier Desmodus.png',
  'Cap Yi Ling': 'Dossier Yi Ling.png',
  'Cap Kaprosuchus': 'Dossier Kaprosuchus.png',
  'Cap Shastasaurus': 'Shastasaurus.png',
  'Cap Pyromanes': 'Pyromane.png',
  'Cap Dreadmare': 'Dreadmare.png',
  'Cap Drakeling': 'Drakeling.png',
  'Cap Veilwyn': 'Veilwyn.png',
  'Ossidon': 'Ossidon.png',
  'Cap Ossidon': 'Ossidon.png',
  'Cap Aureliax': 'Aureliax.png',
  'Aureliax': 'Aureliax.png',
  'Cap Gloon': 'Gloon.png',
  'Gloon': 'Gloon.png',
  'Cap Solwyn': 'Solwyn.png',
  'Solwyn': 'Solwyn.png',
  'Cap Malwyn': 'Malwyn.png',
  'Malwyn': 'Malwyn.png',
  'Grand Tortugar': null,
  'Cap Grand Tortugar': null
};


const LOCAL_IMAGES = {
  'Cap Unicorn': ['pvp', 'unicorn.png'],
  'Cap Carcharodontosaurus': ['pvp', 'carcharodontosaurus.png'],
  'Cap Therizinosaur': ['pvp', 'therizinosaur.png'],
  'Cap Thylacoleo': ['pvp', 'thylacoleo.png'],
  'Cap Rexs': ['pvp', 'rex.png'],
  'Cap Pyromanes': ['pvp', 'pyromane.png'],
  'Cap Basilisk': ['pvp', 'basilisk.png'],
  'Cap Dreadmare': ['pvp', 'dreadmare.png'],
  'Cap Aber Megalosaurus': ['pvp', 'megalosaurus.png'],
  'Cap Aber Carnotaurus': ['pvp', 'carnotaurus.png'],
  'Cap Aberrant Spino': ['pvp', 'spinosaurus.png'],
  'Cap Velonasaurs': ['pvp', 'velonasaur.png'],
  'Cap Managarmrs': ['pvp', 'managarmr.png'],
  'Karkinos': ['pvp', 'karkinos.png'],
  'Ossidon': ['pvp', 'ossidon.png'],
  'Aureliax': ['flyers', 'aureliax.png'],
  'Gigadesmodus': ['flyers', 'gigadesmodus.png'],
  'Cap Desmodus': ['flyers', 'desmodus.png'],
  'Cap Griffins': ['flyers', 'griffin.png'],
  'Cap Wyverns': ['flyers', 'wyverns.png'],
  'Cap Pteranodons': ['flyers', 'pteranodon.png'],
  'Cap Tapejara': ['flyers', 'tapejara.png'],
  'Cap Quetzal': ['flyers', 'quetzal.png'],
  'Argentavis': ['flyers', 'argentavis.png'],
  'Cap Xiphactinus': ['water', 'xiphactinus.png'],
  'Cap Tuso': ['water', 'tusoteuthis.png'],
  'Cap Baryonyx': ['water', 'baryonyx.png'],
  'Cap Megalodon': ['water', 'megalodon.png'],
  'Cap Basilosaurus': ['water', 'basilosaurus.png'],
  'Shastasaurus': ['water', 'shastasaurus.png'],
  'Plesiosaur': ['water', 'plesiosaur.png'],
  'Cap Deinosuchus': ['water', 'deinosuchus.png'],
  'Cap Mantis': ['farm', 'mantis.png'],
  'Cap Ankylosaurus': ['farm', 'ankylosaurus.png'],
  'Cap Ovis': ['farm', 'ovis.png'],
  'Gachas': ['farm', 'gacha.png'],
  'Reaper': ['support', 'reaper.png'],
  'Maeguana': ['support', 'maeguana.png'],
  'Cap Yutyrannus': ['support', 'yutyrannus.png'],
  'Cap Yi Ling': ['support', 'yiling.png'],
  'Cap Arthropluera': ['support', 'arthropluera.png'],
  'Gloon': ['support', 'gloon.png'],
  'Cap Veilwyn': ['support', 'veilwyn.png'],
  'Cap Deinonychus': ['support', 'deinonychus.png'],
  'Cap Daeodon': ['support', 'daeodon.png'],
  'Cap Terror Bird': ['support', 'terrorbird.png'],
  'Cap Drakeling': ['support', 'drakeling.png'],
  'Karkinos@farm': ['farm', 'karkinos.png']
};

function getLocalImage(name, categoryKey) {
  const baseName = name.replace(/\s+\[.*?\]$/, '').trim();
  if (baseName === 'Karkinos' && categoryKey === 'farm') return LOCAL_IMAGES['Karkinos@farm'];
  return LOCAL_IMAGES[baseName] || null;
}

const FFA_IMAGES = {
  'Fridges of Flyers': ['flyers', 'wyverns.png'],
  'Fridges of DPS': ['pvp', 'carcharodontosaurus.png'],
  'Fridges of Supports': ['support', 'yutyrannus.png'],
  'Fridges of Waters': ['water', 'shastasaurus.png'],
  'Fridges of Soakers': ['soakers', 'stegosaurus.png']
};

const SOAKER_IMAGES = {
  'Cap Carbonemys': 'carbonemys.png',
  'Cap Stegosaurus': 'stegosaurus.png',
  'Cap Paraceratherium': 'paraceratherium.png',
  'Cap Gasbags': 'gasbags.png',
  'Dreadnoughtus': 'dreadnoughtus.png'
};

function getSoakerImage(name) {
  const baseName = name.replace(/\s+\[.*?\]$/, '').trim();
  return SOAKER_IMAGES[baseName] || null;
}

function getImageUrl(name) {
  const baseName = name.replace(/\s+\[.*?\]$/, '').trim();
  const file = IMAGE_ALIASES[baseName];
  if (!file) return null;
  return `https://ark.wiki.gg/wiki/Special:Redirect/file/${encodeURIComponent(file)}`;
}

function formatShopDescription(name, price, emoji = '') {
  const prefix = emoji ? `${emoji} ` : '';
  const lines = price.split(/\n+/).filter(line => line.trim()).map(line => {
    const clean = line.replace(/\*\*/g, '').trim();
    const match = clean.match(/^(.*?)\s*(?:=\s*)?\$?\s*(\d+(?:\.\d+)?)\s*\$?$/);
    if (!match) return `${prefix}${clean}`;
    const quantity = match[1].replace(/\s*=\s*$/, '').trim();
    return `${prefix}**${quantity}** ${match[2]} 🪙`;
  });
  return `${prefix}**${name.trim()}**\n\n**Prices:**\n\n${lines.join('\n\n')}`;
}

function makeDinoEmbed(category, product, index, total, localImageName = null, shopEmoji = "", isShopProduct = false) {
  const [name, price, stats] = product;
  const isSoaker = category.title.includes('Soakers');
  const isCarbonemys = name === 'Cap Carbonemys';
  const displayTitle = isSoaker
    ? `${isCarbonemys ? '💠 ' : ''}${name}`
    : `💠 ${name}`;
  const isPvpWyverns = category.title.includes('PvP') && name === 'Cap Wyverns';
  const statsPrefix = (isSoaker || isPvpWyverns) ? '' : '💠 ';

  const embed = new EmbedBuilder()
    .setColor(config.embedColor)
    .setAuthor({ name: 'Small Tribes Crossplay' })
    .setTitle(isShopProduct ? name.trim() : displayTitle)
    .setDescription(isShopProduct ? formatShopDescription(name, price, shopEmoji) + (stats ? `\n\n**${category.title.includes("Armor") ? "Details" : "Contents"}:**\n${stats}` : "") :
      `${shopEmoji ? `${shopEmoji} **${name.trim()}**\n\n` : ''}` +
      `${stats ? `${statsPrefix}**${stats}**\n\n` : ''}` +
      `💰 **Price:**\n` +
      `${price}`
    )
    .setFooter({ text: `ARK FLEX MARKET • ${category.title.replace('💠 ', '')} • ${index}/${total}` });

  if (isShopProduct) embed.setTitle(null);

  if (localImageName) {
    embed.setImage(`attachment://${localImageName}`);
  } else {
    const imageUrl = getImageUrl(name);
    if (imageUrl) embed.setImage(imageUrl);
  }

  return embed;
}

// Upload the original ARK armor icons once, then use their Discord IDs.
const armorEmojiUploads = new Map();
async function ensureArmorEmojis(guild) {
  if (!guild) return;
  if (armorEmojiUploads.has(guild.id)) return armorEmojiUploads.get(guild.id);
  const pending = (async () => {
    await guild.emojis.fetch();
    for (const name of ['flex_market_flak_chest', 'flex_market_tek_chest']) {
      if (!guild.emojis.cache.some(emoji => emoji.name === name && emoji.available !== false)) {
        await guild.emojis.create({
          attachment: path.join(__dirname, 'assets', 'armor', `${name}.png`),
          name,
          reason: 'Original ARK armor icons for the Flex Market shop'
        });
      }
    }
  })();
  armorEmojiUploads.set(guild.id, pending);
  try { await pending; } finally { armorEmojiUploads.delete(guild.id); }
}

async function sendCategory(message, key) {
  const category = categories[key];
  if (!category) return;

  if (key === 'armor') {
    try { await ensureArmorEmojis(message.guild); } catch (error) {
      console.error('Armor emoji upload failed:', error.message);
      await message.channel.send('Please give the bot permission to create server emojis and ensure two emoji slots are available, then run !armor again.');
      return;
    }
  }

  if (SHOP_EMOJIS[key] && message.guild) await message.guild.emojis.fetch();

  // Send each dino separately so every embed can carry its own local image.
  for (let i = 0; i < category.products.length; i++) {
    const product = category.products[i];
    let local = null;
    let folder = null;

    if (key === 'soakers') {
      const fn = getSoakerImage(product[0]);
      if (fn) { local = fn; folder = 'soakers'; }
    } else if (key === 'ffa') {
      const fi = FFA_IMAGES[product[0]];
      if (fi) { folder = fi[0]; local = fi[1]; }
    } else {
      const li = getLocalImage(product[0], key);
      if (li) { folder = li[0]; local = li[1]; }
    }

    const payload = {
      embeds: [makeDinoEmbed(category, product, i + 1, category.products.length, local, getShopEmoji(message.guild, key, product[0]), Boolean(SHOP_EMOJIS[key]))]
    };
    if (local && folder) {
      payload.files = [new AttachmentBuilder(path.join(__dirname, 'assets', folder, local), { name: local })];
    }
    await message.channel.send(payload);
  }

}

client.once('ready', () => {
  console.log(`ARK FLEX MARKET online as ${client.user.tag}`);

  console.log(
    'Commands:',
    ['saddles','armor','basekits','pvpkit','pvp','soaker','flyer','water','farm','support','eggs','cloners','ffa','arb','resources','structures','tekstructures','turrets','soon','prices','giveaway','craft','demo','gacha','ticket']
      .map(command => `!${command}`)
      .join(', ')
  );
});

const pricesText = `**Rockwell**
1x Seat 14.99
2x Seats 26.99
3x Seats 37.49
4x Seats 44.99
5x Seats 52.49
6x Seats 59.99

**Manticore**
1x Seat 9.99
2x Seats 17.99
3x Seats 24.99
4x Seats 29.99
5x Seats 34.99
6x Seats 39.99

**Island boss pack**
1x Seat 24.99
2x Seats 44.99
3x Seats 62.49
4x Seats 74.99
5x Seats 87.49
6x Seats 99.99

**Tek cave**
1x Seat 11.99
2x Seats 21.99
3x Seats 29.99
4x Seats 35.99
5x Seats 41.99
6x Seats 47.99`;

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const command = message.content.trim().toLowerCase();

  if (!command.startsWith(PREFIX)) return;

  const key = command
    .slice(PREFIX.length)
    .split(/\s+/)[0];

  if (['basekit', 'basekits'].includes(key)) {
    await sendKitImages(message, 'base');
    return;
  }

  if (['pvpkit', 'pvpkits', 'kit', 'kits'].includes(key)) {
    await sendKitImages(message, 'pvp');
    return;
  }

  if (key === 'emojicheck') {
    if (!message.guild) return;
    const emojis = await message.guild.emojis.fetch();
    const wanted = [...new Set(Object.values(SHOP_EMOJIS).flatMap(items => Object.values(items)))];
    const lines = [
      `Server: ${message.guild.name} (${message.guild.id})`,
      `Bot: ${client.user.tag}`,
      `Server-Emojis: ${emojis.size}`,
      '',
      'Erwartete Shop-Emojis:'
    ];
    for (const name of wanted) {
      const emoji = emojis.find(item => item.name === name);
      lines.push(emoji ? `GEFUNDEN ${name} | ID ${emoji.id} | available=${emoji.available}` : `FEHLT ${name}`);
    }
    lines.push('', 'Alle Emoji-Namen auf diesem Server:');
    for (const emoji of emojis.values()) lines.push(`${emoji.name} | ${emoji.id}`);
    await message.channel.send({
      content: `Emoji-Prüfung: ${wanted.filter(name => emojis.some(item => item.name === name)).length}/${wanted.length} Shop-Emojis gefunden.`,
      files: [new AttachmentBuilder(Buffer.from(lines.join('\n'), 'utf8'), { name: 'emoji-pruefung.txt' })]
    });
    return;
  }

  if (key === 'dust') {
    if (message.guild) await message.guild.emojis.fetch();
    const dustEmoji = getShopEmoji(message.guild, 'dust', 'Dust');
    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setAuthor({ name: 'Small Tribes Crossplay' })
      .setTitle('Dust')
      .setDescription(formatShopDescription('Dust', '**100000 [100 slots]**  0.69\n\n**300000 [300 slots]**  1.04\n\n**900000 [900 slots]**  2.09\n\n**1800000 [1 dedi]**  3.49\n\n**3600000 [2 dedis]**  5.94\n\n**5400000 [3 dedis]**  8.04\n\n**7200000 [4 dedis]**  9.79', dustEmoji))
      .setFooter({ text: 'ARK FLEX MARKET • Dust' });
    embed.setTitle(null);
    await message.channel.send({ embeds: [embed] });
    return;
  }

  if (key === 'soon') {
    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setTitle('Create ticket for price list')
      .setDescription('For this, please create a ticket.');
    await message.channel.send({ embeds: [embed] });
    return;
  }

  if (key === 'prices') {
    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setTitle('Boss Prices')
      .setDescription(pricesText)
      .setFooter({ text: 'ARK FLEX MARKET • Boss Prices' });
    await message.channel.send({ embeds: [embed] });
    return;
  }

  // ARB command
  if (key === 'arb') {
    if (message.guild) await message.guild.emojis.fetch();
    const arbEmoji = getArbEmoji(message.guild);
    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setAuthor({ name: 'Small Tribes Crossplay' })
      .setTitle('Advanced Rifle Bullet [ARB]')
      .setDescription(formatShopDescription('Advanced Rifle Bullet [ARB]', '**10,000 [100 slots]**  0.69\n\n**30,000 [300 slots]**  1.39\n\n**90,000 [900 slots]**  3.49\n\n**180,000 [1 dedi]**  6.99\n\n**360,000 [2 dedis]**  11.89\n\n**540,000 [3 dedis]**  16.09', arbEmoji))
      .setFooter({ text: 'ARK FLEX MARKET • ARB' });
    embed.setTitle(null);
    await message.channel.send({ embeds: [embed] });
    return;
  }

  if (key === 'giveaway') {
    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setAuthor({ name: 'Small Tribes Crossplay' })
      .setTitle('💠 Invite Giveaway')
      .setDescription(
        '**1 invite**  3 FFAs Random\n\n' +
        '**3 invites**  30 Eggs [3x Dino]\n\n' +
        '**5 invites**  15 FFAs Random\n\n' +
        '**10 invites**  12 FFAs of choice\n\n' +
        '**15 invites**  150 Eggs [15x Different dinos]'
      )
      .setFooter({ text: 'ARK FLEX MARKET • Giveaway' });

    await message.channel.send({ embeds: [embed] });
    return;
  }

  if (key === 'ticket') {
    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setAuthor({ name: 'Small Tribes Crossplay' })
      .setTitle('💠 Open a Ticket')
      .setDescription('**Need help or want to place an order? Open up a ticket!**')
      .setFooter({ text: 'ARK FLEX MARKET • Ticket' });

    await message.channel.send({ embeds: [embed], components: [makeButtonRow()] });
    return;
  }

  if (key === 'craft') {
    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setAuthor({ name: 'Small Tribes Crossplay' })
      .setTitle('💠 BP Crafting')
      .setDescription(
        '**Want your own BPs crafted by a Level 210+ character? Then this is the place for you! (We can provide BPs as well.)**\n\n' +
        '**Just open up a ticket!**'
      )
      .setFooter({ text: 'ARK FLEX MARKET • Crafting' });
    await message.channel.send({ embeds: [embed] });
    return;
  }

  if (key === 'demo') {
    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setAuthor({ name: 'Small Tribes Crossplay' })
      .setTitle('💠 Structure Demo')
      .setDescription(
        '**Need structures demoed fast and easily for resources? Then this is the place for you! (Everything will be demoed on your server.)**\n\n' +
        '**Just open up a ticket!**'
      )
      .setFooter({ text: 'ARK FLEX MARKET • Demo' });
    await message.channel.send({ embeds: [embed] });
    return;
  }

  if (['saddles', 'saddle'].includes(key)) {
    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setAuthor({ name: 'ARK FLEX MARKET' })
      .setTitle('Saddles')
      .setDescription(
        '**Normal Saddle:**\n' +
        '• **1x:** 0.35 🪙\n' +
        '• **10x:** 2.80 🪙\n' +
        '• **100x:** 24.50 🪙\n' +
        '• **300x:** 49.00 🪙\n\n' +
        '**Tek Saddles:**\n' +
        '• **1x:** 0.70 🪙\n' +
        '• **10x:** 6.30 🪙\n' +
        '• **100x:** 59.50 🪙'
      )
      .setImage('attachment://flex_market_saddles.png')
      .setFooter({ text: 'ARK FLEX MARKET' });
    await message.channel.send({ embeds: [embed], files: [new AttachmentBuilder(path.join(__dirname, 'assets', 'saddles', 'flex_market_saddles.png'), { name: 'flex_market_saddles.png' })] });
    return;
  }

  if (['gacha', 'gachakit', 'gachatower'].includes(key)) {
    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setAuthor({ name: 'ARK FLEX MARKET' })
      .setTitle('Gacha Tower Kit')
      .setDescription(
        '**Price:** 49 🪙\n\n' +
        '• 20x Dust Gacha Pairs\n' +
        '• 20x Flint / Stone / Wood Gacha Pairs\n' +
        '• 5x Black Pearl Gacha Pairs\n' +
        '• 10x Obsidian Gacha Pairs\n' +
        '• 20x Pegomastax\n' +
        '• 60x Dungbeetles\n' +
        '• 60x Deinotheriums'
      )
      .setImage('attachment://flex_market_gacha_tower.png')
      .setFooter({ text: 'ARK FLEX MARKET' });
    await message.channel.send({ embeds: [embed], files: [new AttachmentBuilder(path.join(__dirname, 'assets', 'gacha', 'flex_market_gacha_tower.png'), { name: 'flex_market_gacha_tower.png' })] });
    return;
  }

  const aliases = {
    armor: 'armor',
    armour: 'armor',
    armors: 'armor',
    pvpkit: 'pvpkit',
    pvpkits: 'pvpkit',
    kit: 'pvpkit',
    kits: 'pvpkit',
    pvp: 'pvp',
    soaker: 'soakers',
    soakers: 'soakers',
    flyer: 'flyers',
    flyers: 'flyers',
    water: 'water',
    farm: 'farm',
    support: 'support',
    supports: 'support',
    eggs: 'eggs',
    egg: 'eggs',
    cloner: 'cloners',
    cloners: 'cloners',
    ffa: 'ffa',
    mix: 'mix',
    breeder: 'breeder',
    resource: 'resources',
    resources: 'resources',
    structure: 'structures',
    structures: 'structures',
    tek: 'tekstructures',
    tekstructure: 'tekstructures',
    tekstructures: 'tekstructures',
    turret: 'turrets',
    turrets: 'turrets',
    soon: 'soon'
  };

  const categoryKey = aliases[key] || key;
  if (categories[categoryKey]) {
    await sendCategory(message, categoryKey);
  }
});

client.login(process.env.DISCORD_TOKEN);
