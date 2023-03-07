const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the current song"),

	execute: async ({ client, interaction }) => {

        // Get the queue for the server
		const queue = client.player.getQueue(interaction.guildId)

        // If there is no queue, return
		if (!queue)
        {
            await interaction.reply("There are no songs in the queue");
            return;
        }

        const currentSong = queue.current

        // Skip the current song
		queue.skip()

        // Get next song information to display
        const queueString = queue.tracks.slice(0, 1).map((song, i) => {
            return `[${song.duration}]\ ${song.title} - <@${song.requestedBy.id}>`
        }).join("\n")

        // Return an embed to the user saying the song has been skipped and shows the next song thats going to play
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`${currentSong.title} has been skipped!`+
                    `\n\n**Next song:**\n${queueString}`)
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
	},
}