const { Client, GatewayIntentBits, Partials, Collection, PermissionFlagsBits, codeBlock, EmbedBuilder, ChannelType, ActionRowBuilder, InteractionType, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputStyle, TextInputBuilder, SelectMenuBuilder } = require("discord.js");
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;
const config = require('./config.json');
const db = require('croxydb');

const client = new Client({ 
    intents: [Guilds, GuildMembers, GuildMessages],
    partials: [User, Message, GuildMember, ThreadMember]
});

client.config = require("./config.json");
client.commands = new Collection();
client.subCommands = new Collection();
client.events = new Collection();
client.guildConfigs = new Collection();

const { loadEvents } = require("./Handlers/eventHandler");
loadEvents(client);

const Modal = new ModalBuilder()
    .setCustomId('form')
    .setTitle('Botlist Başvuru Formu')
const a1 = new TextInputBuilder()
    .setCustomId('id')
    .setLabel('Bot ID Yazınız')
    .setStyle(TextInputStyle.Paragraph)
    .setMinLength(15)
    .setMaxLength(25)
    .setPlaceholder('Botunun ID (Kimliği) nedir?')
    .setRequired(true)
const a2 = new TextInputBuilder()
    .setCustomId('prefix')
    .setLabel('Bot Prefixini Yazınız')
    .setStyle(TextInputStyle.Paragraph)
    .setMinLength(1)
    .setMaxLength(4)
    .setPlaceholder('Botunun Prefixi (Ön Ek) nedir?')
    .setRequired(true)

const row = new ActionRowBuilder().addComponents(a1);
const row3 = new ActionRowBuilder().addComponents(a2);
Modal.addComponents(row, row3);


client.on('interactionCreate', async (interaction) => {


    if (interaction.commandName === "bot-ekle") {

        const zatenEklenmis = new EmbedBuilder()
            .setTitle("Başarısız!")
            .setDescription("Zaten eklenmiş olan bir botun var!")
            .setColor("Red")
        let varmi = db.get(`ekledi_${interaction.user.id}`)
        if (varmi) return interaction.reply({ embeds: [zatenEklenmis], ephemeral: true })
    }
})

