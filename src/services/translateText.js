const { MessageEmbed } = require('discord.js')
const { errorParse, shorten } = require('../util/util')
const { isCyrillic } = require('../util/util')

async function translateText(untranslated, message) {
    untranslated = shorten(untranslated.join(' '), 2000).trim()

    const langInput = isCyrillic(untranslated) ? 'ru' : 'en'
    const langOutput = langInput == 'ru' ? 'en' : 'ru'

    const response = await fetch(`https://${message.client.config.NONK_PROMT_URL}?to=${langOutput}`, {
        method: 'POST',
        body: untranslated,
    }).catch(() => {})

    if (!response?.ok) {
        console.log(response)
        let errReason = response === undefined ? 'the api is dead lol.' : `**${response.status.toString()}**: ${response.statusText}`
        errorParse(`API error! Please try again later\n${errReason}`, message)
        return undefined
    }

    const text = await response.text()
    const translatedText = shorten(text)
    if (!translatedText) {
        errorParse('API returned empty output', message)
        return undefined
    }

    return {
        text: translatedText,
        langIn: langInput,
        langOut: langOutput,
    }
}

function sendMessage(textObject, message) {
    const embed = new MessageEmbed()
      .setColor('#3131BB')
      .setTitle('`' + textObject.langIn + '` → `' + textObject.langOut + '`')
      .setDescription(textObject.text)

    let msg = message
      .editOrReply(null, { embeds: [embed], files: [] })
      .catch((e) => {
        msg = errorParse(e.toString(), message)
      })

    return msg
}

module.exports = {
  translateText,
  sendMessage,
}