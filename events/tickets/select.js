const { dinamicActionRowBuilder, dinamicReplyMessage } = require('../../utility/utility');
const { returnUserModlogs } = require('../../utility/actions');
const { Events } = require('discord.js');
const select = require('./select.json');
const modal = require("./modal");

module.exports = {
    name: Events.InteractionCreate,
    mainSelector: dinamicActionRowBuilder('select-option', 'Alege Problema', Object.keys(select.menu["📝 Cere ajutor"])),
    findOption: (option, menu) => {
        if (menu.hasOwnProperty(option)) {
            return { steps: menu[option] };
        }

        for (let key in menu) {
            if (menu.hasOwnProperty(key)) {
                let subMenu = menu[key];
                if (typeof subMenu === "object") {
                    let result = module.exports.findOption(option, subMenu);
                    if (result.steps !== null) {
                        return { steps: [key].concat(result.steps) };
                    }
                }
            }
        }

        return { steps: null };
    },
    updateMenu: async (interaction, option, steps) => {
        let text = Object.keys(select.messages).includes(option) ? select.messages[option] : `Ai selectat **${option}**`;

        if (option == "📝 Cere ajutor") {
            const optionsList = Object.keys(steps);
            await interaction.update({ components: [dinamicActionRowBuilder('select-option', 'Cere Ajutor', ['📝 Cere ajutor'])] }).catch(console.error);
            await interaction.followUp({ content: text, components: [dinamicActionRowBuilder(`${option}-option`, `${option}`, optionsList)], ephemeral: true }).catch(console.error);
            return;
        }

        if (Object.keys(select.actions).includes(option) && select.actions[option]) return eval(select.actions[option]);

        const subMenu = select.subMenu[option];
        
        if (subMenu) await interaction.update({ content: text, components: [dinamicActionRowBuilder(`${option}-option`, `${option}`, subMenu)], ephemeral: true }).catch(console.error);

        const message = dinamicActionRowBuilder(`${option}-option`, `${option}`, steps);
        await interaction.update({ content: text, components: [message], ephemeral: true }).catch(console.error);
    },
    async execute(interaction) {
        if (!interaction.isStringSelectMenu()) return;

        const option = interaction.values[0];
        let { steps } = module.exports.findOption(option, select.menu);
        if (steps == null) steps = [];

        if (steps && option != '📝 Cere ajutor') steps.shift();
        if (option == "anuleaza") return interaction.update({ content: "Ai anulat **actiunea**.", components: [this.mainSelector], ephemeral: true }).catch(console.error);

        module.exports.updateMenu(interaction, option, steps).catch(console.error);
    },
};