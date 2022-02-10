const Discord = require('discord.js');
const moment = require('moment');
require('moment-duration-format');

function capString(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getTime(ms) {
    return moment.duration(new Date() - ms).format('[Guild was created] Y [years], M [months], D [days], h [hours], m [minutes], s [seconds] [ago.]')
}

module.exports = {
    name: 'serverinfo',
    description: 'See info of a server',
    aliases: ['si'],
    usage: '',
    cooldown: 5,
    permission: '*',
    execute(client, message, args) {
        const g = message.guild;

        const embed = new Discord.MessageEmbed()
            .setAuthor(g.name, 'https://cdn.discordapp.com/embed/avatars/0.png')
            .setThumbnail(g.iconURL({ format: 'png', dynamic: true }))
            .addField('ID', g.id)
            .addField('Owner', `\`${g.owner.user.tag}\``)
            .addField('Region', capString(g.region))
            .addField('Channels', g.channels.cache.size)
            .addField('Created at', getTime(g.createdAt))
            .setColor(require('../config/config.js').color)

        message.channel.send(embed)
    }
}