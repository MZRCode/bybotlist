const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const db = require("croxydb");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sıfırla")
    .setDescription("Başvuru kanalını sıfırlar")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option => option
        .setName('sıfırla')
        .setDescription('Seçtiğiniz Rolü Sıfırlar')
        .setRequired(true)
        .addChoices(
          { name: 'Tüm Ayarları Sıfırla', value: 'hepsi' },
          { name: 'Bot Rolü', value: 'bot_rol' },
          { name: 'Developer Rolü', value: 'developer_rol' },
          { name: 'Yetkili Rolü', value: 'yetkili_rol' },
          { name: 'BotList Logu', value: 'botlist_log' },
          { name: 'Onay Red Kanalı', value: 'onayed_kanal' },
          { name: 'Bot Ekle Kanalı', value: 'yetkili_rol' },
        )),
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const { guild, options, user } = interaction;

    const sıfırla = options.getString('sıfırla');
    let sıfırlaName;

    if (sıfırla === 'hepsi') {
      sıfırlaName = 'Tüm Ayarlar';
      db.delete(`botRol_${guild.id}`);
      db.delete(`devRol_${guild.id}`);
      db.delete(`adminRol_${guild.id}`);
      db.delete(`log_${guild.id}`);
      db.delete(`onay_${guild.id}`);
      db.delete(`botekle_${guild.id}`);
    } else if (sıfırla === 'bot_rol') {
      sıfırlaName = 'Bot Rolü';
      const botRol = db.get(`botRol_${guild.id}`);
      if (!botRol) {
        return interaction.reply({
          content: "Bot Rolü Kayıtlı Değil!",
          ephemeral: true,
        });
      }
      db.delete(`botRol_${guild.id}`);
    } else if (sıfırla === 'developer_rol') {
      sıfırlaName = 'Developer Rolü';
      const devRol = db.get(`devRol_${guild.id}`);
      if (!devRol) {
        return interaction.reply({
          content: "Developer Rolü Kayıtlı Değil!",
          ephemeral: true,
        });
      }
      db.delete(`devRol_${guild.id}`);
    } else if (sıfırla === 'yetkili_rol') {
      sıfırlaName = 'Yetkili Rolü';
      const adminRol = db.get(`adminRol_${guild.id}`);
      if (!adminRol) {
        return interaction.reply({
          content: "Admin Rolü Kayıtlı Değil!",
          ephemeral: true,
        });
      }
      db.delete(`adminRol_${guild.id}`);
    } else if (sıfırla === 'botlist_log') {
      sıfırlaName = 'BotList Logu';
      const log = db.get(`log_${guild.id}`);
      if (!log) {
        return interaction.reply({
          content: "Log Kanalı Kayıtlı Değil!",
          ephemeral: true,
        });
      }
      db.delete(`log_${guild.id}`);
    } else if (sıfırla === 'onayed_kanal') {
      sıfırlaName = 'Onay Red Kanalı';
      const onayred = db.get(`onay_${guild.id}`);
      if (!onayred) {
        return interaction.reply({
          content: "Log Kanalı Kayıtlı Değil!",
          ephemeral: true,
        });
      }
      db.delete(`onay_${guild.id}`);
    } else if (sıfırla === 'bot_ekle_kanalı') {
      sıfırlaName = 'Bot Ekle Kanalı';
      const botekle = db.get(`botekle_${guild.id}`);
      if (!botekle) {
        return interaction.reply({
          content: "Log Kanalı Kayıtlı Değil!",
          ephemeral: true,
        });
      }
      db.delete(`botekle_${guild.id}`);
    }

    const embed = new EmbedBuilder()
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
      .setTitle("Başarıyla Sıfırlandı <:check:904101655316947024>")
      .setDescription(`**${sıfırlaName}** Başarıyla sıfırlandı!`)
      .setColor("#0bf343")
      .setTimestamp()
      .setFooter({ text:  `Ayarlamak için /botlist-ayarla` });

    interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
