const unirest = require('unirest')
const req = unirest('POST', 'https://pelevin.gpt.dobro.ai/generate/')
const paginationEmbed = require('../services/embedPagination')
const { MessageEmbed, MessageButton } = require('discord.js')
const { getRandomInt, errorParse } = require('../util/util')
let gen = require('../services/generateText')

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
    const msg = await message.reply('generating text...')
    let output = gen.fetchText({
      message,
      args,
      msg
    }).then(async (output) => {
      console.log(output)
      await createPages({
        message,
        output,
        args,
        msg
      })
    }).catch(() => {})

    function embedBase(output, args, page) {
      return new MessageEmbed()
        .setTitle('Result')
        .setDescription(args.join(' ').trim() + output.splice(output[page - 1], 1))
    }

    
      
    function createPages({
      message,
      output,
      args,
      msg = false
    }) {
      const embed1 = embedBase(output, args, 1)
      const embed2 = embedBase(output, args, 2)
      const embed3 = embedBase(output, args, 3)

      const button1 = new MessageButton()
        .setCustomId('previousbtn')
        .setLabel('')
        .setStyle('PRIMARY')
        .setEmoji('⬅️')

      const button2 = new MessageButton()
        .setCustomId('nextbtn')
        .setLabel('')
        .setStyle('PRIMARY')
        .setEmoji('➡️')

      const button3 = new MessageButton()
        .setCustomId('regenbtn')
        .setLabel('')
        .setStyle('SUCCESS')
        .setEmoji('🔄')

      pages = [
	       embed1,
	       embed2,
        embed3,
      ]

      buttonList = [
        button1,
        button2,
        button3
      ]
      if (msg) msg.delete()
      paginationEmbed(message, pages, buttonList, timeout = 120000)
    }
  },
}