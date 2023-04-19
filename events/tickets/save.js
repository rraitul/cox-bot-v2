const discordTranscripts = require('discord-html-transcripts');
const { config, dinamicSendMessageToChannel } = require('../../utility/utility');
const servers = config().servers
const path = require("path");
const fs = require('fs');

module.exports = {
    async execute(reaction, user) {
        const channel = reaction.message.channel;
        const htmlStingValues = await discordTranscripts.createTranscript(channel, {
            limit: -1,
            returnType: 'string',
            saveImages: true,
        }).catch(console.error);

        const fileName = `${Math.floor(Date.now() / 1000)}-${user.id}-ticket.html`;
        const filePath = path.join(__dirname, './logs/');

        await fs.appendFile(filePath + fileName, htmlStingValues, (err) => { if (err) console.log(err) });

        const logsChannel = reaction.message.guild.channels.cache.get(servers.cox_server.tickets.logs.id);
        const logAddressedLink = `http://${servers.cox_server.tickets.logs.ip}:${servers.cox_server.tickets.logs.port}/events/ticket/logs/${fileName}`
        const text = `Ticketul a fost inchis! Pentru a vizualiza logs: Apasa [**Aici**](${logAddressedLink})`;
        
        await dinamicSendMessageToChannel(logsChannel, text).catch(console.error);
    },
};
