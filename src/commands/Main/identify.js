const axios = require('axios').default
const { emote, errorParse, validateUrl } = require('../../util/util')
const { repliedMessageObject, findImageUrlInMessage, findImageUrlInMessageHistory } = require('../../util/message')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'identify',
  aliases: ['analyze', 'ident'],
  description: 'Identifies an image.\nPut -tags as the last argument to return a list of tags.',
  desc: 'Identify an image',
  permissions: '',
  usage: '<image url/attachment/user mention>',
  cooldown: 9,
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
          console.log(input)
          return null
        }
      } else {
        output = input
      }

      if (!isNaN(output)) mentioned = await message.client.users.cache.get(output)

      if (mentioned) {
        return mentioned.avatarURL({ format: 'png', size: 1024 }) || mentioned.displayAvatarURL({ format: 'png', size: 1024 })
      } else return null
    }

    let onlyTags = false
    if (args[args.length - 1] === '-tags') {
      onlyTags = true
      args.splice(-1, 5)
    }

    let url
    let mess = ''
    let messUrl = ''
    let errorText = 'Please provide an attachment, image URL, user ID or mention'

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
        let result = await findImageUrlInMessageHistory(message, true).catch((e) => {
          errorText = e
          return null
        })
        return result
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
        return errorParse('Invalid or malformed URL', message)
      }
    } else if (validateUrl(args)) {
      url = args[0]
    } else return errorParse(errorText, message)

    let msg
    msg = await message.editOrReply(emote('hmmm'))

    const options = {
      method: 'POST',
      url: 'https://microsoft-computer-vision3.p.rapidapi.com/analyze',
      params: {
        language: 'en',
        descriptionExclude: 'Celebrities',
        visualFeatures: 'Description',
        details: 'Celebrities'
      },
      headers: {
        'content-type': 'application/json',
        'x-rapidapi-host': 'microsoft-computer-vision3.p.rapidapi.com',
        'x-rapidapi-key': message.client.config.BING_KEY,
      },
      data: {
        url: url
      }
    }

    const res = await axios.request(options).catch((er) => {
      let erCode = '\n\n'
      if (er.response.data) {
        console.error(er.response.data)
        if (er.response.data.code) {
          erCode += `${er.response.data.code}: ${er.response.data.message}`
        } else if (er.response.data.messages) {
          erCode += `${er.response.data.messages}`
        }
      } else erCode = ''
      msg.delete()
      return errorParse(`${er.toString()}${erCode}`, msg, false)
    })

    let botResponse = ''
    let anal

    if (res && res.data) {
      anal = res.data.description.captions[0]
      let tags = res.data.description.tags
      botResponse = getBotResponse(anal, tags)
    } else {
      msg.delete()
      return errorParse('No API response. Try again later.', message)
    }

    function getBotResponse(anal, tags) {
      if (onlyTags && tags.length) {
        if (tags.length > 25) tags.splice(24, tags.length - 25)
        return `I see ${tags.join(', ')}`
      }
      if (!anal || !anal.text) {
        if (tags.length) {
          if (tags.length > 3) tags.splice(2, tags.length - 3)
          return `I can't really describe the image but I do see ${tags.join(', ')}`
        }
      } else {
        return `${anal.confidence < 0.4 ? 'I am not really confident, but ' : ''}I think it is ${anal.text}.`
      }
      return `I really can't describe the image ` + emote('fluid')
    }

    const embed = new MessageEmbed()
      .setColor('#3131BB')
      .setDescription(botResponse)
      .setTitle('Image Recognition Result')
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setThumbnail(url)
      .setFooter(`(${Math.round(anal.confidence * 100).toString()}% confidence)`)
    msg.edit({ content: null, embeds: [embed] })
    return msg
  },
}

