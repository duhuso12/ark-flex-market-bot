require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const config = require('./config');

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
const EMBED_BLUE = 0x00BFFF;
const TICKET_URL =
  `https://discord.com/channels/${config.guildId}/${config.ticketChannelId}`;

const categories = {
  pvp: {
    title: '💠 PvP Dinos',
    products: [
      ['Tek Giganotosaurus', 'Male or Female » $7.50\nPair » $12.50', '1365% Damage • 269 pts'],
      ['Cap Carcharodontosaurus [376 LvL]', 'Male or Female » $7.50\nPair » $12.50', '18968 Health • 871 Weight • 305 pts'],
      ['Cap Therizinosaur [385 LvL]', 'Male or Female » $4.99\nPair » $7.99', '1825% Damage • 17400 Health'],
      ['Cap Thylacoleo [378 LvL]', 'Male or Female » $4.99\nPair » $7.99', '43820 Health • 840 Weight'],
      ['Cap Rexs', 'Male or Female » $4.99\nPair » $7.99', 'Rex V1 • Rex V2 • Rex V3'],
      ['Cap Woolly Rhino [382 LvL]', 'Male or Female » $4.99\nPair » $7.99', '1936% Damage • 308 pts'],
      ['Chalicotheriums', 'Male or Female » $4.99\nPair » $7.99', 'V1: 972% • V2: 1913%'],
      ['Cap Pyromanes', 'Male or Female » $4.99\nPair » $7.99', '3 variants available'],
      ['Cap Basilisk [390 LvL]', 'Male or Female » $4.99\nPair » $7.99', '1619% Damage • 28325 Health'],
      ['Cap Dreadmare', 'Male or Female » $4.99\nPair » $7.99', '51000 Health • 1242 Weight'],
      ['Cap Aber Megalosaurus [375 LvL]', 'Male or Female » $4.99\nPair » $7.99', '1372% Damage • 24993 Health'],
      ['Cap Aber Carnotaurus [382 LvL]', 'Male or Female » $4.99\nPair » $7.99', '24514 Health'],
      ['Cap Aberrant Spino [382 LvL]', 'Male or Female » $4.99\nPair » $7.99', '1260% Damage • 23338 Health'],
      ['Megatherium', 'Male or Female » $2.99\nPair » $4.99', '578% Damage • 12728 Health'],
      ['Cap Velonasaurs', 'Male or Female » $4.99\nPair » $7.99', '2 variants available'],
      ['Cap Managarmrs', 'Male or Female » $4.99\nPair » $7.99', '2 variants available'],
      ['Karkinos', 'Male or Female » $4.99\nPair » $7.99', '52560 Health'],
      ['Cap Unicorn [378 LvL]', 'Male or Female » $4.99\nPair » $7.99', '1772% Damage • 2544 Health'],
      ['Ossidon', 'Male or Female » $4.99\nPair » $7.99', '766% Damage • 32604 Health'],
      ['Acrocanthosaurus', 'Male or Female » $4.99\nPair » $7.99', '666% Damage • 25740 Health']
    ]
  },

  water: {
    title: '💠 Water Dinos',
    products: [
      ['Cap Deinosuchus [367 LvL]', 'Male or Female » $4.99\nPair » $7.99', '33400 Health • 954% Damage'],
      ['Plesiosaur', 'Male or Female » $4.99\nPair » $7.99', 'V1: 43296 Health • V2: 66912 Health'],
      ['Mosasaurus', 'Male or Female » $4.99\nPair » $7.99', '30384 Health • 522% Damage'],
      ['Shastasaurus', 'Male or Female » $7.50\nPair » $12.50', 'V1: 100620 Health • V2: 172980 Health'],
      ['Cap Xiphactinus [387 LvL]', 'Male or Female » $4.99\nPair » $7.99', '24390 Health • 839% Damage'],
      ['Cap Basilosaurus [374 LvL]', 'Male or Female » $4.99\nPair » $7.99', '157440 Health'],
      ['Cap Megalodon [369 LvL]', 'Male or Female » $4.99\nPair » $7.99', '39240 Health'],
      ['Cap Baryonyx [364 LvL]', 'Male or Female » $4.99\nPair » $7.99', '28512 Health'],
      ['Cap Tuso [376 LvL]', 'Male or Female » $7.50\nPair » $12.50', '1625% Damage • 56700 Health'],
      ['Cap Kaprosuchus [386 LvL]', 'Male or Female » $4.99\nPair » $7.99', '6000 Health • 1007% Damage'],
      ['Cap Helicoprion', 'Male or Female » $2.99\nPair » $4.99', 'Craft: 80%']
    ]
  },

  flyers: {
    title: '💠 Flyers',
    products: [
      ['Cap Quetzal [378 LvL]', 'Male or Female » $7.50\nPair » $12.50', '63240 Health • 305 pts'],
      ['Cap Tapejara [380 LvL]', 'Male or Female » $4.99\nPair » $7.99', '17286 Health • 307 pts'],
      ['Cap Pteranodons', 'Male or Female » $2.99\nPair » $4.99', '2 variants available'],
      ['Argentavis', 'Male or Female » $2.99\nPair » $4.99', '5402 Health • 984 Weight'],
      ['Cap Wyverns', 'Male or Female » $7.50\nPair » $12.50', 'Lightning • Poison • Fire • Ice'],
      ['War Rhyniognathas [350-390 LvLs]', '1x » $4.99', '80k-90k+'],
      ['Cap Snow Owl [385 LvL]', 'Male or Female » $4.99\nPair » $7.99', '19175 Health • 290 pts'],
      ['Farm Rhyniognatha', '1x » $9.99', '10 000+'],
      ['Cap Griffins', 'Male or Female » $4.99\nPair » $7.99', '4 variants available'],
      ['Cap Desmodus', 'Male or Female » $4.99\nPair » $7.99', '2 variants available'],
      ['Gigadesmodus', 'Male or Female » $7.50\nPair » $12.50', '14585 • 429%'],
      ['Aureliax', 'Male or Female » $4.99\nPair » $7.99', '42160 Health']
    ]
  },

  supports: {
    title: '💠 Supports',
    products: [
      ['Cap Yutyrannus [384 LvL]', 'Male or Female » $4.99\nPair » $7.99', '69740 Health'],
      ['Cap Yi Ling [389 LvL]', 'Male or Female » $4.99\nPair » $7.99', '20150 Health'],
      ['Cap Daeodon [362 LvL]', 'Male or Female » $4.99\nPair » $7.99', '93437 Food'],
      ['Cap Arthropluera [387 LvL]', 'Male or Female » $4.99\nPair » $7.99', '2178% Damage'],
      ['Cap Deinonychus [384 LvL]', 'Male or Female » $4.99\nPair » $7.99', '11720 Health • 502% Damage'],
      ['Cap Beelzebufo [370 LvL]', 'Male or Female » $4.99\nPair » $7.99', '13263 Health'],
      ['Cap Ovis [369 LvL]', 'Male or Female » $2.99\nPair » $4.99', '6200 Health'],
      ['Cap Gigantopithecus [391 LvL]', 'Male or Female » $4.99\nPair » $7.99', '9536 Health • 864% Damage'],
      ['Cap Drakeling [389 LvL]', 'Male or Female » $4.99\nPair » $7.99', '4680 Health'],
      ['Cap Veilwyn [381 LvL]', 'Male or Female » $4.99\nPair » $7.99', '6400 Health • 1229% Damage'],
      ['Burrowbuck', 'Male or Female » $4.99\nPair » $7.99', '6380 Health'],
      ['Cryolophosaurus', 'Male or Female » $4.99\nPair » $7.99', '7000 Health • 493% Damage'],
      ['Grand Tortugar', 'Male or Female » $4.99\nPair » $7.99', '40950 Health']
    ]
  },

  soakers: {
    title: '💠 Soakers',
    products: [
      ['Karkinos', 'Male or Female » $4.99\nPair » $7.99', '2416 Weight'],
      ['Cap Kentrosaurus [375 LvL]', '1x » $4.99', '20150 Health • 990% Damage'],
      ['Cap Brontosaurus', 'Male or Female » $4.99\nPair » $7.99', '2 variants available'],
      ['Cap Woolly Rhino [382 LvL]', 'Male or Female » $4.99\nPair » $7.99', '1936% Damage']
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
      ['Maeguana', 'Male or Female » $2.99\nPair » $4.99', '34400 Food • 6055 Health'],
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

  ffa: {
    title: '💠 FFA Cryofridges',
    products: [
      ['Fridges of Flyers', 'Pteras $34.99 • Tapejaras $39.99 • Quetzals $49.99 • Wyverns $44.99\nSnow Owl $34.99 • Griffin $39.99 • Desmodus $39.99', 'Top Stats'],
      ['Fridges of DPS', 'Gigas $59.99 • Carchas $59.99 • Therizino $34.99 • Thyla $44.99\nRex $34.99 • Pyro $34.99 • Basilisk $39.99 • Megalos $34.99\nCarno $34.99 • Spino $44.99 • Mana $49.99 • Karki $54.99', 'Top Stats'],
      ['Fridges of Supports', 'Yuty $54.99 • Yi Ling $24.99 • Daeodon $49.99 • Arthro $39.99\nDimorph $34.99 • Deinonychus $34.99 • Beelzebufo $34.99 • Ovis $29.99', 'Top Stats'],
      ['Fridges of Waters', 'Plesio $54.99 • Shasta $89.99 • Xipha $29.99 • Basilo $44.99\nMegalodon $44.99 • Bary $39.99 • Tuso $49.99', 'Top Stats'],
      ['Fridges of Soakers', 'Carbo $24.99 • Stego $29.99 • Paracer $44.99 • Dread $59.99', 'Top Stats'],
      ['Fridges of Mixs', 'Random » $49.99', 'Top Stats'],
      ['Small Dinos', '1x FFA » $0.99\n12x FFAs » $5.99\n36x FFAs » $12.50', '1 imprint during the event'],
      ['Large Dinos', '1x FFA » $1.99\n12x FFAs » $14.99\n36x FFAs » $24.50', '2–3 imprints during the event']
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
      .setLabel('OPEN TICKET')
      .setEmoji('🎫')
      .setStyle(ButtonStyle.Link)
      .setURL(TICKET_URL)
  );
}

// ARK creature artwork. We use the ARK Official Community Wiki
// file redirect so Discord receives the actual creature image.
const IMAGE_ALIASES = {
  // Use actual ARK creature artwork from the ARK Official Community Wiki.
  // Keep these as direct file URLs so Discord gets the real creature image.
  'Tek Giganotosaurus': 'Giganotosaurus.png',
  'Cap Carcharodontosaurus': 'Carcharodontosaurus.png',
  'Cap Therizinosaur': 'Therizinosaur.png',
  'Cap Thylacoleo': 'Thylacoleo.png',
  'Cap Rexs': 'Rex.png',
  'Cap Woolly Rhino': 'Woolly_Rhino.png',
  'Chalicotheriums': 'Chalicotherium_large.png',
  'Cap Pyromanes': 'Pyromane.png',
  'Cap Basilisk': 'Basilisk.png',
  'Cap Dreadmare': 'Dreadmare.png',
  'Cap Aber Megalosaurus': 'Aberrant_Megalosaurus.png',
  'Cap Aber Carnotaurus': 'Aberrant_Carnotaurus.png',
  'Cap Aberrant Spino': 'Aberrant_Spino.png',
  'Megatherium': 'Megatherium.png',
  'Cap Velonasaurs': 'Velonasaur.png',
  'Cap Managarmrs': 'Managarmr.png',
  'Karkinos': 'Karkinos.png',
  'Cap Unicorn': 'Unicorn.png',
  'Ossidon': 'Ossidon.png',
  'Acrocanthosaurus': 'Acrocanthosaurus.png',
  'Cap Deinosuchus': 'Deinosuchus.png',
  'Plesiosaur': 'Plesiosaur.png',
  'Mosasaurus': 'Mosasaurus.png',
  'Shastasaurus': 'Shastasaurus.png',
  'Cap Xiphactinus': 'Xiphactinus.png',
  'Cap Basilosaurus': 'Basilosaurus.png',
  'Cap Megalodon': 'Megalodon.png',
  'Cap Baryonyx': 'Baryonyx.png',
  'Cap Tuso': 'Tusoteuthis.png',
  'Cap Kaprosuchus': 'Kaprosuchus.png',
  'Cap Helicoprion': 'Helicoprion.png',
  'Cap Quetzal': 'Quetzal.png',
  'Cap Tapejara': 'Tapejara.png',
  'Cap Pteranodons': 'Pteranodon.png',
  'Argentavis': 'Render_Argentavis.png',
  'Cap Wyverns': 'Wyvern.png',
  'War Rhyniognathas': 'Rhyniognatha.png',
  'Cap Snow Owl': 'Snow_Owl.png',
  'Farm Rhyniognatha': 'Rhyniognatha.png',
  'Cap Griffins': 'Griffin.png',
  'Cap Desmodus': 'Desmodus.png',
  'Gigadesmodus': 'Desmodus.png',
  'Aureliax': 'Aureliax.png',
  'Cap Yutyrannus': 'Yutyrannus.png',
  'Cap Yi Ling': 'Yi_Ling.png',
  'Cap Daeodon': 'Daeodon.png',
  'Cap Arthropluera': 'Arthropluera.png',
  'Cap Deinonychus': 'Deinonychus.png',
  'Cap Beelzebufo': 'Beelzebufo.png',
  'Cap Ovis': 'Ovis.png',
  'Cap Gigantopithecus': 'Gigantopithecus.png',
  'Cap Drakeling': 'Drakeling.png',
  'Cap Veilwyn': 'Veilwyn.png',
  'Burrowbuck': 'Burrowbuck.png',
  'Cryolophosaurus': 'Cryolophosaurus.png',
  'Grand Tortugar': 'Grand_Tortugar.png',
  'Cap Kentrosaurus': 'Kentrosaurus.png',
  'Cap Brontosaurus': 'Brontosaurus.png',
  'Dung Beetle': 'Dung_Beetle.png',
  'Achatina': 'Achatina.png',
  'Giant Bee': 'Giant_Bee.png',
  'Iguanodon': 'Iguanodon.png',
  'Diplocaulus': 'Diplocaulus.png',
  'Armadoggo': 'Armadoggo.png',
  'Mammoth': 'Mammoth.png',
  'Otter': 'Otter.png',
  'Gachas': 'Gacha.png',
  'Maeguana': 'Maeguana.png',
  'Oviraptor': 'Oviraptor.png',
  'Pegomastax': 'Pegomastax.png',
  'Procoptodon': 'Procoptodon.png',
  'Pelagornis': 'Pelagornis.png',
  'Dunkleosteus': 'Dunkleosteus.png',
  'Anglerfish': 'Anglerfish.png',
  'Fasolasuchus': 'Fasolasuchus.png',
  'Doedicurus': 'Doedicurus.png',
  'Deinotherium': 'Deinotherium.png'
};

function getImageUrl(name) {
  const baseName = name.replace(/\s+\[.*?\]$/, '').trim();
  const file = IMAGE_ALIASES[baseName];
  if (!file) return null;
  return `https://ark.wiki.gg/wiki/Special:Redirect/file/${encodeURIComponent(file)}`;
}

function makeDinoEmbed(category, product, index, total) {
  const [name, price, stats] = product;

  const embed = new EmbedBuilder()
    .setColor(EMBED_BLUE)
    .setAuthor({ name: 'Infinity Market - Small Tribes Crossplay' })
    .setTitle(`🔷 ${name.replace(/\s*\[\d+\s*LvL\]/gi, '')}`)
    .addFields(
      ...(stats ? [{
        name: '🔷 Stats',
        value: stats,
        inline: false
      }] : []),
      {
        name: '💰 Price',
        value: price.replace(/\n/g, '\n\n'),
        inline: false
      }
    )
    .setFooter({
      text: `ARK FLEX MARKET • ${category.title.replace('💠 ', '')} • ${index}/${total}`
    });

  const imageUrl = getImageUrl(name);
  if (imageUrl) embed.setImage(imageUrl);

  return embed;
}


async function sendCategory(message, key) {
  const category = categories[key];
  if (!category) return;

  // Discord allows up to 10 embeds per message. Each product stays
  // separate so its image appears directly below its own price block.
  const perMessage = 10;

  for (let i = 0; i < category.products.length; i += perMessage) {
    const batch = category.products.slice(i, i + perMessage);

    await message.channel.send({
      embeds: batch.map((product, offset) =>
        makeDinoEmbed(
          category,
          product,
          i + offset + 1,
          category.products.length
        )
      ),
      components: [makeButtonRow()]
    });
  }
}

client.once('ready', () => {
  console.log(`ARK FLEX MARKET online as ${client.user.tag}`);

  console.log(
    'Commands:',
    Object.keys(categories)
      .map(command => `!${command}`)
      .join(', ')
  );
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const command = message.content.trim().toLowerCase();

  if (!command.startsWith(PREFIX)) return;

  const key = command
    .slice(PREFIX.length)
    .split(/\s+/)[0];

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
        makeEmbed(
          arb,
          arb.products,
          1,
          1
        )
      ],
      components: [makeButtonRow()]
    });

    return;
  }

  if (categories[key]) {
    await sendCategory(message, key);
  }
});

client.login(process.env.DISCORD_TOKEN);
