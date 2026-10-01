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
const TICKET_URL = `https://discord.com/channels/${config.guildId}/${config.ticketChannelId}`;

const categories = {
  "pvp": {
    "title": "💠 PvP Dinos",
    "products": [
      [
        "Tek Giganotosaurus",
        "Male or Female » $7.50\nPair » $12.50",
        "1365% Damage • 269 pts"
      ],
      [
        "Cap Carcharodontosaurus",
        "Male or Female » $7.50\nPair » $12.50",
        "18968 Health • 871 Weight • 305 pts"
      ],
      [
        "Cap Therizinosaur",
        "Male or Female » $4.99\nPair » $7.99",
        "1825% Damage • 17400 Health"
      ],
      [
        "Cap Thylacoleo",
        "Male or Female » $4.99\nPair » $7.99",
        "43820 Health • 840 Weight"
      ],
      [
        "Cap Rexs",
        "Male or Female » $4.99\nPair » $7.99",
        "Rex V1: 41360 Health • 1184% Damage\nRex V2: 29920 Health • 1407% Damage\nRex V3: 32120 Health • 1584% Damage"
      ],
      [
        "Cap Woolly Rhino",
        "Male or Female » $4.99\nPair » $7.99",
        "1936% Damage • 308 pts"
      ],
      [
        "Chalicotheriums",
        "Male or Female » $4.99\nPair » $7.99",
        "V1: 972% Damage\nV2: 1913% Damage"
      ],
      [
        "Cap Pyromanes",
        "Male or Female » $4.99\nPair » $7.99",
        "V1: 21120 Health • 873% Damage\nV2: 38160 Health\nV3: 1315% Damage • 14040 Health"
      ],
      [
        "Cap Basilisk",
        "Male or Female » $4.99\nPair » $7.99",
        "1619% Damage • 28325 Health"
      ],
      [
        "Cap Dreadmare",
        "Male or Female » $4.99\nPair » $7.99",
        "51000 Health • 1242 Weight"
      ],
      [
        "Cap Aber Megalosaurus",
        "Male or Female » $4.99\nPair » $7.99",
        "1372% Damage • 24993 Health"
      ],
      [
        "Cap Aber Carnotaurus",
        "Male or Female » $4.99\nPair » $7.99",
        "24514 Health"
      ],
      [
        "Cap Aberrant Spino",
        "Male or Female » $4.99\nPair » $7.99",
        "1260% Damage • 23338 Health"
      ],
      [
        "Megatherium",
        "Male or Female » $2.99\nPair » $4.99",
        "578% Damage • 12728 Health"
      ],
      [
        "Cap Velonasaurs",
        "Male or Female » $4.99\nPair » $7.99",
        "V1: 1325% Damage • 11880 Health\nV2: 1960% Damage • 2904 Health"
      ],
      [
        "Cap Managarmrs",
        "Male or Female » $4.99\nPair » $7.99",
        "V1: 1154% Damage • 14850 Health\nV2: 1625% Damage • 9900 Health"
      ],
      [
        "Karkinos",
        "Male or Female » $4.99\nPair » $7.99",
        "52560 Health"
      ],
      [
        "Cap Unicorn",
        "Male or Female » $4.99\nPair » $7.99",
        "1772% Damage • 2544 Health"
      ],
      [
        "Cap Malwyn",
        "1x clone » $4.99",
        "27200 Health • 1102% Damage"
      ],
      [
        "Cap Solwyn",
        "1x clone » $4.99",
        "20800 Health • 1102% Damage"
      ],
      [
        "Ossidon",
        "Male or Female » $4.99\nPair » $7.99",
        "766% Damage • 32604 Health"
      ],
      [
        "Acrocanthosaurus",
        "Male or Female » $4.99\nPair » $7.99",
        "666% Damage • 25740 Health"
      ]
    ]
  },
  "soakers": {
    "title": "💠 Soakers",
    "products": [
      [
        "Cap Carbonemys",
        "Male or Female » $2.99\nPair » $4.99",
        "40950 Health"
      ],
      [
        "Cap Stegosaurus",
        "Male or Female » $4.99\nPair » $7.99",
        "41080 Health • 825 Oxygen • 930 Food"
      ],
      [
        "Cap Paraceratherium",
        "Male or Female » $4.99\nPair » $7.99",
        "65458 Health"
      ],
      [
        "Cap Tek Triceratops",
        "Male or Female » $4.99\nPair » $7.99",
        "24075 Health"
      ],
      [
        "Cap Gasbags",
        "Male or Female » $4.99\nPair » $7.99",
        "32370 Health • 9550 Oxygen • 3060 Food"
      ],
      [
        "Dreadnoughtus",
        "Male or Female » $7.50\nPair » $12.50",
        "V1: 580640 Health • 510% Damage\nV2: 674080 Health • 356% Damage\nV3: 456480 Health • 673% Damage"
      ]
    ]
  },
  "flyers": {
    "title": "💠 Flyers",
    "products": [
      [
        "Cap Quetzal",
        "Male or Female » $7.50\nPair » $12.50",
        "63240 Health • 305 pts"
      ],
      [
        "Cap Tapejara",
        "Male or Female » $4.99\nPair » $7.99",
        "17286 Health • 307 pts"
      ],
      [
        "Cap Pteranodons",
        "Male or Female » $2.99\nPair » $4.99",
        "2 variants available"
      ],
      [
        "Argentavis",
        "Male or Female » $2.99\nPair » $4.99",
        "5402 Health • 984 Weight"
      ],
      [
        "Cap Wyverns",
        "Male or Female » $7.50\nPair » $12.50",
        "Lightning • Poison • Fire • Ice"
      ],
      [
        "War Rhyniognathas",
        "1x » $4.99",
        "80k-90k+"
      ],
      [
        "Cap Snow Owl",
        "Male or Female » $4.99\nPair » $7.99",
        "19175 Health • 290 pts"
      ],
      [
        "Farm Rhyniognatha",
        "1x » $9.99",
        "10 000+"
      ],
      [
        "Cap Griffins",
        "Male or Female » $4.99\nPair » $7.99",
        "4 variants available"
      ],
      [
        "Cap Desmodus",
        "Male or Female » $4.99\nPair » $7.99",
        "2 variants available"
      ],
      [
        "Gigadesmodus",
        "Male or Female » $7.50\nPair » $12.50",
        "14585 Health • 429% Damage"
      ],
      [
        "Aureliax",
        "Male or Female » $4.99\nPair » $7.99",
        "42160 Health"
      ]
    ]
  },
  "water": {
    "title": "💠 Water Dinos",
    "products": [
      [
        "Cap Deinosuchus",
        "Male or Female » $4.99\nPair » $7.99",
        "33400 Health • 954% Damage"
      ],
      [
        "Plesiosaur",
        "Male or Female » $4.99\nPair » $7.99",
        "V1: 43296 Health\nV2: 66912 Health"
      ],
      [
        "Mosasaurus",
        "Male or Female » $4.99\nPair » $7.99",
        "30384 Health • 522% Damage"
      ],
      [
        "Shastasaurus",
        "Male or Female » $7.50\nPair » $12.50",
        "V1: 100620 Health\nV2: 172980 Health"
      ],
      [
        "Cap Xiphactinus",
        "Male or Female » $4.99\nPair » $7.99",
        "24390 Health • 839% Damage"
      ],
      [
        "Cap Basilosaurus",
        "Male or Female » $4.99\nPair » $7.99",
        "157440 Health"
      ],
      [
        "Cap Megalodon",
        "Male or Female » $4.99\nPair » $7.99",
        "39240 Health"
      ],
      [
        "Cap Baryonyx",
        "Male or Female » $4.99\nPair » $7.99",
        "28512 Health"
      ],
      [
        "Cap Tuso",
        "Male or Female » $7.50\nPair » $12.50",
        "1625% Damage • 56700 Health"
      ],
      [
        "Cap Kaprosuchus",
        "Male or Female » $4.99\nPair » $7.99",
        "6000 Health • 1007% Damage"
      ],
      [
        "Cap Helicoprion",
        "Male or Female » $2.99\nPair » $4.99",
        "80% Crafting"
      ]
    ]
  },
  "farm": {
    "title": "💠 Farm",
    "products": [
      [
        "Dung Beetle",
        "1x » $1.99"
      ],
      [
        "Cap Brontosaurus",
        "Male or Female » $4.99\nPair » $7.99",
        "V1: 127056 Health\nV2: 8000 Weight • 27870 Health"
      ],
      [
        "Moschops",
        "Male or Female » $2.99\nPair » $4.99",
        "1280% Damage"
      ],
      [
        "Achatina",
        "1x » $1.99"
      ],
      [
        "Procoptodon",
        "Male or Female » $2.99\nPair » $4.99",
        "1199 Weight"
      ],
      [
        "Giant Bee",
        "1x » $1.99"
      ],
      [
        "Cap Mantis",
        "Male or Female » $2.99\nPair » $4.99",
        "V1: 872% Damage • 3245 Health\nV2: 1025% Damage"
      ],
      [
        "Pelagornis",
        "Male or Female » $2.99\nPair » $4.99",
        "475% Damage"
      ],
      [
        "Dunkleosteus",
        "Male or Female » $2.99\nPair » $4.99",
        "V1: 2930 Weight • 616% Damage\nV2: 3840 Weight • 663% Damage"
      ],
      [
        "Anglerfish",
        "Male or Female » $2.99\nPair » $4.99",
        "851% Damage"
      ],
      [
        "Iguanodon",
        "1x » $1.99"
      ],
      [
        "Gachas",
        "Male or Female » $2.99\nPair » $4.99",
        "V1-V6 available • resource-specific variants"
      ],
      [
        "Beelzebufo",
        "1x » $1.99"
      ],
      [
        "Fasolasuchus",
        "Male or Female » $2.99\nPair » $4.99",
        "972 Weight • 425% Damage"
      ],
      [
        "Doedicurus",
        "Male or Female » $2.99\nPair » $4.99",
        "704% Damage"
      ],
      [
        "Karkinos",
        "Male or Female » $4.99\nPair » $7.99",
        "2416 Weight"
      ],
      [
        "Cap Ovis",
        "Male or Female » $2.99\nPair » $4.99",
        "6200 Health"
      ],
      [
        "Cap Ankylosaurus",
        "Male or Female » $2.99\nPair » $4.99",
        "1927% Damage"
      ]
    ]
  },
  "support": {
    "title": "💠 Support",
    "products": [
      [
        "Diplocaulus",
        "1x » $1.99"
      ],
      [
        "Armadoggo",
        "1x » $1.99"
      ],
      [
        "Mammoth",
        "1x » $1.99"
      ],
      [
        "Gigantoraptor",
        "Male or Female » $2.99\nPair » $4.99",
        "7546 Health"
      ],
      [
        "Maeguana",
        "Male or Female » $2.99\nPair » $4.99",
        "34400 Food • 6055 Health"
      ],
      [
        "Otter",
        "1x » $1.99"
      ],
      [
        "Oviraptor",
        "Male or Female » $2.99\nPair » $4.99",
        "262 Weight"
      ],
      [
        "Pegomastax",
        "Male or Female » $2.99\nPair » $4.99",
        "139 Weight"
      ],
      [
        "Cap Terror Bird",
        "Male or Female » $2.99\nPair » $4.99",
        "16848 Health"
      ],
      [
        "Cap Yutyrannus",
        "Male or Female » $4.99\nPair » $7.99",
        "69740 Health"
      ],
      [
        "Cap Yi Ling",
        "Male or Female » $4.99\nPair » $7.99",
        "20150 Health"
      ],
      [
        "Cap Daeodon",
        "Male or Female » $4.99\nPair » $7.99",
        "93437 Food"
      ],
      [
        "Cap Arthropluera",
        "Male or Female » $4.99\nPair » $7.99",
        "2178% Damage"
      ],
      [
        "Reaper",
        "1x » $4.99",
        "20306 Health • 337% Damage"
      ],
      [
        "Deinotherium",
        "Male or Female » $2.99\nPair » $4.99",
        "16450 Health"
      ],
      [
        "Cap Drakeling",
        "Male or Female » $4.99\nPair » $7.99",
        "4680 Health"
      ],
      [
        "Dimorphodon",
        "Male or Female » $4.99\nPair » $7.99",
        "3125 Health • 1172% Damage"
      ],
      [
        "Rock Drake",
        "Male or Female » $4.99\nPair » $7.99",
        "24768 Health"
      ],
      [
        "Cap Gloon",
        "Male or Female » $4.99\nPair » $7.99",
        "1919% Damage"
      ],
      [
        "Cap Deinonychus",
        "Male or Female » $4.99\nPair » $7.99",
        "11720 Health • 502% Damage"
      ],
      [
        "Cap Gigantopithecus",
        "Male or Female » $4.99\nPair » $7.99",
        "9536 Health • 864% Damage"
      ],
      [
        "Cap Kentrosaurus",
        "1x » $4.99",
        "20150 Health • 990% Damage"
      ],
      [
        "Cap Beelzebufo",
        "Male or Female » $4.99\nPair » $7.99",
        "13263 Health"
      ],
      [
        "Cap Veilwyn",
        "Male or Female » $4.99\nPair » $7.99",
        "6400 Health • 1229% Damage"
      ],
      [
        "Burrowbuck",
        "Male or Female » $4.99\nPair » $7.99",
        "6380 Health"
      ],
      [
        "Cryolophosaurus",
        "Male or Female » $4.99\nPair » $7.99",
        "7000 Health • 493% Damage"
      ],
      [
        "Grand Tortugar",
        "Male or Female » $4.99\nPair » $7.99",
        "40950 Health"
      ]
    ]
  },
  "eggs": {
    "title": "💠 Eggs & Embryos",
    "products": [
      [
        "🥚 Eggs — 10",
        "10 Eggs [1x Dino] » $7.50",
        "Minimum 10 eggs per dino type • extra eggs $0.50"
      ],
      [
        "🥚 Eggs — 30",
        "30 Eggs [3x Different dinos] » $17.50",
        "Extra eggs $0.40"
      ],
      [
        "🥚 Eggs — 50",
        "50 Eggs [5x Different dinos] » $24.99",
        "Extra eggs $0.30"
      ],
      [
        "🥚 Eggs — 100",
        "100 Eggs [10x Different dinos] » $39.99",
        "Extra eggs $0.20"
      ],
      [
        "🥚 Eggs — 200",
        "200 Eggs [20x Different dinos] » $69.99",
        "Extra eggs $0.10"
      ],
      [
        "🥚 Eggs — 300",
        "300 Eggs [30x Different dinos] » $99.99",
        "Extra eggs $0.50"
      ],
      [
        "🧬 Embryos — 10",
        "10 Embryos [1x Dino] » $11.25",
        "Extra embryos $0.75"
      ],
      [
        "🧬 Embryos — 30",
        "30 Embryos [3x Different dinos] » $26.25",
        "Extra embryos $0.60"
      ],
      [
        "🧬 Embryos — 50",
        "50 Embryos [5x Different dinos] » $37.50",
        "Extra embryos $0.45"
      ],
      [
        "🧬 Embryos — 100",
        "100 Embryos [10x Different dinos] » $59.99",
        "Extra embryos $0.30"
      ],
      [
        "🧬 Embryos — 200",
        "200 Embryos [20x Different dinos] » $104.99",
        "Extra embryos $0.15"
      ],
      [
        "🧬 Embryos — 300",
        "300 Embryos [30x Different dinos] » $149.99",
        "Extra embryos $0.75"
      ]
    ]
  },
  "cloners": {
    "title": "💠 Cloners",
    "products": [
      [
        "Phoenix",
        "1 Clone » $4.99\n6 Clones » $17.50\n20 Clones » $49.99",
        "+ 2 Gachas gift at 20"
      ],
      [
        "Karkinos",
        "1 Clone » $4.99\n6 Clones » $9.99\n20 Clones » $29.99",
        "+ 1 Moschops gift at 20"
      ],
      [
        "Reaper",
        "1 Clone » $4.99\n6 Clones » $9.99\n20 Clones » $29.99",
        ""
      ],
      [
        "Tek Giga Female",
        "1 Clone » $4.99\n6 Clones » $9.99\n20 Clones » $29.99",
        ""
      ]
    ]
  },
  "ffa": {
    "title": "💠 FFA Cryofridges",
    "products": [
      [
        "Fridges of Flyers",
        "Pteras » $34.99\nTapejaras » $39.99\nQuetzals » $49.99\nWyverns (Any type) » $44.99\nSnow Owl » $34.99\nGriffin » $39.99\nDesmodus » $39.99",
        "Top Stats"
      ],
      [
        "Fridges of DPS",
        "Gigas » $59.99\nCarchas » $59.99\nTherizino » $34.99\nThyla » $44.99\nRex » $34.99\nPyro » $34.99\nBasilisk » $39.99\nMegalos » $34.99\nCarno » $34.99\nSpino » $44.99\nMana » $49.99\nKarki » $54.99",
        "Top Stats"
      ],
      [
        "Fridges of Supports",
        "Yuty » $54.99\nYi Ling » $24.99\nDaeodon » $49.99\nArthro » $39.99\nDimorph » $34.99\nDeinonychus » $34.99\nBeelzebufo » $34.99\nOvis » $29.99",
        "Top Stats"
      ],
      [
        "Fridges of Waters",
        "Plesio » $54.99\nShasta » $89.99\nXipha » $29.99\nBasilo » $44.99\nMegalodon » $44.99\nBary » $39.99\nTuso » $49.99",
        "Top Stats"
      ],
      [
        "Fridges of Soakers",
        "Carbo » $24.99\nStego » $29.99\nParacer » $44.99\nDread » $59.99",
        "Top Stats"
      ],
      [
        "Fridges of Mixs",
        "Random » $49.99",
        "Top Stats"
      ],
      [
        "Small Dinos",
        "1x FFA » $0.99\n12x FFAs » $5.99\n36x FFAs » $12.50",
        "1 imprint during the event"
      ],
      [
        "Large Dinos",
        "1x FFA » $1.99\n12x FFAs » $14.99\n36x FFAs » $24.50",
        "2–3 imprints during the event"
      ]
    ]
  }
};

