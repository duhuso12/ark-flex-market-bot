ARK FLEX MARKET BOT
===================

What it does
- Type !arb in a Discord channel.
- The bot posts the ARB market as a real Discord embed (not an image).
- OPEN TICKET links to your existing ticket channel.

Configured IDs
Server: 1554939641507872778
Ticket channel: 1554959741724131348

SETUP
1. Install Node.js 18 or newer.
2. Create a Discord application/bot in the Discord Developer Portal.
3. Enable MESSAGE CONTENT INTENT for the bot.
4. Invite the bot to your server with permissions:
   - View Channels
   - Send Messages
   - Embed Links
5. In this folder, rename .env.example to .env.
6. Put your bot token after DISCORD_TOKEN= in .env.
   Never send/share your token with anyone.
7. Open a terminal in this folder and run:
      npm install
      npm start
8. In Discord, type:
      !arb

CUSTOMIZATION
- Edit config.js to change the command or embed color.
- Edit index.js to change product names, prices, text, and layout.

NOTE
Discord controls the native embed layout. Things like a diagonal IN STOCK ribbon cannot be freely positioned without using an image, but the status here is native Discord text.
