// triggered when bot leaves a guild
module.exports = async guild => {
    // delete guild model
    await guild.client.database.models.guildModel.deleteMany({
        guildID: guild.id
    });
    console.log(`[LEFT GUILD]: ${guild.name} | ${guild.id}`); // Show an informative on console
}
