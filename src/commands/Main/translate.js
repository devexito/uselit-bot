const bingkey = '9e3ceaef5emsh58cb033407ace61p16ab76jsn5510af64ae15'
const unirest = require('unirest')
const { MessageEmbed } = require('discord.js')
const { errorParse, shorten } = require('../../util/util')
const { repliedMessage } = require('../../util/message')
const langList = [ 'af', 'am', 'ar', 'as', 'az', 'bg', 'bn', 'bs', 'ca', 'cs', 'cy', 'da', 'de', 'el', 'en', 'es', 'et', 'fa', 'fi', 'fil', 'fj', 'fr', 'fr-ca', 'ga', 'gu', 'he', 'hi', 'hr', 'ht', 'hu', 'hy', 'id', 'is', 'it', 'iu', 'ja', 'kk', 'km', 'kmr', 'kn', 'ko', 'ku', 'lo', 'lt', 'lv', 'lzh', 'mg', 'mi', 'ml', 'mr', 'ms', 'mt', 'mww', 'my', 'nb', 'ne', 'nl', 'or', 'otq', 'pa', 'pl', 'prs', 'ps', 'pt', 'pt-pt', 'ro', 'ru', 'sk', 'sl', 'sm', 'sq', 'sr-cyrl', 'sr-latn', 'sv', 'sw', 'ta', 'te', 'th', 'ti', 'tlh-latn', 'tlh-piqd', 'to', 'tr', 'ty', 'uk', 'ur', 'vi', 'yua', 'yue', 'zh-hans', 'zh-hant' ]

module.exports = {
  name: 'translate',
  aliases: ['tr'],
  description: `Translates text using Microsoft Bing Translate\nSupported languages: \`${langList.join('`, `')}\``,
  desc: 'Translate text with Bing',
  permissions: '',
  args: true,
  usage: '<lang in short> <text>',
  typing: true,
  async execute(message, args) {
    const usage = this.usage
    if (!args[1] && args[0]) return errorParse('Invalid Arguments', message, usage)

    const langInput = args[0].toLowerCase()
    if (!langList.includes(langInput)) {
      return errorParse('Unsupported language. Language List: `' + langList.join('`, `') + '`', message, usage)
    }
    
    const reqTr = unirest('POST', 'https://microsoft-translator-text.p.rapidapi.com/translate')

/*
    const regex = /-from (\w{2,4}(-\w{2,4})?)/g
    if (!regex.test(args)) {
      inputFrom = ''
    } else if (!regex.test(args)) {
      return errorParse('❗*Unsupported language* :( *Needs to be one of the following:* `' + langList.join('`, `') + '`', message)
    } else {
      regex.exec(args)[1]
      console.log(
      const inputFrom = [1]
    }
*/
    //start of bing translate code
    reqTr.query({
      'to': args[0],
      'api-version': '3.0',
      'profanityAction': 'NoAction',
      'textType': 'plain'
    })

    reqTr.headers({
      'content-type': 'application/json',
      'x-rapidapi-key': bingkey,
      'x-rapidapi-host': 'microsoft-translator-text.p.rapidapi.com',
      'useQueryString': true
    })

    let textToTranslate = args
    textToTranslate.splice(0, 1)
    textToTranslate = textToTranslate.join(' ')
    
    reqTr.type('json')
    reqTr.send([
      {
        'Text': '' + textToTranslate.trim() + ''
      }
    ])

    reqTr.end(function (res) {
      if (res.error) {
        errorParse('API error! Please try again later', message)
        return console.error(res.error)
      }
      let outFrom
      
      try {
        outFrom = res.body.map(a => a.detectedLanguage['language'])
      } catch (e) {
        console.error(e)
        return message.reply('error')
      }
      let output = res.body.map(a => a.translations.map(b => b.text)[0])

      const embed = new MessageEmbed()
        .setColor('#3131BB')
      
      let parsedOutText = ''

      if (!output) {
        errorParse('API returned empty output', message)
      } else {
        parsedOutText = shorten(output[0])
        embed.setTitle('`' + outFrom[0] + '` → `' + langInput + '`')
          .setDescription(parsedOutText)
        message.reply({ embeds: [embed] }).catch(e => errorParse(e.toString(), message))
      }
    })
    
    //end of bing translate code
  },
}