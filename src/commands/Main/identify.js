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
    let url
    let mess = undefined
    if (message.attachments.size) {
      url = message.attachments.first().url
    } else if (message.reference) {
      const repliedMessage = await repliedMessageObject(message)
      if (!repliedMessage) return errorParse('Could not fetch a reply', message)
      url = await findImageUrlInMessage(repliedMessage).catch((e) => {
        errorParse('Error searching for an image in referenced message', message)
        return console.error(e)
      })
    } else if (args.length && message.mentions.users.size) {
      let mentioned = message.mentions.users.first()
      if (mentioned) url = mentioned.avatarURL({ format: 'png' }) || mentioned.displayAvatarURL({ format: 'png' })
    } else if (!args || !args.length || args == '') {
      [url, mess] = await findImageUrlInMessageHistory(message, true)
    }
    if (url) {
      if (!validateUrl(url)) {
        return errorParse('Malformed URL', message)
      }
    } else if (validateUrl(args)) {
      url = args[0]
    } else return errorParse('Please provide an attachment, image URL or a user mention', message)

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
      console.error(er)
      if (er.response.data) {
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
      if (!anal || !anal.text) return errorParse('No output received from API', msg, false, true)
      msg.edit(`\`I think it is ${anal.text}, ${anal.confidence < 0.5 ? 'although I am only' : 'I am'} ${Math.ceil(anal.confidence * 100).toString()}% sure\``).catch(() => {})
    }
  },
}

