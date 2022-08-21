const unirest = require('unirest')
const { MessageEmbed } = require('discord.js')
const { errorParse, shorten, argsError } = require('../../util/util')
const { repliedMessage } = require('../../util/message')
const clm = require('../../util/clm')

module.exports = {
  name: 'ytblock',
  aliases: ['ytb', 'isblocked', 'youtubeblock', 'checkvideo', 'checkvid', 'checkv', 'checkyt', 'checkyoutube', 'isvideoblocked', 'ytblock', 'checkblock'],
  description: 'Check YouTube video restrictions. Supported by unblockvideos.com',
  desc: 'Check yt video restrictions',
  permissions: '',
  cooldown: 3,
  usage: '<text>',
  async execute(message, args) {
    let reply = await repliedMessage(message).catch((e) => console.error(e))
    if (undefined != args && args.length) {
    } else if (undefined != reply && reply[0] !== '' && reply.length) {
      args = reply
    } else {
      return argsError(this, message)
    }

    args = args.join(' ')

    let array
    const regex = /[-A-Za-z0-9_]{11}/gm
    let urls = []

    while ((array = regex.exec(args)) !== null) {
      urls.push(array[0])
    }

    // chatbot api
    const req = unirest('GET', `https://api.unblockvideos.com/youtube_restrictions?id=${urls.join(',')}`)

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
          out = 'This is not a valid YouTube video.'
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
            out = res.body
          }
        break
      }

      if (res.ok) {
        const embed = new MessageEmbed()
          .setColor('#3131BB')
          .setTitle('YouTube Video Restrictions')
        
        let embed_size = 0
        
        let output = res.body
        output.forEach((video) => {
          let blockedCountries = []
          video.blocked.forEach((lang) => {
            let parsed = clm.getCountryNameByAlpha2(lang)
            if (parsed !== undefined) {
              blockedCountries.push(parsed)
            }
          })
          
          if (blockedCountries.length > 210) {
            let list = clm.getAllCountries()
            let allowedCountries = []
            list.forEach((lang) => {
              if (!blockedCountries.includes(lang.name)) {
                allowedCountries.push(lang.name)
              }
            })
            
            let finalout = shorten(allowedCountries.join(', '), 980)
            embed.addField(`${video.title}\n(https://youtu.be/${video.id})`, `Blocked everywhere **except**: ${finalout}`, true)
            
          } else {
            if (blockedCountries.length == 0) {
              embed.addField(`${video.title}\n(https://youtu.be/${video.id})`, 'Video is not blocked in any country', true)
            }
            else if (embed_size < 4000) {
              let finalout = shorten(blockedCountries.join(', '), 1000)
              embed.addField(`${video.title}\n(https://youtu.be/${video.id})`, `Blocked in: ${finalout}`, true)
              embed_size = embed_size + finalout.length
            }
          }
        })
        

        message.reply({ embeds: [embed] })
      } else {
        try {
          errorParse(out, message)
          console.log(`'${args}' - ${res.body}`)
        }
        catch (e) {
          errorParse('Empty response.', message)
          console.log(e)
        }
      }
    })
  },
}