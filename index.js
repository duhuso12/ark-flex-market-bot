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
const TICKET_URL =
  config.guildId && config.ticketChannelId
    ? `https://discord.com/channels/${config.guildId}/${config.ticketChannelId}`
    : null;

const categories = {
  pvp: {
    title: '💠 PvP Dinos',
    products: [
            ['Cap Carcharodontosaurus', 'Male or Female » $7.50\nPair » $12.50', '51 HP • 51+254 DMG'],
      ['Cap Therizinosaur', 'Male or Female » $4.99\nPair » $7.99', '53+42 HP • 59+230 DMG'],
      ['Cap Thylacoleo', 'Male or Female » $4.99\nPair » $7.99', '54+254 HP'],
      ['Cap Rexs', 'Male or Female » $4.99\nPair » $7.99', '61+80 HP • 56+192 DMG'],
      ['Cap Pyromanes', 'Male or Female » $4.99\nPair » $7.99', '52+16 HP • 53+200 DMG'],
      ['Cap Basilisk', 'Male or Female » $4.99\nPair » $7.99', '58+40 HP • 62+192 DMG'],
      ['Cap Dreadmare', 'Male or Female » $4.99\nPair » $7.99', '50+200 HP • 50+38 Weight'],
      ['Cap Aber Megalosaurus', 'Male or Female » $4.99\nPair » $7.99', '52+70 HP • 53+73 DMG'],
      ['Cap Aber Carnotaurus', 'Male or Female » $4.99\nPair » $7.99', '45+200 HP'],
      ['Cap Aberrant Spino', 'Male or Female » $4.99\nPair » $7.99', '54+24 HP • 48+124 DMG'],
      ['Cap Velonasaurs', 'Male or Female » $4.99\nPair » $7.99', '49 HP • 44 STAM • 58+232 DMG'],
      ['Cap Managarmrs', 'Male or Female » $4.99\nPair » $7.99', '55+0 HP • 54+20 STAM • 55+200 DMG'],
      ['Karkinos', 'Male or Female » $4.99\nPair » $7.99', '62+100 HP'],
      ['Cap Unicorn', 'Male or Female » $4.99\nPair » $7.99', '48 HP • 50+230 DMG'],
      ['Ossidon', 'Male or Female » $4.99\nPair » $7.99', '49+60 HP • 49+60 DMG'],
      ['Acrocanthosaurus', 'Male or Female » $4.99\nPair » $7.99', '59+50 HP • 52+50 DMG']
    ]
  },

  water: {
    title: '💠 Water Dinos',
    products: [
      ['Cap Deinosuchus [367 LvL]', 'Male or Female » $4.99\nPair » $7.99', '33400 Health • 954% Damage'],
      ['Plesiosaur', 'Male or Female » $4.99\nPair » $7.99', '62+130 HP'],
      ['Mosasaurus', 'Male or Female » $4.99\nPair » $7.99', '30384 Health • 522% Damage'],
      ['Shastasaurus', 'Male or Female » $7.50\nPair » $12.50', '51+254 HP'],
      ['Cap Xiphactinus [387 LvL]', 'Male or Female » $4.99\nPair » $7.99', '24390 Health • 839% Damage'],
      ['Cap Basilosaurus', 'Male or Female » $4.99\nPair » $7.99', '69+254 HP'],
      ['Cap Megalodon', 'Male or Female » $4.99\nPair » $7.99', '68+254 HP'],
      ['Cap Baryonyx [364 LvL]', 'Male or Female » $4.99\nPair » $7.99', '65+254 HP'],
      ['Cap Tuso [376 LvL]', 'Male or Female » $7.50\nPair » $12.50', '62+38 HP • 69+186 DMG'],
      ['Cap Kaprosuchus [386 LvL]', 'Male or Female » $4.99\nPair » $7.99', '6000 Health • 1007% Damage'],
      ['Cap Helicoprion', 'Male or Female » $2.99\nPair » $4.99', 'Craft: 80%']
    ]
  },

  flyers: {
    title: '💠 Flyers',
    products: [
      ['Cap Quetzal [378 LvL]', 'Male or Female » $7.50\nPair » $12.50', '63240 Health • 305 pts'],
      ['Cap Tapejara', 'Male or Female » $4.99\nPair » $7.99', '53+254 HP'],
      ['Cap Pteranodons', 'Male or Female » $2.99\nPair » $4.99', '2 variants available'],
      ['Argentavis', 'Male or Female » $2.99\nPair » $4.99', '5402 Health • 984 Weight'],
      ['Cap Wyverns', 'Male or Female » $7.50\nPair » $12.50', 'Lightning • Poison • Fire • Ice'],
      ['War Rhyniognathas [350-390 LvLs]', '1x » $4.99', '80k-90k+'],
      ['Cap Snow Owl [385 LvL]', 'Male or Female » $4.99\nPair » $7.99', '19175 Health • 290 pts'],
      ['Farm Rhyniognatha', '1x » $9.99', '10 000+'],
      ['Cap Griffins', 'Male or Female » $4.99\nPair » $7.99', '45+40 HP • 54+152 DMG'],
      ['Cap Desmodus', 'Male or Female » $4.99\nPair » $7.99', 'V1: 53+254 HP • V2: 53+50 HP / 62+142 DMG'],
      ['Gigadesmodus', 'Male or Female » $7.50\nPair » $12.50', '14585 • 429%'],
      ['Aureliax', 'Male or Female » $4.99\nPair » $7.99', '42160 Health']
    ]
  },

  farm: {
    title: '💠 Farm Dinos',
    products: [
      ['Dung Beetle [Random LvL]', '1x » $1.99', ''],
      ['Cap Brontosaurus', 'Male or Female » $4.99\nPair » $7.99', 'V1: 127056 Health • V2: 8000 Weight / 27870 Health'],
      ['Moschops', 'Male or Female » $2.99\nPair » $4.99', '1280% Damage'],
      ['Achatina [Random LvL]', '1x » $1.99', ''],
      ['Procoptodon', 'Male or Female » $2.99\nPair » $4.99', '1199 Weight'],
      ['Giant Bee [Random LvL]', '1x » $1.99', ''],
      ['Cap Mantis', 'Male or Female » $2.99\nPair » $4.99', '54 HP • 52+202 DMG'],
      ['Pelagornis', 'Male or Female » $2.99\nPair » $4.99', '475% Damage'],
      ['Dunkleosteus', 'Male or Female » $2.99\nPair » $4.99', 'V1: 2930 Weight / 616% Damage • V2: 3840 Weight / 663% Damage'],
      ['Anglerfish', 'Male or Female » $2.99\nPair » $4.99', '851% Damage'],
      ['Iguanodon [Random LvL]', '1x » $1.99', ''],
      ['Gachas', 'Male or Female » $2.99\nPair » $4.99', 'V1–V6 available'],
      ['Beelzebufo [Random LvL]', '1x » $1.99', ''],
      ['Fasolasuchus', 'Male or Female » $2.99\nPair » $4.99', '972 Weight • 425% Damage'],
      ['Doedicurus', 'Male or Female » $2.99\nPair » $4.99', '704% Damage'],
      ['Karkinos', 'Male or Female » $4.99\nPair » $7.99', '62+100 HP'],
      ['Cap Ovis', 'Male or Female » $2.99\nPair » $4.99', '51+254 HP'],
      ['Cap Ankylosaurus [369 LvL]', 'Male or Female » $2.99\nPair » $4.99', '1927% Damage']
    ]
  },

  support: {
    title: '💠 Supports',
    products: [
      ['Reaper', '1 clone » $4.99\n6 clones » $9.99\n20 clones » $29.99', '59 HP • 36 DMG'],
      ['Maeguana', 'Male or Female » $2.99\nPair » $4.99', '64+26 HP • 62+102 Food'],
      ['Gloon', 'Male or Female » $4.99\nPair » $7.99', '44 HP • 51+200 DMG'],
      ['Cap Yutyrannus [384 LvL]', 'Male or Female » $4.99\nPair » $7.99', '58+254 HP'],
      ['Cap Yi Ling [389 LvL]', 'Male or Female » $4.99\nPair » $7.99', '51+254 HP'],
      ['Cap Daeodon [362 LvL]', 'Male or Female » $4.99\nPair » $7.99', '93437 Food'],
      ['Cap Arthropluera', 'Male or Female » $4.99\nPair » $7.99', '62+254 DMG'],
      ['Cap Deinonychus [384 LvL]', 'Male or Female » $4.99\nPair » $7.99', '11720 Health • 502% Damage'],
      ['Cap Beelzebufo [370 LvL]', 'Male or Female » $4.99\nPair » $7.99', '13263 Health'],
      ['Cap Ovis', 'Male or Female » $2.99\nPair » $4.99', '51+254 HP'],
      ['Cap Gigantopithecus [391 LvL]', 'Male or Female » $4.99\nPair » $7.99', '9536 Health • 864% Damage'],
      ['Cap Drakeling [389 LvL]', 'Male or Female » $4.99\nPair » $7.99', '4680 Health'],
      ['Cap Veilwyn', 'Male or Female » $4.99\nPair » $7.99', '57+96 HP • 52+118 DMG'],
      ['Burrowbuck', 'Male or Female » $4.99\nPair » $7.99', '6380 Health'],
      ['Cryolophosaurus', 'Male or Female » $4.99\nPair » $7.99', '7000 Health • 493% Damage'],
      ['Grand Tortugar', 'Male or Female » $4.99\nPair » $7.99', '40950 Health']
    ]
  },

  soakers: {
    title: '💠 Soakers',
    products: [
      ['Cap Carbonemys', 'Male or Female » $2.99\nPair » $4.99', '40950 Health [66+254=320p]'],
      ['Cap Stegosaurus', 'Male or Female » $4.99\nPair » $7.99', '63+254 HP'],
      ['Cap Paraceratherium', 'Male or Female » $4.99\nPair » $7.99', '60+254 HP'],
      ['Cap Gasbags', 'Male or Female » $4.99\nPair » $7.99', '32370 Health [50+194=244p]\n9550 Oxygen [41+54=95p]\n3060 Stamina [41p]'],
      ['Dreadnoughtus', 'Male or Female » $7.50\nPair » $12.50', 'V1: 50+254 HP\n\nV2: 50+152 HP • 51+124 DMG']
    ]
  },
    mix: {
    title: '💠 Mix / Random',
    products: [
      ['Dung Beetle [Random LvL]', '1x » $1.99'],
      ['Achatina [Random LvL]', '1x » $1.99'],
      ['Giant Bee [Random LvL]', '1x » $1.99'],
      ['Iguanodon [Random LvL]', '1x » $1.99'],
      ['Beelzebufo [Random LvL]', '1x » $1.99'],
      ['Diplocaulus [Random LvL]', '1x » $1.99'],
      ['Armadoggo [Random LvL]', '1x » $1.99'],
      ['Mammoth [Random LvL]', '1x » $1.99'],
      ['Otter [Random LvL]', '1x » $1.99'],
      ['Gachas', 'Male or Female » $2.99\nPair » $4.99', 'Multiple variants available'],
      ['Maeguana', 'Male or Female » $2.99\nPair » $4.99', '64+26 HP • 62+102 Food'],
      ['Oviraptor [338 LvL]', 'Male or Female » $2.99\nPair » $4.99', '262 Weight'],
      ['Pegomastax [343 LvL]', 'Male or Female » $2.99\nPair » $4.99', '139 Weight'],
      ['Procoptodon', 'Male or Female » $2.99\nPair » $4.99', '1199 Weight'],
      ['Pelagornis', 'Male or Female » $2.99\nPair » $4.99', '475% Damage'],
      ['Dunkleosteus', 'Male or Female » $2.99\nPair » $4.99', '2 variants available'],
      ['Anglerfish', 'Male or Female » $2.99\nPair » $4.99', '851% Damage'],
      ['Fasolasuchus', 'Male or Female » $2.99\nPair » $4.99', '972 Weight • 425% Damage'],
      ['Doedicurus', 'Male or Female » $2.99\nPair » $4.99', '704% Damage'],
      ['Deinotherium', 'Male or Female » $2.99\nPair » $4.99', '16450 Health']
    ]
  },

  eggs: {
    title: '💠 Eggs & Embryos',
    products: [
      ['Eggs — 10', '10 Eggs » $7.50', '1x Dino • minimum 10 eggs per breed line'],
      ['Eggs — 30', '30 Eggs » $17.50', '3x Different dinos'],
      ['Eggs — 50', '50 Eggs » $24.99', '5x Different dinos'],
      ['Eggs — 100', '100 Eggs » $39.99', '10x Different dinos'],
      ['Eggs — 200', '200 Eggs » $69.99', '20x Different dinos'],
      ['Eggs — 300', '300 Eggs » $99.99', '30x Different dinos'],
      ['Embryos — 10', '10 Embryos » $11.25', '1x Dino'],
      ['Embryos — 30', '30 Embryos » $26.25', '3x Different dinos'],
      ['Embryos — 50', '50 Embryos » $37.50', '5x Different dinos'],
      ['Embryos — 100', '100 Embryos » $59.99', '10x Different dinos'],
      ['Embryos — 200', '200 Embryos » $104.99', '20x Different dinos'],
      ['Embryos — 300', '300 Embryos » $149.99', '30x Different dinos']
    ]
  },

  cloners: {
    title: '💠 Cloners',
    products: [
      ['Phoenix', '1 clone » $4.99\n6 clones » $17.50\n20 clones » $49.99', '6 LvL • Purple'],
      ['Karkinos', '1 clone » $4.99\n6 clones » $9.99\n20 clones » $29.99', '1 LvL'],
      ['Reaper', '1 clone » $4.99\n6 clones » $9.99\n20 clones » $29.99', '3 LvL'],
      ['Tek Giga Female', '1 clone » $4.99\n6 clones » $9.99\n20 clones » $29.99', '1 LvL']
    ]
  },

  ffa: {
    title: '💠 FFA Cryofridges',
    products: [
      ['Fridges of Flyers', 'Pteras $34.99\nTapejaras $39.99\nQuetzals $49.99\nWyverns $44.99\nSnow Owl $34.99\nGriffin $39.99\nDesmodus $39.99', 'Top Stats'],
      ['Fridges of DPS', 'Gigas $59.99\nCarchas $59.99\nTherizino $34.99\nThyla $44.99\nRex $34.99\nPyro $34.99\nBasilisk $39.99\nMegalos $34.99\nCarno $34.99\nSpino $44.99\nMana $49.99\nKarki $54.99', 'Top Stats'],
      ['Fridges of Supports', 'Yuty $54.99\nYi Ling $24.99\nDaeodon $49.99\nArthro $39.99\nDimorph $34.99\nDeinonychus $34.99\nBeelzebufo $34.99\nOvis $29.99', 'Top Stats'],
      ['Fridges of Waters', 'Plesio $54.99\nShasta $89.99\nXipha $29.99\nBasilo $44.99\nMegalodon $44.99\nBary $39.99\nTuso $49.99', 'Top Stats'],
      ['Fridges of Soakers', 'Carbo $24.99\nStego $29.99\nParacer $44.99\nDread $59.99', 'Top Stats'],
      ['Fridges of Mixs', 'Random » $49.99', 'Top Stats'],
      ['Small Dinos', '1x FFA » $0.99\n12x FFAs » $5.99\n36x FFAs » $12.50', '1 imprint during the event'],
      ['Large Dinos', '1x FFA » $1.99\n12x FFAs » $14.99\n36x FFAs » $24.50', '2–3 imprints during the event']
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
      [' Blue | Green Gems ', '30000 [300 slots] » $3.99\n180000 [1800 slots] » $9.99', ''],
      [' Sulfur ', '10000 [100 slots] » $3.99\n30000 [300 slots] » $8.99', ''],
      [' Chitin ', '180000 [1800 slots] » $2.99', ''],
      [' Silk ', '10000 [100 slots] » $2.99\n30000 [300 slots] » $8.99', ''],
      [' Oil ', '30000 [300 slots] » $3.99\n180000 [1800 slots] » $13.99', ''],
      [' Sap ', '3000 [100 slots] » $1.99\n9000 [300 slots] » $4.99', ''],
      [' Hide ', '60000 [300 slots] » $1.99\n360000 [1800 slots] » $4.99', ''],
      [' Silica Pearls ', '30000 [300 slots] » $1.99\n180000 [1800 slots] » $6.99', ''],
      [' Electronics ', '30000 [300 slots] » $4.99\n180000 [1800 slots] » $19.99', ''],
      [' Crystal ', '30000 [300 slots] » $1.99\n180000 [1800 slots] » $5.99', ''],
      [' Cementing Paste ', '30000 [300 slots] » $2.99\n180000 [1800 slots] » $9.99', ''],
      [' Black Pearls ', '60000 [300 slots] » $4.99\n360000 [1800 slots] » $19.99', ''],
      [' Hard Polymer ', '30000 [300 slots] » $4.99\n180000 [1800 slots] » $14.99', ''],
      [' Metal Ingots ', '90000 [300 slots] » $1.99\n540000 [1800 slots] » $9.99', '']
    ]
  },

  structures: {
    title: '💠 Structures',
    products: [
      [' Metal Foundations ', '100x = $1.99', ''],
      [' Metal Walls ', '100x = $0.99', ''],
      [' Metal Ceilings ', '100x = $1.49', ''],
      [' Metal Triangle Foundations ', '100x = $0.99', ''],
      [' Metal Pilars ', '100x = $0.99', ''],
      [' Metal Gateways ', '100x = $4.99', ''],
      [' Metal Cliff Platforms ', '3x = $1.79', ''],
      [' Industrial Forges ', '1x = $0.49', ''],
      [' Chemistry Benchs ', '1x = $0.49', ''],
      [' Industrial Cookers ', '1x = $0.49', ''],
      [' Industrial Grinders ', '1x = $0.49', ''],
      [' Industrial Grills ', '1x = $0.10', ''],
      [' Refrigerators ', '1x = $0.10', ''],
      [' Vaults ', '1x = $0.25', ''],
      [' Air Conditioners ', '1x = $0.09', ''],
      [' Electrical Generators ', '1x = $0.09', ''],
      [' Cryofridges ', '1x = $0.09', ''],
      [' Motorboats ', '1x = $1.49', ''],
      [' Zeppelins ', '1x = $0.69', ''],
      [' Clockfaces ', '1x = $0.69', ''],
      [' Linked Storage Boxs ', '1x = $0.69', ''],
      [' Steam Forges ', '1x = $1.49', ''],
      [' Makeshift Megalab ', '1x = $0.69', ''],
      [' Embryo Incubators ', '1x = $0.69', ''],
      [' Sir5RM8 ', '1x = $0.99', ''],
      [' Gene Scanners ', '1x = $0.69', ''],
      [' Gene Storages ', '1x = $0.69', ''],
      [' Industrial Preserving Bins ', '1x = $0.69', ''],
      [' Tinkering Desks ', '1x = $0.69', ''],
      [' Bio Grinder ', '1x = $0.69', ''],
      [' Library Storage ', '1x = $0.69', ''],
      [' Battlerig Garage ', '1x = $0.69', '']
    ]
  },

  tekstructures: {
    title: '💠 Tek Structures',
    products: [
      [' Tek Foundations ', '100x = $1.99'],
      [' Tek Walls ', '100x = $0.99'],
      [' Tek Ceilings ', '100x = $1.49'],
      [' Tek Triangle Foundations ', '100x = $0.99'],
      [' Tek Pillars ', '100x = $0.99'],
      [' Tek Gateways ', '100x = $4.99'],
      [' Vacuum Compartments ', '5x = $1.99'],
      [' Tek Troughs ', '1x = $1.49'],
      [' Small Tek Teleporters ', '1x = $1.49'],
      [' Medium Tek Teleporters ', '1x = $2.49'],
      [' Large Tek Teleporters ', '1x = $4.49'],
      [' Tek Generators ', '1x = $2.49'],
      [' Tek Replicators ', '1x = $4.49'],
      [' Tek Transmiters ', '1x = $3.49'],
      [' Tek Forcefields ', '1x = $4.49'],
      [' Cloning Chambers ', '1x = $4.49'],
      [' Tek Dedicated Storages ', '10x = $0.99'],
      [' Tek Sleeping Pods ', '1x = $0.19'],
      [' Behemoth Tek Cellar Doors ', '100x = $2.99'],
      [' Tek Crop Plots ', '10x = $0.99'],
      [' Tek Sensor ', '1x = $0.49'],
      [' Tek Hover Skiff ', '1x = $4.99'],
      [' Tek Jump Pad ', '1x = $0.49']
    ]
  },

  turrets: {
    title: '💠 Turrets',
    products: [
      [' Auto Turrets ', '1x = $0.19\n10x = $1.49\n100x = $9.99\n300x = $24.99'],
      [' Bladewasp Hive Turrets ', '1x = $0.89\n10x = $7.99\n100x = $69.99\n300x = $179.99'],
      [' Heavy Turrets ', '1x = $0.45\n10x = $4.49\n100x = $13.49\n300x = $35.99'],
      [' Tek Turrets ', '1x = $0.45\n10x = $4.49\n100x = $13.49\n300x = $29.99'],
      [' Tesla Turrets ', '1x = $0.45\n10x = $4.49\n100x = $26.99\n300x = $62.99']
    ]
  },

  breeder: {
    title: '💠 Breeder Packs',
    products: [
      ['Gamma PvP Pack', 'Pair » $39.99\nMale only » $24.50', 'Carcha or Giga • Thylacoleo • Therizinosaur • Pyromane'],
      ['Beta PvP Pack', 'Pair » $59.99\nMale only » $37.50', 'Carcha or Giga • Thylacoleo • Basilisk • Velonasaur • Rex • Pyromane • Therizinosaur • Managarmr'],
      ['Alpha PvP Pack', 'Pair » $99.99\nMale only » $57.99', 'Carcha • Thylacoleo • Basilisk • Velonasaur • Spino • Rex • Pyromane • Therizinosaur • Managarmr • Karkinos • Giga • Woolly Rhino • Aber Megalosaurus • Carnotaurus • Dreadmare']
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
  'Cap Xiphactinus': ['water', 'xiphactinus.png'],
  'Cap Tuso': ['water', 'tusoteuthis.png'],
  'Cap Baryonyx': ['water', 'baryonyx.png'],
  'Cap Megalodon': ['water', 'megalodon.png'],
  'Cap Basilosaurus': ['water', 'basilosaurus.png'],
  'Shastasaurus': ['water', 'shastasaurus.png'],
  'Plesiosaur': ['water', 'plesiosaur.png'],
  'Cap Mantis': ['farm', 'mantis.png'],
  'Cap Ovis': ['farm', 'ovis.png'],
  'Reaper': ['support', 'reaper.png'],
  'Maeguana': ['support', 'maeguana.png'],
  'Cap Yutyrannus': ['support', 'yutyrannus.png'],
  'Cap Yi Ling': ['support', 'yiling.png'],
  'Cap Arthropluera': ['support', 'arthropluera.png'],
  'Gloon': ['support', 'gloon.png'],
  'Cap Veilwyn': ['support', 'veilwyn.png'],
  'Karkinos@farm': ['farm', 'karkinos.png']
};

function getLocalImage(name, categoryKey) {
  const baseName = name.replace(/\s+\[.*?\]$/, '').trim();
  if (baseName === 'Karkinos' && categoryKey === 'farm') return LOCAL_IMAGES['Karkinos@farm'];
  return LOCAL_IMAGES[baseName] || null;
}

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
  const statsPrefix = isSoaker ? '' : '💠 ';

  const embed = new EmbedBuilder()
    .setColor(config.embedColor)
    .setAuthor({ name: 'Small Tribes Crossplay' })
    .setTitle(displayTitle)
    .setDescription(
      `${stats ? `${statsPrefix}**${stats}**\n\n` : ''}` +
      `💰 **Price:**\n` +
      `➤ ${price.replace(/\n/g, '\n➤ ')}`
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

  await message.channel.send({ components: [makeButtonRow()] });
}

client.once('ready', () => {
  console.log(`ARK FLEX MARKET online as ${client.user.tag}`);

  console.log(
    'Commands:',
    ['pvp','soaker','flyer','water','farm','support','eggs','cloners','ffa','arb','resources','structures','tekstructures','turrets','soon','prices']
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

    await message.channel.send({ embeds: [embed], components: [makeButtonRow()] });
    return;
  }
  if (key === 'soon') {
    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setTitle('Create ticket for price list')
      .setDescription('Use the ticket button at the bottom.');
    await message.channel.send({ embeds: [embed], components: [makeButtonRow()] });
    return;
  }

  if (key === 'prices') {
    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setTitle('Boss Prices')
      .setDescription(pricesText)
      .setFooter({ text: 'ARK FLEX MARKET • Boss Prices' });
    await message.channel.send({ embeds: [embed], components: [makeButtonRow()] });
    return;
  }

  // ARB command
  if (key === 'arb') {
    const arb = {
      title: '💠 Advanced Rifle Bullet [ARB]',
      products: [
        ['10,000 ARB', '$0.99', '100 slots'],
        ['30,000 ARB', '$1.99', '300 slots'],
        ['90,000 ARB', '$4.99', '900 slots'],
        ['180,000 ARB', '$9.99', '1 dedi'],
        ['360,000 ARB', '$16.99', '2 dedis'],
        ['540,000 ARB', '$22.99', '3 dedis']
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
      components: [makeButtonRow()]
    });

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
