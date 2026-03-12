import { Client, GatewayIntentBits, Partials, ChannelType } from 'discord.js';
import { BOT_TOKEN, GUILD_ID } from './config.js';
import { registerCommands } from './discord/commands.js';
import { runSetup } from './discord/setup.js';
import { createMatchThread } from './discord/matchthread.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.GuildMember],
});

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  try {
    await registerCommands({
      token: BOT_TOKEN,
      clientId: client.user.id,
      guildId: GUILD_ID,
    });
    console.log('Slash commands registered');
  } catch (err) {
    console.error('Failed to register commands', err);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'setup') {
    if (!interaction.inGuild()) {
      await interaction.reply({
        content: 'Commande utilisable uniquement dans un serveur.',
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    try {
      const guild = await client.guilds.fetch(GUILD_ID);
      await guild.channels.fetch();
      await guild.roles.fetch();

      await runSetup(guild);
      await interaction.editReply(
        'Setup terminé : rôles + salons créés/configurés.'
      );
    } catch (err) {
      console.error(err);
      await interaction.editReply(
        `Erreur pendant le setup: ${err.message ?? String(err)}`
      );
    }
  }

  if (interaction.commandName === 'matchthread') {
    if (!interaction.inGuild()) {
      await interaction.reply({
        content: 'Commande utilisable uniquement dans un serveur.',
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    try {
      const round = interaction.options.getInteger('round', true);
      const table = interaction.options.getInteger('table', true);
      const joueur1 = interaction.options.getUser('joueur1', true);
      const joueur2 = interaction.options.getUser('joueur2', true);

      const guild = await client.guilds.fetch(GUILD_ID);

      const thread = await createMatchThread({
        guild,
        round,
        table,
        joueur1,
        joueur2,
      });

      // Try also to post a link in #pairings if it exists
      const channels = await guild.channels.fetch();
      const pairings = channels.find(
        (c) => c && c.type === ChannelType.GuildText && c.name === 'pairings'
      );
      if (pairings) {
        await pairings.send(
          `Thread résultats (R${round} T${table}) : ${thread.url}`
        );
      }

      await interaction.editReply(`Thread créé : ${thread.url}`);
    } catch (err) {
      console.error(err);
      await interaction.editReply(
        `Erreur pendant la création du thread: ${err.message ?? String(err)}`
      );
    }
  }
});

client.login(BOT_TOKEN);
