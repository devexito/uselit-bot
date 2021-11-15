const { readFileSync } = require('fs')

class NickChanger {
  constructor(client) {
    this.client = client

    this.client.on('guildMemberUpdate', async (oldMember, newMember) => {
      if (oldMember.nickname === newMember.nickname) return
      this.list = readFileSync('./src/nicks.json')
      this.list = JSON.parse(this.list)
      for (const [guildId, users] of Object.entries(this.list)) {
        if (oldMember.guild.id != guildId) continue
        for (const [usrId, nick] of Object.entries(users)) {
          if (newMember.nickname == nick) break
          if (newMember.user.id != usrId) continue
          try {
            this.client.guilds.cache.get(oldMember.guild.id).members.cache.get(oldMember.user.id).setNickname(nick)
            console.log(newMember.user.username + ' сменился с "' + oldMember.nickname + '" на "' + newMember.nickname + '"! Меняю на ' + nick)
          } catch (e) {}
        }
      }
    })
  }
}

module.exports = NickChanger