module.exports = {
    name: "ping", // set command name
    aliases: [ "p" ], // set command aliases
    permissions: [], // set command permissions
    guildOnly: true, // set true if command is guild only
    ownerOnly: true, // set true if command is owner only
    exec: async (client, message, args) => {
        // the rest of the code
    }
}