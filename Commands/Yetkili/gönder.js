const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const db = require("croxydb");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gönder")
    .setDescription("Bot Ekle Embedını Gönderir")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
        const { guild } = interaction;

        let botekle = db.get(`botekle_${guild.id}`)

        const menu = new EmbedBuilder()
            .setColor("Blurple")
            .setTitle("Botumu Nasıl Eklerim?")
            .setDescription("Aşağıdaki **Bot Ekle** butonuna basarak bastıktan sonra ordaki istenenleri doldurup Gönder'e tıkla ve yetkilileri bekle!")

        let row1 = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('bot-ekle')
                    .setLabel('Bot Ekle')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🤖'))
        
            interaction.reply({ content: `Başarıyla <#${botekle}> kanalına gönderildi!`, ephemeral: true });
            client.channels.cache.get(botekle).send({ embeds: [menu], components: [row1] }).catch(() => { })
    },
};
