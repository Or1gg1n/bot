  module.exports = {
    name: "restart",
    category: "owner",
    run: async (client, message, args) => {
        if (message.author.id !== '624046352145317908') {
            return message.channel.send(`🚫 Você não tem permissão!`)
        }
        await message.channel.send(`Restarting...`)
        process.exit();
    }
}
