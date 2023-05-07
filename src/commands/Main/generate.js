const paginationEmbed = require('../../services/embedPagination')
const { MessageEmbed, MessageButton } = require('discord.js')
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
    const embed = new MessageEmbed()
      .setColor('#3131BB')
      .setTitle('Generating text...')
      .setDescription(emote('shue'))
    const msg = await message.reply({ embeds: [embed] }).catch(e => errorParse(e.toString(), message))
    if (!msg) return
    const out = await gen.fetchText(message, args, msg)
    .then(async (output) => {
      if (!output) return msg.delete()
      await createPages({
        message,
        output,
        msg,
        args
      })
    }).catch((e) => console.log(e))
    
    async function createPages({
      message,
      output,
      msg = false,
      args
    }) {
      
      const embed1 = await gen.embedBase(output, 1)

      let button3 = new MessageButton()
        .setCustomId('regenbtn')
        .setStyle('PRIMARY')
       // .setLabel('Regen')
        .setEmoji('🔄')

      let button4 = new MessageButton()
        .setCustomId('genmorebtn')
        .setStyle('PRIMARY')
       // .setLabel('More')
        .setEmoji('⏩')

      let button5 = new MessageButton()
        .setCustomId('stopbtn')
        .setStyle('DANGER')
      //  .setLabel('Stop')
        .setEmoji('✖️')

      const pages = [
        embed1
      ]

      const buttonList = [
        button3,
        button4,
        button5
      ]
      msg ? paginationEmbed(msg, pages, buttonList, timeout = 120000, message, args) : errorParse('Unexpected error occurred!', message)
    }
  },
}