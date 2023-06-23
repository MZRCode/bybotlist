const { ChatInputCommandInteraction, SlashCommandBuilder, Client, PermissionFlagsBits, ChannelType, EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const db = require('croxydb');

module.exports = {
  subCommand: "ayarla.botlist",
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, guild, user } = interaction;

        const row1 = new ActionRowBuilder()

            .addComponents(
                new ButtonBuilder()
                    .setEmoji("⚙️")
                    .setLabel("Ayarlar")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("ayarlar")
            )

            .addComponents(
                new ButtonBuilder()
                    .setEmoji("🗑️")
                    .setLabel("Sistemi Sıfırla")
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId("kapat")
            )

        const basarili = new EmbedBuilder()
            .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
            .setTitle("Başarıyla Ayarlandı <:check:904101655316947024>")
            .setDescription("BotList sistemi başarıyla ayarlandı!")
            .setColor("00ff3e")
            .setTimestamp()
            .setFooter({ text: user.username, iconURL: user.displayAvatarURL() })
        interaction.reply({ embeds: [basarili], components: [row1], ephemeral: true })

        const botRol = options.getRole('bot-rolü')
        const devRol = options.getRole('developer-rolü')
        const adminRol = options.getRole('yetkili-rolü')
        const log = options.getChannel('botlist-log')
        const onay = options.getChannel('onay-kanalı')
        const botekle = options.getChannel('botekle-kanalı')

        db.set(`botRol_${guild.id}`, botRol.id)
        db.set(`devRol_${guild.id}`, devRol.id)
        db.set(`adminRol_${guild.id}`, adminRol.id)
        db.set(`log_${guild.id}`, log.id)
        db.set(`onay_${guild.id}`, onay.id)
        db.set(`botekle_${guild.id}`, botekle.id)
    }
}
