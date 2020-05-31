// triggered when bot joins a guild
module.exports = async guild => {
    await db.set(`${guild.id}.language`, "en"); // set default language to english
    guild.language = "en"; // set default language to english
    console.log(`[JOINED GUILD]: ${guild.name} | ${guild.id}`); // Show an informative on console
}