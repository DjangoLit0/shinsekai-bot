import {
  ChannelType,
  PermissionsBitField,
} from 'discord.js';

const ROLE_NAMES = {
  admin: 'Admin',
  referee: 'Arbitre',
  player: 'Joueur',
};

const TEXT_CHANNELS = ['annonces', 'inscriptions', 'pairings', 'resultats'];
const VOICE_CHANNELS = ['Match-1', 'Match-2', 'Arbitrage'];

async function ensureRole(guild, name) {
  const existing = guild.roles.cache.find((r) => r.name === name);
  if (existing) return existing;
  return guild.roles.create({ name, mentionable: true, reason: 'Shinsekai setup' });
}

async function ensureTextChannel(guild, name) {
  const existing = guild.channels.cache.find((c) => c.type === ChannelType.GuildText && c.name === name);
  if (existing) return existing;
  return guild.channels.create({ name, type: ChannelType.GuildText, reason: 'Shinsekai setup' });
}

async function ensureVoiceChannel(guild, name) {
  const existing = guild.channels.cache.find((c) => c.type === ChannelType.GuildVoice && c.name === name);
  if (existing) return existing;
  return guild.channels.create({ name, type: ChannelType.GuildVoice, reason: 'Shinsekai setup' });
}

export async function runSetup(guild) {
  // Roles
  const adminRole = await ensureRole(guild, ROLE_NAMES.admin);
  const refereeRole = await ensureRole(guild, ROLE_NAMES.referee);
  const playerRole = await ensureRole(guild, ROLE_NAMES.player);

  // Channels
  for (const ch of TEXT_CHANNELS) await ensureTextChannel(guild, ch);
  const voices = [];
  for (const ch of VOICE_CHANNELS) voices.push(await ensureVoiceChannel(guild, ch));

  // Permissions for Arbitrage
  const arbitrage = voices.find((c) => c.name === 'Arbitrage');
  if (arbitrage) {
    await arbitrage.permissionOverwrites.set(
      [
        {
          id: guild.roles.everyone.id,
          deny: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.Connect,
            PermissionsBitField.Flags.Speak,
            PermissionsBitField.Flags.Stream,
          ],
        },
        {
          id: adminRole.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.Connect,
            PermissionsBitField.Flags.Speak,
            PermissionsBitField.Flags.Stream,
          ],
        },
        {
          id: refereeRole.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.Connect,
            PermissionsBitField.Flags.Speak,
            PermissionsBitField.Flags.Stream,
          ],
        },
      ],
      'Lock Arbitrage to admin/referees'
    );
  }

  return {
    roles: { adminRole, refereeRole, playerRole },
    channels: { arbitrage },
  };
}
