const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Shuffles the playlist"),
	execute: async ({ client, interaction }) => {
        // Get the queue for the server
		const queue = client.player.nodes.get(interaction.guildId)

        // Check if the queue is empty
		if (!queue)
		{
			await interaction.reply("There are no songs in the queue")
			return;
		}

        // Shuffle the current queue
		queue.tracks.shuffle();

        await interaction.reply("Queue has been shuffled")
	},
}