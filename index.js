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
            ['Cap Unicorn', 'Male or Female $3.49 🪙\nPair $5.59 🪙', '48 HP • 50+230 DMG'],
      ['Cap Carcharodontosaurus', 'Male or Female $5.25 🪙\nPair $8.75 🪙', '51 HP • 51+254 DMG'],
      ['Cap Therizinosaur', 'Male or Female $3.49 🪙\nPair $5.59 🪙', '53+42 HP • 59+230 DMG'],
      ['Cap Thylacoleo', 'Male or Female $3.49 🪙\nPair $5.59 🪙', '54+254 HP'],
      ['Cap Rexs', 'Male or Female $3.49 🪙\nPair $5.59 🪙', '61+80 HP • 56+192 DMG'],
      ['Cap Pyromanes', 'Male or Female $3.49 🪙\nPair $5.59 🪙', '52+16 HP • 53+200 DMG'],
      ['Cap Basilisk', 'Male or Female $3.49 🪙\nPair $5.59 🪙', '58+40 HP • 62+192 DMG'],
      ['Cap Dreadmare', 'Male or Female $3.49 🪙\nPair $5.59 🪙', '50+200 HP • 50+38 Weight'],
      ['Cap Aber Megalosaurus', 'Male or Female $3.49 🪙\nPair $5.59 🪙', '52+70 HP • 53+73 DMG'],
      ['Cap Aber Carnotaurus', 'Male or Female $3.49 🪙\nPair $5.59 🪙', '45+200 HP'],
      ['Cap Aberrant Spino', 'Male or Female $3.49 🪙\nPair $5.59 🪙', '54+24 HP • 48+124 DMG'],
      ['Cap Velonasaurs', 'Male or Female $3.49 🪙\nPair $5.59 🪙', '49 HP • 44 STAM • 58+232 DMG'],
      ['Cap Managarmrs', 'Male or Female $3.49 🪙\nPair $5.59 🪙', '55+0 HP • 54+20 STAM • 55+200 DMG'],
      ['Karkinos', 'Male or Female $3.49 🪙\nPair $5.59 🪙', '62+100 HP'],
      ['Ossidon', 'Male or Female $3.49 🪙\nPair $5.59 🪙', '49+60 HP • 49+60 DMG'],
      ['Cap Wyverns', 'Male or Female $5.25 🪙\nPair $8.75 🪙', 'Fire Wyvern: 48+150 HP • 41 STAM • 46+12 DMG\n\nPoison Wyvern: 43+94 HP • 41 STAM • 44+156 DMG\n\nLightning Wyvern: 56+62 HP • 45 STAM • 51+136 DMG\n\nAggro Lightning Wyvern: 56+74 HP • 51+208 DMG'],
    ]
  },

  water: {
    title: '💠 Water Dinos',
    products: [
      ['Plesiosaur', 'Male or Female $3.49 🪙\nPair $5.59 🪙', '62+130 HP'],
      ['Shastasaurus', 'Male or Female $5.25 🪙\nPair $8.75 🪙', '51+254 HP Clone\n58+88 HP'],
      ['Cap Xiphactinus [387 LvL]', 'Male or Female $3.49 🪙\nPair $5.59 🪙', '24390 Health • 839% Damage'],
      ['Cap Basilosaurus', 'Male or Female $3.49 🪙\nPair $5.59 🪙', '69+254 HP'],
      ['Cap Megalodon', 'Male or Female $3.49 🪙\nPair $5.59 🪙', '68+254 HP'],
      ['Cap Baryonyx [364 LvL]', 'Male or Female $3.49 🪙\nPair $5.59 🪙', '65+254 HP'],
      ['Cap Tuso [376 LvL]', 'Male or Female $5.25 🪙\nPair $8.75 🪙', '62+38 HP • 69+186 DMG'],
      ['Cap Deinosuchus', 'Male or Female $3.49 🪙\nPair $5.59 🪙', '55+22 HP • 65+218 DMG'],
    ]
  },

  flyers: {
    title: '💠 Flyers',
    products: [
      ['Cap Quetzal [378 LvL]', 'Male or Female $5.25 🪙\nPair $8.75 🪙', '63240 Health • 305 pts'],
      ['Cap Tapejara', 'Male or Female $3.49 🪙\nPair $5.59 🪙', '53+254 HP'],
      ['Cap Pteranodons', 'Male or Female $2.09 🪙\nPair $3.49 🪙', '2 variants available'],
      ['Cap Wyverns', 'Male or Female $5.25 🪙\nPair $8.75 🪙', 'Fire Wyvern: 48+150 HP • 41 STAM • 46+12 DMG\n\nPoison Wyvern: 43+94 HP • 41 STAM • 44+156 DMG\n\nLightning Wyvern: 56+62 HP • 45 STAM • 51+136 DMG\n\nAggro Lightning Wyvern: 56+74 HP • 51+208 DMG'],
      ['Cap Griffins', 'Male or Female $3.49 🪙\nPair $5.59 🪙', '45+40 HP • 54+152 DMG'],
      ['Cap Desmodus', 'Male or Female $3.49 🪙\nPair $5.59 🪙', 'V1: 53+254 HP • V2: 53+50 HP / 62+142 DMG'],
      ['Gigadesmodus', 'Male or Female $5.25 🪙\nPair $8.75 🪙', '14585 • 429%'],
      ['Aureliax', 'Male or Female $3.49 🪙\nPair $5.59 🪙', '42160 Health'],
      ['Argentavis', 'Male or Female $2.09 🪙\nPair $3.49 🪙', '49+20 HP • 49+14 STAM • 59+14 Weight • 58+16 DMG']
    ]
  },

  farm: {
    title: '💠 Farm Dinos',
    products: [
      ['Cap Mantis', 'Male or Female $2.09 🪙\nPair $3.49 🪙', '54 HP • 52+202 DMG'],
      ['Cap Ankylosaurus', 'Male or Female $2.09 🪙\nPair $3.49 🪙', '51+254 DMG'],
      ['Karkinos', 'Male or Female $3.49 🪙\nPair $5.59 🪙', '62+100 HP'],
      ['Cap Ovis', 'Male or Female $2.09 🪙\nPair $3.49 🪙', '51+254 HP'],
      ['Gachas', 'Male or Female $2.09 🪙\nPair $3.49 🪙', 'Multiple variants available'],
    ]
  },

  support: {
    title: '💠 Supports',
    products: [
      ['Reaper', '1 clone $3.49 🪙\n6 clones $6.99 🪙\n20 clones $20.99 🪙', '59 HP • 36 DMG'],
      ['Maeguana', 'Male or Female $2.09 🪙\nPair $3.49 🪙', '64+26 HP • 62+102 Food'],
      ['Gloon', 'Male or Female $3.49 🪙\nPair $5.59 🪙', '44 HP • 51+200 DMG'],
      ['Cap Yutyrannus [384 LvL]', 'Male or Female $3.49 🪙\nPair $5.59 🪙', '58+254 HP'],
      ['Cap Yi Ling [389 LvL]', 'Male or Female $3.49 🪙\nPair $5.59 🪙', '51+254 HP'],
      ['Cap Arthropluera', 'Male or Female $3.49 🪙\nPair $5.59 🪙', '62+254 DMG'],
      ['Cap Veilwyn', 'Male or Female $3.49 🪙\nPair $5.59 🪙', '57+96 HP • 52+118 DMG'],
      ['Cap Deinonychus', 'Male or Female $3.49 🪙\nPair $5.59 🪙', '34+254 HP • 36+28 DMG'],
      ['Cap Daeodon', 'Male or Female $3.49 🪙\nPair $5.59 🪙', '61+254 Food'],
      ['Cap Terror Bird', 'Male or Female $2.09 🪙\nPair $3.49 🪙', '53+254 HP'],
      ['Cap Drakeling', 'Male or Female $3.49 🪙\nPair $5.59 🪙', '55+102 HP'],
      ['Tideup', 'Male or Female $2.79 🪙\nPair $4.89 🪙', '43 Food'],
    ]
  },

  soakers: {
    title: '💠 Soakers',
    products: [
      ['Cap Carbonemys', 'Male or Female $2.09 🪙\nPair $3.49 🪙', '40950 Health [66+254=320p]'],
      ['Cap Stegosaurus', 'Male or Female $3.49 🪙\nPair $5.59 🪙', '63+254 HP'],
      ['Cap Paraceratherium', 'Male or Female $3.49 🪙\nPair $5.59 🪙', '60+254 HP'],
      ['Cap Gasbags', 'Male or Female $3.49 🪙\nPair $5.59 🪙', '32370 Health [50+194=244p]\n9550 Oxygen [41+54=95p]\n3060 Stamina [41p]'],
      ['Dreadnoughtus', 'Male or Female $5.25 🪙\nPair $8.75 🪙', 'V1: 50+254 HP\n\nV2: 50+152 HP • 51+124 DMG']
    ]
  },
    mix: {
    title: '💠 Mix / Random',
    products: [
      ['Dung Beetle [Random LvL]', '1x $1.39 🪙'],
      ['Achatina [Random LvL]', '1x $1.39 🪙'],
      ['Giant Bee [Random LvL]', '1x $1.39 🪙'],
      ['Iguanodon [Random LvL]', '1x $1.39 🪙'],
      ['Beelzebufo [Random LvL]', '1x $1.39 🪙'],
      ['Diplocaulus [Random LvL]', '1x $1.39 🪙'],
      ['Armadoggo [Random LvL]', '1x $1.39 🪙'],
      ['Mammoth [Random LvL]', '1x $1.39 🪙'],
      ['Otter [Random LvL]', '1x $1.39 🪙'],
      ['Gachas', 'Male or Female $2.09 🪙\nPair $3.49 🪙', 'Multiple variants available'],
      ['Maeguana', 'Male or Female $2.09 🪙\nPair $3.49 🪙', '64+26 HP • 62+102 Food'],
      ['Oviraptor [338 LvL]', 'Male or Female $2.09 🪙\nPair $3.49 🪙', '262 Weight'],
      ['Pegomastax [343 LvL]', 'Male or Female $2.09 🪙\nPair $3.49 🪙', '139 Weight'],
      ['Procoptodon', 'Male or Female $2.09 🪙\nPair $3.49 🪙', '1199 Weight'],
      ['Pelagornis', 'Male or Female $2.09 🪙\nPair $3.49 🪙', '475% Damage'],
      ['Dunkleosteus', 'Male or Female $2.09 🪙\nPair $3.49 🪙', '2 variants available'],
      ['Anglerfish', 'Male or Female $2.09 🪙\nPair $3.49 🪙', '851% Damage'],
      ['Fasolasuchus', 'Male or Female $2.09 🪙\nPair $3.49 🪙', '972 Weight • 425% Damage'],
      ['Doedicurus', 'Male or Female $2.09 🪙\nPair $3.49 🪙', '704% Damage'],
      ['Deinotherium', 'Male or Female $2.09 🪙\nPair $3.49 🪙', '16450 Health']
    ]
  },

  eggs: {
    title: '💠 Eggs & Embryos',
    products: [
      ['Eggs — 30', '30 Eggs $4.19 🪙', '3x Different dinos'],
      ['Eggs — 50', '50 Eggs $5.59 🪙', '5x Different dinos'],
      ['Eggs — 100', '100 Eggs $7.00 🪙', '10x Different dinos'],
      ['Eggs — 200', '200 Eggs $14.00 🪙', '20x Different dinos'],
      ['Eggs — 300', '300 Eggs $21.00 🪙', '30x Different dinos'],
      ['Embryos — 10', '10 Embryos $7.88 🪙', '1x Dino'],
      ['Embryos — 30', '30 Embryos $18.38 🪙', '3x Different dinos'],
      ['Embryos — 50', '50 Embryos $26.25 🪙', '5x Different dinos'],
      ['Embryos — 100', '100 Embryos $10.50 🪙', '10x Different dinos'],
      ['Embryos — 200', '200 Embryos $21.00 🪙', '20x Different dinos'],
      ['Embryos — 300', '300 Embryos $28.00 🪙', '30x Different dinos']
    ]
  },

  cloners: {
    title: '💠 Cloners',
    products: [
      ['Phoenix', '1 clone $3.49 🪙\n6 clones $12.25 🪙\n20 clones $34.99 🪙', '6 LvL • Purple'],
      ['Karkinos', '1 clone $3.49 🪙\n6 clones $6.99 🪙\n20 clones $20.99 🪙', '1 LvL'],
      ['Reaper', '1 clone $3.49 🪙\n6 clones $6.99 🪙\n20 clones $20.99 🪙', '3 LvL'],
      ['Tek Giga Female', '1 clone $3.49 🪙\n6 clones $6.99 🪙\n20 clones $20.99 🪙', '1 LvL']
    ]
  },

  ffa: {
    title: '💠 FFA Cryofridges',
    products: [
      ['Fridges of Flyers', 'Pteras $24.49 🪙\nTapejaras $27.99 🪙\nQuetzals $34.99 🪙\nWyverns $31.49 🪙\nSnow Owl $24.49 🪙\nGriffin $27.99 🪙\nDesmodus $27.99 🪙', 'Top Stats'],
      ['Fridges of DPS', 'Gigas $41.99 🪙\nCarchas $41.99 🪙\nTherizino $24.49 🪙\nThyla $31.49 🪙\nRex $24.49 🪙\nPyro $24.49 🪙\nBasilisk $27.99 🪙\nMegalos $24.49 🪙\nCarno $24.49 🪙\nSpino $31.49 🪙\nMana $34.99 🪙\nKarki $38.49 🪙', 'Top Stats'],
      ['Fridges of Supports', 'Yuty $38.49 🪙\nYi Ling $17.49 🪙\nDaeodon $34.99 🪙\nArthro $27.99 🪙\nDimorph $24.49 🪙\nDeinonychus $24.49 🪙\nBeelzebufo $24.49 🪙\nOvis $20.99 🪙', 'Top Stats'],
      ['Fridges of Waters', 'Plesio $38.49 🪙\nShasta $62.99 🪙\nXipha $20.99 🪙\nBasilo $31.49 🪙\nMegalodon $31.49 🪙\nBary $27.99 🪙\nTuso $34.99 🪙', 'Top Stats'],
      ['Fridges of Soakers', 'Carbo $17.49 🪙\nStego $20.99 🪙\nParacer $31.49 🪙\nDread $41.99 🪙', 'Top Stats'],
      ['Fridges of Mixs', 'Random $34.99 🪙', 'Top Stats'],
      ['Small Dinos', '1x FFA $0.69 🪙\n12x FFAs $4.19 🪙\n36x FFAs $8.75 🪙', '1 imprint during the event'],
      ['Large Dinos', '1x FFA $1.39 🪙\n12x FFAs $10.49 🪙\n36x FFAs $17.15 🪙', '2–3 imprints during the event']
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
      [' Blue | Green Gems ', '30000 [300 slots] $2.79 🪙\n180000 [1800 slots] $6.99 🪙', ''],
      [' Sulfur ', '10000 [100 slots] $2.79 🪙\n30000 [300 slots] $6.29 🪙', ''],
      [' Chitin ', '180000 [1800 slots] $2.09 🪙', ''],
      [' Silk ', '10000 [100 slots] $2.09 🪙\n30000 [300 slots] $6.29 🪙', ''],
      [' Oil ', '30000 [300 slots] $2.79 🪙\n180000 [1800 slots] $9.79 🪙', ''],
      [' Sap ', '3000 [100 slots] $1.39 🪙\n9000 [300 slots] $3.49 🪙', ''],
      [' Hide ', '60000 [300 slots] $1.39 🪙\n360000 [1800 slots] $3.49 🪙', ''],
      [' Silica Pearls ', '30000 [300 slots] $1.39 🪙\n180000 [1800 slots] $4.89 🪙', ''],
      [' Electronics ', '30000 [300 slots] $3.49 🪙\n180000 [1800 slots] $13.99 🪙', ''],
      [' Crystal ', '30000 [300 slots] $1.39 🪙\n180000 [1800 slots] $4.19 🪙', ''],
      [' Cementing Paste ', '30000 [300 slots] $2.09 🪙\n180000 [1800 slots] $6.99 🪙', ''],
      [' Black Pearls ', '60000 [300 slots] $3.49 🪙\n360000 [1800 slots] $13.99 🪙', ''],
      [' Hard Polymer ', '30000 [300 slots] $3.49 🪙\n180000 [1800 slots] $10.49 🪙', ''],
      [' Metal Ingots ', '90000 [300 slots] $1.39 🪙\n540000 [1800 slots] $6.99 🪙', '']
    ]
  },

  structures: {
    title: '💠 Structures',
    products: [
      [' Metal Foundations ', '100x = $1.39 🪙', ''],
      ['<:wall:1557345711216009276> Metal Walls', '100x = $0.69 🪙', ''],
      ['<:ceiling:1557345740827926559> Metal Ceilings', '100x = $1.04 🪙', ''],
      ['<:trianglefoundation:1557345761472028774> Metal Triangle Foundations', '100x = $0.69 🪙', ''],
      ['<:pillar:1557345785308389488> Metal Pilars', '100x = $0.69 🪙', ''],
      ['<:gate:1557345192405893161> Metal Gateways', '100x = $3.49 🪙', ''],
      ['<:cliff:1557345926732062790> Metal Cliff Platforms', '3x = $1.25 🪙', ''],
      ['<:forge:1557345806632099890> Industrial Forges', '1x = $0.34 🪙', ''],
      ['<:chemistrybench:1557345824621469736> Chemistry Benchs', '1x = $0.34 🪙', ''],
      ['<:cooker:1557345107072655380> Industrial Cookers', '1x = $0.34 🪙', ''],
      ['<:grinder:1557345242259136562> Industrial Grinders', '1x = $0.34 🪙', ''],
      ['<:industrialgrill:1557345131009544223> Industrial Grills', '1x = $0.08 🪙', ''],
      ['<:fridge:1557345088495951942> Refrigerators', '1x = $0.08 🪙', ''],
      [' Vaults ', '1x = $0.18 🪙', ''],
      ['<:airconditioner:1557345172243750923> Air Conditioners', '1x = $0.06 🪙', ''],
      ['<:electricalgenerator:1557345261225779257> Electrical Generators', '1x = $0.06 🪙', ''],
      ['<:cryofridge:1557345853872545832> Cryofridges', '1x = $0.06 🪙', ''],
      ['<:motorboat:1557345225507213423> Motorboats', '1x = $1.04 🪙', ''],
      ['<:zeppelin:1557345282142769152> Zeppelins', '1x = $0.49 🪙', ''],
      [' Clockfaces ', '1x = $0.49 🪙', ''],
      ['<:linked:1557345299507191892> Linked Storage Boxs', '1x = $0.49 🪙', ''],
      ['<:steamforges:1557345905148174366> Steam Forges', '1x = $1.04 🪙', ''],
      ['<:megalab:1557346107884052561> Makeshift Megalab', '1x = $0.49 🪙', ''],
      ['<:embryoincubator:1557346045287993504> Embryo Incubators', '1x = $0.49 🪙', ''],
      ['<:sir:1557345318121771038> Sir5RM8', '1x = $0.69 🪙', ''],
      ['<:genescanner:1557346087466045470> Gene Scanners', '1x = $0.49 🪙', ''],
      ['<:genestorage:1557345335699836968> Gene Storages', '1x = $0.49 🪙', ''],
      ['<:preservingbins:1557345354553237504> Industrial Preserving Bins', '1x = $0.49 🪙', ''],
      ['<:tinkeringdesk:1557345373347905656> Tinkering Desks', '1x = $0.49 🪙', ''],
      [' Bio Grinder ', '1x = $0.49 🪙', ''],
      [' Library Storage ', '1x = $0.49 🪙', ''],
      [' Battlerig Garage ', '1x = $0.49 🪙', '']
    ]
  },

  tekstructures: {
    title: '💠 Tek Structures',
    products: [
      [' Tek Foundations ', '100x = $1.39 🪙'],
      [' Tek Walls ', '100x = $0.69 🪙'],
      [' Tek Ceilings ', '100x = $1.04 🪙'],
      [' Tek Triangle Foundations ', '100x = $0.69 🪙'],
      [' Tek Pillars ', '100x = $0.69 🪙'],
      [' Tek Gateways ', '100x = $3.49 🪙'],
      [' Vacuum Compartments ', '5x = $1.39 🪙'],
      [' Tek Troughs ', '1x = $1.04 🪙'],
      [' Small Tek Teleporters ', '1x = $1.04 🪙'],
      [' Medium Tek Teleporters ', '1x = $1.74 🪙'],
      [' Large Tek Teleporters ', '1x = $3.14 🪙'],
      [' Tek Generators ', '1x = $1.74 🪙'],
      [' Tek Replicators ', '1x = $3.14 🪙'],
      [' Tek Transmiters ', '1x = $2.44 🪙'],
      [' Tek Forcefields ', '1x = $3.14 🪙'],
      [' Cloning Chambers ', '1x = $3.14 🪙'],
      [' Tek Dedicated Storages ', '10x = $0.69 🪙'],
      [' Tek Sleeping Pods ', '1x = $0.14 🪙'],
      [' Behemoth Tek Cellar Doors ', '100x = $2.09 🪙'],
      [' Tek Crop Plots ', '10x = $0.69 🪙'],
      [' Tek Sensor ', '1x = $0.34 🪙'],
      [' Tek Hover Skiff ', '1x = $3.49 🪙'],
      [' Tek Jump Pad ', '1x = $0.34 🪙']
    ]
  },

  turrets: {
    title: '💠 Turrets',
    products: [
      [' Auto Turrets ', '1x = $0.14 🪙\n10x = $1.04 🪙\n100x = $6.99 🪙\n300x = $17.49 🪙'],
      [' Bladewasp Hive Turrets ', '1x = $0.63 🪙\n10x = $5.59 🪙\n100x = $48.99 🪙\n300x = $125.99 🪙'],
      [' Heavy Turrets ', '1x = $0.31 🪙\n10x = $3.14 🪙\n100x = $9.44 🪙\n300x = $25.19 🪙'],
      [' Tek Turrets ', '1x = $0.31 🪙\n10x = $3.14 🪙\n100x = $9.44 🪙\n300x = $20.99 🪙'],
      [' Tesla Turrets ', '1x = $0.31 🪙\n10x = $3.14 🪙\n100x = $18.89 🪙\n300x = $44.09 🪙']
    ]
  },

  breeder: {
    title: '💠 Breeder Packs',
    products: [
      ['Gamma PvP Pack', 'Pair $19.59 🪙\nMale only $12.00 🪙', 'Carcha or Giga • Thylacoleo • Therizinosaur • Pyromane'],
      ['Beta PvP Pack', 'Pair $29.39 🪙\nMale only $18.38 🪙', 'Carcha or Giga • Thylacoleo • Basilisk • Velonasaur • Rex • Pyromane • Therizinosaur • Managarmr'],
      ['Alpha PvP Pack', 'Pair $48.99 🪙\nMale only $28.41 🪙', 'Carcha • Thylacoleo • Basilisk • Velonasaur • Spino • Rex • Pyromane • Therizinosaur • Managarmr • Karkinos • Giga • Woolly Rhino • Aber Megalosaurus • Carnotaurus • Dreadmare']
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

const pricesText = `💠 **ROCKWELL**
1x Seat 10.49
2x Seats 18.89
3x Seats 26.24
4x Seats 31.49
5x Seats 36.74
6x Seats 41.99

💠 **ISLAND BOSS PACK**
1x Seat 17.49
2x Seats 31.49
3x Seats 43.74
4x Seats 52.49
5x Seats 61.24
6x Seats 69.99

💠 **TEK CAVE**
1x Seat 8.39
2x Seats 15.39
3x Seats 20.99
4x Seats 25.19
5x Seats 29.39
6x Seats 33.59`;

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
      .setAuthor({ name: 'Small Tribes Crossplay' })
      .setTitle('<:dust:1557299027219849236> Dust')
      .setDescription('**Prices:**\n\n<:dust:1557299027219849236> **100000 [100 slots]**  0.69 🪙\n\n<:dust:1557299027219849236> **300000 [300 slots]**  1.04 🪙\n\n<:dust:1557299027219849236> **900000 [900 slots]**  2.09 🪙\n\n<:dust:1557299027219849236> **1800000 [1 dedi]**  3.49 🪙\n\n<:dust:1557299027219849236> **3600000 [2 dedis]**  5.94 🪙\n\n<:dust:1557299027219849236> **5400000 [3 dedis]**  8.04 🪙\n\n<:dust:1557299027219849236> **7200000 [4 dedis]**  9.79 🪙')
      .setFooter({ text: 'ARK FLEX MARKET • Dust' });
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
      .setAuthor({ name: 'Small Tribes Crossplay' })
      .setTitle('💠 Boss Fight Prices')
      .setDescription(pricesText)
      .setFooter({ text: 'ARK FLEX MARKET • Boss Fights' });
    await message.channel.send({ embeds: [embed] });
    return;
  }

  // ARB command
  if (key === 'arb') {
    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setAuthor({ name: 'Small Tribes Crossplay' })
      .setTitle('<:advancedriflebul:1557294574572011560> Advanced Rifle Bullet [ARB]')
      .setDescription('**Prices:**\n\n<:advancedriflebul:1557294574572011560> **10,000 [100 slots]**  0.69 🪙\n\n<:advancedriflebul:1557294574572011560> **30,000 [300 slots]**  1.39 🪙\n\n<:advancedriflebul:1557294574572011560> **90,000 [900 slots]**  3.49 🪙\n\n<:advancedriflebul:1557294574572011560> **180,000 [1 dedi]**  6.99 🪙\n\n<:advancedriflebul:1557294574572011560> **360,000 [2 dedis]**  11.89 🪙\n\n<:advancedriflebul:1557294574572011560> **540,000 [3 dedis]**  16.09 🪙')
      .setFooter({ text: 'ARK FLEX MARKET • ARB' });
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
