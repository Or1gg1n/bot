const Discord = require('discord.js');
const config = require('../config/config.js');

module.exports = {
    name: 'invite',
    description: 'Me Adicione Em Seu Servidor',
    aliases: ['bot', 'inv'],
    usage: '',
    cooldown: 5,
    permission: '*',
    execute(client, message, args) {
        var url = `https://${config.discordDomain}/api/oauth2/authorize?client_id=${client.user.id}&permissions=${config.invitePermissions}&scope=bot`
        var embed = new Discord.MessageEmbed()
            .setTitle('Me Adicione Em Seu Servidor!')
            .setDescription('Convite: ' + url)
            .setColor(config.color).setThumbnail(client.user.displayAvatarURL())

        message.channel.send(embed);
    }
}