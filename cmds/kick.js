const Discord = require('discord.js');
const config = require('../config/config.js');

module.exports = {
    name: 'kick',
    description: 'Kick a member',
    aliases: [],
    usage: '<@user> [reason]',
    cooldown: 5,
    permission: 'KICK_MEMBERS',
    async execute(client, message, args) {
        var reason = args[1] || '¯\\_(ツ)_/¯';
        var userID = message.mentions.users.first().id || args[0];
        var member = message.guild.members.cache.get(userID);

        if (!message.member.permissions.has('KICK_MEMBERS')) return message.channel.send(`🚫 **You do not have permission**`);
        if (!userID) return message.reply('**Mention a user to ban**');
        if (!member.bannable) return message.reply('**It is not possible to ban this user.**');

        await member.kick({ reason: reason });
        message.reply('**User successfully banned!**');
    }
};