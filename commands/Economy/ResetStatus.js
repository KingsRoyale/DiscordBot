const fs = require('fs');
const users = require('../../storage/permissions.json');
const Groups = require('../../util/Enums/Groups.js');
const _NoticeEmbed = require('../../util/Constructors/_NoticeEmbed.js')
const Colors = require('../../util/Enums/Colors.js')
const _User = require('../../util/Constructors/_User')
const _Role = require('../../util/Constructors/_Role.js')
const Discord = require('discord.js');
const bot = require('../../bot.js');
const db = require('../../Database').getDB();

module.exports.run = async (bot,message,args,cmd) => {

    if(args.length == 0) return new _NoticeEmbed(Colors.WARN, "Please specify a user (mention or id)").send(message.channel);

    let user = message.mentions.users.first() || message.guild.members.get(args[0]) || message.guild.members.find(val => val.user.username.toLowerCase() == args[0].toLowerCase()) || message.guild.members.find(val => val.user.tag.toLowerCase() == args[0].toLowerCase());
    
    if(user != null) if(user.username == undefined) user = user.user;

    if(!user) return new _NoticeEmbed(Colors.ERROR, "Invalid role or user - Specify a valid user (mention or id)").send(message.channel);

    db.all("SELECT * FROM profiles WHERE userId = ?", [`${user.id}`], (err, rows) => {
        if(err) console.log(err);
        if(rows.length > 0){
            db.run("UPDATE profiles SET status = ? WHERE userId = ?", ["Playing Kings Royale", `${user.id}`], err => {
                if(err) console.log(err);
            })
        } else {
            db.run("INSERT INTO profiles (userId, xp, money, status) VALUES (?, ?, ?, ?)", [`${user.id}`, 0, 0, "Playing Kings Royal"], err => {
                if(err) console.log(err);
            })
        }
        let embed = new Discord.RichEmbed()
            .setColor(Colors.SUCCESS)
            .setDescription(`You have successfully reset <@${user.id}>'s status`)

        message.channel.send(embed);
    })

}

module.exports.help = {
    name: "resetstatus",
    aliases: ["reset-status"],
    permission: Groups.ADMIN,
    description: "Resets the status of a user",
    usage: "resetstatus <user>"
}