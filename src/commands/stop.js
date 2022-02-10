const config = require('../config/config.js');
const Discord = require('discord.js');

module.exports = {
    name: 'stop',
    description: 'Pare a música e limpe a fila',
    aliases: ['st'],
    usage: '',
    cooldown: 5,
    permission: 'MANAGE_MESSAGES',
    execute(client, message, args) {
        const stopCommandEmbed = new Discord.MessageEmbed()
            .setDescription('Musica parada')
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
            .setDescription('Você não tem permissão de `MANAGE_MESSAGES`.')
            .setFooter(message.author.tag, message.author.displayAvatarURL())
            .setColor(config.color);

        if (!message.member.hasPermission("MANAGE_MESSAGES"))
            return message.channel.send(withoutPermissions);
        if (!message.member.voice.channel)
            return message.channel.send(errorMemberChannelEmbed);
        if (message.guild.me.voice.channel && message.guild.me.voice.channel.id != message.member.voice.channel.id)
            return message.channel.send(memberNotWithTheBot);

        message.client.queue.delete(message.guild.id);

        channel = message.member.voice.channel
        if (channel) {
            channel.leave();
        }

        message.channel.send(stopCommandEmbed);
    }
}