const DOSSIER_ALIASES = {
  "Tek Giganotosaurus": "Giganotosaurus",
  "Cap Carcharodontosaurus": "Carcharodontosaurus",
  "Cap Therizinosaur": "Therizinosaur",
  "Cap Thylacoleo": "Thylacoleo",
  "Cap Rexs": "Rex",
  "Cap Woolly Rhino": "Woolly Rhino",
  "Chalicotheriums": "Chalicotherium",
  "Cap Pyromanes": "Pyromane",
  "Cap Basilisk": "Basilisk",
  "Cap Dreadmare": "Dreadmare",
  "Cap Aber Megalosaurus": "Megalosaurus",
  "Cap Aber Carnotaurus": "Carnotaurus",
  "Cap Aberrant Spino": "Spino",
  "Megatherium": "Megatherium",
  "Cap Velonasaurs": "Velonasaur",
  "Cap Managarmrs": "Managarmr",
  "Karkinos": "Karkinos",
  "Cap Unicorn": "Unicorn",
  "Ossidon": "Ossidon",
  "Acrocanthosaurus": "Acrocanthosaurus",
  "Cap Carbonemys": "Carbonemys",
  "Cap Stegosaurus": "Stegosaurus",
  "Cap Paraceratherium": "Paraceratherium",
  "Cap Tek Triceratops": "Triceratops",
  "Cap Gasbags": "Gasbags",
  "Dreadnoughtus": "Dreadnoughtus",
  "Cap Deinosuchus": "Deinosuchus",
  "Plesiosaur": "Plesiosaur",
  "Mosasaurus": "Mosasaurus",
  "Shastasaurus": "Shastasaurus",
  "Cap Xiphactinus": "Xiphactinus",
  "Cap Basilosaurus": "Basilosaurus",
  "Cap Megalodon": "Megalodon",
  "Cap Baryonyx": "Baryonyx",
  "Cap Tuso": "Tusoteuthis",
  "Cap Kaprosuchus": "Kaprosuchus",
  "Cap Helicoprion": "Helicoprion",
  "Cap Quetzal": "Quetzal",
  "Cap Tapejara": "Tapejara",
  "Cap Pteranodons": "Pteranodon",
  "Argentavis": "Argentavis",
  "Cap Wyverns": "Wyvern",
  "War Rhyniognathas": "Rhyniognatha",
  "Cap Snow Owl": "Snow Owl",
  "Farm Rhyniognatha": "Rhyniognatha",
  "Cap Griffins": "Griffin",
  "Cap Desmodus": "Desmodus",
  "Gigadesmodus": "Desmodus",
  "Giga Desmodus": "Desmodus",
  "GigaDesmodus": "Desmodus",
  "Aureliax": "Aureliax",
  "Cap Yutyrannus": "Yutyrannus",
  "Cap Yi Ling": "Yi Ling",
  "Cap Daeodon": "Daeodon",
  "Cap Arthropluera": "Arthropluera",
  "Cap Deinonychus": "Deinonychus",
  "Cap Beelzebufo": "Beelzebufo",
  "Cap Ovis": "Ovis",
  "Cap Gigantopithecus": "Gigantopithecus",
  "Cap Drakeling": "Drakeling",
  "Cap Veilwyn": "Veilwyn",
  "Burrowbuck": "Burrowbuck",
  "Cryolophosaurus": "Cryolophosaurus",
  "Grand Tortugar": "Grand Tortugar",
  "Cap Kentrosaurus": "Kentrosaurus",
  "Cap Brontosaurus": "Brontosaurus",
  "Dung Beetle": "Dung Beetle",
  "Achatina": "Achatina",
  "Giant Bee": "Giant Bee",
  "Iguanodon": "Iguanodon",
  "Diplocaulus": "Diplocaulus",
  "Armadoggo": "Armadoggo",
  "Mammoth": "Mammoth",
  "Otter": "Otter",
  "Gachas": "Gacha",
  "Maeguana": "Maeguana",
  "Oviraptor": "Oviraptor",
  "Pegomastax": "Pegomastax",
  "Procoptodon": "Procoptodon",
  "Pelagornis": "Pelagornis",
  "Dunkleosteus": "Dunkleosteus",
  "Anglerfish": "Angler",
  "Fasolasuchus": "Fasolasuchus",
  "Doedicurus": "Doedicurus",
  "Deinotherium": "Deinotherium",
  "Gigantoraptor": "Gigantoraptor",
  "Cap Terror Bird": "Terror Bird",
  "Reaper": "Reaper",
  "Dimorphodon": "Dimorphodon",
  "Rock Drake": "Rock Drake",
  "Cap Gloon": "Gloon", 
  "Cap Ankylosaurus": "Ankylosaurus",
  "Anky": "Ankylosaurus",
  // Official ARK creature dossiers
  "Beelzebufo": "Beelzebufo",
  "Mantis": "Mantis",
  "Moschops": "Moschops",
  "Yuty": "Yutyrannus",
  "Yutyrannus": "Yutyrannus",
  "Deinonychus": "Deinonychus",
};
// These are official ARK dossier files on ark.wiki.gg.
// Custom/non-official creatures are intentionally NOT mapped to fabricated images.
const DOSSIER_OVERRIDES = {
  "Gigadesmodus": "https://ark.wiki.gg/wiki/Special:Redirect/file/Dossier_Desmodus.png",
  "Giga Desmodus": "https://ark.wiki.gg/wiki/Special:Redirect/file/Dossier_Desmodus.png",
  "GigaDesmodus": "https://ark.wiki.gg/wiki/Special:Redirect/file/Dossier_Desmodus.png",
  "Cap Ankylosaurus": "https://ark.wiki.gg/wiki/Special:Redirect/file/Dossier_Ankylosaurus.png",
  "Ankylosaurus": "https://ark.wiki.gg/wiki/Special:Redirect/file/Dossier_Ankylosaurus.png",
  "Anky": "https://ark.wiki.gg/wiki/Special:Redirect/file/Dossier_Ankylosaurus.png"
};

