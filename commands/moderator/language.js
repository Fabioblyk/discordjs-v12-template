const fs = require("fs");

module.exports = {
    name: "language",
    aliases: [ "lang" ],
    permissions: [ "BAN_MEMBERS" ],
    exec: async (client, message, args) => {

        // check specified language
        let lang = args[0];

        // if no language specified then terminate job
        if (!lang) return await message.channel.send(message.guild.language.specify_language);

        // get language files
        let languages = fs.readdirSync("./locales/") // read all files in locales directory
            .filter(file => file.endsWith(".json")) // filter non-JSON files
            //replace ".json" extension with nothing (so we can access pure language name)
            .map(file => file.replace(".json", ""));
        
        // if no valid language specified then terminate job
        if (!languages.includes(lang)) return await message.channel
            .send(message.guild.language.specify_valid_language.replace(/{languages}/g, languages.join(", ")));

        client.db.set(`${message.guild.id}.language`, lang);
        message.guild.language = require(`../../locales/${lang}.json`);
        await message.channel.send(message.guild.language.language_updated);
    }
}