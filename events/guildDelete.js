// triggered when bot leaves a guild
module.exports = async guild => {
    db.delete(`${guild.id}`) // delete guild data
    console.log(`[LEFT GUILD]: ${guild.name} | ${guild.id}`); // Show an informative on console
}