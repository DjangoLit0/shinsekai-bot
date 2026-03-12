import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { BOT_TOKEN, GUILD_ID } from './config.js';
import { registerCommands } from './discord/commands.js';
import { runSetup } from './discord/setup.js';

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
      await interaction.reply({ content: 'Commande utilisable uniquement dans un serveur.', ephemeral: true });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    try {
      const guild = await client.guilds.fetch(GUILD_ID);
      await guild.channels.fetch();
      await guild.roles.fetch();

      await runSetup(guild);
      await interaction.editReply('Setup terminé : rôles + salons créés/configurés.');
    } catch (err) {
      console.error(err);
      await interaction.editReply(`Erreur pendant le setup: ${err.message ?? String(err)}`);
    }
  }
});

client.login(BOT_TOKEN);
