const { errorParse } = require('../util/util')

async function repliedMessage(message) {
  if (!message.reference) return
  const msg = await message.channel.messages.fetch(message.reference.messageId).catch((e) => console.error(e))
  if (!msg || message.deleted) return
  let content = msg.content.replace(/ +(?= )/g,'').split(' ')

  if (msg.embeds.length > 0) {
    if (msg.embeds[0].description) {
      content = msg.embeds[0].description.replace(/ +(?= )/g,'').split(' ')
    } else {
    //  errorParse('Found empty description in embed. Only embed descriptions are supported yet', message)
      return
    }
  }

  return content[0] !== '' ? content : null
}

module.exports = { repliedMessage }