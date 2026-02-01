const unirest = require('unirest')
const { MessageEmbed } = require('discord.js')
const { errorParse, shorten, argsError } = require('../../util/util')
const { repliedMessage } = require('../../util/message')

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

    untranslated = shorten(untranslated.join(' '), 2000)

    const cyrillicPattern = /[\u0400-\u045F]+/
    const isCyrillic = cyrillicPattern.test(untranslated)
    const langInput = isCyrillic ? 'en' : 'ru'
    const langOutput = isCyrillic ? 'ru' : 'en'
    
    const reqTr = unirest('POST', 'https://' + message.client.config.NONK_PROMT_URL)

    //start of bing translate code
    reqTr.query({
      'to': langInput
    })

    reqTr.headers({
      'content-type': 'application/json'
    })
    
    reqTr.type('json')
    reqTr.send([
      {
        'data': '' + untranslated.trim() + ''
      }
    ])
    let msg

    reqTr.end((res) => {
      if (res.error) {
        console.error(res.error)
        msg = errorParse('API error: ' + res.error.status + '! Please try again later', message)
        return msg
      }
      const output = res.body[0].data//.map(a => a.translations.map(b => b.text)[0])
      console.log(output)

      const embed = new MessageEmbed()
        .setColor('#3131BB')
      
      let parsedOutText = shorten(output)

      if (!output || typeof parsedOutText !== 'string') {
        msg = errorParse('API returned empty output', message)
        return msg
      } else {
        embed.setTitle('`' + langOutput + '` → `' + langInput + '`')
          .setDescription(parsedOutText)

        msg = message.editOrReply(null, { embeds: [embed], files: [] }).catch((e) => {
          msg = errorParse(e.toString(), message)
        })
      }
    })
    console.log(msg)
    return msg
  },
}