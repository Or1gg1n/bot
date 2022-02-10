const config = require('../config/config.js');

module.exports = {
    name: 'exec',
    description: 'Command execution on demand',
    aliases: ['eval'],
    usage: '<code>',
    cooldown: 0,
    permission: 'BOT_OWNER',
    execute(client, message, args) {
        if (message.author.id !== config.ownerID) return message.channel.send(`🚫 **You do not have permission**`);
        try {
            const code = args.join(" ");
            let evaled = eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);

            message.channel.send(evaled, { code: "xl" });
        } catch (err) {
            message.channel.send(`\`ERRO\` \`\`\`xl\n${err}\n\`\`\``);
        }
    }
}
