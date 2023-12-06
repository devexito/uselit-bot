const { inspect } = require('util')
const { errorParse } = require('../../util/util')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'eval',
  description: 'Can be used only by bot\'s owner',
  desc: '.',
  owner: true,
  async execute (message, args) {
    // argument
    let noOutput = false
    if (args[args.length - 1] === '-off') {
      noOutput = true
      args.splice(-1, 4)
    }

    let evaled
    try {
      evaled = await eval(args.join(' ').trim())
    } catch (e) {
      if (e.message == 'Cannot send an empty message') {
        message.react('🏴')
        return null
      }
      console.error(e)
      return errorParse('```\n' + e.toString() + '\n```', message)
    }

    // output
    console.log(inspect(evaled))
    if (inspect(evaled) == 'undefined') {
      message.react('♿');
      return null
    }
    if (inspect(evaled).length > 4000) {
      message.react('🏳️')
      return null
    }
    if (noOutput) {
      message.react('🆙')
      return null
    } else {
      const embed = new MessageEmbed()
        .setDescription('```js\n' + inspect(evaled) + '\n```')
      return message.editOrReply(null, { embeds: [embed] })
    }
  },
}