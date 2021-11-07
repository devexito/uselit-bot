const unirest = require('unirest')
// const ctkey = '00IGfYo3R5USlx45tAVLoAAid'
const { errorParse } = require('../../util/util')
const { repliedMessage } = require('../../util/message')
const XRegExp = require('xregexp')

module.exports = {
  name: 'talk',
  aliases: ['t', 'talk', 'chat'],
  description: 'Chatbot. Supported by api.affiliateplus.xyz\n\nSupports message replies.',
  desc: 'Chatbot that works?..',
  permissions: '',
  cooldown: 3,
  usage: '<text>',
  async execute(message, args, client) {
    let reply = await repliedMessage(message).catch((e) => console.error(e))
    if (undefined != args && args.length) {
    } else if (undefined != reply && reply[0] !== '' && reply.length) {
      args = reply
    } else {
      return errorParse('No text provided', message)
    }

    args = args.join(' ')

    function detectLanguage(text) {
      // split into words
      const langs = text.trim().split(/\s+/).map(word => {
        return detect(word)
      })

      // pick the lang with the most occurances
      return (langs || []).reduce( ( acc, el ) => {
        acc.k[el] = acc.k[el] ? acc.k[el] + 1 : 1
        acc.max = acc.max ? acc.max < acc.k[el] ? el : acc.max : el
        return acc  
      }, { k:{} }).max

      function detect(text) {
        const scores = {}

        // https://en.wikipedia.org/wiki/Unicode_block
        // http://www.regular-expressions.info/unicode.html#script
        const regexes = {
          // en: /[a-zA-Z]+/gi,
          English: XRegExp('\\p{Latin}', 'gi'),
          Chinese: XRegExp('\\p{Han}', 'gi'),
          Hindi: XRegExp('\\p{Devanagari}', 'gi'),
          Arabic: XRegExp('\\p{Arabic}', 'gi'),
          Bengal: XRegExp('\\p{Bengali}', 'gi'),
          Hebrew: XRegExp('\\p{Hebrew}', 'gi'),
          Russian: XRegExp('\\p{Cyrillic}', 'gi'),
          Japanese: XRegExp('[\\p{Hiragana}\\p{Katakana}]', 'gi'),
          Punjabi: XRegExp('\\p{Gurmukhi}', 'gi')
        }

        for (const [lang, regex] of Object.entries(regexes)) {
          // detect occurances of lang in a word
          let matches = XRegExp.match(text, regex) || []
          let score = matches.length / text.length

          if (score) {
            // high percentage, return result
            if (score > 0.85) {
              return lang
            }
            scores[lang] = score
          }
        }

        // not detected
        if (Object.keys(scores).length == 0)
          return 'English'

        // pick lang with highest percentage
        return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b)
      }
    }

    let detectedLang
    let text = encodeURI(args)
    try {
      detectedLang = detectLanguage(args)
      console.log(detectedLang)
    } catch (a) {
      detectedLang = 'English'
      console.error(a)
    }

    // chatbot api
    const req = unirest('GET', `https://api.affiliateplus.xyz/api/chatbot?message=${text}&botname=${client.user.username}&language=${detectedLang}&gender=male&user=1`)

    req.headers({
      'content-type': 'application/json'
    })

    req.type = 'json'
    req.timeout = 10000
    req.send()

    req.end(function (res) {

      let out = ''

      switch (res.code) { // оьвалыьлдваьплдьвлдпватлдпвалдтоьплд
        case 500:
          out = 'Oops! Something weird happened. Please try again.'
        break
        
        case 400:
          out = 'You wanna send a null message?'
        break
        
        case 429:
          out = 'Too many requests! Please try again later.'
        break
        
        default:
          if (res.error) {
            out = 'API ' + res.error
          }
          else if (res.body.error) {
            out = `API Response: \`${res.body.error}\``
          }
          else {
            out = res.body.response
          }
        break
      }

      if (res.ok) {
        message.reply(res.body.message).catch(e => errorParse(e.toString(), message))
      } else {
        try {
          errorParse(out, message)
          console.log(`'${text}' - ${res.body.response}`)
        }
        catch (e) {
          errorParse('Empty response.', message)
          console.log(e)
        }
      }
    })
  },
}