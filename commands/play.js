const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders")
const { QueryType, GuildQueue } = require("discord-player")
module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("play a song from YouTube.")
		.addSubcommand(subcommand =>
			subcommand
				.setName("search")
				.setDescription("Searches for a song on YouTube and plays it")
				.addStringOption(option =>
					option.setName("searchterms").setDescription("search keywords").setRequired(true)
				)
		)
        .addSubcommand(subcommand =>
			subcommand
				.setName("playlist")
				.setDescription("Plays a playlist from YouTube or Spotify")
				.addStringOption(option => option.setName("url").setDescription("the playlist's url").setRequired(true))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("song")
				.setDescription("Plays a single song from YouTube, Spotify or Soundcloud")
				.addStringOption(option => option.setName("url").setDescription("the song's url").setRequired(true))
		),
	execute: async ({ client, interaction }) => {
        // Let the Discord Client know the bot is alive
        await interaction.deferReply();
        
        // Make sure the user is inside a voice channel
		if (!interaction.member.voice.channel) return interaction.reply("You need to be in a Voice Channel to play a song.");

        // Create a play queue for the server
		//const queue = await client.player.createQueue(interaction.guild);
        const queue = client.player.nodes.create(interaction.guild, {
            metadata: interaction
        });

        // Wait until you are connected to the channel
		if (client.voice.adapters.size == 0) await queue.connect(interaction.member.voice.channel)

		let embed = new EmbedBuilder()        

		if (interaction.options.getSubcommand() === "song") {
            let url = interaction.options.getString("url")
            var result;
            // Search for the song using the discord-player
            if(url.includes("youtube") || url.includes("youtu.be")){
                result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_VIDEO
                })
            }
            else if(url.includes("spotify")){
                result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.SPOTIFY_SONG})
            }
            else if(url.includes("soundcloud")){
                result = await client.player.search(url.split('?')[0], {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.SOUNDCLOUD_TRACK})
            }

            // finish if no tracks were found
            if (result.tracks.length === 0)
                return interaction.editReply("No results")

            // Add the track to the queue
            const song = result.tracks[0]
            try {
                await client.player.play(interaction.member.voice.channel, song.url,{
                nodeOptions:{

                }
            })
                embed
                .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})}
            
            catch (e){
                return interaction.followUp(e)
            }

		}
        else if (interaction.options.getSubcommand() === "playlist") {

            // Search for the playlist using the discord-player
            let url = interaction.options.getString("url")
            let result;

            if(url.includes("youtube") || url.includes("youtu.be")){
                result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
                })
            }
            else if(url.includes("spotify")){
                    result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.SPOTIFY_PLAYLIST
                })
            }

            if (result.tracks.length === 0)
                return interaction.editReply(`No playlists found with ${url}`)
            
            const playlist = result.playlist;

            try {
                await client.player.play(interaction.member.voice.channel, playlist,{
                nodeOptions:{

                }
            })
            embed
                .setDescription(`**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the Queue`)
            }
            
            catch (e){
                return interaction.followUp(e)
            }
         

		} 
        else if (interaction.options.getSubcommand() === "search") {            
            // Search for the song using the discord-player
            let url = interaction.options.getString("searchterms")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })


            // finish if no tracks were found
            if (result.tracks.length === 0)
                return interaction.editReply("No results")
            
            // Add the track to the queue
            const song = result.tracks[0]

            try {
                await client.player.play(interaction.member.voice.channel, song.url,{
                nodeOptions:{

                }
            })
                embed
                .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})}
            
            catch (e){
                return interaction.followUp(e)
            }
		}
        
        await interaction.editReply({
            embeds: [embed]
        })
	},
}