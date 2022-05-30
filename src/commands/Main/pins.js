const Discord = require('discord.js')
const { errorParse } = require('../../util/util')

module.exports = {
  name: 'pins',
  aliases: ['img', 'toimg', 'toimage'],
  description: 'Lists a number of pins in a channel.',
  desc: 'How many pins',
  permissions: '',
  usage: '[channel]',
  cooldown: 2,
  async execute(message, args) {
    async function channelCheck(input, message) {
      var output = input.join('')

      if (isNaN(output)) {
        try {
          var regEx = /<#\!?([0-9]{17,21})>/
          output = regEx.exec(output)[1]
        } catch {
          console.log(output)
          return null
        }
      }
      
      return isNaN(output) ? null : await message.guild.channels.cache.get(output)
    }

    let url
    let mess = ''
    let messUrl = ''

    async function findUrl(args, message) {
      let mentioned
      if (args.length) mentioned = await channelCheck(args, message)
      if (mentioned) return mentioned

      if (!args || !args.length || args == '') {
        return await message.channel
      }
      return null
    }
    url = await findUrl(args, message)

    if (url) {
      if (Array.isArray(url)) {
        [messUrl, mess] = url
        url = messUrl.toString()
      }
    } else if (validateUrl(args)) {
      url = args[0]
    } else return errorParse('Please provide an attachment, image URL, user id or mention', message)

    return await message.reply()
  },
}

