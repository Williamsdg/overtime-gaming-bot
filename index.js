const { Client, GatewayIntentBits, Partials, Events } = require('discord.js');
const dotenv = require('dotenv');
const express = require('express');
dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

const WELCOME_CHANNEL_ID = 'YOUR_WELCOME_CHANNEL_ID';
const ROLE_REACTIONS = {
    '🔥': 'ROLE_ID_FOR_FIRE',
    '❄️': 'ROLE_ID_FOR_ICE'
};

client.once(Events.ClientReady, () => {
    console.log('Logged in as Overtime Gaming');
});

client.on(Events.GuildMemberAdd, member => {
    const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
    if (channel) {
        channel.send(`Welcome to the server, ${member}! 🎉`);
    }
});

client.on(Events.MessageReactionAdd, async (reaction, user) => {
    if (reaction.partial) await reaction.fetch();
    if (user.bot) return;

    const roleId = ROLE_REACTIONS[reaction.emoji.name];
    if (!roleId) return;

    const guild = reaction.message.guild;
    const member = await guild.members.fetch(user.id);
    await member.roles.add(roleId);
});

client.on(Events.MessageReactionRemove, async (reaction, user) => {
    if (reaction.partial) await reaction.fetch();
    if (user.bot) return;

    const roleId = ROLE_REACTIONS[reaction.emoji.name];
    if (!roleId) return;

    const guild = reaction.message.guild;
    const member = await guild.members.fetch(user.id);
    await member.roles.remove(roleId);
});

client.login(process.env.TOKEN);

// Keep-alive server
const app = express();
app.get('/', (req, res) => res.send('Overtime Gaming Bot is alive'));
app.listen(3000, () => console.log('Keepalive server running'));
