const { dinamicModalBuilder, dinamicTextInput } = require('../../utility/utility');
const { actions } = require('../../events/tickets/select.json')
const { Events, ActionRowBuilder } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    classic: async (interaction) => {
        const modal = dinamicModalBuilder('modal-tickets', 'Cox Family Support - Tickets');
        const inputSubject = dinamicTextInput('subject-input', 'Subiect', 'Ex: Toxic User / Excessive Soundpad', 'short', 20);
        const inputDescribeSubject = dinamicTextInput('describe-input', 'Descrie problema', 'A venit si a inceput sa ne unjure', 'paragraph', 200);

        const subject = new ActionRowBuilder().addComponents(inputSubject);
        const describe = new ActionRowBuilder().addComponents(inputDescribeSubject);

        modal.addComponents(subject, describe);
        await interaction.showModal(modal);
    },
    custom: async (interaction) => {
        const modal = dinamicModalBuilder('modal-tickets', 'Cox Family Support - Tickets');
        const inputRole = dinamicTextInput('role-input', 'Grad', 'Ex: Zeul Coxului', 'short', 20);
        const inputColor = dinamicTextInput('color-input', 'Culoarea', 'Sa fie hexacolor cod. Ex: #FF0000', 'short', 20);

        const grad = new ActionRowBuilder().addComponents(inputRole);
        const color = new ActionRowBuilder().addComponents(inputColor);

        modal.addComponents(grad, color);
        await interaction.showModal(modal);
    },
    async execute(interaction, selectedOption) {
        if (!Object.keys(actions).includes(selectedOption)) return;
        if (selectedOption === "🎟️ Deschide ticket") return await this.classic(interaction).catch(console.error);
        if (selectedOption === "💸 Doresc sa cumpar Grad Custom") return await this.custom(interaction).catch(console.error);
    }
};