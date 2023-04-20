const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Shuffles the playlist"),
	execute: async ({ client, interaction }) => {
		// Let the Discord Client know the bot is alive   
		await interaction.deferReply();

        // Get the queue for the server
		const queue = client.player.nodes.get(interaction.guildId)

        // Check if the queue is empty
		if (!queue)
		{
			await interaction.editReply("There are no songs in the queue")
			return;
		}

        // Shuffle the current queue
		queue.tracks.shuffle();

        await interaction.editReply("Queue has been shuffled")
	},
}