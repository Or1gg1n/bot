const Discord = require('discord.js');
const config = require('../config/config.js');
const moment = require("moment");
require("moment-duration-format");
const ytdl = require('discord-ytdl-core');
const YouTubeSearch = require('youtube-search');
const acess = require('../config/acess.js');

module.exports = {
    name: 'play',
    description: 'Toque uma música do YouTube em seu canal',
    aliases: ['p'],
    usage: '<Search Query/YouTube Video URL>',
    cooldown: 5,
    permission: '*',
    async execute(client, message, args) {
        await getLink(args.join(' '), async (url) => {
            if (!url) {
                const searchErrorEmbed = new Discord.MessageEmbed()
                    .setDescription('Não foi possível encontrar a música para sua pesquisa. Tente usar um URL.')
                    .setFooter(message.author.tag, message.author.displayAvatarURL())
                    .setColor(config.color);

                return message.channel.send(searchErrorEmbed);
            }

            const errorMemberChannelEmbed = new Discord.MessageEmbed()
                .setDescription('Você precisa estar em um canal de voz.')
                .setFooter(message.author.tag, message.author.displayAvatarURL())
                .setColor(config.color);

            const needPermissionsEmbed = new Discord.MessageEmbed()
                .setDescription('Preciso de permissão para falar e me conectar ao canal.')
                .setFooter(message.author.tag, message.author.displayAvatarURL())
                .setColor(config.color);

            const memberNotWithTheBot = new Discord.MessageEmbed()
                .setDescription('Você deve estar no mesmo canal que eu.')
                .setFooter(message.author.tag, message.author.displayAvatarURL())
                .setColor(config.color);

            const unknownArgs = new Discord.MessageEmbed()
                .setDescription('Argumentos inválidos. Insira um nome de música ou URL válido.')
                .setFooter(message.author.tag, message.author.displayAvatarURL())
                .setColor(config.color);

            const queue = message.client.queue;
            const serverQueue = queue.get(message.guild.id);
            const voiceChannel = message.member.voice.channel;
            const permissions = voiceChannel.permissionsFor(message.client.user);

            if (!voiceChannel)
                return message.channel.send(errorMemberChannelEmbed);
            if (!permissions.has("CONNECT") || !permissions.has("SPEAK"))
                return message.channel.send(needPermissionsEmbed);
            if (message.guild.me.voice.channel && message.guild.me.voice.channel.id != message.member.voice.channel.id)
                return message.channel.send(memberNotWithTheBot);
            if (!args[0])
                return message.channel.send(unknownArgs);

            var songInfo = await ytdl.getInfo(url);
            const song = {
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url,
                duration: getFormattedTime(songInfo.videoDetails.lengthSeconds * 1000),
                id: songInfo.videoDetails.videoId
            };
            message.channel.send('Carregando: ' + `\`${song.title}\``);
            if (!serverQueue) {
                const queueContruct = {
                    textChannel: message.channel,
                    voiceChannel: voiceChannel,
                    connection: null,
                    songs: [],
                    volume: 5,
                    playing: true
                };

                queue.set(message.guild.id, queueContruct);
                queueContruct.songs.push(song);

                try {
                    var connection = await voiceChannel.join();
                    queueContruct.connection = connection;

                    play(message, queueContruct.songs[0]);

                    const playingNowEmbed = new Discord.MessageEmbed()
                        .setTitle('Tocando Agora')
                        .addField('Autor', `[${songInfo.videoDetails.author.name}](${songInfo.videoDetails.author.channel_url})`)
                        .setThumbnail(songInfo.videoDetails.author.avatar)
                        .addField('Likes', songInfo.videoDetails.likes ? songInfo.videoDetails.likes : "0", true)
                        .addField('Dislikes', songInfo.videoDetails.dislikes ? songInfo.videoDetails.dislikes : "0", true)
                        .addField('Duração', song.duration)
                        .addField('Titulo', `**[${song.title}](${songInfo.videoDetails.video_url})**`)
                        .setImage(`https://i.ytimg.com/vi/${songInfo.videoDetails.videoId}/hqdefault.jpg`)
                        .setFooter(message.author.tag, message.author.displayAvatarURL())
                        .setColor(config.color);

                    return message.channel.send(playingNowEmbed);
                } catch (error) {
                    console.log(error);
                    queue.delete(message.guild.id)
                    const errorEmbed = new Discord.MessageEmbed()
                        .setTitle('Error')
                        .setDescription(`**${error.message}**`)
                        .setColor('RED');
                    return message.channel.send(errorEmbed);
                }
            } else {
                serverQueue.songs.push(song);

                const queueMusicAddedEmbed = new Discord.MessageEmbed()
                    .setTitle('Música adicionada à fila')
                    .addField('Autor', `[${songInfo.videoDetails.author.name}](${songInfo.videoDetails.author.channel_url})`)
                    .setThumbnail(songInfo.videoDetails.author.avatar)
                    .addField('Likes', songInfo.videoDetails.likes ? songInfo.videoDetails.likes : "0", true)
                    .addField('Dislikes', songInfo.videoDetails.dislikes ? songInfo.videoDetails.dislikes : "0", true)
                    .addField('Duração', song.duration)
                    .addField('Titulo', `**[${song.title}](${songInfo.videoDetails.video_url})**`)
                    .setImage(`https://i.ytimg.com/vi/${songInfo.videoDetails.videoId}/hqdefault.jpg`)
                    .setFooter(message.author.tag, message.author.displayAvatarURL())
                    .setColor(config.color);
                return message.channel.send(queueMusicAddedEmbed);
            }
        })
    }
}

