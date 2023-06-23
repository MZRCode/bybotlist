const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ayarla")
    .setDescription("BotList Sistemi Ayarlama")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((options) => options
    .setName("rol")
    .setDescription("BotList Sisteminde Ek Olarak Rol Ayarlama Komutu")
        .addStringOption(option => option
            .setName('ayarla-rol')
            .setDescription('Ayarlanacak Rolü Seçin')
            .setRequired(true)
            .addChoices(
                { name: 'Bot Rolü', value: 'bot_rol' },
                { name: 'Developer Rolü', value: 'developer_rol' },
                { name: 'Yetkili Rolü', value: 'yetkili_rol' },
            ))
        .addRoleOption(option => option
            .setName('rol')
            .setDescription('Ayarlanacak Rol')
            .setRequired(true)
        ))
    .addSubcommand((options) => options
    .setName("kanal")
    .setDescription("BotList Sisteminde Ek Olarak Kanal Ayarlama Komutu")
        .addStringOption(option => option
            .setName('ayarla-kanal')
            .setDescription('Ayarlanacak Rolü Seçin')
            .setRequired(true)
            .addChoices(
                { name: 'BotList Log Kanalı', value: 'botlist_log' },
                { name: 'Onay Red Kanalı', value: 'onayred_kanal' },
                { name: 'Bot Ekle Kanalı', value: 'botekle_kanal' },
            ))
        .addChannelOption(option => option
            .setName('kanal')
            .setDescription('Ayarlanacak Kanal')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        ))
    .addSubcommand((options) => options
    .setName("botlist")
    .setDescription("BotList Sistemini Ayarlarsınız")
        .addRoleOption((options) => options
            .setName("bot-rolü")
            .setDescription("Botlara verilecek rolü ayarlarsınız")
            .setRequired(true)
        )
        .addRoleOption((options) => options
            .setName("developer-rolü")
            .setDescription("Botunu ekleyen kişilere verilecek rolü ayarlarsınız")
            .setRequired(true)
        )
        .addRoleOption((options) => options
            .setName("yetkili-rolü")
            .setDescription("Sunucunuza bot ekleyecek yetkili rolünü ayarlarsınız")
            .setRequired(true)
        )
        .addChannelOption((options) => options
            .setName("botlist-log")
            .setDescription("Botlist log kanalını ayarlarsınız")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
        .addChannelOption((options) => options
            .setName("onay-kanalı")
            .setDescription("Botlist log kanalını ayarlarsınız")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
        .addChannelOption((options) => options
            .setName("botekle-kanalı")
            .setDescription("Botların eklenebileceği kanalı ayarlarsınız")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
    ))
}
