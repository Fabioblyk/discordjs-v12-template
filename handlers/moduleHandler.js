const { Collection } = require("discord.js"); // we need collections to access command easily
const fs = require("fs"); // Same as eventHandler.js, we need fs (file system) module to access command files
const path = require("path"); // Same as eventHandler.js, we need path module to format file path

let Commands = new Collection(); // create commands collection
let Aliases = new Collection(); // create command aliases collection

// Check for command categories
let modules = fs.readdirSync("./commands") // read all files in commands directory
    .filter(file => fs.statSync(path.join("./commands", file)).isDirectory()); // filter non-directory files (we need category directories)

// Iterate same process for every category
for (let module of modules) {

    // Show an informative message on console
    console.info(`Loading module: ${module}`);

    // Check for command files
    let commandFiles = fs.readdirSync(path.resolve(`./commands/${module}`)) // read all files in module directory
        .filter(file => !fs.statSync(path.resolve("./commands/", module, file)).isDirectory()) // filter directories
        .filter(file => file.endsWith(".js")); // filter non-js files
    
    // Iterate same process for every command
    for (let file of commandFiles) {

        // Show an informative message on console
        console.info(`Loading command: ${file}`);

        // Access command file
        file = require(`../commands/${module}/${file}`);

        // set file category as its directory (means category) name
        file.module = module;

        // Add command file to commands collection
        Commands.set(file.name, file);
        
        // Iterate same process for every aliases
        for (let alias of file.aliases) Aliases.set(alias, file); // Add command file to aliases collection
    }
}

// Export command and aliases using our client object
module.exports = client => {
    client.commands = Commands; // set commands to our client object
    client.aliases = Aliases; // set aliases to our client object
}