const paginationEmbed = require('../services/embedPagination')
const { MessageEmbed, MessageButton } = require('discord.js')
const { errorParse } = require('../util/util')
const { repliedMessage } = require('../util/message')
const gen = require('../services/generateText')

module.exports = {
  name: 'generate',
  aliases: ['g', 'gen', 'porf', 'porfirevich'],
  description: 'Completes text using https://porfirevich.ru/',
  desc: 'Complete text using Porfirevich',
  permissions: '',
  cooldown: 5,
  usage: '<text>',
  typing: true,
  async execute(message, args) {
    let replied = false
    let reply = await repliedMessage(message).catch((e) => console.error(e))
    if (undefined != args && args.length) {
    } else if (undefined != reply && reply.length) {
      args = reply
      replied = true
    } else {
      console.log('no text')
      return errorParse('No text provided', message)
    }
    const embed = new MessageEmbed()
      .setColor('#3131BB')
      .setTitle('Generating text...')
      .setDescription('<:clueless:896283754652381214>')
    const msg = await message.reply({ embeds: [embed] }).catch()
    const out = await gen.fetchText(message, args, msg).catch()
    .then(async (output) => {
      await createPages({
        message,
        output,
        args,
        msg,
        replied
      })
    }).catch((e) => {console.log(e)})
    
    async function createPages({
      message,
      output,
      args,
      msg = false,
      replied = false
    }) {
      if (!output) {
        if (msg) {
          msg.delete()
          return errorParse('Received no output while creating pages', message)
        } else return
      }
      const embed1 = await gen.embedBase(output, args, 1)
      const embed2 = await gen.embedBase(output, args, 2)
      const embed3 = await gen.embedBase(output, args, 3)

      let button1 = new MessageButton()
        .setCustomId('previousbtn')
     //   .setLabel('')
        .setStyle('PRIMARY')
        .setEmoji('⬅️')

      let button2 = new MessageButton()
        .setCustomId('nextbtn')
        .setStyle('PRIMARY')
        .setEmoji('➡️')

      let button3 = new MessageButton()
        .setCustomId('regenbtn')
        .setStyle('SECONDARY')
        .setEmoji('🔄')

      if (replied) button3.setDisabled(true)

      let button4 = new MessageButton()
        .setCustomId('stopbtn')
        .setStyle('DANGER')
        .setEmoji('✖️')

      pages = [
	       embed1,
	       embed2,
        embed3
      ]

      buttonList = [
        button1,
        button2,
        button3,
        button4,
      ]
      msg ? paginationEmbed(msg, pages, buttonList, timeout = 120000) : errorParse('Unexpected error occurred!', message)
    }
  },
}