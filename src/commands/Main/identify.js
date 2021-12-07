const axios = require('axios').default
const { errorParse, validateUrl } = require('../../util/util')
const { repliedMessageObject, findImageUrlInMessage, findImageUrlInAttachment, findImageUrlInMessageHistory, findImageUrlInEmbed } = require('../../util/message')

module.exports = {
  name: 'identify',
  aliases: ['analyze'],
  description: 'Identifies an image',
  desc: 'Identify an image',
  permissions: '',
  usage: '<image url/attachment/user mention>',
  cooldown: 10,
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

    let onlyTags = false
    if (args[args.length - 1] === '-tags') {
      onlyTags = true
      args.splice(-1, 5)
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
    if (mess) {
      msg = await mess.reply(':thinking:')
    } else {
      msg = await message.reply(':thinking:')
    }

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
        'x-rapidapi-key': '9e3ceaef5emsh58cb033407ace61p16ab76jsn5510af64ae15'
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
      return errorParse(`${er.toString()}${erCode}`, msg, false, true)
    })
    if (res && res.data) {
      let anal = res.data.description.captions[0]
      let tags = res.data.description.tags
      if (onlyTags && tags.length) {
        if (tags.length > 25) tags.splice(24, tags.length - 25)
        return msg.edit(`I see ${tags.join(', ')}`)
      }
      if (!anal || !anal.text) {
        if (tags.length) {
          if (tags.length > 3) tags.splice(2, tags.length - 3)
          return msg.edit(`I can't really describe the image but I do see ${tags.join(', ')}`)
        }
      } else {
        return msg.edit(`${anal.confidence < 0.4 ? 'I am not really confident, but ' : ''}I think it is ${anal.text} (${Math.ceil(anal.confidence * 100).toString()}% confidence)`).catch(() => {})
      }
      msg.edit(`I really can't describe the image 😳`)
    }
  },
}

