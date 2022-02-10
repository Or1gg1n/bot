const Discord = require('discord.js');
const discloud = require("discloud-status");
const config = require('../config/config.js');
const moment = require('moment');
require('moment-duration-format');
const os = require('os');

module.exports = {
    name: 'status',
    description: 'Show the bot status',
    aliases: ['ping', 'pong'],
    usage: '',
    cooldown: 5,
    permission: '*',
    execute(client, message, args) {
        var ping = Math.floor(client.ws.ping);
        var cpu = os.cpus()[0].model;
        var system = cS(process.platform);
        var uptime = moment.duration(client.uptime).format(" D[d], H[h], m[m], s[s]");
        var ram = discloud.ram() || `${cM((os.totalmem() - os.freemem()))}/${cMWF(os.totalmem())}`;

        const status = new Discord.MessageEmbed()
            .setTitle(client.user.username + ' Status')
            .setColor(config.color)
            .addField('Sistema Operacional', system)
            .addField('Processador', cpu)
            .addField('Memoria', ram)
            .addField('Ping', `${ping}ms`)
            .addField('Uptime', uptime);

        message.channel.send(status)
    }
}

function cM(bytes) {
    let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    if(i <= 2) return Math.round(bytes / Math.pow(1024, i), 2);
    if((bytes / Math.pow(1024, i)).toFixed(3).includes(".00")) return Math.round(bytes / Math.pow(1024, i), 2);
    if((bytes / Math.pow(1024, i)).toFixed(3).includes(".0")) return ((bytes / Math.pow(1024, i)).toFixed(3)).replace("0","")
    return (bytes / Math.pow(1024, i)).toFixed(2);
}

function cMWF(bytes) {
    let formats = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0B';
    let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    let format = ' ' + formats[i];
    if(i <= 2) return Math.round(bytes / Math.pow(1024, i), 2) + format;
    if((bytes / Math.pow(1024, i)).toFixed(3).includes(".00")) return Math.round(bytes / Math.pow(1024, i), 2) + format;
    if((bytes / Math.pow(1024, i)).toFixed(3).includes(".0")) return ((bytes / Math.pow(1024, i)).toFixed(3) + format).replace("0","")
    return (bytes / Math.pow(1024, i)).toFixed(2) + format;
}

function cS(opsys) {
    let output = '¯\\_(ツ)_/¯';
    switch (opsys) {
        case 'android':
            output = 'Android'
            break;
        case 'darwin':
            output = 'MacOS'
            break;
        case 'freebsd':
            output = 'FreeBSD'
            break;
        case 'linux':
            output = 'Linux'
            break;
        case 'win32':
        case 'win64':
            output = 'Windows'
            break;
        default:
            output = output;
            break;
    };

    return output;
}