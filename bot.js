require('dotenv').config();

const fs = require('node:fs');
const path = require('node:path');
// const Discord = require("discord.js");
const { Client, Events, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
// const { Client, Intents } = require("discord.js");
// const client = new Discord.Client();
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ]
});

// const client = new Client({ intents: [
//     Intents.FLAGS.GUILDS, 
//     Intents.FLAGS.GUILD_MESSAGES ] 
// })

// const { SlashCommandBuilder } = require('@discordjs/builders');

// const data = new SlashCommandBuilder()
// .setName('ping')
// .setDescription('Replies with Pong!');

client.on(
    Events.ClientReady, () => { console.log(`Logged in as ${client.user.tag}!`) }
);

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// client.on(
//     "messageCreate", msg => {
//         if (msg.content.startsWith("-anon")) {
//             msg.reply("pong");
//         }
//     }
// )

// client.on(Events.InteractionCreate, async interaction => {
// 	if (!interaction.isChatInputCommand()) return;

// 	if (interaction.commandName === 'ping') {
// 		await interaction.reply({ content: 'Secret Pong!', ephemeral: true });
// 	}
// });

// client.login(process.env.DISCORD_TOKEN);
client.login(token);