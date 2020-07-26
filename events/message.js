// save active users for cooldown
const activeUsers = {};

// triggered when someone send a message
module.exports = async message => {

    // ignore bots
    if (message.author.bot) return;

    let prefix = message.client.config.prefixes[0], cmdFile; // preparation variable

    // Iterate same process for every prefixes
    for (let i = 0; i < message.client.config.prefixes.length; i++) {

        // if message starts with prefix
        if (message.content.startsWith(message.client.config.prefixes[i])) 
            prefix = message.client.config.prefixes[i]; // then set prefix as it
    }
    
    // check if message not starts with prefix then termiante job
    if (!message.content.startsWith(prefix)) return;

    // check if guild language file is not set
    if (!message.guild.language) {
        
        let guildModel = await client.database.models.guildModel.findOne({
            guildID: message.guild.id
        });

        // check if guild has data
        let language = guildModel ? 
            guildModel.language :
            "en";
        
        // set guilds language file
        message.guild.language = require(`../locales/${language}.json`);
    }

    // split args and command
    let args = message.content.slice(prefix.length).split(" ");
    command = args.shift();

    // check if bot has command
    if (message.client.commands.has(command)) {

        // if commands collection has command
        cmdFile = message.client.commands.get(command); // then set cmdFile to it
    } else if (message.client.aliases.has(command)) {

        // if aliases collection has command
        cmdFile = message.client.aliases.get(command); // then set cmdFile to it
    } else return; // else terminate job

    // check disabled commands
    if (!cmdFile.enabled) return message.channel.send(message.guild.language.command_disabled);

    // check ownerOnly commands
    if (cmdFile.ownerOnly && !message.client.config.owners.includes(message.author.id)) {

        // send informative message that says you can't use this command if you are not owner
        return message.channel.send(message.guild.language.command_owner_only);
    }
    
    // check if member has permission
    if (message.client.config.owners.includes(message.author.id) || // if user is bot owner
        message.member.permissions.has(cmdFile.permissions)) { // or has enough permission to run this command

        // check if command is guild only
        if (cmdFile.guildOnly) {

            // check if message sent in guild
            if (message.guild) { // if message sent in guild

                // check for cooldown
                if (checkCooldown(cmdFile, message)) return message.channel.send(message.guild.language.wait_cooldown.replace(/{cooldown}/g, cmdFile.cooldown));
            
                // then run command without any action
                cmdFile.exec(message.client, message, args);

                // set cooldown for user
                setCooldown(cmdFile, message);
            } else { // if message not sent in guild

                // send informative message that says you can't use this command
                return message.channel.send(message.guild.language.command_guild_only);
            }
        } else { // if command is not guild only

            // check for cooldown
            if (checkCooldown(cmdFile, message)) return message.channel.send(message.guild.language.wait_cooldown.replace(/{cooldown}/g, cmdFile.cooldown));
            
            // then run command without any action
            cmdFile.exec(message.client, message, args);

            // set cooldown for user
            setCooldown(cmdFile, message);
        }

    } else  { // if user has not permissions to run this commands

        // send informative message that says you can't use this command
        return message.channel.send(message.guild.language.not_enough_permission
            .replace(/{permissions}/g, cmdFile.permissions.join(", ")));
    }

}

// add new users to cooldown
function setCooldown(cmd, message) {
    if (activeUsers.hasOwnProperty(cmd.name)) {
        activeUsers[cmd.name].push(message.author.id);
        message.client.setTimeout(() => {
            activeUsers[cmd.name].splice(activeUsers[cmd.name].indexOf(message.author.id), 1);
        }, cmd.cooldown * 1000);
    }
}

function checkCooldown(cmd, message) {
    if (
        cmd.cooldown && 
        typeof cmd.cooldown === "number" && 
        cmd.cooldown >= 1 && 
        cmd.cooldown <= 1440
    ) {
        if (!activeUsers.hasOwnProperty(cmd.name)) activeUsers[cmd.name] = [];
        if (activeUsers[cmd.name].includes(message.author.id)) return true;
    }
    return false;
}