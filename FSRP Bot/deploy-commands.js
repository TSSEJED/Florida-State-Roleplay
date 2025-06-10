const { REST, Routes } = require('discord.js');
require('dotenv').config();

const clientId = process.env.CLIENT_ID || require('./config.json').clientId;
const guildId = process.env.GUILD_ID || require('./config.json').guildId;
const token = process.env.DISCORD_TOKEN || require('./config.json').token;

if (!clientId || !guildId || !token) {
    console.error('Missing required configuration. Please set CLIENT_ID, GUILD_ID, and DISCORD_TOKEN in .env or config.json');
    process.exit(1);
}
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
// Grab all the command files from the commands directory
const commandsPath = path.join(__dirname, 'src/commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
    const command = require(`./src/commands/${file}`);
    commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();