const CLONER_IMAGES = {
  "Phoenix": "https://media.discordapp.net/attachments/1358733897126510761/1358880402218942685/Phoenix.png?format=webp&quality=lossless&width=640&height=360",
  "Karkinos": "https://media.discordapp.net/attachments/1358733897126510761/1358886254862798989/Karkinos_farm.png?format=webp&quality=lossless&width=640&height=360",
  "Reaper": "https://media.discordapp.net/attachments/1358733897126510761/1359095858548969664/Reaper.png?format=webp&quality=lossless&width=640&height=360"
};

function cleanName(name) {
  return name.replace(/\s*\[\d+(?:-\d+)?\s*LvLs?\]\s*/gi, '')
             .replace(/\s*\[Random\s*LvL\]\s*/gi, '')
             .trim();
}

function getImageUrl(name, categoryKey) {
  if (categoryKey === 'cloners' && CLONER_IMAGES[cleanName(name)]) {
    return CLONER_IMAGES[cleanName(name)];
  }
  const base = cleanName(name);
  if (DOSSIER_OVERRIDES[base]) return DOSSIER_OVERRIDES[base];
  const file = DOSSIER_ALIASES[base];
  if (!file) return null;
  return `https://ark.wiki.gg/wiki/Special:Redirect/file/${encodeURIComponent(`Dossier ${file}.png`)}`;
}

