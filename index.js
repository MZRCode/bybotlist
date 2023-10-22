const { Client, GatewayIntentBits, Partials, Collection, PermissionFlagsBits, codeBlock, EmbedBuilder, ChannelType, ActionRowBuilder, InteractionType, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputStyle, TextInputBuilder, SelectMenuBuilder } = require("discord.js");
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;
const db = require('croxydb');
const { token } = require("./config.json");

const client = new Client({ 
    intents: [Guilds, GuildMembers, GuildMessages],
    partials: [User, Message, GuildMember, ThreadMember]
});

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
        const { guild, user } = interaction;

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

const embed = new EmbedBuilder()
    .setTitle(`Başvuru Gönderildi!`)
    .setDescription("**Bilgilendirme:** Onaylamak, reddetmek veya botu eklemek için aşağıdaki butonları kullan.")
    .addFields({ name: 'Bot İsmi', value: `<@${id}>`, inline: true })
    .addFields({ name: 'Bot Kimliği', value: `${id}`, inline: true })
    .addFields({ name: 'Bot Prefixi', value: `${codeBlock("yaml", `${prefix}`)}`, inline: false })
    .addFields({ name: 'Bot Sahibi', value: `${codeBlock("yaml", `${user.username}`)}`, inline: false })
    .setColor("Blurple")
        const logKanalID = await db.get(`onay_${guild.id}`);
        const log = client.channels.cache.get(logKanalID);

        log.send({ content: "<@&" + adminRol + ">", embeds: [embed], components: [row] }).then((mesaj) => {
            interaction.reply({ content: `<a:Tik:900089759911776266> **|** ${sahip}, <@${id}> isimli bot başarıyla sisteme eklendi. *[Yetkililerden geri dönüş gelene kadar bekleyin!]*`, ephemeral: true });
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

    if (!member.roles.cache.has(admin)) return interaction.reply({ content: "Bu işlemi gerçekleştirmek için <@&" + admin + "> rolüne sahip olmalısın!", ephemeral: true })

	let a = await client.users.fetch(bot);
    const author = { name: `${a.username} | Reddedildi`, iconURL: a.displayAvatarURL({ format: "png", size: 1024 }) };

    const yetkili = member.user;

    const embed = new EmbedBuilder()
        .setAuthor(author)
        .addFields({ name: 'Bot İsmi', value: `${a.username}`, inline: true })
        .addFields({ name: 'Bot Kimliği', value: `${a.id}`, inline: true })
        .addFields({ name: 'Botu Reddeden Yetkili', value: `${yetkili} \`[${yetkili.username}]\``, inline: true })
        .setColor("Red")

    log.send({ content: "<@" + uye + ">", embeds: [embed] })
    message.delete()
}

if (interaction.customId === "onayla") {
    const { guild, member } = interaction;
    let admin = db.get(`adminRol_${guild.id}`);
    if (!member.roles.cache.has(admin)) {
      return interaction.reply({ content: "Bu işlemi gerçekleştirmek için <@&" + admin + "> rolüne sahip olmalısın!", ephemeral: true });
    }
  
    let message = await interaction.channel.messages.fetch(interaction.message.id);
    const logKanalID = await db.fetch(`log_${guild.id}`);
    const log = client.channels.cache.get(logKanalID);
    let dev = db.get(`devRol_${guild.id}`);
    let botrol = db.get(`botRol_${guild.id}`);
    var data = db.fetch(`bot_${interaction.message.id}`);
    var uye = data.user;
    var bot = data.bot;
	
    let a = await client.users.fetch(bot);
    const uyecik = await guild.members.fetch(uye);
  
    const hata = new EmbedBuilder()
      .setTitle("Başarısız!")
      .setDescription("Önce botu sunucuya eklemelisin!")
      .setColor("Red");
    if (!a) {
      return interaction.reply({ embeds: [hata], ephemeral: true });
    }
  
    const author = { name: `${a.username} | Onaylandı`, iconURL: a.displayAvatarURL({ format: "png", size: 1024 }) };
    const botcuk = await guild.members.fetch(bot);

    const yetkili = member.user;
    
    const embed = new EmbedBuilder()
      .setAuthor(author)
      .addFields({ name: 'Bot İsmi', value: `${a.username}`, inline: true })
      .addFields({ name: 'Bot Kimliği', value: `${a.id}`, inline: true })
      .addFields({ name: 'Botu Onaylayan Yetkili', value: `${yetkili} \`[${yetkili.username}]\``, inline: true })
      .setColor("Green");
  
    log.send({ content: "<@" + uye + ">", embeds: [embed] });
    uyecik.roles.add(dev);
    botcuk.roles.add(botrol);
    message.delete();
  }
})

client.on('interactionCreate', async (interaction) => {
    if (interaction.customId === "bot-ekle") {
        await interaction.showModal(Modal);
    }
})

// Sistemi Sıfırla - Button Bölümü
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

