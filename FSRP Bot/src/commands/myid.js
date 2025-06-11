const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('myid')
        .setDescription('Get your Discord user ID with an easy copy option'),
    
    async execute(interaction) {
        const userId = interaction.user.id;
        
        // Create a select menu with copy option
        const select = new StringSelectMenuBuilder()
            .setCustomId('user_id_actions')
            .setPlaceholder('Select an action')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Copy User ID')
                    .setValue('copy_id')
                    .setEmoji('📋'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Show Full User Tag')
                    .setValue('show_tag')
                    .setEmoji('👤')
            );
            
        const row = new ActionRowBuilder().addComponents(select);
        
        // Send the user their ID with actions (visible to everyone)
        const message = await interaction.reply({
            content: `👤 **Your Discord ID**\n\`${userId}\`\n*Select an action below*`,
            components: [row],
            ephemeral: false // Visible to everyone
        });
        
        // Set up a collector to handle the select menu
        const filter = i => i.customId === 'user_id_actions' && i.user.id === interaction.user.id;
        const collector = message.createMessageComponentCollector({ filter, time: 60000 });
        
        collector.on('collect', async i => {
            if (i.values[0] === 'copy_id') {
                // Send a message with the ID that can be easily copied
                await i.reply({
                    content: `✅ Here's your ID to copy:\n\`\`\`\n${userId}\n\`\`\`\n*You can now copy this from the message above*`,
                    ephemeral: true
                });
            } else if (i.values[0] === 'show_tag') {
                await i.reply({
                    content: `👤 Your full Discord tag is:\n\`${interaction.user.tag}\`\nUser ID: \`${userId}\``,
                    ephemeral: true
                });
            }
        });
        
        collector.on('end', () => {
            // Disable the select menu after the collector ends
            select.setDisabled(true);
            message.edit({ components: [row] }).catch(console.error);
        });
    },
};
