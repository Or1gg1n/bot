const config = require('../config/config.js');
const Discord = require('discord.js');

module.exports = {
    name: 'skip',
    description: 'Pule para a próxima música',
    aliases: ['sk'],
    usage: '',
    cooldown: 5,
    permission: 'MANAGE_MESSAGES',
    execute(client, message, args) {
        const skipCommandEmbed = new Discord.MessageEmbed()
            .setDescription('Música pulada')
            .setFooter('Requerido por: ' + message.author.tag, message.author.displayAvatarURL())
            .setColor(config.color);

        const errorMemberChannelEmbed = new Discord.MessageEmbed()
            .setDescription('Você deve estar no mesmo canal que eu.')
            .setFooter(message.author.tag, message.author.displayAvatarURL())
            .setColor(config.color);

        const memberNotWithTheBot = new Discord.MessageEmbed()
            .setDescription('Você deve estar no mesmo canal que eu.')
            .setFooter(message.author.tag, message.author.displayAvatarURL())
            .setColor(config.color);

        const withoutPermissions = new Discord.MessageEmbed()
            .setDescription('Você não tem a permissão `MANAGE_MESSAGES`.')
            .setFooter(message.author.tag, message.author.displayAvatarURL())
            .setColor(config.color);

        const serverQueue = message.client.queue.get(message.guild.id);

        if (!message.member.hasPermission("MANAGE_MESSAGES"))
            return message.channel.send(withoutPermissions);
        if (!message.member.voice.channel)
            return message.channel.send(errorMemberChannelEmbed);
        if (message.guild.me.voice.channel && message.guild.me.voice.channel.id != message.member.voice.channel.id)
            return message.channel.send(memberNotWithTheBot);
        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
        }

        if (serverQueue) serverQueue.connection.dispatcher.end()
        if (!serverQueue) message.member.voice.channel.leave();

        return message.channel.send(skipCommandEmbed);
    }
}