const Discord = require('discord.js');
const config = require('../config/config.js')

module.exports = {
    name: 'resume',
    description: 'Retomar a reprodução da música',
    aliases: ['continue'],
    usage: '',
    cooldown: 5,
    permission: '*',
    execute(client, message, args) {
        let serverQueue = message.client.queue.get(message.guild.id);

        let memberNotWithTheBot = new Discord.MessageEmbed()
            .setDescription('Você deve estar no mesmo canal que eu.')
            .setFooter(message.author.tag, message.author.displayAvatarURL())
            .setColor(config.color);

        let nothingPlaying = new Discord.MessageEmbed()
            .setDescription('Nenhuma musica tocando')
            .setFooter(message.author.tag, message.author.displayAvatarURL())
            .setColor(config.color);

        let resumedMusic = new Discord.MessageEmbed()
            .setDescription('Reprodução de música retomada')
            .setFooter(message.author.tag, message.author.displayAvatarURL())
            .setColor(config.color);

        if (!serverQueue) return message.channel.send(nothingPlaying);
        if (!message.member.voice.channel) return message.channel.send(memberNothingAvoice.channel);
        if (message.guild.me.voice.channel && message.guild.me.voice.channel.id != message.member.voice.channel.id)
            return message.channel.send(memberNotWithTheBot);

        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
            return message.channel.send(resumedMusic);
        }
        return message.channel.send(nothingPlaying);
    }
}