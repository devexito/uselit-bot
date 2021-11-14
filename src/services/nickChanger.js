//const { MessageEmbed } = require('discord.js')

class NickChanger {
  constructor(client) {
    this.client = client
   // this.list = require('../nicks.json')

    this.client.on('guildMemberUpdate', async (oldMember, newMember) => {
      if (oldMember.nickname === newMember.nickname) return
      let guild = 467759978716069888
      let m = [350177157550571521, 761943058924830740, 567411443276840984]
      let n = ['❤Nikitock Fanta❤', '❤femboy debil❤', '❤serafemboy❤']

      if (oldMember.guild.id != guild) return
      if (newMember.user.id == m[0]) {
        if (newMember.nickname != n[0]) {
          newMember.setNickname(n[0])
        }
      } else if (newMember.user.id == m[1]) {
        if (newMember.nickname != n[1]) {
          newMember.setNickname(n[1])
        }
      } else if (newMember.user.id == m[2]) {
        if (newMember.nickname != n[2]) {
          newMember.setNickname(n[2])
        }
      } else return
      console.log(newMember.user.username + ' has changed from ' + oldMember.nickname + ' to ' + newMember.nickname + '! Changing back to their defaults')
    })
  }
}

module.exports = NickChanger