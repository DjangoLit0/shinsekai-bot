import { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const commands = [
  new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Initialise le serveur Shinsekai Cup (roles + salons)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .toJSON(),
];

export async function registerCommands({ token, clientId, guildId }) {
  const rest = new REST({ version: '10' }).setToken(token);
  await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
}
