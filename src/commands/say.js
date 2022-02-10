const Discord = require('discord.js');
const config = require('../config/config.js');

module.exports = {
    name: 'say',
    description: 'Resume music playback',
    aliases: ['write'],
    usage: '<message>',
    cooldown: 5,
    permission: 'MANAGE_MESSAGES',
    execute(client, message, args) {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send(`🚫 **Você não tem permissão**`);
        if (!args[0]) return message.channel.send('🚫 **Escreva uma mensagem!**');

        var content = args.join(' ');
        message.channel.send(content);
        message.delete();
    }
}
