const { Events, Collection } = require('discord.js');
const { dinamicReplyMessage } = require('../../utility/utility');

// Create a new collection to store command cooldowns
const cooldowns = new Collection();

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			await interaction.reply(`Comanda ${interaction.commandName} nu a fost gasita.`)
			return;
		}

		// Check if the command has a cooldown
		const now = Date.now();
		const timestamps = cooldowns.get(command.name) || new Collection();
		const cooldownAmount = (command.cooldown || 1) * 1000;

		if (timestamps.has(interaction.user.id)) {
			const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return dinamicReplyMessage(interaction, `Please wait ${timeLeft.toFixed(1)} seconds to execute the command again.`)
			}
		}

		// Set the user's cooldown
		timestamps.set(interaction.user.id, now);
		cooldowns.set(command.name, timestamps);

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
		}
	},
};
