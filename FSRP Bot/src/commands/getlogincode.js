const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { v4: uuidv4 } = require('uuid');
const { loginCodes } = require('../../utils/auth');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('getlogincode')
        .setDescription('Generate a one-time login code for the FSRP website'),
    
    async execute(interaction) {
        try {
            // Generate a 6-digit code
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            const userId = interaction.user.id;
            
            // Store the code with user ID and expiration (30 minutes from now)
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 30);
            
            loginCodes.set(code, {
                userId,
                expiresAt,
                used: false
            });
            
            // Create an embed with the login code
            const embed = new EmbedBuilder()
                .setColor('#4f46e5')
                .setTitle('Your FSRP Login Code')
                .setDescription(`Use this code to log in to the FSRP website. It will expire in 30 minutes.`)
                .addFields(
                    { name: 'Code', value: `\`\`\`\n${code}\n\`\`\``, inline: false },
                    { name: 'Expires', value: `<t:${Math.floor(expiresAt.getTime() / 1000)}:R>`, inline: false }
                )
                .setFooter({ text: 'Do not share this code with anyone.' })
                .setTimestamp();
            
            // Send the code via DM
            try {
                await interaction.user.send({ embeds: [embed] });
                
                // Send a confirmation message in the channel
                const replyEmbed = new EmbedBuilder()
                    .setColor('#10b981')
                    .setDescription('✅ Check your DMs for your login code!')
                    .setFooter({ text: 'Didn\'t receive a DM? Make sure your DMs are open for this server.' });
                
                await interaction.reply({ embeds: [replyEmbed], ephemeral: true });
            } catch (error) {
                console.error('Failed to send DM:', error);
                await interaction.reply({ 
                    content: '❌ I couldn\'t send you a DM. Please make sure your DMs are open and try again.',
                    ephemeral: true 
                });
            }
        } catch (error) {
            console.error('Error in getlogincode command:', error);
            await interaction.reply({ 
                content: '❌ An error occurred while generating your login code. Please try again later.',
                ephemeral: true 
            });
        }
    }
};
