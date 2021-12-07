const paginationEmbed = require('../../services/embedPagination')
const { MessageEmbed, MessageButton } = require('discord.js')
const { shorten, emote, errorParse, argsError } = require('../../util/util')
const { repliedMessage } = require('../../util/message')
//const gen = require('../../services/searchGoogle')

module.exports = {
  name: 'google',
  aliases: ['go', 'search', 'gs'],
  description: 'Searches results in Google Search.',
  desc: 'Search results in Google',
  permissions: '',
  cooldown: 10,
  usage: '<text>',
  typing: true,
  owner: true,
  async execute(message, args) {
/*
    let reply = await repliedMessage(message).catch((e) => console.error(e))
    if (undefined != args && args.length) {
    } else if (undefined != reply && reply[0] !== '' && reply.length) {
      args = reply
    } else {
      return argsError(this, message)
    }
    const embed = new MessageEmbed()
      .setColor('#3131BB')
      .setTitle('Searching...')
      .setDescription(emote('clueless'))
    const msg = await message.reply({ embeds: [embed] }).catch(e => errorParse(e.toString(), message))
    if (!msg) return
    const out = await gen.fetchText(message, args, msg)
    .then(async (output) => {
      if (!output) return msg.delete()
      console.log(output)
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
      msg,
      args
    }) {
      let pages = []

      for (const [id, result] of output.res.entries()) {
        while (
          pages.push(embedBase(resCopy, id, output.input))
      }

      let button1 = new MessageButton()
        .setCustomId('previousbtn')
        .setStyle('PRIMARY')
        .setEmoji('⬅️')
       // .setLabel('Prev')

      let button2 = new MessageButton()
        .setCustomId('nextbtn')
        .setStyle('PRIMARY')
        .setEmoji('➡️')
      //  .setLabel('Next')

      let button3 = new MessageButton()
        .setCustomId('regenbtn')
        .setStyle('SECONDARY')
       // .setLabel('Regen')
        .setEmoji('🔀')

      let button4 = new MessageButton()
        .setCustomId('genmorebtn')
        .setStyle('SECONDARY')
       // .setLabel('More')
        .setEmoji('#️⃣')

      let button5 = new MessageButton()
        .setCustomId('stopbtn')
        .setStyle('DANGER')
      //  .setLabel('Stop')
        .setEmoji('✖️')

      const buttonList = [
        button1,
        button2,
        button3,
        button4,
        button5
      ]
      msg ? paginationEmbed(msg, pages, buttonList, timeout = 120000, message, args) : errorParse('Unexpected error occurred!', message)
    }
  },
}

function embedBase(output, page, input) {
  if (!output) return console.error('no output for embedding pages')
 // let result = output.splice(output.res[page - 1], 1)
  return new MessageEmbed()
    .setColor('#3131BB')
    .setTitle(`Search Results for ${shorten(input, 60)}`)
  for (let i = 0; i < 3; i++) {
    embed.addField(output[i].title, shorten(`**${output[i].link}**\n${output[i].description}}`), 1024)
*/
  }
}