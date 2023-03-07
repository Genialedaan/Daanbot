const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("previous")
        .setDescription("Replays previous song"),
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
        if(queue.history.previousTrack){
		    queue.history.back();

            await interaction.reply("Replaying previous song")
        }
        else{
            await interaction.reply("No previous song, stop trying to break the bot")
        }
	},
}