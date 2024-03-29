const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("shows first 10 songs in the queue"),

    execute: async ({ client, interaction }) => {
        // Let the Discord Client know the bot is alive
        await interaction.deferReply();

        // Get the queue for the server
        const queue = client.player.nodes.get(interaction.guildId)

        // check if there are songs in the queue
        if (!queue)
        {
            await interaction.editReply("There are no songs in the queue");
            return;
        }

        // Get the first 10 songs in the queue
        const queueString = queue.tracks.store.slice(0, 10).map((song, i) => {
            return `${i+1}) \`[${song.duration}]\`\ **[${song.title}](${song.url})** - <@${song.requestedBy.id}>`
        }).join("\n")

        // Get the current song
        const currentSong = queue.currentTrack

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**Currently Playing**\n` + 
                        (currentSong ? `\`[${currentSong.duration}]\` **[${currentSong.title}](${currentSong.url})** - <@${currentSong.requestedBy.id}>` : "None") +
                        `\n\n**Queue**\n${queueString}`
                    )
            ]
        })
    }
}
