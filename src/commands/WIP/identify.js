const axios = require('axios').default
const { errorParse } = require('../../util/util')
const { repliedMessageObject, findImageUrlInMessage } = require('../../util/message')

module.exports = {
  name: 'identify',
  aliases: ['anal'],
  description: 'Identifies an image',
  desc: 'Identify an image',
  permissions: '',
  usage: '<image url/attachment/user mention>',
  cooldown: 10,
  owner: true,
  async execute(message, args) {
    let url
    if (message.attachments.size) {
      args = [ message.attachments.first().url ]
    } else if (message.reference) {
      const repliedMessage = await repliedMessageObject(message)
      if (!repliedMessage) return errorParse('Could not fetch a reply', message)
      url = await findImageUrlInMessage(repliedMessage).catch((e) => {console.error(e)})
      console.log(url)
      
/*
      await message.channel.messages.fetch(message.messageReference.messageId)
      .then(message => {
        if (message.attachments.size) {
          args = [ message.attachments.first().url ]
        }
      }).catch(() => {})
*/

    } else if (args.length && message.mentions.users.size) {
      let mentioned = message.mentions.users.first()
      if (mentioned) args = [ mentioned.avatarURL({ format: 'png' }) || mentioned.displayAvatarURL({ format: 'png' }) ]
    }
    if (url) args = [ url ]
    if (!args || !args.length || args == '') return errorParse('Please provide an attachment, image URL or mention a user', message)

//https://cdn.discordapp.com/attachments/834155990571810826/906941048394227712/b64c642588d1c4469ad9f55c85dfe823.png

    return message.reply(args[0])
    const msg = await message.reply(':thinking:')

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
        url: args[0]
      }
    }

    const res = await axios.request(options).catch((er) => {
      console.error(er)
      errorParse(er.message, message)
    })
    let anal = res.data.description.captions
    if (!anal || !anal.length) return msg.edit('`I really can\'t describe the image\`')
    console.log(anal.text)
    msg.edit(`\`I think it is ${anal.text}, ${anal.confidence < 0.5 ? 'although I am only' : 'I am'} ${Math.ceil(anal.confidence * 100).toString()}% sure\``).catch(() => {})
  },
}