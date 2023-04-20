const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("exit")
        .setDescription("Kick the bot from the channel."),
	execute: async ({ client, interaction }) => {
		// Let the Discord Client know the bot is alive   
		await interaction.deferReply();

        // Get the current queue
		const queue = client.player.nodes.get(interaction.guildId)

		if (!queue)
		{
			await interaction.editReply("There are no songs in the queue")
			return;
		}

        // Deletes all the songs from the queue and exits the channel
		queue.delete();

        await interaction.editReply("I didn't want to be here anyway")
	},
}