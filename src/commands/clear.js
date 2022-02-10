const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  if (!message.member.permissions.has("MANAGE_MESSAGES"))
    return message.reply(
      "⚠️ Comando apenas para admins!"
    );
  const deleteCount = parseInt(args[0], 10);
  if (!deleteCount || deleteCount < 1 || deleteCount > 99)
    return message.reply(
      "forneça um número de até **99 mensagens** a serem excluídas"
    );

  const fetched = await message.channel.messages.fetch({
    limit: deleteCount + 1
  });
  message.channel.bulkDelete(fetched);
  message.channel
    .send(`✔️ **${args[0]}  Mensagens apagadas.**`).then(msg => msg.delete({timeout: 5000}))
    .catch(error =>
      console.log(`🤔 Algo de errado não está certo! Erro: ${error}`)
    );
};