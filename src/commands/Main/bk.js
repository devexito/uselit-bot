const ignoreList = ['227054810673840128', '567411443276840984']

const { errorParse } = require('../../util/util')
module.exports = {
  name: 'bk',
  description: 'Reacts with badklass emoji on every message of someone who really does some crap.\nUse `-off` postfix to turn this off for a specified user.\n\nDoes not work for bots.',
  desc: 'React with crap on users',
  cooldown: 5,
  usage: '<user mention/id> [-off]',
  args: true,
  async execute(message, args) {
    let owner = (message.client.config.owners.includes(message.author.id)) ? true : false
    let off

    if (ignoreList.includes(message.author.id)) return message.reply('idi nahui dolbaeb lol')

    async function mentionCheck(input, message) {
      
      if (isNaN(input)) {
        try {
          var regEx = /<@\!?([0-9]{17,21})>/
          input = regEx.exec(input)[1]
        } catch (e) {
          errorParse('Please provide a user mention or id', message)
          return false
        }
      }

      if (!isNaN(input)) {
        let usr = await message.client.users.fetch(input).catch((e) => { 
          errorParse('User not found')
          return false
        })
        if (usr.bot) {
          errorParse('Bots are not supported', message)
          return false
        }
        return usr
      } else return false
    }

    if (args[0] == 'list') {
      if (owner) {
        return (bk.length > 0) ?message.reply(bk.join(', ')) : message.reply('bk is empty')
      } else {
        return message.react('🚽').catch(() => { console.log('Toilet reaction blocked') })
      }
    }

    if (args[args.length - 1] === '-off') {
      args.splice(-1, 1)
      off = true
      if (args.length == 0 || args[0] == '') {
        if (owner) {
          bk = []
          console.log('bk now empty')
          return message.reply('ok, turned off for everyone')
        } else {
          return errorParse('Please specify a user', message, this.usage)
        }
      }
    }
    let user = {}
    let defaultUser = false

    if (!args || !args.length || args[0] == '') {
      user.id = '342247854875738113' //poka misha :(
      defaultUser = true
    } else {
      user = await mentionCheck(args[0], message)
    }
    if (typeof user !== 'object') return
    if (!user) return errorParse('User not found', message)

    if (bk.indexOf(user.id) === -1) { // checking if specified user is not in bk array...
      if (!off) {
        bk.push(user.id)
        return message.react('👍🏿').catch(() => {})
      } else {
        return errorParse('This user is already not in the list', message)
      }
    } else if (off) {
      bk.splice(bk.indexOf(user.id), 1)
      return message.reply('ok, removed user ' + user.username)
    } else if (defaultUser) {
      return errorParse('Uhh.. Invalid Arguments\nPlease specify a user', message, this.usage)
    } else {
      return errorParse('This user is already included in the list', message)
    }
  },
}