// Discord.JS and Database packages
const { Client } = require("discord.js");
const { Database } = require("bookman");

// Our client object, everything happens in this sneaky thing
const client = new Client();

// We have defined the settings and database in our client object to access these settings from anywhere.
client.config = require("./config.json");
client.db = new Database("database/main");

// Load our commands and events
require("./handlers/eventHandler")(client);
require("./handlers/moduleHandler")(client);

// Connect to Discord API
client.login(client.config.bot_token);