const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Get information about a user')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to get info about')
                .setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const member = interaction.guild.members.cache.get(user.id);

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('User Information')
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: 'Username', value: user.tag, inline: true },
                { name: 'ID', value: user.id, inline: true },
                { name: 'Account Created', value: user.createdAt.toDateString(), inline: true },
                { name: 'Joined Server', value: member?.joinedAt?.toDateString() || 'Not in server', inline: true },
                { name: 'Roles', value: member?.roles.cache.size ? member.roles.cache.size - 1 + ' roles' : 'None', inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `Requested by ${interaction.user.tag}` });

        await interaction.reply({ embeds: [embed] });
    },
};
