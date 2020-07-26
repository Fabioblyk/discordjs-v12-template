// triggered when bot joins a guild
module.exports = async guild => {
    // create guild model
    let guildModel = new guild.client.database.models.guildModel({
        guildID: guild.id
    });
    await guildModel.save(); // save model
    guild.language = require("../locales/en.json"); // set default language to english
    console.log(`[JOINED GUILD]: ${guild.name} | ${guild.id}`); // Show an informative on console
}
