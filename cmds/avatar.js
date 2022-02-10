const Discord = require('discord.js');
const config = require('../config/config.js');

module.exports = {
    name: 'avatar',
    description: 'See user avatar',
    aliases: ['icon'],
	usage: '[@user]',
    cooldown: 2,
    permission: '*',
    execute(client, message, args) {
        var user = message.mentions.users.first() || message.author;
        var url = user.displayAvatarURL({ format: 'png', dynamic: true, size: 2048 });

        var embed = new Discord.MessageEmbed()
            .setDescription(`\`${user.tag}\` **|** [Download](${url})`)
            .setImage(url).setColor(config.color)

        message.channel.send(embed);
    }
}