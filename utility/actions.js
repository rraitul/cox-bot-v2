
const { dinamicReplyMessage } = require('./utility');
const path = require('path');
const fs = require('fs');

const MEMBER_WARNS_PATH = path.resolve(__dirname, '../commands/member-warn/member-warns.json');

module.exports = {
    async returnUserModlogs(interaction) {
        const userId = interaction.user.id;
        const memberWarns = JSON.parse(fs.readFileSync(MEMBER_WARNS_PATH, 'utf8'));
        const userWarns = memberWarns.usersWarned[`${userId}`];
        
        if (!userWarns || userWarns.length === 0) return await dinamicReplyMessage(interaction, `Nu există avertismente pentru utilizatorul cu ID-ul <@${userId}>`);

        let warnsMessage = "";
        for (const [index, warn] of userWarns.entries()) {
            warnsMessage += `**Cazul:** ${warn.id}\n`;
            warnsMessage += `**Tip:** ${warn.type}\n`;
            warnsMessage += `**Membrul:** ${warn.member}\n`;
            warnsMessage += `**Staff:** ${warn.staff_member}\n`;
            warnsMessage += `**Motiv:** ${warn.reason}\n`;
            warnsMessage += `**Data:** ${warn.date}\n\n`;
        }

        await dinamicReplyMessage(interaction, `Istoricul de avertismente pentru utilizatorul <@${userId}>.\n\n${warnsMessage}`)
    }
};
