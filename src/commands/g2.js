const unirest = require('unirest')
const req = unirest('POST', 'https://pelevin.gpt.dobro.ai/generate/')


module.exports = {
  name: 'g2',
  aliases: ['balaboba', 'bal'],
  description: 'Completes text using https://yandex.ru/lab/yalm',
  desc: 'Completes text using Balaboba',
  permissions: '',
  cooldown: 5,
  args: true,
  usage: '<text>',
  owner: true,
  async execute(message, args, client, disbut, generateController) {
    const msg = await message.reply('generating text...')
    
    req.query({
      'Accept-Encoding': 'gzip, deflate, br',
      'content-type': 'text/plain;charset=UTF-8'
    })

    req.headers({
      'content-type': 'application/json',
    })

    req.type('json')
    req.send(args.join(' ').trim() + '')
  },
}