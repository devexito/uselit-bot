const { inspect } = require('util')
const { errorParse } = require('../../util/util')
const Discord = require('discord.js')

module.exports = {
  name: 'eval',
  description: 'Can be used only by bot\'s owner',
  desc: '.',
  owner: true,
  async execute (message, args) {
    if (!owners.includes(message.author.id)) {
      return errorParse('⛔ Missing Access', message)
    }

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
      if (e.message == 'Cannot send an empty message') return message.react('🏴')
      console.error(e)
      return errorParse('```\n' + e.toString() + '\n```', message)
    }

    // output
    console.log(inspect(evaled))
    if (inspect(evaled) == 'undefined') return message.react('♿')
    if (inspect(evaled).length > 4000) return message.react('🏳️')
    if (noOutput) {
      return message.react('🆙')
    } else {
      const embed = new Discord.EmbedBuilder()
        .setDescription('```js\n' + inspect(evaled) + '\n```')
      message.reply({embeds: [embed]})
    }
  },
}