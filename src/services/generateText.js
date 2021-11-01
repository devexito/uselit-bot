const unirest = require('unirest')
const req = unirest('POST', 'https://pelevin.gpt.dobro.ai/generate/')
const { MessageEmbed } = require('discord.js')
const { errorParse } = require('../util/util')

  async function fetchText(message, args, msg = false) {

    if (!args) return errorParse('No args?', message)
    
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

    return new Promise(function(resolve, reject) {
      req.end(async function (res) {
        if (res.error) {
          if (msg) {
            reject('API error! Please try again later')
          } else {
            reject('Couldn\'t generate text')
          }
          return console.error(res.error)
        } else {
          resolve(res.body.replies)
        }
      })
    }).catch(async (e) => {
      errorParse(e, message)
      console.error(e)
    })
  }

  async function embedBase(output, args, page) {
    if (!output) return console.error('no output for embedding pages')
    return new MessageEmbed()
      .setColor('#3131BB')
      .setTitle('Result')
      .setDescription(args.join(' ').trim() + output.splice(output[page - 1], 1))
  }

module.exports = {
  fetchText,
  embedBase,
}