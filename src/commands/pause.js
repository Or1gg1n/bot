const Discord = require('discord.js');
const config = require('../config/config.js')

module.exports = {
    name: 'pause',
    description: 'Pause music playback',
    aliases: [],
    usage: '',
    cooldown: 5,
    permission: '*',
    execute(client, message, args) {
        let serverQueue = message.client.queue.get(message.guild.id);

        let memberNothingAVoiceChannel = new Discord.MessageEmbed()
            .setDescription('Você não está em um canal de voz.')
            .setFooter(message.author.tag, message.author.displayAvatarURL())
            .setColor(config.color)

        let memberNotWithTheBot = new Discord.MessageEmbed()
            .setDescription('Você precisa estar no mesmo canal que eu.')
            .setFooter(message.author.tag, message.author.displayAvatarURL())
            .setColor(config.color);

        let nothingPlaying = new Discord.MessageEmbed()
            .setDescription('Sem música.')
            .setFooter(message.author.tag, message.author.displayAvatarURL())
            .setColor(config.color);

        let pausedMusic = new Discord.MessageEmbed()
            .setDescription('Reprodução de música pausada.')
            .setFooter(message.author.tag, message.author.displayAvatarURL())
            .setColor(config.color);

        if (!serverQueue) return message.channel.send(nothingPlaying);
        if (!message.member.voice.channel) return message.channel.send(memberNothingAVoiceChannel);
        if (message.guild.me.voice.channel && message.guild.me.voice.channel.id != message.member.voice.channel.id)
            return message.channel.send(memberNotWithTheBot);

        if (serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
            return message.channel.send(pausedMusic);
        }

        return message.channel.send(nothingPlaying);
    }
}