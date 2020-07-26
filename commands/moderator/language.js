const fs = require("fs");

module.exports = {
    name: "language",
    usage: "language <code>",
    description: "language_command",
    aliases: [ "lang" ],
    cooldown: 15,
    enabled: true,
    permissions: [ "BAN_MEMBERS" ],
    exec: async (client, message, args) => {

        // check specified language
        let lang = args[0];

        // if no language specified then terminate job
        if (!lang) return await message.channel.send(message.guild.language.specify_language).catch(err => {
            return null;
        });

        // get language files
        let languages = fs.readdirSync("./locales/") // read all files in locales directory
            .filter(file => file.endsWith(".json")) // filter non-JSON files
            //replace ".json" extension with nothing (so we can access pure language name)
            .map(file => file.replace(".json", ""));
        
        // if no valid language specified then terminate job
        if (!languages.includes(lang)) return await message.channel
            .send(message.guild.language.specify_valid_language.replace(/{languages}/g, languages.join(", "))).catch(err => {
                return null;
            });

        // update guild model
        await client.database.models.guildModel.updateOne({
            guildID: message.guild.id
        }, {
            language: lang
        });

        // update guild language
        message.guild.language = require(`../../locales/${lang}.json`);

        //send informative message
        await message.channel.send(message.guild.language.language_updated)
    }
}