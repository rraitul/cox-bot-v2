const { SlashCommandBuilder } = require('discord.js');
const { config, dinamicReplyMessage } = require('../../utility/utility');
const servers = config().servers

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add')
		.setDescription('Adauga o persoana de pe canal!')
		.addUserOption(option => option.setName('user').setDescription('Persoana pe care dorești să o adaugi în canal.').setRequired(true)),
	async execute(interaction) {
		const hasAllowedRole = interaction.member.roles.cache.some(role => servers.cox_server.tickets.permissions.includes(role.id));
		const member = interaction.member;
		const channel = interaction.channel;
		const channelName = channel.name;
		const user = interaction.options.getUser('user');

		if (!hasAllowedRole) {
			return dinamicReplyMessage(interaction, 'Nu ai permisiunea de a folosi aceasta comanda.')
		}

		if (!channelName.includes('ticket')) {
			return dinamicReplyMessage(interaction, 'Această comandă poate fi folosită doar într-un canal de tipul "ticket"!');
		}

		if (user.id === member.id) {
			return dinamicReplyMessage(interaction, 'Nu poți să te adaugi singur în canal!');
		}

		if (channel.members.some(member => member.id === user.id)) {
			return dinamicReplyMessage(interaction, `${user} este deja în canalul ${channel}!`, false);
		}

		channel.permissionOverwrites.edit(user.id, { ViewChannel: true, SendMessages: true })
			.then(() => {
				dinamicReplyMessage(interaction, `${user} a fost adaugat in canalul ${channel}!`, false);
				user.send(`Ai fost adaugat intr-un ticket. Pentru a afla mai multe apasa mai jos.\n${channel}`);
			})
			.catch((error) => {
				console.error('A intervenit o erroare la adaugarea persoanei.', error);
			});
	},
};