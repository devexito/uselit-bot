const paginationEmbed = require('../../services/embedPagination')
const Discord = require('discord.js')
const { emote, errorParse, argsError } = require('../../util/util')
const { repliedMessage } = require('../../util/message')
const gen = require('../../services/generateText')

module.exports = {
  name: 'generate',
  aliases: ['g', 'gen', 'porf', 'porfirevich'],
  description: 'Completes text using https://porfirevich.ru/\n\nSupports message replies.',
  desc: 'Complete text using Porfirevich',
  permissions: '',
  cooldown: 5,
  usage: '<text>',
  typing: true,
  async execute(message, args) {
    let reply = await repliedMessage(message).catch((e) => console.error(e))
    if (undefined != args && args.length) {
    } else if (undefined != reply && reply[0] !== '' && reply.length) {
      args = reply
    } else {
      return argsError(this, message)
    }
    
    const embed = new Discord.EmbedBuilder()
      .setColor(0x3131BB)
      .setTitle('Generating text...')
      .setDescription(emote('shue'))
    
    const msg = await message.reply({ embeds: [embed] }).catch(e => errorParse(e.toString(), message))
    if (!msg) return
    
    const out = await gen.fetchText(message, args, msg)
      .then(async (output) => {
        if (!output) return msg.delete()
        await createButtons({
          message,
          output,
          msg,
          args
        })
      }).catch((e) => console.log(e))
    
    async function createButtons({
      message,
      output,
      msg = false,
      args
    }) {
      
      const resultEmbed = new Discord.EmbedBuilder()
        .setColor(0x3131BB)
        .setTitle('Result')
        .setDescription(output.input + output.res.splice(output.res[0], 1))

      let button1 = new Discord.ButtonBuilder()
        .setCustomId('regenerate')
        .setStyle('Primary')
        .setEmoji('🔄')

      let button2 = new Discord.ButtonBuilder()
        .setCustomId('generateMore')
        .setStyle('Primary')
        .setEmoji('⏩')

      let button3 = new Discord.ButtonBuilder()
        .setCustomId('close')
        .setStyle('Danger')
        .setEmoji('✖️')

      let button4 = new Discord.ButtonBuilder()
        .setCustomId('song')
        .setStyle('Secondary')
        .setEmoji('📢')

      const buttonList = [
        button1,
        button2,
        button3,
        button4
      ]
      msg ? paginationEmbed(msg, resultEmbed, buttonList, timeout = 120000, message, args) : errorParse('Unexpected error occurred!', message)
    }
  },
}
