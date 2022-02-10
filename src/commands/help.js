const { MessageEmbed } = require('discord.js');
const config = require('../config/config.js');

async function getHelpList(params) {
    var out = [];
    await params.forEach((p) => {
        var cmd = require(`./${p}.js`);
        out.push(`${cmd.name} ${cmd.usage}`);
    })

    return out.join('\n');
}

module.exports = {
    name: 'help',
    description: 'Lista de comandos',
    aliases: ['commands', 'ajuda'],
    usage: '[command]',
    cooldown: 5,
    permission: '*',
    async execute(client, message, args) {
        console.log(args);
        if (!args[0]) {
            await message.channel.send('**<a:loading:755513577850273822> Fetching commands...**').then(async (m) => {
                const embed = new MessageEmbed()
                    .setTitle('Commands')
                    .setDescription(`Use the commands with prefix, e.g. \`${config.prefix}help\`.\nUse \`${config.prefix}help <command>\` for more info.`)
                    .addField('Moderation', await getHelpList(['ban', 'kick']))
                    .addField('Utils', await getHelpList(['avatar', 'image', 'invite', 'mcskin', 'random', 'say', 'search', 'serverinfo', 'status', 'userinfo']))
                    .addField('Music', await getHelpList(['play', 'pause', 'resume', 'skip', 'stop', 'volume', 'queue', 'skip', 'help']))
                    .setColor(config.color)
                    .setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
                    .setFooter(message.author.tag + ' | <required> [optional]', message.author.displayAvatarURL({ dynamic: true }));

                message.author.send(embed);
                m.edit('**<:mail:755511064111611925> See your DMs!**');
            })
        } else {
            if (!client.commands.has(args[0])) return message.channel.send(
                new MessageEmbed()
                    .setDescription(`The \`${command}\` command was not found, try using \`${config.prefix}help\``)
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
                    .setColor('RED')
            );
            const info = client.commands.get(args[0]) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

            const embedInfo = new MessageEmbed()
                .setTitle(config.prefix + info.name)
                .addField('Usage', config.prefix + info.name + " " + info.usage)
                .addField('Description', info.description)
                .addField('Need permission', info.permission)
                .addField('Aliases', info.aliases.join(', '))
                .setColor(config.color)
                .setFooter(message.author.tag + ' | <required> [optional]', message.author.displayAvatarURL({ dynamic: true }))

            message.channel.send(embedInfo);
        }
    }
}
