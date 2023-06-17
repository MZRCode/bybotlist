const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const db = require("croxydb");

module.exports = {
    subCommand: "ayarla.rol",
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const { guild, options, user } = interaction;

    const rolSec = options.getString('ayarla-rol');
    let rolName;
    const rol = options.getRole('rol');

    if (rolSec === 'bot_rol') {
      rolName = 'Bot Rolü';
      const botRol = db.get(`botRol_${guild.id}`);
      if (botRol) {
        return interaction.reply({
          content: "Bot Rolü Zaten Kayıtlı!",
          ephemeral: true,
        });
      }
      db.set(`botRol_${guild.id}`, rol.id);
    } else if (rolSec === 'developer_rol') {
        rolName = 'Developer Rolü';
        const devRol = db.get(`devRol_${guild.id}`);
        if (devRol) {
          return interaction.reply({
            content: "Developer Rolü Zaten Kayıtlı!",
            ephemeral: true,
          });
        }
        db.set(`devRol_${guild.id}`, rol.id);
    } else if (rolSec === 'yetkili_rol') {
        rolName = 'Yetkili Rolü';
        const adminRol = db.get(`adminRol_${guild.id}`);
        if (adminRol) {
          return interaction.reply({
            content: "Yetkili Rolü Zaten Kayıtlı!",
            ephemeral: true,
          });
        }
        db.set(`adminRol_${guild.id}`, rol.id);
    }

    const embed = new EmbedBuilder()
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
      .setTitle("Başarıyla Ayarlandı <:check:904101655316947024>")
      .setDescription(`**${rolName}** olarak ${rol} rolü ayarlandı!`)
      .setColor("#0bf343")
      .setTimestamp()
      .setFooter({ text: `Sıfırlamak için /sıfırla` });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
