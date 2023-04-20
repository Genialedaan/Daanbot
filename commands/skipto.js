const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("skipto")
        .setDescription("Skips to a specific song in the queue")
        .addStringOption(option => option.setName("number").setDescription("Number in the queue").setRequired(true)),

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

        // Retrieve the number to skip to and get the size of current queue
        let number = interaction.options.getString("number")
        number =+ number
        var queueSize = queue.getSize();

        // If the size of the queue is equal to or bigger than the number skip to that song in the queue
        if(queueSize >= number && number > 0){
		    queue.node.skipTo(number - 1)
            if(number == 1){
                await interaction.editReply(`Bruh coulda used regular skip if ur gonna skip just one song 😒`)
            }
            else{
                await interaction.editReply(`Skipped to song number ${number} in the queue`);
            }            
        }
        else{
            await interaction.editReply("I can't skip to that!")
        }
	},
}