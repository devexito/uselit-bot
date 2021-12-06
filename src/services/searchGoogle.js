const unirest = require('unirest')
const { MessageEmbed } = require('discord.js')
const { shorten, errorParse } = require('../util/util')
const key = '5620bc919dmshbe00ec9bdd7aecbp1ed69ajsna0fc5570197f'

async function fetchText(message, args, msg = false) {

  if (!args || !args.length) return errorParse('No args?', message)

  let txt = encodeURI(shorten(args.join(' ').trim(), 240))
  var req = unirest('GET', `https://google-search3.p.rapidapi.com/api/v1/search/q=${txt}&num=100`)

  req.headers({
    'x-user-agent': 'desktop',
    'x-proxy-location': 'US',
    'x-rapidapi-host': 'google-search3.p.rapidapi.com',
    'x-rapidapi-key': key,
    'useQueryString': true
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
        resolve({
          res: res.body.results,
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