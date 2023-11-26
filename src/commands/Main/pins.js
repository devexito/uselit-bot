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
  ignore_dms: true,
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

    async function findId(args, message) {
      let mentioned
      if (args.length)
        mentioned = await channelCheck(args, message)
      if (mentioned)
        return mentioned

      if (!args || !args.length || args == '')
        return await message.channel
      
      return null
    }
    
    let channel = await findId(args, message)
    if (!channel || !channel.messages)
      return errorParse('Invalid channel.', message)
    await channel.messages.fetchPinned().then(m => {
      let pinCount = m.size.toString()
      message.reply(`There ${pinCount == 1 ? `is 1 pin` : `are ${pinCount} pins`} in <#${channel.id}>`)
    }).catch(() => {
      return errorParse('Could not fetch channel.', message)
    })
  },
}

