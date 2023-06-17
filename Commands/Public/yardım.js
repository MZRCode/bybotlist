const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("yardım")
    .setDescription("Yardım Menüsünü Gösterir"),
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute(interaction, client){
        const embed = new EmbedBuilder()
        .setTitle("Yardım Menüm")
        .addFields([
            {name: "Yetkili Komutlarım", value: `<:moderator:904316800840380448> **/gönder**\nBot Ekle embedını göndermeye yarar.\n\n<:moderator:904316800840380448> **/ayarla botlist**\nHızlı bir şekilde ayarlama yapmanıza yarar.\n\n<:moderator:904316800840380448> **/ayarla kanal**\nTeker teker kanal ayarlaması yapmanıza yarar.\n\n<:moderator:904316800840380448> **/ayarla rol**\nTeker teker rol ayarlamanıza yarar.\n\n<:moderator:904316800840380448> **/ayarlar**\nAyarları görürmenize yarar.\n\n<:moderator:904316800840380448> **/sıfırla**\nTeker teker veya hepsini sıfırlamanıza yarar.`, inline: false},
            {name: "Kullanıcı Komutlarım", value: `<:member:904102980536643614> **/yardım**\nYardım menüsünü gösterir\n\n<:member:904102980536643614> **/ping**\nBotun pingini gösterir\n\n<:member:904102980536643614> **/invite**\nBotu davet edersiniz ve destek sunucusuna katılabilirsiniz`, inline: true},
        ])
        .setColor("Blurple")
        interaction.reply({embeds: [embed], ephemeral: true});

    }

}
