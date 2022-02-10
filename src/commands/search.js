const search = require('youtube-search');
const Discord = require('discord.js');
const config = require('../config/config.js');
const acess = require('../config/acess.js');

module.exports = {
    name: 'search',
    description: 'Pesquise qualquer coisa no YouTube',
    aliases: ['s'],
    usage: '<search query>',
    cooldown: 5,
    permission: '*',
    execute(client, message, args) {
        if (!args[0]) return message.channel.send('Forneça um nome de música')
        search(args.join(' '), { maxResults: 5, key: acess.YouTube },
            function (err, results) {
                if (err) return console.log(err);
                const embed = new Discord.MessageEmbed()
                    .setTitle('YouTube | Results')
                    .setColor(config.color)
                    .addField(results[0].title, results[0].link)
                    .addField(results[1].title, results[1].link)
                    .addField(results[2].title, results[2].link)
                    .addField(results[3].title, results[3].link)
                    .addField(results[4].title, results[4].link)

                message.channel.send(embed);
            });
    }
}