// Banı Kaldır Button Bölümü
const unban = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setEmoji("<a:guard:1081678541457993728>")
            .setLabel("Banı Kaldır")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("unban"))

client.on('guildMemberRemove', async member => {

    const logKanalID = await db.get(`log_${member.guild.id}`)
    const log = client.channels.cache.get(logKanalID)

    var data = db.fetch(`ekledi_${member.id}`)
    if (!data) return;

    let Data = data

    const BanEmbed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Banlandı!")
        .setDescription(`<a:danger:1091095742711599144> **|** \`${member.user.username}\` isimli kullanıcı sunucudan çıktığı için **botu** <@${data}> sunucudan banlandı!`)

    member.guild.members.ban(Data).catch(() => { })
    log.send({ embeds: [BanEmbed], components: [unban] }).then(mesaj => {
        db.set(`user_${mesaj.id}`, member.id)
    })
})

// Banı Kaldır Bölümü
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

// Ayarlar Button Bölümü
client.on('interactionCreate', async interaction => {
    const { member } = interaction;

    if (!interaction.isButton()) return;

    if (interaction.customId === "ayarlar") {
        const { guild } = interaction;

        let logID = db.get(`log_${guild.id}`)
        let onayKanalID = db.get(`onay_${guild.id}`)
        let botEkleID = db.get(`botekle_${guild.id}`)
        let botRolID = db.get(`botRol_${guild.id}`)
        let devRolID = db.get(`devRol_${guild.id}`)
        let adminRolID = db.get(`adminRol_${guild.id}`)

        const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() || "https://cdn.discordapp.com/emojis/1119027206908284948.gif" })
            .setTitle("Sunucu Ayarları <:settings:904101655535034448>")
            .setColor("#5865F2")
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        const logKanal = interaction.guild.channels.cache.get(onayKanalID);
        if (logKanal) {
            embed.addFields([
                {name: "<:book:904101654834606102> Log Kanalı", value: logKanal.toString(), inline: true}
            ]);
        } else {
            embed.addFields([
                {name: "<:book:904101654834606102> Log Kanalı", value: `Ayarlı Değil <:cross:904102980553437184>`, inline: true}
            ]);
        }

        const onayredKanal = interaction.guild.channels.cache.get(onayKanalID);
        if (onayredKanal) {
            embed.addFields([
                {name: "<:verified:910523666620645378> Onay & Red Kanalı", value: onayredKanal.toString(), inline: true}
            ]);
        } else {
            embed.addFields([
                {name: "<:verified:910523666620645378> Onay & Red Kanalı", value: `Ayarlı Değil <:cross:904102980553437184>`, inline: true}
            ]);
        }

        const botekleKanal = interaction.guild.channels.cache.get(botEkleID);
        if (botekleKanal) {
            embed.addFields([
                {name: "<:link:904101655455358976> Bot Ekle Kanalı", value: botekleKanal.toString(), inline: true}
            ]);
        } else {
            embed.addFields([
                {name: "<:link:904101655455358976> Bot Ekle Kanalı", value: `Ayarlı Değil <:cross:904102980553437184>`, inline: true}
            ]);
        }

        const botRol = interaction.guild.roles.cache.get(botRolID);
        if (botRol) {
            embed.addFields([
                {name: "<:BOTS:1099791011657547876> Bot Rolü", value: botRol.toString(), inline: true}
            ]);
        } else {
            embed.addFields([
                {name: "<:BOTS:1099791011657547876> Bot Rolü", value: `Ayarlı Değil <:cross:904102980553437184>`, inline: true}
            ]);
        }

        const developerRol = interaction.guild.roles.cache.get(devRolID);
        if (developerRol) {
            embed.addFields([
                {name: "<:Developer:899715020873678888> Developer Rolü", value: developerRol.toString(), inline: true}
            ]);
        } else {
            embed.addFields([
                {name: "<:Developer:899715020873678888> Developer Rolü", value: `Ayarlı Değil <:cross:904102980553437184>`, inline: true}
            ]);
        }
        
        const yetkiliRol = interaction.guild.roles.cache.get(adminRolID);
        if (yetkiliRol) {
            embed.addFields([
                {name: "<:moderator:904316800840380448> Yetkili Rolü", value: yetkiliRol.toString(), inline: true}
            ]);
        } else {
            embed.addFields([
                {name: "<:moderator:904316800840380448> Yetkili Rolü", value: `Ayarlı Değil <:cross:904102980553437184>`, inline: true}
            ]);
        }

        const yetki = new EmbedBuilder()
            .setTitle("Yetersiz Yetki <:cross:904102980553437184>")
            .setDescription("Bu komutu kullanabilmek için **Yönetici** yetkisine ihtiyacın var!")
            .setColor("Red")
            if (!member.permissions.has(PermissionFlagsBits.ManageChannels)) return interaction.reply({ embeds: [yetki], ephemeral: true });

        interaction.reply({ embeds: [embed], ephemeral: true }).catch(() => { })
    }
})

client.login(token);
