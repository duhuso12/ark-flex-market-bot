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
  console.error('Missing DISCORD_TOKEN. Copy .env.example to .env and add your token.');
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once('ready', () => {
  console.log(`ARK FLEX MARKET online as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || message.content.trim().toLowerCase() !== config.command) return;

  const ticketUrl = `https://discord.com/channels/${config.guildId}/${config.ticketChannelId}`;

  const embed = new EmbedBuilder()
    .setColor(config.embedColor)
    .setAuthor({ name: 'ARK FLEX MARKET' })
    .setTitle('💠 Advanced Rifle Bullet [ARB]')
    .setDescription(
      '**💎 Prices**\n\n' +
      '➤ **10,000** `[100 slots]` » **$0.99**\n' +
      '➤ **30,000** `[300 slots]` » **$1.99**\n' +
      '➤ **90,000** `[900 slots]` » **$4.99**\n' +
      '➤ **180,000** `[1 dedi]` » **$9.99**\n' +
      '➤ **360,000** `[2 dedis]` » **$16.99**\n' +
      '➤ **540,000** `[3 dedis]` » **$22.99**\n\n' +
      '🤝 **Found a better price?** Let us know — we’ll do our best to beat it!\n\n' +
      '🎁 Every order also comes with a **random bonus!**\n\n' +
      '💠 There are never many ARBs.'
    )
    .addFields({ name: 'Availability', value: '🟢 **IN STOCK**', inline: true })
    .setFooter({ text: 'ARK FLEX MARKET • Fast & simple ordering' })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel('OPEN TICKET')
      .setEmoji('🎫')
      .setStyle(ButtonStyle.Link)
      .setURL(ticketUrl)
  );

  await message.channel.send({ embeds: [embed], components: [row] });
});

client.login(process.env.DISCORD_TOKEN);
