if (process.argv[2] === 'test') {
    console.clear();
    console.log('3 2 1 testing!');
    return process.exit();
}

if (process.argv[2] === 'log') console.log('[ DEBUG ] Logging all commands executed')

const { prefix, color } = require('./src/config/config.js');
const { MessageEmbed, Collection } = require('discord.js');
const Client = require('./src/config/Client.js');
const acess = require('./src/config/acess.js');
require("moment-duration-format");
const moment = require("moment");
const fs = require('fs')

const client = new Client();
client.commands = new Collection();

const cooldowns = new Collection();
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./src/commands/${file}`);
    client.commands.set(command.name, command)
};

client.on('ready', () => {
    console.log(`${client.user.tag} ready!`);

    let idx = 0;
    client.user.setStatus('online')
    setInterval(() => {
        let uptime = moment.duration(client.uptime).format(" D[d], H[h], m[m], s[s]");
        let messages = ['Tortuguita V1'];
        let message = messages[idx];
        idx++;
        if (idx >= messages.length) idx = 0;

        client.user.setActivity(message, { type: 'WATCHING' });
    }, 5 * 1000);
});

client.on('guildCreate', (guild) => {
    const embed = new MessageEmbed()
        .setAuthor('Tortuguita', client.user.displayAvatarURL(), '')
        .setDescription(`Obrigado por me adicionar em seu servidor!
    
Before you start: the host is in the united states, if the music is lagging, try changing the server region to US South
    
Use **${prefix}help** to see the commands`)
        .setColor(color)
        .setFooter(guild.owner.user.tag, guild.owner.user.displayAvatarURL({ dynamic: true }));

    guild.owner.user.send(embed);
})

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (process.argv[2] === 'log') {
        console.log(`${message.author.tag}: ${message.content}`)
    }

    if (!command) return message.channel.send({
        embed: {
            title: 'This commands does not exist!',
            color: color,
            description: `Try using \`${prefix}help\``,
            footer: {
                text: message.author.tag,
                icon_url: message.author.displayAvatarURL({ format: 'png', dynamic: true })
            }
        }
    });

    if (command.guildOnly && message.channel.type === 'dm') return message.channel.send('**<:error:755511540320436385> Use commandos in guild channel!**');

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`**<:error:755511540320436385> Por Favor ${timeLeft.toFixed(1)} Espere segundo(s) para usar \`${prefix}${command.name}\` commando.**`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(client, message, args);
    } catch (error) {
        console.error(error);
        message.reply('**Erro, Tente Novamente Mais Tarde.**');
    }
});

client.login(acess.Discord);
