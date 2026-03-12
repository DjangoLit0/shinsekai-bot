import 'dotenv/config';

export const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
export const GUILD_ID = process.env.DISCORD_GUILD_ID;

if (!BOT_TOKEN) throw new Error('Missing DISCORD_BOT_TOKEN');
if (!GUILD_ID) throw new Error('Missing DISCORD_GUILD_ID');
