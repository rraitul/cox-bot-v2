const { Client, Collection, GatewayIntentBits, Events } = require('discord.js');
const { config } = require('./utility/utility');
const path = require('node:path');
const fs = require('node:fs');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages] });
client.commands = new Collection();

// 1. Aceasta bucata de cod este de a gasi comenzile creeate pentru bot in sub folderele din Commands

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            //console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// 2. Aceasta bucata de cod este de a gasi eventurile creeate pentru bot din events

const eventsPath = path.join(__dirname, 'events');
const eventFolders = fs.readdirSync(eventsPath);

for (const folder of eventFolders) {
    const eventsInFolder = fs.readdirSync(path.join(eventsPath, folder)).filter(file => file.endsWith('.js'));
    for (const file of eventsInFolder) {
        const filePath = path.join(eventsPath, folder, file);
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => {
                const executeArgs = event.name === Events.GuildMemberUpdate ? [...args, client] : args;
                event.execute(...executeArgs);
            });
        }
    }
}

client.login(config().bot.token);