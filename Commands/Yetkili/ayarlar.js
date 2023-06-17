const { ChatInputCommandInteraction, SlashCommandBuilder, Client, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const db = require('croxydb');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ayarlar")
    .setDescription("Ayarlarını Gösterir")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */

    async execute(interaction, client) {

        const guildID = interaction.guild.id;

        let log = db.get(`log_${guildID}`)
        let onayRed = db.get(`onay_${guildID}`)
        let botEkle = db.get(`botekle_${guildID}`)
        let botRolu = db.get(`botRol_${guildID}`)
        let devRol = db.get(`devRol_${guildID}`)
        let adminRol = db.get(`adminRol_${guildID}`)
      
        const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() || "https://cdn.discordapp.com/emojis/1119027206908284948.gif" })
            .setTitle("Sunucu Ayarları <:settings:904101655535034448>")
            .setColor("#5865F2")
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        const logKanal = interaction.guild.channels.cache.get(log);
        if (logKanal) {
            embed.addFields([
                {name: "<:book:904101654834606102> Log Kanalı", value: logKanal.toString(), inline: true}
            ]);
        } else {
            embed.addFields([
                {name: "<:book:904101654834606102> Log Kanalı", value: `Ayarlı Değil <:cross:904102980553437184>`, inline: true}
            ]);
        }

        const onayredKanal = interaction.guild.channels.cache.get(onayRed);
        if (onayredKanal) {
            embed.addFields([
                {name: "<:verified:910523666620645378> Onay & Red Kanalı", value: onayredKanal.toString(), inline: true}
            ]);
        } else {
            embed.addFields([
                {name: "<:verified:910523666620645378> Onay & Red Kanalı", value: `Ayarlı Değil <:cross:904102980553437184>`, inline: true}
            ]);
        }

        const botekleKanal = interaction.guild.channels.cache.get(botEkle);
        if (botekleKanal) {
            embed.addFields([
                {name: "<:link:904101655455358976> Bot Ekle Kanalı", value: botekleKanal.toString(), inline: true}
            ]);
        } else {
            embed.addFields([
                {name: "<:link:904101655455358976> Bot Ekle Kanalı", value: `Ayarlı Değil <:cross:904102980553437184>`, inline: true}
            ]);
        }

        const botRol = interaction.guild.roles.cache.get(botRolu);
        if (botRol) {
            embed.addFields([
                {name: "<:BOTS:1099791011657547876> Bot Rolü", value: botRol.toString(), inline: true}
            ]);
        } else {
            embed.addFields([
                {name: "<:BOTS:1099791011657547876> Bot Rolü", value: `Ayarlı Değil <:cross:904102980553437184>`, inline: true}
            ]);
        }

        const developerRol = interaction.guild.roles.cache.get(devRol);
        if (developerRol) {
            embed.addFields([
                {name: "<:Developer:899715020873678888> Developer Rolü", value: developerRol.toString(), inline: true}
            ]);
        } else {
            embed.addFields([
                {name: "<:Developer:899715020873678888> Developer Rolü", value: `Ayarlı Değil <:cross:904102980553437184>`, inline: true}
            ]);
        }
        
        const yetkiliRol = interaction.guild.roles.cache.get(adminRol);
        if (yetkiliRol) {
            embed.addFields([
                {name: "<:moderator:904316800840380448> Yetkili Rolü", value: yetkiliRol.toString(), inline: true}
            ]);
        } else {
            embed.addFields([
                {name: "<:moderator:904316800840380448> Yetkili Rolü", value: `Ayarlı Değil <:cross:904102980553437184>`, inline: true}
            ]);
        }

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};