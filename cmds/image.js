const DIG = require('discord-image-generation')
const Discord = require('discord.js');

module.exports = {
    name: 'image',
    description: 'Generate cool images',
    aliases: ['preset', 'gen', 'generate', 'generate-image'],
    usage: '<view/preset> [@user]',
    cooldown: 10,
    permission: '*',
    async execute(client, message, args) {
        let images = ['Blur', 'Gay', 'Greyscale', 'Invert', 'Sepia', 'Ad', 'Affect', 'Beautiful',
            'Bed', 'Bobross', 'Delete', 'Facepalm', 'Hitler', 'Jail', 'Mms', 'Poutine', 'Rip',
            'Stonk', 'Tatoo', 'Thomas', 'Trash', 'Wanted', 'Circle']

        if (args[0].toLowerCase() === 'view') return message.channel.send(`\`${images.map(image => image).join(', ')}\``);

        if (!args[0]) return message.reply('this preset does not exists!')
        let preset = args[0].charAt(0).toUpperCase() + args[0].slice(1);
        if (!images.includes(preset)) return message.reply('this preset does not exists!')

        await generateImage(message, preset);

        async function generateImage(message, preset) {
            let user = message.mentions.users.first() || message.author;
            let avatar = user.displayAvatarURL({ dynamic: false, format: 'png' }) + "?size=2048";
            let img = await new DIG[preset]().getImage(avatar)
            let attach = new Discord.MessageAttachment(img, `${preset}.png`);;
            message.channel.send(attach)
        }
    }
}