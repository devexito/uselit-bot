const { argsError } = require('../../util/util')
const { repliedMessage } = require('../../util/message')
const { translateText, sendMessage } = require('../../services/translateText')

module.exports = {
  name: 'translate',
  aliases: ['tr'],
  description: `Translates text using PROMT 7.8. Only English and Russian are supported.\nThanks to @nonk123 for hosting this API.`,
  desc: 'Translate text with PROMT',
  permissions: '',
  usage: '<text>',
  typing: true,
  async execute(message, args) {
    let untranslated = args

    let reply = await repliedMessage(message).catch((e) => console.error(e))
    if (undefined != untranslated && untranslated.length) {
    } else if (undefined != reply && reply[0] !== '' && reply.length) {
      untranslated = reply
    } else {
      return argsError(this, message)
    }

    const text = await translateText(untranslated, message)
    if (text === undefined) {
      return
    }

    //console.log(text)
    
    return sendMessage(text, message)
  },
}