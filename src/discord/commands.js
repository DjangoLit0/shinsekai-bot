import {
  REST,
  Routes,
  SlashCommandBuilder,
  PermissionFlagsBits,
} from 'discord.js';

export const commands = [
  new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Initialise le serveur Shinsekai Cup (roles + salons)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .toJSON(),

  new SlashCommandBuilder()
    .setName('matchthread')
    .setDescription('Crée un thread de résultats pour un match')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageThreads)
    .addIntegerOption((opt) =>
      opt
        .setName('round')
        .setDescription('Numéro du round')
        .setRequired(true)
        .setMinValue(1)
    )
    .addIntegerOption((opt) =>
      opt
        .setName('table')
        .setDescription('Table (1 ou 2)')
        .setRequired(true)
        .addChoices({ name: '1', value: 1 }, { name: '2', value: 2 })
    )
    .addUserOption((opt) =>
      opt.setName('joueur1').setDescription('Premier joueur').setRequired(true)
    )
    .addUserOption((opt) =>
      opt.setName('joueur2').setDescription('Deuxième joueur').setRequired(true)
    )
    .toJSON(),
];

export async function registerCommands({ token, clientId, guildId }) {
  const rest = new REST({ version: '10' }).setToken(token);
  await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
    body: commands,
  });
}
