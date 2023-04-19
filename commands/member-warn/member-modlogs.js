const { dinamicReplyMessage, config } = require('../../utility/utility');
const { SlashCommandBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');
const servers = config().servers

const MEMBER_WARNS_PATH = path.resolve(__dirname, '../member-warn/member-warns.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('modlogs')
        .setDescription('Adauga un warn unui utilizator!')
        .addUserOption(option => option.setName('user').setDescription('Utilizatorul a cărui avertismente doriți să le afișați.').setRequired(true)),
    async execute(interaction) {
        const userId = interaction.options.getUser('user').id;
        const memberWarns = JSON.parse(fs.readFileSync(MEMBER_WARNS_PATH, 'utf8'));
        const userWarns = memberWarns.usersWarned[`${userId}`];


        if (!interaction.member.roles.cache.some(role => servers.cox_server.tickets.permissions.includes(role.id))) return dinamicReplyMessage(interaction, 'Nu ai permisiunea de a folosi aceasta comanda.');
        if (interaction.channel.id !== servers.cox_server.modlogs.channel) return dinamicReplyMessage(interaction, `Această comandă poate fi folosită doar pe canalul <#${servers.cox_server.modlogs.channel}>`);
        if (!userWarns || userWarns.length === 0) return await dinamicReplyMessage(interaction, `Nu există avertismente pentru utilizatorul cu ID-ul <@${userId}>`, false);

        let warnsMessage = "";
        for (const [index, warn] of userWarns.entries()) {
            warnsMessage += `**Cazul:** ${warn.id}\n`;
            warnsMessage += `**Tip:** ${warn.type}\n`;
            warnsMessage += `**Membrul:** ${warn.member}\n`;
            warnsMessage += `**Staff:** ${warn.staff_member}\n`;
            warnsMessage += `**Motiv:** ${warn.reason}\n`;
            warnsMessage += `**Data:** ${warn.date}\n\n`;
        }

        await dinamicReplyMessage(interaction, `Istoricul de avertismente pentru utilizatorul <@${userId}>.\n\n${warnsMessage}`, false)
    }
};