async function getLink(input, callback) {
    if (!input || input.length > 128) return callback(undefined);
    if (ytdl.validateURL(input)) return callback(input);

    YouTubeSearch(input, { maxResults: 2, key: acess.YouTube }, async (err, results) => {
        if (err) return console.log(err);
        if (!results) return callback(undefined);
        if (results[0].kind === 'youtube#video') return callback(results[1].link);

        return callback(results[0].link);
    });
}

async function play(message, song) {
    const queue = message.client.queue;
    const guild = message.guild;
    const serverQueue = queue.get(guild.id);

    if (!serverQueue) return;
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const filters = {
        bassboost: 'bass=g=20,dynaudnorm=f=200',
        '8D': 'apulsator=hz=0.08',
        vaporwave: 'aresample=48000,asetrate=48000*0.8',
        nightcore: 'aresample=48000,asetrate=48000*1.25',
        phaser: 'aphaser=in_gain=0.4',
        tremolo: 'tremolo',
        vibrato: 'vibrato=f=6.5',
        reverse: 'areverse',
        treble: 'treble=g=5',
        normalizer: 'dynaudnorm=f=200',
        surrounding: 'surround',
        pulsator: 'apulsator=hz=1',
        subboost: 'asubboost',
        karaoke: 'stereotools=mlev=0.03',
        flanger: 'flanger',
        gate: 'agate',
        haas: 'haas',
        mcompand: 'mcompand',
        meuporra: 'bass=frequency=60:gain=20,dynaudnorm=g=70'
    }

    var stream = ytdl(song.url, {
        filter: "audioonly",
        opusEncoded: true,
        encoderArgs: ['-af', filters['meuporra']]
    });

    await serverQueue.connection
        .play(stream, {
            type: "opus"
        })
        .on("finish", () => {
            serverQueue.songs.shift();
            play(message, serverQueue.songs[0]);
        })
        .on("error", error => {
            console.error(error)
        })
        .setVolumeLogarithmic(serverQueue.volume / 10);
}

function getFormattedTime(miliseconds) {
    return moment.duration(miliseconds).format(" D [days], H [hours], m [minutes], s [seconds]")
}