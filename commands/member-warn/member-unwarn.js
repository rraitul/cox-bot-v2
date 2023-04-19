const { config, dinamicReplyMessage } = require('../../utility/utility');
const { SlashCommandBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');
const servers = config().servers

const MEMBER_WARNS_PATH = path.resolve(__dirname, '../member-warn/member-warns.json');

let memberWarns;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ravertisment')
        .setDescription('Șterge un warn al unui utilizator!')
        .addUserOption(option => option.setName('user').setDescription('Persoana de la care dorești să ștergi un avertisment.').setRequired(true))
        .addIntegerOption(option => option.setName('warn-id').setDescription('ID-ul avertismentului pe care dorești să îl ștergi.').setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const warnId = interaction.options.getInteger('warn-id');
        memberWarns = memberWarns || JSON.parse(fs.readFileSync(MEMBER_WARNS_PATH, 'utf8'));

        if (!interaction.member.roles.cache.some(role => servers.cox_server.tickets.permissions.includes(role.id))) return dinamicReplyMessage(interaction, 'Nu ai permisiunea de a folosi aceasta comanda.');
        if (interaction.channel.id !== servers.cox_server.modlogs.channel) return dinamicReplyMessage(interaction, `Această comandă poate fi folosită doar pe canalul <#${servers.cox_server.modlogs.channel}>`);
        if (!memberWarns.usersWarned[user.id] || memberWarns.usersWarned[user.id].length < warnId) return dinamicReplyMessage(interaction, `Nu există un avertisment cu id-ul ${warnId} pentru utilizatorul ${user}.`, false);

        memberWarns.usersWarned[user.id].splice(warnId - 1, 1);

        if (memberWarns.usersWarned[user.id].length === 0) delete memberWarns.usersWarned[user.id];

        await fs.promises.writeFile(MEMBER_WARNS_PATH, JSON.stringify(memberWarns)).catch(console.error);
        await dinamicReplyMessage(interaction, `S-a șters avertismentul cu id-ul ${warnId} pentru utilizatorul ${user}.`, false)
    },
};
