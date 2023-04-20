const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("previous")
        .setDescription("Replays previous song"),
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

        // Check if there is a previously played song and go back to it
        if(queue.history.previousTrack){
		    queue.history.back();

            await interaction.editReply("Replaying previous song")
        }
        else{
            await interaction.editReply("No previous song, stop trying to break the bot")
        }
	},
}