client.on('interactionCreate', async interaction => {
    if (interaction.type !== InteractionType.ModalSubmit) return;
    if (interaction.customId === 'form') {
        const { guild, member, user } = interaction;

        let onay = db.get(`onay_${guild.id}`);
        let logg = db.get(`log_${guild.id}`);
        let botRol = db.get(`botRol_${guild.id}`);
        let devRol = db.get(`devRol_${guild.id}`);
        let botekle = db.get(`botekle_${guild.id}`);
        let adminRol = db.get(`adminRol_${guild.id}`);

        if (!onay || !logg || !botRol || !devRol || !adminRol || !botekle) {
            return interaction.reply({ content: "Botlist sistemi ayarlanmamış!", ephemeral: true });
        }

        const id = interaction.fields.getTextInputValue("id");
        const prefix = interaction.fields.getTextInputValue('prefix');
        const sahip = `<@${user.id}>`;

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Botu Ekle")
                    .setStyle(ButtonStyle.Link)
                    .setURL("https://discord.com/oauth2/authorize?client_id=" + id + "&scope=bot&permissions=0"),
                new ButtonBuilder()
                    .setLabel("Botu Onayla")
                    .setStyle(ButtonStyle.Success)
                    .setCustomId("onayla"),
                new ButtonBuilder()
                    .setLabel("Botu Reddet")
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId("reddet")
            );
            
        adminRol = db.get(`adminRol_${guild.id}`);
        let a = await client.users.fetch(id);
        let avatar = a.avatar;
        let link = "https://cdn.discordapp.com/avatars/" + id + "/" + avatar + ".png?size=1024";

        const botUser = client.users.cache.get(id);

        const author = {
          name: `${botUser.username} | Reddedildi`,
          iconURL: botUser.displayAvatarURL({ format: "png", size: 1024 })
        };

const embed = new EmbedBuilder()
    .setAuthor(author)
    .setDescription("**• Tüyo:** Onaylamak, reddetmek veya botu eklemek için aşağıdaki butonları kullan.")
    .addFields({ name: '• Bot İsmi', value: `${botUser.username}`, inline: true })
    .addFields({ name: '• Bot Etiketi', value: `${botUser}`, inline: true })
    .addFields({ name: '• Bot Kimliği', value: `${id}`, inline: true })
    .addFields({ name: 'Bot Prefixi', value: `${codeBlock("yaml", `${prefix}`)}`, inline: false })
    .addFields({ name: 'Bot Sahibi', value: `${codeBlock("yaml", `${user.username}`)}`, inline: false })
    .setColor("Yellow")
        const logKanalID = await db.get(`onay_${guild.id}`);
        const log = client.channels.cache.get(logKanalID);

        log.send({ content: "<@&" + adminRol + ">", embeds: [embed], components: [row] }).then((mesaj) => {
            interaction.reply({ content: `<a:Tik:900089759911776266> **|** ${sahip} **${botUser.username}** isimli bot başarıyla sisteme eklendi. *[Yetkililerden geri dönüş gelene kadar bekleyin!]*`, ephemeral: true });
            db.set(`bot_${mesaj.id}`, { user: user.id, bot: id });
            db.set(`ekledi_${user.id}`, id);
        });
    }
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "reddet") {

        const { guild, member } = interaction;

        let message = await interaction.channel.messages.fetch(interaction.message.id)
        const logKanalID = await db.get(`log_${guild.id}`)
        const log = client.channels.cache.get(logKanalID)
        var data = db.fetch(`bot_${interaction.message.id}`)
        var uye = data.user
        var bot = data.bot

        let admin = db.get(`adminRol_${guild.id}`)

        if (!interaction.member.roles.cache.has(admin)) return interaction.reply({ content: "Bu işlemi gerçekleştirmek için <@&" + admin + "> rolüne sahip olmalısın!", ephemeral: true })

        let a = await client.users.fetch(bot);
        let avatar = a.avatar

        const botUser = client.users.cache.get(data.bot);
        const author = {
          name: `${botUser.username} | Reddedildi`,
          iconURL: botUser.displayAvatarURL({ format: "png", size: 1024 })
        };

        const yetkili = member.user;

        const embed = new EmbedBuilder()
            .setAuthor(author)
            .addFields({ name: '• Bot İsmi', value: `${botUser.username}`, inline: true })
            .addFields({ name: '• Bot Kimliği', value: `${botUser.id}`, inline: true })
            .addFields({ name: '• Botu Reddeden Yetkili', value: `${yetkili} \`[${yetkili.username}]\``, inline: true })
            .setColor("Red")

        log.send({ content: "<@" + uye + ">", embeds: [embed] })
        message.delete()
    }

    if (interaction.customId === "onayla") {
        const { guild, member } = interaction;
        let admin = db.get(`adminRol_${interaction.guild.id}`);
        if (!interaction.member.roles.cache.has(admin)) {
          return interaction.reply({ content: "Bu işlemi gerçekleştirmek için <@&" + admin + "> rolüne sahip olmalısın!", ephemeral: true });
        }
      
        let message = await interaction.channel.messages.fetch(interaction.message.id);
        const logKanalID = await db.fetch(`log_${interaction.guild.id}`);
        const log = client.channels.cache.get(logKanalID);
        let dev = db.get(`devRol_${guild.id}`);
        let botrol = db.get(`botRol_${guild.id}`);
        var data = db.fetch(`bot_${interaction.message.id}`);
        var uye = data.user;
        var bot = data.bot;
        let a = await client.users.fetch(bot);
        let avatar = a.avatar;
        let link = "https://cdn.discordapp.com/avatars/" + bot + "/" + avatar + ".png?size=1024";
      
        let eklendimi = interaction.guild.members.cache.get(bot);
        const hata = new EmbedBuilder()
          .setTitle("Başarısız!")
          .setDescription("Önce botu sunucuya eklemelisin!")
          .setColor("Red");
        if (!eklendimi) {
          return interaction.reply({ embeds: [hata], ephemeral: true });
        }
      
        const botUser = client.users.cache.get(data.bot);
        const author = {
          name: `${botUser.username} | Onaylandı`,
          iconURL: botUser.displayAvatarURL({ format: "png", size: 1024 })
        };

        const yetkili = member.user;
        
        const embed = new EmbedBuilder()
          .setAuthor(author)
          .addFields({ name: '• Bot İsmi', value: `${botUser.username}`, inline: true })
          .addFields({ name: '• Bot Kimliği', value: `${botUser.id}`, inline: true })
          .addFields({ name: '• Botu Onaylayan Yetkili', value: `${yetkili} \`[${yetkili.username}]\``, inline: true })
          .setColor("Green");
      
        log.send({ content: "<@" + uye + ">", embeds: [embed] });
        interaction.guild.members.cache.get(uye).roles.add(dev).catch(err => {});
        interaction.guild.members.cache.get(bot).roles.add(botrol).catch(err => {});
        message.delete();
      }
})

client.on('interactionCreate', async (interaction) => {
    if (interaction.customId === "bot-ekle") {
        await interaction.showModal(Modal);
    }
})

// Sistemi Sıfırla - Button
client.on('interactionCreate', async interaction => {
    
    if (!interaction.isButton()) return;

    if (interaction.customId === "kapat") {
        const { member, guild } = interaction;

        const yetkii = new EmbedBuilder()
            .setTitle("Yetersiz Yetki <:cross:904102980553437184>")
            .setDescription("Bu komutu kullanabilmek için **Yönetici** yetkisine ihtiyacın var!")
            .setColor("Red")

        const embed1 = new EmbedBuilder()
            .setTitle("Başarıyla Sıfırlandı <:check:904101655316947024>")
            .setDescription("BotList sistemi başarıyla **sıfırlandı**!")
            .setColor("Green")

            if (!member.permissions.has(PermissionFlagsBits.ManageChannels)) return interaction.reply({ embeds: [yetkii], ephemeral: true })

        db.delete(`log_${guild.id}`)
        db.delete(`botRol_${guild.id}`)
        db.delete(`devRol_${guild.id}`)
        db.delete(`adminRol_${guild.id}`)
        db.delete(`onay_${guild.id}`)
        db.delete(`botekle_${guild.id}`)
        return interaction.reply({ embeds: [embed1], ephemeral: true }).catch(() => { })
    }
})

