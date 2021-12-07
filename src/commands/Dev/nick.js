const { errorParse } = require('../../util/util')
const fs = require('fs')
const name = './src/nicks.json'
var list = fs.readFileSync(name).toString()
list = JSON.parse(list)

module.exports = {
  name: 'nick',
  args: true,
  owner: true,
  description: 'Chan',
  desc: '.',
  aliases: ['nick'],
  usage: '<add/remove/list> <user id> <guild id> <nickname>',
  permissions: 'owner',
  async execute(message, args) {
    if (!message.client.config.owners.includes(message.author.id)) return message.react('⛔')
    let [setting, usrId, guildId, ...nicknm] = args
    if (nicknm[nicknm.length - 1] === '-now') {
      var now = true
      nicknm.splice(-1, 4)
    }
    nicknm = nicknm.join(' ').trim()
    let isDeleting = false
    var out = ''

    if (setting === 'remove' || setting === 'delete') {
      isDeleting = true
    } else if (setting === 'list') {
      return message.reply('```js\n' + JSON.stringify(list, null, 2) + '\n```')
    } else if (setting !== 'add') {
      return errorParse('setting is neither add nor remove', message)
    }

    let allUsers = false
    if (!usrId || !guildId) return errorParse('invalid arguments', message)
    if (isDeleting && (usrId === 'all' || usrId === 'guild')) allUsers = true

    if (!allUsers) {
      try {
        var memCache = message.client.guilds.cache.get(guildId).members.cache.get(usrId)
      } catch (e) {
        return errorParse('couldnt cache smth', message)
      }
    }

    if (isDeleting) {
      if (!list[guildId]) return errorParse('this guild does not exist in the list', message)
      if (!allUsers) {
        if (!list[guildId][usrId]) return errorParse('this user does not exist in the list', message)
        delete list[guildId][usrId]
        if (list[guildId] == {}) delete list[guildId]
        msg = 'ok, removed user ' + memCache.user.username
      } else {
        delete list[guildId]
        msg = 'ok, removed guild ' + guildId + ' and every its member'
      }
    } else if (nicknm) {
      if (!list[guildId]) list[guildId] = {}
      list[guildId][usrId] = nicknm
      msg = 'ok, added user ' + memCache.user.username
    } else return errorParse('provide a nickname', message)

    console.log(list)

    try {
      fs.writeFileSync(name, JSON.stringify(list), 'utf8')
      if (now) await memCache.setNickname(nicknm)
      message.reply(msg)
    } catch (err) {
      console.error(err)
      errorParse('File writing error: ' + err.toString(), message)
    }
  },
}