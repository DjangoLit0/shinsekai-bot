import { ChannelType } from 'discord.js';

const RESULTS_CHANNEL_NAME = 'resultats';

export async function createMatchThread({ guild, round, table, joueur1, joueur2 }) {
  const channels = await guild.channels.fetch();
  const resultsChannel = channels.find(
    (c) => c && c.type === ChannelType.GuildText && c.name === RESULTS_CHANNEL_NAME
  );

  if (!resultsChannel) {
    throw new Error(`Salon #${RESULTS_CHANNEL_NAME} introuvable`);
  }

  const threadName = `R${round}-T${table} ${joueur1.username} vs ${joueur2.username}`;

  const thread = await resultsChannel.threads.create({
    name: threadName,
    autoArchiveDuration: 1440, // 24h
    reason: 'Shinsekai match results thread',
  });

  await thread.send(
    `Match **Round ${round} / Table ${table}**\n` +
      `${joueur1} vs ${joueur2}\n\n` +
      `Merci de poster ici :\n` +
      `- un screenshot de fin de partie (victoire/défaite)\n` +
      `- et le vainqueur (texte)\n\n` +
      `En cas de litige, un arbitre tranchera avec les preuves.`
  );

  return thread;
}
