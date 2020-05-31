const fs = require("fs"); // We need fs (file system) module to access event files
const path = require("path"); // We need path module to format file path

// Export events using our client object
module.exports = client => {

    // check for event files
    let Events = fs.readdirSync("./events/") // read all files in events directory
        .filter(file => !fs.statSync(path.resolve("./events/" + file)).isDirectory()) // filter directories
        .filter(file => file.endsWith(".js")); // filter non-js files

    // Iterate same process for every event files
    for (let event of Events) {

        // replace ".js" extension with nothing (so we can access pure event name)
        event = event.replace(/\.js$/i, "");

        // show an informative message on console
        console.info(`Loading event: ${event}`);

        // "ready" is a special event so we need to use our client object with it
        if (event === "ready") client.on(event, () => require(`../events/${event}`)(client)); // load ready event
        else client.on(event, require(`../events/${event}`)); // load other events
    }
};