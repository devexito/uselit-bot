//const { MessageEmbed } = require('discord.js')

class NickChanger {
  constructor(client) {
    this.client = client
    this.list = require('../nicks.json')

    this.client.on('guildMemberUpdate', async (oldMember, newMember) => {
      for (const [guildId, users] of Object.entries(this.list)) {
        if (oldMember.guild.id != guildId) break
        for (const [usrId, nick] of Object.entries(users)) {
          if (newMember.nickname == nick) break
          if (newMember.user.id != usrId) break
          this.client.guilds.cache.get(oldMember.guild.id).members.cache.get(oldMember.user.id).setNickname(nick)
          console.log(newMember.user.username + ' has changed from ' + oldMember.nickname + ' to ' + newMember.nickname + '! Changing back to their defaults')
        }
      }
    })
  }
}

module.exports = NickChanger