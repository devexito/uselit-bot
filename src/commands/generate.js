const paginationEmbed = require('../services/embedPagination')
const { MessageEmbed, MessageButton } = require('discord.js')
const { errorParse } = require('../util/util')
const gen = require('../services/generateText')

module.exports = {
  name: 'generate',
  aliases: ['g', 'gen', 'porf', 'porfirevich'],
  description: 'Completes text using https://porfirevich.ru/',
  desc: 'Complete text using Porfirevich',
  permissions: '',
  cooldown: 5,
  args: true,
  usage: '<text>',
  typing: true,
  async execute(message, args) {
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
        msg
      })
    }).catch((e) => {console.log(e)})
    
    async function createPages({
      message,
      output,
      args,
      msg = false
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

      const button1 = new MessageButton()
        .setCustomId('previousbtn')
     //   .setLabel('')
        .setStyle('PRIMARY')
        .setEmoji('⬅️')

      const button2 = new MessageButton()
        .setCustomId('nextbtn')
        .setStyle('PRIMARY')
        .setEmoji('➡️')

      const button3 = new MessageButton()
        .setCustomId('regenbtn')
        .setStyle('SECONDARY')
       // .setDisabled(true)
        .setEmoji('🔄')

      const button4 = new MessageButton()
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