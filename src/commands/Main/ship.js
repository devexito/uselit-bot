const { emote, getRandomInt, argsError } = require('../../util/util')
const { MessageEmbed } = require('discord.js')
const { errorParse } = require('../../util/util')

module.exports = {
  name: 'ship',
  permissions: '',
  aliases: ['c'],
  description: `Ships two user names (or thing names?)\nSkip arguments for random users. You can either enter two mentions, id or words separated by spaces, or use a \`|\` as a separator for words.\n\nUse \`-s\` for server nicknames.\nUse \`-f\` to floor odd amount of characters instead of ceiling it.`,
  desc: 'Lovely shipping...',
  usage: '[first mention or id] [second mention or id] [-s] [-f]\`\n**OR**\n\`[text] | [another text]',
  typing: true,
  async execute(message, args) {
    let sexLvl = getRandomInt(256)
    const virgin = 101 - getRandomInt(101)
    let rate = 100 - getRandomInt(100)
    let [ hot, hotString ] = getTemp(sexLvl)

    function getTemp(sexLvl) {
      let a = Math.ceil(sexLvl / 3) - getRandomInt(10) + getRandomInt(20)
      if (a > 100) a = 100 - getRandomInt(5)

      let str = '???'
      if (a < 1) str = 'Freezing love :ice_cube: 💙'
      if (a > 0 && a < 15) str = 'Cold 🥶'
      if (a > 14 && a < 36) str = '🧐'
      if (a > 35 && a < 50) str = 'Hot 🤒'
      if (a > 49 && a < 65) str = 'Hotdamn it ' + emote('fluid')
      if (a > 64 && a < 80) str = 'Very damn hot 🥵🥵🥵'
      if (a > 79 && a < 95) str = 'What the hell! 🔥🔥🔥 That is so hot 😍'
      if (a > 94 && a < 101) str = 'Boiled alive. I\'d not be proud of this.'
      return [ a, str ]
    }
    const emoteList = [
      emote('pregnant'),
      emote('heroin'),
      emote('losyash'),
      emote('suhariki'),
      emote('ball')
    ]
    let emotenum = 0
    let randomised = 0
    
    let isServNick = false
    let isReversed = false
    if (args[args.length - 1] === '-s' && message.guild) {
      isServNick = true
      args.splice(-1, 2)
    }
    if (args[args.length - 1] === '-f' && args[args.length - 2] === '-s' && message.guild) {
      isServNick = true
      isReversed = true
      args.splice(-2, 2)
    }
    if (args[args.length - 1] === '-f') {
      isReversed = true
      args.splice(-1, 2)
    }

    args = args.join(' ')
    if (args.includes('|')) {
      args = args.split('|')
      emotenum = 1
    } else {
      args = args.split(' ')
    }

    let user = args[0]
    let user2 = args[1]

    const embed = new MessageEmbed()
      .setColor('#3131BB')

    async function randUser(message, isServNick) {
      let random = message.guild?.members.cache.random()
      if (isServNick && random.nickname) {
        return random.nickname
      } else {
        return random.user.username
      }
    }

    async function mentionCheck(input, message, isServNick) {
      if (isNaN(input)) {
        var regEx = /<@\!?([0-9]{17,21})>/
        input = regEx.exec(input)[1]
      }

      if (!isNaN(input) && message.client.users.cache.get(input)) {
        if (isServNick && message.guild.members.cache.get(input).nickname) {
          return message.guild.members.cache.get(input).nickname
        } else {
          return message.client.users.cache.get(input).username
        }
      } else return
    }

    async function splitter(user, second, isReversed) {
      let pattern
      if (!isReversed) {
        pattern = new RegExp(".{1," + Math.ceil(user.length / 2) + "}", "ig")
      } else {
        pattern = new RegExp(".{1," + Math.floor(user.length / 2) + "}", "ig")
      }
      
      let result = user.match(pattern).map(item => item)
      if (second) {
        result.splice(0, 1)
        if (isReversed) result = result.join('')
      }
      return result
    }

    user = await mentionCheck(user, message, isServNick).catch((e) => {})
    user2 = await mentionCheck(user2, message, isServNick).catch((e) => {})

    if (!user) {
      if (!args[0]) {
        if (message.guild) {
          user = await randUser(message, isServNick).catch((e) => {})
          randomised += 1
        } else {
          return argsError(this, message)
        }
      } else {
        user = args[0]
        emotenum = 1
      }
    }
    if (!user2) {
      if (!args[1]) {
        if (message.guild) {
          user2 = await randUser(message, isServNick).catch((e) => {})
          randomised += 1
        } else {
          return argsError(this, message)
        }
      } else {
        user2 = args[1]
        emotenum = 1
      }
    }

    user = user.trim()
    user2 = user2.trim()

    if (randomised < 2 && user === user2) return errorParse('Cannot ship someone with themselves', message)

    const result = await splitter(user, false, isReversed).catch((e) => console.log('Couldn\'t split a string: ' + e))
    const result2 = await splitter(user2, true, isReversed).catch((e) => console.log('Couldn\'t split a string: ' + e))
    const final = result[0] + result2

    let newEmote = ''
    const regSex = new RegExp('sex')
    if (regSex.test(final)) {
      (emotenum === 0) ? newEmote = ' ' + emoteList[3] : newEmote = ' ' + emoteList[2]
      emotenum = 4
      rate = 69
      sexLvl = 69
    }

    embed
      .setTitle('`' + user + '` + `' + user2 + '`')
      .setDescription('**' + final + '** ' + emoteList[emotenum])
    if (emotenum === 0) {
      embed
      .addField('Sex level', sexLvl.toString() + newEmote, true)
      .addField('Virgin probability', virgin.toString() + '%', true)
      .addField('Love in temperature', `${hot.toString()}°C. ${hotString}`, true)
    } else {
      embed
      .addField('Professional ratings', rate.toString() + '/100' + newEmote)
    }

    return message.editOrReply(null, { embeds: [embed], files: [] })
  }
}