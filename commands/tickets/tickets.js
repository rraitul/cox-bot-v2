const { SlashCommandBuilder } = require('discord.js');
const { config, dinamicReplyMessage, dinamicButtonComponent, dinamicEmbedMessage, dinamicActionRowBuilder } = require('../../utility/utility');
const { cox_server } = config().servers
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tickets')
        .setDescription('Activezi/Dezactivezi sistemul de tickete!')
        .addStringOption(option =>
            option.setName('status')
                .setDescription('Activezi/Dezactivezi sistemul de tickete!')
                .setRequired(true)
                .addChoices(
                    {
                        name: 'Activeaza',
                        value: 'activate'
                    },
                    {
                        name: 'Dezactiveaza',
                        value: 'dezactivate'
                    }
                )
        ),
    async execute(interaction) {
        const status = interaction.options.getString('status');
        const permission = interaction.member.roles.cache.some(role => cox_server.tickets.permissions.includes(role.id));
        const channel = await interaction.client.channels.fetch(cox_server.tickets.channel);
        const message = cox_server.tickets.message ? await channel.messages.fetch(cox_server.tickets.message) : null;

        if (!permission) {
            return dinamicReplyMessage(interaction, "Nu ai permisiunea de a folosi aceasta comanda.");
        }

        if (status === 'dezactivate') {
            if (!message) {
                return dinamicReplyMessage(interaction, `Mesajul de tickete nu a fost gasit pe canalul <#${cox_server.tickets.channel}> !`);
            }

            try {
                const buttonComponent = dinamicButtonComponent('create-ticket', 'Tickete oprite.', 'danger', '📝', true)
                const embedEditedMessage = dinamicEmbedMessage(0x0099FF, 'Cox Family Support - Tickets', 'https://discord.gg/cox', 'Apasa pe butonul de mai jos pentru a creea un ticket!', 'https://cdn.discordapp.com/attachments/656420226556100609/918151996580720660/standard_copy.gif');
                dinamicReplyMessage(interaction, `Ticketele sunt acum **${status}** !`);
                return message.edit({ embeds: [embedEditedMessage], components: [buttonComponent], ephemeral: true });
            } catch (error) {
                console.log(error);
            }
        }

        if (!message) {
            try {
                const dropdownSelector = dinamicActionRowBuilder('select-option', 'Cere Ajutor', ['📝 Cere ajutor'])
                const embedEditedMessage = dinamicEmbedMessage(0x0099FF, 'Cox Family Support - Tickets', 'https://discord.gg/cox', 'Apasa pe butonul de mai jos pentru a creea un ticket!', 'https://cdn.discordapp.com/attachments/656420226556100609/918151996580720660/standard_copy.gif');
                const sentMessage = await channel.send({ embeds: [embedEditedMessage], components: [dropdownSelector], ephemeral: true });
                cox_server.tickets.message = sentMessage.id;
                fs.writeFile('config.json', JSON.stringify(config()), err => {
                    if (err) {
                        console.error(err);
                    } else {
                        dinamicReplyMessage(interaction, `Ticketele sunt acum ${status}!`);
                    }
                });
            } catch (error) {
                console.error(error);
            }
        }

        if (message) {
            try {
                const dropdownSelector = dinamicActionRowBuilder('select-option', 'Cere Ajutor', ['📝 Cere ajutor'])
                const embedEditedMessage = dinamicEmbedMessage(0x0099FF, 'Cox Family Support - Tickets', 'https://discord.gg/cox', 'Apasa pe butonul de mai jos pentru a creea un ticket!', 'https://cdn.discordapp.com/attachments/656420226556100609/918151996580720660/standard_copy.gif');
                dinamicReplyMessage(interaction, `Ticketele sunt acum **${status}**!`);
                await message.edit({ embeds: [embedEditedMessage], components: [dropdownSelector], ephemeral: true });
            } catch (error) {
                console.log(error);
            }
        }
    },
};