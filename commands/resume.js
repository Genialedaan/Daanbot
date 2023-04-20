const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resumes the current song"),
	execute: async ({ client, interaction }) => {                
        // Let the Discord Client know the bot is alive                
        await interaction.deferReply();

        // Get the queue for the server
		const queue = client.player.nodes.get(interaction.guildId)

        // Check if the queue is empty
		if (!queue)
        {
            await interaction.editReply("No songs in the queue");
            return;
        }
        

        // Pause the current song
		queue.node.resume();

        await interaction.editReply("Player has been resumed")
	},
}