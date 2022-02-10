const config = require('../config/config.js');

module.exports = {
    name: 'random',
    description: 'Pick a random option',
    aliases: ['pick'],
    usage: '<option 1, option 2, ...>',
    cooldown: 5,
    permission: '*',
    execute(client, message, args) {
        if (!args[1]) return message.reply('Provide at least two options!')

        const options = message.content.replace(`${config.prefix}random `, "").split(",");
        const result = options[Math.floor(Math.random() * options.length)];

        message.channel.send(`Result: **${result}**`)
    }
}