const { errorParse } = require('../../util/util')
module.exports = {
  name: 'bk',
  description: 'Not providing any argument will insert a default user\n\nUse `-off` postfix to turn this off for a specified user, or use it as a single argument to turn it off for everyone\n\nDoes not work for bots',
  desc: 'bar',
  usage: '[userID] [-off]',
  owner: true,
  async execute(message, args) {
    let off

    async function mentionCheck(input, message) {
      
      if (isNaN(input)) {
        var regEx = /<@\!?([0-9]{17,21})>/g
        input = regEx.exec(input)[1]
        console.log('blya ', input)
      }

      if (!isNaN(input)) {
        let usr = await message.client.users.fetch(input).catch((e) => { return false })
        console.log('id ', usr.id)
        if (usr.bot) {
          errorParse('Bots are not supported', message)
          return {}
        }
        return usr.id
      } else return false
    }

    if (args[0] == 'list') {
      if (message.author.id == message.client.config.ownerID) {
        return (bk.length > 0) ?message.reply(bk.join(', ')) : message.reply('bk is empty')
      } else {
        message.react('🚽')
      }
    }

    if (args[args.length - 1] === '-off') {
      args.splice(-1, 1)
      off = true
      if (args.length == 0 || args[0] == '') {
        bk = []
        console.log('bk now empty')
        return message.reply('ok, turned off for everyone').catch(() => {})
      }
    }
    let user

    if (!args || !args.length || args[0] == '') {
      user = '342247854875738113' //privet misha
    } else {
      user = await mentionCheck(args[0], message)
    }
    if (typeof user === 'object') return
    if (!user) return errorParse('User not found', message)

    if (bk.indexOf(user) === -1) { // checking if specified user is not in bk array...
      if (!off) {
        bk.push(user)
        console.log('bk now:', bk)
        return message.react('👍🏿').catch(() => {})
      } else {
        return errorParse('This user is already not included in the list', message)
      }
    } else if (off) {
      bk.splice(bk.indexOf(user), 1)
      console.log('bk now:', bk)
      return message.reply('ok, removed user ' + user).catch(() => {})
    } else {
      return errorParse('This user is already included in the list', message)
    }
  },
}