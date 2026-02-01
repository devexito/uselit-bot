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
    //const usage = '`' + this.usage + '`'
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

    const request = fetch(`https://${message.client.config.NONK_PROMT_URL}`, {
      method: 'POST',
      body: untranslated,
    }).then((response) => response.text()).catch(() => {})
    
    await request
      .then((res) => {
        console.log(res)
        const embed = new MessageEmbed()
          .setColor('#3131BB')
          .setTitle('`' + langInput + '` → `' + langOutput + '`')
          .setDescription(shorten(res))

        msg = message
          .editOrReply(null, { embeds: [embed], files: [] })
          .catch((e) => {
            msg = errorParse(e.toString(), message)
          })
      }).catch((err) => {
        console.error(err)
        msg = errorParse('API error! Please try again later', message)
      })

    if (!msg) return errorParse('API returned empty output', message)
    return msg
  },
}