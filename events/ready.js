// Once our client gets ready, these line of codes will be triggered
module.exports = async client => {

    // Set clients presence (playing message)
    client.user.setPresence({
        status: client.config.game.status, // set status (online, idle, dnd (do not disturb), invisible)
        activity: {

            // set activity name
            name: typeof client.config.game.name === "string" ? // if activity name is a string
                client.config.game.name : // then set activity as it
                client.config.game.name instanceof Array ? // if its an array
                client.config.game.name[0] : // then set activity as its first element
                null, // else set activity as nothing
            
            // set activity type
            type: client.config.game.type, // (PLAYING, STREAMING, LISTENING, WATCHING)

            // set stream url (if you are using STREAMING activity type)
            url: client.config.game.url && 
                client.config.game.url.trim().length ? 
                client.config.game.url : // if we specified a valid url then set stream url as it
                null // else set stream url as nothing
        }
    });

    // set updating presence
    if (client.config.game.name instanceof Array && client.config.game.name.length) {
        client.setInterval(async () => {

            // get a random activity name
            let activity = client.config.game.name[Math.floor(Math.random() * client.config.game.name.length)];

            // update activity
            await client.user.setActivity(activity, {
                type: client.config.game.type,
                url: client.config.game.url && 
                    client.config.game.url.trim().length ? 
                    client.config.game.url : 
                    null
            });
        }, ((typeof client.config.game.interval === "number" && client.config.game.interval) || 30) * 1000);
    }

    // Iterate same process for every guilds
    for (let guild of client.guilds.cache.array()) {

        // get guild language
        let lang = await client.db.fetch(`${guild.id}.language`);

        // check if no language data found
        if (!lang) {
            lang = "en"; // set default language to english
            client.db.set(`${guild.id}.language`, "en"); // and save it to database
        }

        // set guilds language file
        guild.language = require(`../locales/${lang}.json`);
    }

    // Show an informative message on console
    console.log(`[      BOT]: ${client.user.username} is ready!`); // show bot name
    console.log(`[ PREFIXES]: ${client.config.prefixes.join(" ")}`); // show bots prefixes
    console.log(`[   GUILDS]: ${client.guilds.cache.size}`); // show guild count
    console.log(`[ CHANNELS]: ${client.channels.cache.size}`); // show channel count
    console.log(`[    USERS]: ${client.users.cache.size}`); // show user count
    console.log(`[BOOT TIME]: ${process.uptime() * 1000}ms`); // show boot time
}