const Discord = require('discord.js');
const config = require('../config/config.js')

module.exports = {
    name: 'volume',
    description: 'Altere o volume da reprodução da música (Max: 10, Default: 5)',
    aliases: ['vol', 'v'],
    usage: '[number 0~10]',
    cooldown: 5,
    permission: '*',
    execute(client, message, args) {
        let serverQueue = message.client.queue.get(message.guild.id);

        let memberNotWithTheBot = new Discord.MessageEmbed()
            .setDescription('Você precisa estar no mesmo canal que eu.')
            .setFooter(message.author.tag, message.author.displayAvatarURL())
            .setColor(config.color);

        let nothingPlaying = new Discord.MessageEmbed()
            .setDescription('Nao tem nenhuma musica tocando')
            .setFooter(message.author.tag, message.author.displayAvatarURL())
            .setColor(config.color);

        let settedVolume = new Discord.MessageEmbed()
            .setDescription('Volume: **' + args[0] + "**.")
            .setFooter(message.author.tag, message.author.displayAvatarURL())
            .setColor(config.color);

        if (!serverQueue) return message.channel.send(nothingPlaying);
        if (!message.member.voice.channel) return message.channel.send(memberNothingAvoice.channel);
        if (message.guild.me.voice.channel && message.guild.me.voice.channel.id != message.member.voice.channel.id)
            return message.channel.send(memberNotWithTheBot);

        let currentVolumeEmbed = new Discord.MessageEmbed()
            .setDescription('Volume: **' + serverQueue.volume + "**.")
            .setFooter(message.author.tag, message.author.displayAvatarURL())
            .setColor(config.color);

        if (!args[0]) return message.channel.send(currentVolumeEmbed);
        if (isNaN(args[0])) return message.reply(`\`${args[0]}\` is not a number`);
        if (args[0] > 10) return message.reply('Volume maximo é **10**!');

        serverQueue.volume = args[0];
        serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 10);
        message.channel.send(settedVolume);
    }
}