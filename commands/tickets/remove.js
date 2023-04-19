const { SlashCommandBuilder } = require('discord.js');
const { config, dinamicReplyMessage } = require('../../utility/utility');
const servers = config().servers

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remove')
		.setDescription('Scoate o persoana de pe canal!')
		.addUserOption(option => option.setName('user').setDescription('Persoana pe care dorești să o scoti din canal.').setRequired(true)),
	async execute(interaction) {
		const hasAllowedRole = interaction.member.roles.cache.some(role => servers.cox_server.tickets.permissions.includes(role.id));
		const member = interaction.member;
		const channel = interaction.channel;
		const channelName = channel.name;
		const user = interaction.options.getUser('user');

		if (!hasAllowedRole) return dinamicReplyMessage(interaction, 'Nu ai permisiunea de a folosi aceasta comanda.');

		if (!channelName.includes('ticket')) return dinamicReplyMessage(interaction, 'Această comandă poate fi folosită doar într-un canal de tipul "ticket"!');

		if (user.id === member.id) return dinamicReplyMessage(interaction, 'Nu poți să te scoti singur în canal!');

		if (!channel.members.some(member => member.id === user.id)) return dinamicReplyMessage(interaction, `${user} nu este în canalul ${channel}!`, false);

		channel.permissionOverwrites.edit(user.id, { ViewChannel: false, SendMessages: false })
			.then(() => {
				dinamicReplyMessage(interaction, `${user} a fost scos din canalul ${channel}!`, false);
				user.send(`Ne pare rau, ai fost scos din ticket.`);
			})
			.catch((error) => {
				console.error('A intervenit o erroare la scoaterea persoanei.', error);
			});
	},
};