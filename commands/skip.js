const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the current song"),

	execute: async ({ client, interaction }) => {
        // Let the Discord Client know the bot is alive
        await interaction.deferReply();

        // Get the queue for the server
		const queue = client.player.nodes.get(interaction.guildId)

        // If there is no queue, return
		if (!queue)
        {
            await interaction.editReply("There are no songs in the queue");
            return;
        }
        
        // Skip the current song
		queue.node.skip()
        
        await interaction.editReply("Current song has been skipped")
        return;


        /*const currentSong = queue.current

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
        })*/
	},
}