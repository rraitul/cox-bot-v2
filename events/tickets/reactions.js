const { config, dinamicSendMessageReaction } = require('../../utility/utility');
const { Events } = require('discord.js');
const save = require("./save");
const servers = config().servers

module.exports = {
    name: Events.MessageReactionAdd,
    claim: async (reaction, user) => {
        await Promise.all(servers.cox_server.tickets.permissions.map(async (r) => {
            await reaction.message.channel.permissionOverwrites.edit(r, { ViewChannel: null, SendMessages: null });
        }));

        await reaction.message.channel.permissionOverwrites.edit(user.id, { ViewChannel: true, SendMessages: true });
        await dinamicSendMessageReaction(reaction, `${user} a luat ticketul !`);
        await reaction.remove();
    },

    async execute(reaction, user) {
        const member = await reaction.message.guild.members.fetch(user.id);

        if (user.bot) return;
        if (!servers.cox_server.tickets.permissions.some(role => member.roles.cache.has(role))) return reaction.users.remove(user.id).catch(console.error);;

        switch (reaction.emoji.name) {
            case '🔒':
                save.execute(reaction, user);
                await reaction.message.reactions.removeAll().then(channel => reaction.message.channel.delete({ timeout: 100 })).catch(console.error);
                break;
            case '📝':
                await this.claim(reaction, user).catch(console.error);
                break;
        }
    },
};
