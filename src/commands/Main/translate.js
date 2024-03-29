const unirest = require('unirest')
const { MessageEmbed } = require('discord.js')
const { errorParse, shorten, argsError } = require('../../util/util')
const { repliedMessage } = require('../../util/message')
const langList = [ 'af', 'am', 'ar', 'as', 'az', 'bg', 'bn', 'bs', 'ca', 'cs', 'cy', 'da', 'de', 'el', 'en', 'es', 'et', 'fa', 'fi', 'fil', 'fj', 'fr', 'fr-ca', 'ga', 'gu', 'he', 'hi', 'hr', 'ht', 'hu', 'hy', 'id', 'is', 'it', 'iu', 'ja', 'kk', 'km', 'kmr', 'kn', 'ko', 'ku', 'lo', 'lt', 'lv', 'lzh', 'mg', 'mi', 'ml', 'mr', 'ms', 'mt', 'mww', 'my', 'nb', 'ne', 'nl', 'or', 'otq', 'pa', 'pl', 'prs', 'ps', 'pt', 'pt-pt', 'ro', 'ru', 'sk', 'sl', 'sm', 'sq', 'sr-cyrl', 'sr-latn', 'sv', 'sw', 'ta', 'te', 'th', 'ti', 'tlh-latn', 'tlh-piqd', 'to', 'tr', 'ty', 'uk', 'ur', 'vi', 'yua', 'yue', 'zh-hans', 'zh-hant' ]

module.exports = {
  name: 'translate',
  aliases: ['tr'],
  description: `Translates text using Microsoft Bing Translate\nSupported languages: \`${langList.join('`, `')}\``,
  desc: 'Translate text with Bing',
  permissions: '',
  args: true,
  usage: '<lang in ISO format> <text>',
  typing: true,
  async execute(message, args) {
    const usage = '`' + this.usage + '`'
    let [ langInput, ...untranslated ] = args
    langInput = langInput.toLowerCase()

    if (!langList.includes(langInput)) {
      return errorParse('Unsupported language. Language List: `' + langList.join('`, `') + '`', message, usage)
    }
    
    const reqTr = unirest('POST', 'https://microsoft-translator-text.p.rapidapi.com/translate')


    //start of bing translate code
    reqTr.query({
      'to': langInput,
      'api-version': '3.0',
      'profanityAction': 'NoAction',
      'textType': 'plain'
    })

    reqTr.headers({
      'content-type': 'application/json',
      'x-rapidapi-key': message.client.config.BING_KEY,
      'x-rapidapi-host': 'microsoft-translator-text.p.rapidapi.com',
      'useQueryString': true
    })
/*
    let textToTranslate = args
    textToTranslate.splice(0, 1)
*/
    let reply = await repliedMessage(message).catch((e) => console.error(e))
    if (undefined != untranslated && untranslated.length) {
    } else if (undefined != reply && reply[0] !== '' && reply.length) {
      untranslated = reply
    } else {
      return argsError(this, message)
    }
    untranslated = untranslated.join(' ')
    
    reqTr.type('json')
    reqTr.send([
      {
        'Text': '' + untranslated.trim() + ''
      }
    ])
    let msg

    reqTr.end((res) => {
      if (res.error) {
        console.error(res.error)
        msg = errorParse('API error! Please try again later', message)
        return msg
      }
      let outFrom
      
      try {
        outFrom = res.body.map(a => a.detectedLanguage['language'])
      } catch (e) {
        console.error(e)
        msg = errorParse(e.toString(), message)
        return msg
      }
      let output = res.body.map(a => a.translations.map(b => b.text)[0])

      const embed = new MessageEmbed()
        .setColor('#3131BB')
      
      let parsedOutText = ''

      if (!output) {
        msg = errorParse('API returned empty output', message)
        return msg
      } else {

        parsedOutText = shorten(output[0])

        embed.setTitle('`' + outFrom[0] + '` → `' + langInput + '`')
          .setDescription(parsedOutText)

        msg = message.editOrReply(null, { embeds: [embed], files: [] }).catch((e) => {
          msg = errorParse(e.toString(), message)
        })
      }
    })
    console.log(msg)
    return msg
    
    //end of bing translate code
  },
}