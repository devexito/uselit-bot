const axios = require('axios')
const { errorParse } = require('../../util/util')

module.exports = {
  name: 'g2',
  aliases: ['balaboba', 'bal'],
  description: 'Completes text using https://yandex.ru/lab/yalm',
  desc: 'Complete text using Balaboba',
  permissions: '',
  cooldown: 5,
  args: true,
  usage: '<text>',
  owner: true,
  async execute(message, args) {
    const msg = await message.reply('generating text...')
    const request = async () => {
      try {
        return await axios.post('https://zeapi.yandex.net/lab/api/yalm/text3', {
          filter: 1,
          intro: 0,
          query: args.join(' ').trim() + '',
        }, { headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_4) AppleWebKit/605.1.15 ' +
                        '(KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
          'Origin': 'https://yandex.ru',
          'Referer': 'https://yandex.ru/',
          'Connection': 'keep-alive',
        }})
      } catch (error) {
      //  errorParse('API error! Please try again later', message)
        msg.delete()
        console.error(error)
      }
    }

    const response = async () => {
      const text = await request()
      console.log(text)
    
      if (text) {
        console.log(`Got ${Object.entries(text).length} breeds`)
      }
    }

    response()
    /*
    const req = https.request(options, (res) => {
      console.log(`statusCode: ${res.statusCode}`)
      res.on('data', (d) => {
        let output = d.text
    // .replace(/@/g, '@\u200b')
        
        out = args.join(' ').trim() + output
        console.log(out)

        msg.edit(out)
      })
    })
    */
  },
}