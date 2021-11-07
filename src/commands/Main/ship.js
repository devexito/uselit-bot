const { getRandomInt } = require('../../util/util')
const { MessageEmbed } = require('discord.js')
const { errorParse } = require('../../util/util')

module.exports = {
  name: 'ship',
  permissions: '',
  aliases: ['c', 'child'],
  description: `Ships two user names (or thing names?)\nSkip arguments for random users. You can either enter two mentions, id or words separated by spaces, or use a \`|\` as a separator for words.\n\nUse \`-s\` for server nicknames.\nUse \`-f\` to floor odd amount of characters instead of ceiling it.`,
  desc: 'Lovely shipping...',
  usage: '[first mention or id] [second mention or id] [-s] [-f]\` **OR**\n\`[text] | [another text]',
  typing: true,
  async execute(message, args) {
    let sexLvl = getRandomInt(256)
    const virgin = 101 - getRandomInt(101)
    let rate = 100 - getRandomInt(100)
    const emoteList = ['<a:pregnant:886071002067529770>', '<:heroin:870323994958651424>', '<:losyash:870324026218790913>', '<:gay_sex_minet_anal:893360848058318848>', '<a:ball:858301009309466634>']
    let emote = 0
    let randomised = 0
    
    let isServNick = false
    let isReversed = false
    if (args[args.length - 1] === '-s') {
      isServNick = true
      args.splice(-1, 2)
    }
    if (args[args.length - 1] === '-f' && args[args.length - 2] === '-s') {
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
      emote = 1
    } else {
      args = args.split(' ')
    }

    let user = args[0]
    let user2 = args[1]

    let embed = new MessageEmbed()
      .setColor('#3131BB')

    async function randUser(message, isServNick) {
      let random = message.guild.members.cache.random()
      if (isServNick && random.nickname) {
        return random.nickname
      } else {
        return random.user.username
      }
    }

    async function mentionCheck(input, message, isServNick) {
      //console.log('eba ' + input)
      if (isNaN(input)) {
        var regEx = /<@\!?([0-9]{17,21})>/
        input = regEx.exec(input)[1]
        //console.log('blya ' + input)
      }

      if (!isNaN(input) && message.guild.members.cache.get(input)) {
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
        user = await randUser(message, isServNick).catch((e) => {})
        randomised += 1
      } else {
        user = args[0]
        emote = 1
      }
    }
    if (!user2) {
      if (!args[1]) {
        user2 = await randUser(message, isServNick).catch((e) => {})
        randomised += 1
      } else {
        user2 = args[1]
        emote = 1
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
      (emote === 0) ? newEmote = ' ' + emoteList[3] : newEmote = ' ' + emoteList[2]
      emote = 4
      rate = 69
      sexLvl = 69
    }

    embed
      .setTitle('`' + user + '` + `' + user2 + '`')
      .setDescription('**' + final + '** ' + emoteList[emote])
    if (emote === 0) {
      embed
      .addField('Sex level', sexLvl.toString() + newEmote, true)
      .addField('Virgin', virgin.toString() + '%', true)
    } else {
      embed
      .addField('Professional ratings', rate.toString() + '/100' + newEmote)
    }

    message.reply({ embeds: [embed] })
  }
}