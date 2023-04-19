const { config, dinamicReplyMessage } = require('../../utility/utility');
const { SlashCommandBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');
const servers = config().servers

const MEMBER_WARNS_PATH = path.resolve(__dirname, '../member-warn/member-warns.json');
let memberWarns;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avertisment')
        .setDescription('Adauga un warn unui utilizator!')
        .addUserOption(option => option.setName('user').setDescription('Persoana pe care dorești să o avertizezi.').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Motivul pentru care primeste warn.').setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');
        memberWarns = memberWarns || JSON.parse(fs.readFileSync(MEMBER_WARNS_PATH, 'utf8'));

        if (!interaction.member.roles.cache.some(role => servers.cox_server.tickets.permissions.includes(role.id))) return dinamicReplyMessage(interaction, 'Nu ai permisiunea de a folosi aceasta comanda.');
        if (interaction.channel.id !== servers.cox_server.modlogs.channel) return dinamicReplyMessage(interaction, `Această comandă poate fi folosită doar pe canalul <#${servers.cox_server.modlogs.channel}>`);
        if (!memberWarns.usersWarned[user.id]) memberWarns.usersWarned[user.id] = [];

        const warnId = (memberWarns.usersWarned[user.id].length + 1).toString();
        const now = new Date();
        const formattedDate = now.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            hour12: false,
            minute: '2-digit',
            second: '2-digit'
        });

        memberWarns.usersWarned[user.id].push({
            id: warnId,
            type: 'Warn',
            member: `(${user.id}) ${user.tag}`,
            staff_member: interaction.user.tag,
            reason: reason,
            date: formattedDate
        });

        await fs.promises.writeFile(MEMBER_WARNS_PATH, JSON.stringify(memberWarns)).catch(console.error);
        await dinamicReplyMessage(interaction, `S-a adaugat un nou avertisment utilizatorului ${user} pentru motivul: ${reason}`, false)
    },
};
