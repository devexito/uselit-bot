const { MessageEmbed } = require('discord.js')
const { errorParse, shorten, argsError } = require('../../util/util')
const { repliedMessage } = require('../../util/message')
const { isCyrillic } = require('../../util/util')

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

    untranslated = shorten(untranslated.join(' '), 2000).trim()

    const langInput = isCyrillic(untranslated) ? 'ru' : 'en'
    const langOutput = langInput == 'ru' ? 'en' : 'ru'
    
    let msg

    const response = await fetch(`https://${message.client.config.NONK_PROMT_URL}?to=${langOutput}`, {
      method: 'POST',
      body: untranslated,
    }).catch(() => {})
	
	if (!response.ok) {
		console.log(response)
		msg = errorParse(`API error! Please try again later\n**${response.status.toString()}**: ${response.statusText}`, message)
		return
	}
    
    const text = await response.text()
	console.log(text)
	
	const translatedText = shorten(text)
	if (!translatedText) {
		msg = errorParse('API returned empty output', message)
		return
	}
	
	const embed = new MessageEmbed()
	  .setColor('#3131BB')
	  .setTitle('`' + langInput + '` → `' + langOutput + '`')
	  .setDescription(translatedText)

	msg = message
	  .editOrReply(null, { embeds: [embed], files: [] })
	  .catch((e) => {
		msg = errorParse(e.toString(), message)
	  })

    return msg
  },
}