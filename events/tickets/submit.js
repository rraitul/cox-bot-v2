const { config, dinamicEmbedReactionMessageSend, dinamicEmbedBuilder } = require('../../utility/utility');
const { Events, ChannelType, PermissionsBitField } = require('discord.js');
const { Collection } = require('@discordjs/collection');
const { cox_server } = config().servers;

module.exports = {
    name: Events.InteractionCreate,
    createChannel: async (interaction) => {
        return interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: cox_server.tickets.category,
            permissionOverwrites: [
                {
                    id: interaction.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                },
                {
                    id: interaction.guild.roles.everyone,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                ...cox_server.tickets.permissions.map((role) => {
                    return { "id": role, "allow": [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
                }),
            ],
        });
    },
    updateChannelPermissions: async (channel, menu) => {
        channel.send({ embeds: [menu] });
        dinamicEmbedReactionMessageSend(channel, "🗣️ Vorbeste cu un membru staff", "🔒", "📝");
    },
    async execute(interaction) {
        if (interaction.customId === 'modal-tickets') {
            const collection = new Collection(interaction.fields.fields);
            let fieldNames = collection.map((element) => element.customId);

            const field_1 = collection.get(fieldNames[0]);
            const field_2 = collection.get(fieldNames[1]);
            let fields = [{ name: 'Coxatul', value: `<@${interaction.user.id}>` }];

            switch (true) {
                case (fieldNames.includes("role-input")):
                    fields.push({ name: 'Rolul', value: field_1.value }, { name: 'Culoarea', value: field_2.value });
                    break;
                default:
                    fields.push({ name: 'Subiect', value: field_1.value }, { name: 'Descrierea', value: field_2.value });
                    break;
            }

            const channel = await this.createChannel(interaction).catch(console.error);
            const menu = dinamicEmbedBuilder(
                "Sistem de tickete",
                'Aici iti vei rezolva problema pe care o ai cu ajutorul unui membru din staff',
                'https://cdn.discordapp.com/attachments/656420226556100609/918151996580720660/standard_copy.gif',
                'https://cdn.discordapp.com/icons/730709591440228432/a_59c911be0b17eb1fa99a71b0a6cc9db8.gif?size=512',
                fields
            );

            this.updateChannelPermissions(channel, menu, interaction).catch(console.error);

            channel.send(`<@${interaction.user.id}>`).then(msg => msg.delete({ timeout: 100 })).catch(console.error);
            interaction.reply({ content: 'Ticket-ul tau a fost creat!', ephemeral: true }).then(msg => msg.delete({ timeout: 1000 })).catch(console.error);
        }
    }
};