const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show all available commands'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('FSRP Bot Help')
            .setDescription('Here are the available commands:')
            .addFields(
                { name: '/ping', value: 'Check if the bot is online', inline: false },
                { name: '/help', value: 'Show this help message', inline: false },
                { name: '/userinfo', value: 'Get information about a user', inline: false }
            )
            .setTimestamp()
            .setFooter({ text: 'FSRP Bot' });

        await interaction.reply({ embeds: [embed] });
    },
};
