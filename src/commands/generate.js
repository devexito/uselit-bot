const unirest = require('unirest')
const req = unirest('POST', 'https://pelevin.gpt.dobro.ai/generate/')
const { getRandomInt } = require('../util/util')
const { errorParse } = require('../util/util')

module.exports = {
  name: 'generate',
  aliases: ['g', 'gen'],
  description: 'Completes text using Порфирьевич',
  permissions: '',
  cooldown: 5,
  args: true,
  usage: '<text>',
  typing: true,
  async execute(message, args, client, disbut) {
      const msg = await message.reply('generating text...')
      
      req.query({
        "Accept-Encoding": "gzip, deflate, br",
        "content-type": "text/plain;charset=UTF-8"
      })

      req.headers({
        "content-type": "application/json",
        "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7"
      })
      
      req.type("json")
      req.send({
        prompt: "" + args.join(' ').trim() + "",
        length: 60
      })

      req.end(async function (res) {
        if (res.error) {
          errorParse('API error! Please try again later', message)
          msg.delete()
          return console.error(res.error)
        }
        let output = res.body.replies
        
        randomNumber = getRandomInt(3)
     // .replace(/@/g, '@\u200b')
        
        out = args.join(' ').trim() + output.splice(randomNumber, 1)
       // console.log(out)

        msg.edit(out)
      })
  },
}