const Discord = require('discord.js')
const { errorParse, validateUrl } = require('../../util/util')
const { repliedMessageObject, findImageUrlInMessage, findImageUrlInAttachment, findImageUrlInMessageHistory, findImageUrlInEmbed } = require('../../util/message')

module.exports = {
  name: 'image',
  aliases: ['img', 'toimg', 'toimage'],
  description: 'Converts found image into static image for identify command',
  desc: 'Utility function',
  permissions: '',
  usage: '<image url/attachment/user mention>',
  cooldown: 2,
  async execute(message, args) {
    async function mentionCheck(input, message) {
      input = input.join('')
      let output
      let mentioned

      if (isNaN(input)) {
        try {
          var regEx = /<@\!?([0-9]{17,21})>/
          output = regEx.exec(input)[1]
        } catch {
          return console.log(input)
        }
      } else {
        output = input
      }

      if (!isNaN(output)) mentioned = await message.client.users.cache.get(output)

      if (mentioned) {
        return mentioned.avatarURL({ format: 'png', size: 1024 }) || mentioned.displayAvatarURL({ format: 'png', size: 1024 })
      } else return null
    }

    let url
    let mess = ''
    let messUrl = ''

    async function findUrl(args, message) {

      if (message.attachments.size) {
        return message.attachments.first().url
      }

      if (message.reference) {
        const repliedMessage = await repliedMessageObject(message)
        if (!repliedMessage) return errorParse('Could not fetch a reply', message)
        return await findImageUrlInMessage(repliedMessage).catch((e) => {
          console.error(e)
          return errorParse('Error searching for an image in referenced message', message)
        })
      }

      let mentioned
      if (args.length) mentioned = await mentionCheck(args, message)
      if (mentioned) return mentioned

      if (!args || !args.length || args == '') {
        return await findImageUrlInMessageHistory(message, true).catch((e) => errorParse(e, message))
      }
      return null
    }
    url = await findUrl(args, message)

    if (url) {
      if (Array.isArray(url)) {
        [messUrl, mess] = url
        url = messUrl.toString()
      }
      if (!validateUrl(url)) {
        return errorParse('Malformed URL', message)
      }
    } else if (validateUrl(args)) {
      url = args[0]
    } else return errorParse('Please provide an attachment, image URL, user id or mention', message)

    let msg
    const attachment = new Discord.MessageAttachment(url, 'attachment.png')
    if (mess) {
      msg = await mess.reply({ files: [ attachment ] })
    } else {
      msg = await message.reply({ files: [ attachment ] })
    }
  },
}

