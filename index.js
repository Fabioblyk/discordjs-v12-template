// Discord.JS and Database packages
const { Client } = require("discord.js");
const Mongoose = require("mongoose");

// Our client object, everything happens in this sneaky thing
const client = global.client = new Client();

// We have defined the settings and database in our client object to access these settings from anywhere.
client.config = require("./config.json");

// Connecting to mongodb
Mongoose.connect(client.config.mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
client.database = Mongoose.connection;
client.database.on("error", (err) => {
    throw err;
});

client.database.once("open", async () => {
    // import models
    require("./models");
    
    // Load our commands and events
    require("./handlers/eventHandler")(client);
    require("./handlers/moduleHandler")(client);

    // Connect to Discord API
    client.login(client.config.bot_token);
});