// const Embed = require('../services/embedConstructor.js')

  async function repliedMessage(message) {
    if (message.reference) {
      let content
      await message.channel.messages.fetch(message.reference.messageId)
        .then(msg => {
          if (!message.deleted) content = msg.content.split(' ')
      }).catch(() => {})

      return content ? content : null
    } else return
  }
module.exports = { repliedMessage }