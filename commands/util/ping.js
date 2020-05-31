module.exports = {
    name: "ping", // set command name
    aliases: [ "p" ], // set command aliases
    permissions: [], // set command permissions
    exec: async (client, message) => {

        // send a message to channel that contains information about bots ping
        await message.channel.send(message.guild.language.ping_command.replace(/{ping}/g, client.ws.ping));
    }
}