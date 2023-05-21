const unirest = require('unirest')
const req = unirest('POST', 'https://pelevin.gpt.dobro.ai/generate/')
const Discord = require('discord.js')
const { errorParse } = require('../util/util')

async function fetchText(message, args, msg = false) {

  if (!args || !args.length) return errorParse('No args?', message)

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
      length: 100
    })

    return new Promise(function(resolve, reject) {
      req.end(async function (res) {
        if (res.error) {
          if (msg) {
            reject('API error: ' + res.error.toString() + '\nPlease try again later!')
          } else {
            reject('Couldn\'t generate text')
          }
          return console.error(res.error)
        } else {
          console.log(req.options.body.prompt)
          resolve({
            res: res.body.replies,
            input: args.join(' ').trim()
          })
        }
      })
    }).catch(async (e) => {
      errorParse(e, message)
      console.error(e)
    })
}

module.exports = {
  fetchText,
}