function makeButtonRow() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel('OPEN TICKET')
      .setEmoji('🎫')
      .setStyle(ButtonStyle.Link)
      .setURL(TICKET_URL)
  );
}

function makeEmbed(category, product, index, total, categoryKey) {
  const [name, price, stats = ''] = product;
  const embed = new EmbedBuilder()
    .setColor(EMBED_BLUE)
    .setAuthor({ name: 'Infinity Market - Small Tribes Crossplay' })
    .setTitle(`🔷 ${cleanName(name)}`);

  if (stats.trim()) {
    embed.addFields({
      name: '🔷 Stats',
      value: stats.trim(),
      inline: false
    });
  }

  embed.addFields({
    name: '💰 Price',
    value: price.replace(/\n/g, '\n\n'),
    inline: false
  });

  embed.setFooter({
    text: `ARK FLEX MARKET • ${category.title.replace('💠 ', '')} • ${index}/${total}`
  });

  const imageUrl = getImageUrl(name, categoryKey);
  if (imageUrl) embed.setImage(imageUrl);

  return embed;
}

async function sendCategory(message, key) {
  const category = categories[key];
  if (!category) return;

  // One product per message: everything is fully separated.
  for (let i = 0; i < category.products.length; i++) {
    await message.channel.send({
      embeds: [makeEmbed(category, category.products[i], i + 1, category.products.length, key)],
      components: [makeButtonRow()]
    });
  }
}

