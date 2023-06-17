const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const db = require("croxydb");

module.exports = {
    subCommand: "ayarla.kanal",
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const { guild, options, user } = interaction;

    const kanalSec = options.getString('ayarla-kanal');
    let kanalName;
    const kanal = options.getChannel('kanal');

    if (kanalSec === 'botlist_log') {
      kanalName = 'BotList Log Kanalı';
      const botlistLog = db.get(`log_${guild.id}`);
      if (botlistLog) {
        return interaction.reply({
          content: "BotList Log Kanalı Zaten Kayıtlı!",
          ephemeral: true,
        });
      }
      db.set(`log_${guild.id}`, kanal.id);
    } else if (kanalSec === 'onayred_kanal') {
        kanalName = 'Onay Red Kanalı';
        const onayredKanal = db.get(`onay_${guild.id}`);
        if (onayredKanal) {
          return interaction.reply({
            content: "Onay Red Kanalı Zaten Kayıtlı!",
            ephemeral: true,
          });
        }
        db.set(`onay_${guild.id}`, kanal.id);
    } else if (kanalSec === 'botekle_kanal') {
        kanalName = 'Bot Ekle Kanalı';
        const botekleKanal = db.get(`botekle_${guild.id}`);
        if (botekleKanal) {
          return interaction.reply({
            content: "Bot Ekle Kanalı Zaten Kayıtlı!",
            ephemeral: true,
          });
        }
        db.set(`botekle_${guild.id}`, kanal.id);
    }

    const embed = new EmbedBuilder()
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
      .setTitle("Başarıyla Ayarlandı <:check:904101655316947024>")
      .setDescription(`**${kanalName}** olarak ${kanal} kanalı ayarlandı!`)
      .setColor("#0bf343")
      .setTimestamp()
      .setFooter({ text: `Sıfırlamak için /sıfırla` });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
