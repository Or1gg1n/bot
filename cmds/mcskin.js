const mojangjs = require('mojangjs');
const Discord = require('discord.js');

module.exports = {
    name: 'mcskin',
    description: 'See the skin of a Minecraft User',
    aliases: ['skin', 'minecraft', 'mc'],
    usage: '<Minecraft Username>',
    cooldown: 5,
    permission: '*',
    execute(client, message, args) {
        var nickname = message.content.split(" ")[1];

        if (typeof nickname == 'undefined') nickname = 'Steve';

        mojangjs.getUUID(`${nickname}`).then(uuid => {
            const skinbody = `https://crafatar.com/renders/body/${uuid}?overlay`;
            const skinavatar = `https://crafatar.com/avatars/${uuid}?overlay`;
            const skinhead = `https://crafatar.com/renders/head/${uuid}?overlay}`;
            const skindown = `https://crafatar.com/skins/${uuid}`;

            const embed = new Discord.MessageEmbed()
                .setColor('#2ecc71')
                .setDescription(`**Skin of: ${nickname}** \n [Download](${skindown})`)
                .addField('Avatar', `[Clique aqui](${skinavatar})`, true)
                .addField('Head', `[Clique aqui](${skinhead})`, true)
                .addField('Body', `[Clique aqui](${skinbody})`, true)
                .setThumbnail(`${skinavatar}`)
                .setImage(`${skinbody}`)
                .setFooter(`crafatar.com | UUID: ${uuid}`);

            message.channel.send(embed)
        }).catch(err => {
            if (err == "MojangJS Error: TypeError: Cannot read property 'hasOwnProperty' of undefined") return message.reply('Invalid nickname!');
            message.reply(`Error: \n \`${err}\``)
        });
    }
}