const COMMAND_ALIASES = {
  pvp: 'pvp',
  soaker: 'soakers',
  soakers: 'soakers',
  flyer: 'flyers',
  flyers: 'flyers',
  water: 'water',
  farm: 'farm',
  support: 'support',
  supports: 'support',
  egg: 'eggs',
  eggs: 'eggs',
  'eggs-embryos': 'eggs',
  embryo: 'eggs',
  embryos: 'eggs',
  cloner: 'cloners',
  cloners: 'cloners',
  ffa: 'ffa'
};

client.once('ready', () => {
  console.log(`ARK FLEX MARKET online as ${client.user.tag}`);
  console.log('Commands:', Object.keys(COMMAND_ALIASES).map(x => `!${x}`).join(', '));
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const content = message.content.trim().toLowerCase();
  if (!content.startsWith(PREFIX)) return;

  const raw = content.slice(PREFIX.length).split(/\s+/)[0];
  const key = COMMAND_ALIASES[raw];
  if (!key) return;

  try {
    await sendCategory(message, key);
  } catch (error) {
    console.error(`Failed to send category ${key}:`, error);
    await message.reply('Beim Anzeigen dieser Kategorie ist ein Fehler aufgetreten.');
  }
});

client.login(process.env.DISCORD_TOKEN);
