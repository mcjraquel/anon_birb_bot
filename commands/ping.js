const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

let nicknames = {};
let colors = {};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('anon')
		.setDescription('Enter an anonymous chat room.')
		.addStringOption(option =>
			option
				.setName('nickname')
				.setDescription('Your desired nickname')
				.setRequired(false)
		)
		.addStringOption(option =>
			option
				.setName('message')
				.setDescription('Your anonymous message')
				.setRequired(false)
		),
	async execute(interaction) {

		if (interaction.options.getString('nickname')) {
			nicknames[interaction.member.user.id] = await interaction.options.getString('nickname');
			await interaction.reply({ content: `Nickname set to **${interaction.options.getString('nickname')}**!`, ephemeral: true });
			colors[interaction.member.user.id] = await `#${Math.floor(Math.random()*16777215).toString(16)}`;
		}
		
		if (interaction.options.getString('message')) {
			try {
				const messageEmbed = await new EmbedBuilder()
					.setColor(colors[interaction.member.user.id])
					.setTitle(`**${nicknames[interaction.member.user.id]}**`)
					.setDescription(`${interaction.options.getString('message')}`)
					.setFooter({ text: `ID: ${interaction.id}` });
				await interaction.channel.send({ embeds: [messageEmbed] });
				if (!interaction.options.getString('nickname')) {
					await interaction.reply({ content: 'Message sent.', ephemeral: true });
					interaction.deleteReply();
				}
			} catch(e) {
				interaction.reply({ content: 'Please set your nickname first.', ephemeral: true });
			}
			
		}		
	},
};