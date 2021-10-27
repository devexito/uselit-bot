const unirest = require('unirest')
const req = unirest('POST', 'https://pelevin.gpt.dobro.ai/generate/')
const { errorParse } = require('../util/util')

  async function fetchText({
    message,
    args,
    msg = false
  }) {
    
    req.query({
      'Accept-Encoding': 'gzip, deflate, br',
      'content-type': 'text/plain;charset=UTF-8'
    })

    req.headers({
      'content-type': 'application/json',
      'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7'
    })
    
    req.type('json')
    req.send({
      prompt: '' + args.join(' ').trim() + '',
      length: 60
    })

    req.end(async function (res) {
      if (res.error) {
        if (msg) {
          errorParse('API error! Please try again later', message)
          await msg.delete()
        }
        return console.error(res.error)
      }

// let output =
      return res.body.replies
    })
  }

module.exports = {
  fetchText
}