// Banı Kaldır Button
const unban = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setEmoji("<a:guard:1081678541457993728>")
            .setLabel("Banı Kaldır")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("unban")
    )


client.on('guildMemberRemove', async member => {

    const logKanalID = await db.get(`log_${member.guild.id}`)
    const log = client.channels.cache.get(logKanalID)

    var data = db.fetch(`ekledi_${member.id}`)
    if (!data) return;

    let Data = data

    const BanEmbed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Banlandı!")
        .setDescription(`<a:danger:1091095742711599144> **|** \`${member.user.username}\` isimli kullanıcı sunucudan çıktığı için **botu** sunucudan banlandı!`)

    member.guild.members.ban(Data).catch(() => { })
    log.send({ embeds: [BanEmbed], components: [unban] }).then(mesaj => {
        db.set(`user_${mesaj.id}`, member.id)
    })
})

// Banı Kaldır Button 
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "unban") {
        const { member, guild } = interaction;

        let message = await interaction.channel.messages.fetch(interaction.message.id)
        var user = db.fetch(`user_${interaction.message.id}`)
        var data = db.fetch(`ekledi_${user}`)


        const logKanalID = await db.get(`log_${guild.id}`)
        const log = client.channels.cache.get(logKanalID)

        let Data = data

        const yetkiii = new EmbedBuilder()
            .setTitle("Yetersiz Yetki <:cross:904102980553437184>")
            .setDescription("Bu komutu kullanabilmek için **Yönetici** yetkisine ihtiyacın var!")
            .setColor("Red")

        const embed1 = new EmbedBuilder()
            .setTitle("Başarıyla Kaldırıldı <:check:904101655316947024>")
            .setDescription(`<@${Data}> Botunun banı başarıyla **kaldırıldı**!`)
            .setColor("Green")

        if (!member.permissions.has(PermissionFlagsBits.ManageChannels)) return interaction.reply({ embeds: [yetkiii], ephemeral: true });

        if (!Data) return interaction.reply({ content: "Bu botun banı zaten kaldırılmış!", ephemeral: true })

        interaction.guild.members.unban(Data).catch(() => { })
        message.delete()
        return log.send({ embeds: [embed1], ephemeral: true }).catch(() => { })
    }
})

// Ayarlar Button 
client.on('interactionCreate', async interaction => {
    const { member } = interaction;

    if (!interaction.isButton()) return;

    if (interaction.customId === "ayarlar") {
        const { guild } = interaction;

        let log = db.get(`log_${guild.id}`)
        let onayKanal = db.get(`onay_${guild.id}`)
        let botEkle = db.get(`botekle_${guild.id}`)
        let botRol = db.get(`botRol_${guild.id}`)
        let devRol = db.get(`devRol_${guild.id}`)
        let adminRol = db.get(`adminRol_${guild.id}`)

        const mesaj = new EmbedBuilder()
            .setTitle("BotList Ayarları")
            .addFields(
                { name: "<:book:904101654834606102> **Log Kanalı**", value: `<#${log || "Ayarlanmamış!"}>`, inline: true },
                { name: "<:verified:910523666620645378> **Onay & Red Kanalı**", value: `<#${onayKanal || "Ayarlanmamış!"}>`, inline: true },
                { name: "<:link:904101655455358976> **Bot Ekle Kanalı**", value: `<#${botEkle || "Ayarlanmamış!"}>`, inline: true },
                { name: "<:BOTS:1099791011657547876> **Bot Rolü**", value: `<@&${botRol || "Ayarlanmamış!"}>`, inline: true },
                { name: "<:Developer:899715020873678888> **Developer Rolü**", value: `<@&${devRol || "Ayarlanmamış!"}>`, inline: true },
                { name: "<:moderator:904316800840380448> **Yetkili Rolü**", value: `<@&${adminRol || "Ayarlanmamış!"}>`, inline: true }
            )
            .setColor("Blurple")

        const yetki = new EmbedBuilder()
            .setTitle("Yetersiz Yetki <:cross:904102980553437184>")
            .setDescription("Bu komutu kullanabilmek için **Yönetici** yetkisine ihtiyacın var!")
            .setColor("Red")
            if (!member.permissions.has(PermissionFlagsBits.ManageChannels)) return interaction.reply({ embeds: [yetki], ephemeral: true });

        interaction.reply({ embeds: [mesaj], ephemeral: true }).catch(() => { })
    }
})

client.login(client.config.token)
