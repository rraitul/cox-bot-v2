const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    StringSelectMenuBuilder
} = require('discord.js');

module.exports = {
    config() {
        let config;

        try {
            config = require('../config.json');
        } catch (error) {
            console.error('Failed to load config.json:', error);
            process.exit(1);
        }

        return config;
    },

    dinamicReplyMessage(interaction, text, ephemeral = true) {
        const textMessage = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Cox Family Support')
            .setDescription(text)

        return interaction.reply({ embeds: [textMessage], ephemeral: ephemeral });
    },

    dinamicSendMessageReaction(reaction, text) {
        const textMessage = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Cox Family Support')
            .setDescription(text)

        return reaction.message.channel.send({ embeds: [textMessage] });
    },

    dinamicSendMessageToChannel(channel, text) {
        const textMessage = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Cox Family Support')
            .setDescription(text)

        return channel.send({ embeds: [textMessage] });
    },

    dinamicEmbedMessage(color, title, url, description, image) {
        const dinamicEmbed = new EmbedBuilder()
            .setColor(color)
            .setTitle(title)
            .setURL(url)
            .setDescription(description)
            .setImage(image);

        return dinamicEmbed;
    },

    dinamicButtonComponent(customId, label, style, emoji, activity) {

        const styleEnum = style === 'danger' ? ButtonStyle.Danger : ButtonStyle.Primary;
        const buttonComponent = new ActionRowBuilder();

        buttonComponent.addComponents(
            new ButtonBuilder()
                .setCustomId(customId)
                .setLabel(label)
                .setStyle(styleEnum)
                .setEmoji(emoji)
                .setDisabled(activity));

        return buttonComponent;
    },

    dinamicModalBuilder(customId, title) {
        const modalBuilder = new ModalBuilder()
            .setCustomId(customId)
            .setTitle(title);

        return modalBuilder;
    },

    dinamicTextInput(customId, label, placeholder, style, maxLenght) {
        if (style === "short") {
            style = TextInputStyle.Short;
        }

        if (style === 'paragraph') {
            style = TextInputStyle.Paragraph;
        }

        const input = new TextInputBuilder()
            .setCustomId(customId)
            .setLabel(label)
            .setPlaceholder(placeholder)
            .setStyle(style)
            .setMaxLength(maxLenght);

        return input;
    },

    dinamicEmbedBuilder(author, description, iconURL, thumbnail, options) {
        const embedBuilder = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Cox Family Support - Tickets')
            .setURL('https://discord.gg/cox')
            .setAuthor({ name: author, iconURL: 'https://cdn.discordapp.com/avatars/588871675605549104/d1a3d62e7e3a86429166e74de86665cb.png?size=4096', url: 'https://discord.gg/cox' })
            .setDescription(description)
            .setThumbnail(thumbnail)
            .addFields(
                options
            )
            .setImage(iconURL)
            .setTimestamp()
            .setFooter({ text: `System created by Raraitu' ᶜᵒˣ#7777`, iconURL: 'https://cdn.discordapp.com/avatars/588871675605549104/d1a3d62e7e3a86429166e74de86665cb.png?size=4096' });

        return embedBuilder;
    },

    dinamicActionRowBuilder(customId, placeholder, options) {
        const selectMenuOptions = [];

        for (let i = 0; i < options.length; i++) {
            selectMenuOptions.push({
                label: options[i],
                value: options[i],
            });
        }

        if (customId != 'select-option') {
            selectMenuOptions.push({
                label: "📛 Anuleaza",
                value: "anuleaza",
            });
        }

        const actionRowBuilder = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(customId)
                .setPlaceholder(placeholder)
                .addOptions([
                    ...selectMenuOptions,
                ])
        );

        return actionRowBuilder;
    },

    dinamicEmbedReactionMessageReply(interaction, description, react_1, react_2) {
        const embedReactionmessage = {
            title: 'Ticket-Cox',
            description: description,
            timestamp: new Date()
        };

        const messageWithReactions = interaction.reply({ embeds: [embedReactionmessage], fetchReply: true }).then(embedReactionmessage => {
            embedReactionmessage.react(react_1);
            react_2 ? embedReactionmessage.react(react_2) : null;
        });

        return messageWithReactions;
    },

    dinamicEmbedReactionMessageSend(channel, description, react_1, react_2) {
        const embedReactionmessage = {
            title: 'Ticket-Cox',
            description: description,
            timestamp: new Date()
        };

        const messageWithReactions = channel.send({ embeds: [embedReactionmessage], fetchReply: true }).then(embedReactionmessage => {
            embedReactionmessage.react(react_1);
            react_2 ? embedReactionmessage.react(react_2) : null;
        });

        return messageWithReactions;
    },

    dinamicAddRole(client, guildId, roleId, userId) {
        const guild = client.guilds.cache.get(guildId)
        const role = guild.roles.cache.get(roleId);
        guild.members.fetch(userId).then(user => user.roles.add(role));
    },

    dinamicRemoveRole(client, guildId, roleId, userId) {
        const guild = client.guilds.cache.get(guildId);
        const role = guild.roles.cache.get(roleId);
        guild.members.fetch(userId).then(user => user.roles.remove(role));
    },
};
