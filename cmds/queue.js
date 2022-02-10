const Discord = require('discord.js');
const config = require('../config/config.js')

module.exports = {
    name: 'queue',
    description: 'Mostra playlist de musica',
    aliases: ['playlist'],
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

        if (!serverQueue) return message.channel.send(nothingPlaying);

        let i = 0;
        let queueEmbed = new Discord.MessageEmbed()
            .setTitle('Playlist')
            .setDescription(serverQueue.songs.map(song => `**#${i++}** \`${song.title}\``).join('\n'))
            .setFooter(message.author.tag, message.author.displayAvatarURL())
            .setColor(config.color);

        if (!message.member.voice.channel) return message.channel.send(memberNothingAvoice.channel);
        if (message.guild.me.voice.channel && message.guild.me.voice.channel.id != message.member.voice.channel.id)
            return message.channel.send(memberNotWithTheBot);


        message.channel.send(queueEmbed);
    }
}