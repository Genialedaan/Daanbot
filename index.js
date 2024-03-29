require('dotenv').config();

const {REST} = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents, Collection, GatewayIntentBits, ActivityType } = require('discord.js');
const { Player } = require("discord-player")

const fs = require('fs');
const path = require('path');


const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages]
});

// List of all commands
const commands = [];
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for(const file of commandFiles)
{
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

// Add the player on the client
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25,
        requestOptions: {
            headers: {
                cookie: process.env.YOUTUBE_COOKIE
            }
        }
    }
})

client.player.events.on('playerStart', (queue, track) => {
    // we will later define queue.metadata object while creating the queue
    const channel = queue.metadata.channel; 
    channel.send(`🎶 | Started playing **${track.title}**`);
});

client.on("ready", () => {
    // Get all ids of the servers
    const guild_ids = client.guilds.cache.map(guild => guild.id);

    client.user.setPresence({
        activities: [{ name: `music I hope`, type: ActivityType.Playing }],
        status: 'online',
      });
    
    const rest = new REST({version: '10'}).setToken(process.env.TOKEN);
    
    for (const guildId of guild_ids)
    {
        rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId), 
            {body: commands})
        .then(() => console.log('Successfully updated commands for guild ' + guildId))
        .catch(console.error);
    }


});

client.on("interactionCreate", async interaction => {
    if(!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if(!command) return;

    try
    {
        await command.execute({client, interaction});
    }
    catch(error)
    {
        console.error(error);
        await interaction.editReply({content: "There was an error executing this command"});
    }
});

client.login(process.env.TOKEN);

process.on('warning', e => console.warn(e.stack));

