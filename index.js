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
      [' Metal Foundations ', '100x = $1.59', ''],
      [' Metal Walls ', '100x = $0.79', ''],
      [' Metal Ceilings ', '100x = $1.19', ''],
      [' Metal Triangle Foundations ', '100x = $0.79', ''],
      [' Metal Pilars ', '100x = $0.79', ''],
      [' Metal Gateways ', '100x = $3.99', ''],
      [' Metal Cliff Platforms ', '3x = $1.43', ''],
      [' Industrial Forges ', '1x = $0.39', ''],
      [' Chemistry Benchs ', '1x = $0.39', ''],
      [' Industrial Cookers ', '1x = $0.39', ''],
      [' Industrial Grinders ', '1x = $0.39', ''],
      [' Industrial Grills ', '1x = $0.08', ''],
      [' Refrigerators ', '1x = $0.08', ''],
      [' Vaults ', '1x = $0.20', ''],
      [' Air Conditioners ', '1x = $0.07', ''],
      [' Electrical Generators ', '1x = $0.07', ''],
      [' Cryofridges ', '1x = $0.07', ''],
      [' Motorboats ', '1x = $1.19', ''],
      [' Zeppelins ', '1x = $0.55', ''],
      [' Clockfaces ', '1x = $0.55', ''],
      [' Linked Storage Boxs ', '1x = $0.55', ''],
      [' Steam Forges ', '1x = $1.19', ''],
      [' Makeshift Megalab ', '1x = $0.55', ''],
      [' Embryo Incubators ', '1x = $0.55', ''],
      [' Sir5RM8 ', '1x = $0.79', ''],
      [' Gene Scanners ', '1x = $0.55', ''],
      [' Gene Storages ', '1x = $0.55', ''],
      [' Industrial Preserving Bins ', '1x = $0.55', ''],
      [' Tinkering Desks ', '1x = $0.55', ''],
      [' Bio Grinder ', '1x = $0.55', ''],
      [' Library Storage ', '1x = $0.55', ''],
      [' Battlerig Garage ', '1x = $0.55', '']
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

function makeDinoEmbed(category, product, index, total, localImageName = null) {
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
    .setTitle(displayTitle)
    .setDescription(
      `${stats ? `${statsPrefix}**${stats}**\n\n` : ''}` +
      `💰 **Price:**\n` +
      `${price}`
    )
    .setFooter({ text: `ARK FLEX MARKET • ${category.title.replace('💠 ', '')} • ${index}/${total}` });

  if (localImageName) {
    embed.setImage(`attachment://${localImageName}`);
  } else {
    const imageUrl = getImageUrl(name);
    if (imageUrl) embed.setImage(imageUrl);
  }

  return embed;
}

async function sendCategory(message, key) {
  const category = categories[key];
  if (!category) return;

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
      embeds: [makeDinoEmbed(category, product, i + 1, category.products.length, local)]
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
    ['pvp','soaker','flyer','water','farm','support','eggs','cloners','ffa','arb','resources','structures','tekstructures','turrets','soon','prices','giveaway','craft','demo','gacha','ticket']
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

  if (key === 'dust') {
    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setTitle('💠 Dust')
      .setDescription(
        '100000 [100 slots] — 0.99 $\n' +
        '100 slots\n\n' +
        '300000 [300 slots] — 1.49 $\n' +
        '300 slots\n\n' +
        '900000 [900 slots] — 2.99 $\n' +
        '900 slots\n\n' +
        '1800000 [1 dedi] — 4.99 $\n' +
        '1 dedi\n\n' +
        '3600000 [2 dedis] — 8.49 $\n' +
        '2 dedis\n\n' +
        '5400000 [3 dedis] — 11.49 $\n' +
        '3 dedis\n\n' +
        '7200000 [4 dedis] — 13.99 $\n' +
        '4 dedis'
      )
      .setFooter({ text: 'ARK FLEX MARKET • Dust' });

    await message.channel.send({ embeds: [embed] });
    return;
  }
  if (key === 'soon') {
    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setTitle('Create ticket for price list')
      .setDescription('Use the ticket button at the bottom.');
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
    const arb = {
      title: '💠 Advanced Rifle Bullet [ARB]',
      products: [
        ['10,000 ARB', '$0.79', '100 slots'],
        ['30,000 ARB', '$1.59', '300 slots'],
        ['90,000 ARB', '$3.99', '900 slots'],
        ['180,000 ARB', '$7.99', '1 dedi'],
        ['360,000 ARB', '$13.59', '2 dedis'],
        ['540,000 ARB', '$18.39', '3 dedis']
      ]
    };

    await message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(config.embedColor)
          .setAuthor({ name: 'Small Tribes Crossplay' })
          .setTitle('💠 Advanced Rifle Bullet [ARB]')
          .setDescription(arb.products.map(p => `**${p[0]}** — ${p[1]}\n${p[2]}`).join('\n\n'))
          .setFooter({ text: 'ARK FLEX MARKET • ARB' })
      ],
    });

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

  if (key === 'gacha') {
    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setAuthor({ name: 'Small Tribes Crossplay' })
      .setTitle('💠 Gacha Tower')
      .setDescription(
        '**Tired of building your own Gacha Tower? We\'ve got you covered!**\n\n' +
        '**Just open up a ticket!**\n\n' +
        '**(For more information, open up a ticket.)**'
      )
      .setFooter({ text: 'ARK FLEX MARKET • Gacha Tower' });
    await message.channel.send({ embeds: [embed] });
    return;
  }

  const aliases = {
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
