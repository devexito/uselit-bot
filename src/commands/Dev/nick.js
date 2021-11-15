const { errorParse } = require('../../util/util')
const fs = require('fs')
const name = './src/nicks.json'
var list = fs.readFileSync(name).toString()
list = JSON.parse(list)

module.exports = {
  name: 'nick',
  args: true,
  owner: true,
  description: 'a',
  desc: '.',
  aliases: ['nick'],
  usage: '<add/remove/list> <user id> <guild id> <nickname>',
  permissions: 'owner',
  async execute(message, args) {
    if (message.author.id !== message.client.config.ownerID) return message.react('⛔')
    let [setting, usrId, guildId, ...nicknm] = args
    nicknm = nicknm.join(' ')
    let isDeleting = false
    var out = ''

    if (setting === 'remove' || setting === 'delete') {
      isDeleting = true
    } else if (setting === 'list') {
      return message.reply('```js\n' + JSON.stringify(list, null, 2) + '\n```')
    } else if (setting !== 'add') {
      return errorParse('setting is neither add nor remove', message)
    }

    if (!usrId) return errorParse('no user', message)

    if (isDeleting) {
      if (!list[usrId]) return errorParse('this user does not exist', message)
      delete list[usrId]
      msg = 'ok, removed user ' + usrId
    } else if (guildId && nicknm) {
      list[usrId] = {
        "nick": nicknm,
        "guild": guildId
      }
      msg = 'ok, added user ' + usrId
    } else return errorParse('Invalid arguments', message)

    let er = false
    console.log(list)
    fs.writeFileSync(name, JSON.stringify(list), function (err) {
      if (err) {
        console.error(err)
        errorParse('File writing error', message)
        er = true
      }
    })
    if (!er) message.reply(msg)
  },
}