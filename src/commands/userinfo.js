const Discord = require('discord.js');
const moment = require('moment');
require('moment-duration-format');

function createdAt(time) {
    return moment.duration(new Date() - time).format('[Account was created] Y [years], M [months], D [days], h [hours], m [minutes], s [seconds] [ago.]')
}

function joinedAt(time) {
    return moment.duration(new Date() - time).format('[Member was joined] Y [years], M [months], D [days], h [hours], m [minutes], s [seconds] [ago.]')
}

module.exports = {
    name: 'userinfo',
    description: 'Mostra as informações de um usuario',
    aliases: ['ui'],
    usage: '[@user]',
    cooldown: 5,
    permission: '*',
    execute(client, message, args) {
        const u = message.mentions.users.first() || message.author;
        const m = message.mentions.members.first() || message.member;

        const embed = new Discord.MessageEmbed()
            .setAuthor(u.username, 'https://cdn.discordapp.com/embed/avatars/0.png')
            .setThumbnail(u.displayAvatarURL({ format: 'png', dynamic: true }))
            .addField('Nome', u.tag)
            .addField('ID', u.id)
            .addField('Criada á', createdAt(u.createdAt))
            .addField('Entrou á', joinedAt(m.joinedAt))
            .addField('Cargos', `\`${m.roles.cache.array().map(r => r.name).join('`, `')}\``)
            .setColor(require('../config/config.js').color)

        message.channel.send(embed)
    }
}