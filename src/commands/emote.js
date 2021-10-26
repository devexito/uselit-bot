const { errorParse } = require('../util/util')

module.exports = {
  name: 'emote',
  description: 'Sends URL of a server emoji',
  desc: 'Image link of a server emoji',
  permissions: '',
  aliases: ['e', 'emote', 'emoji', 'enlarge'],
  args: true,
  usage: '<emoji>',
  async execute(message, args) {
    async function emoteCheck(input) {
      var regEx = /<(a?):[\w]{2,40}:([0-9]{16,21})>/
      if (regEx.test(input)) {
        let format = '.png'
        if (regEx.exec(input)[1] === 'a') {
          format = '.gif'
        }
        return regEx.exec(input)[2] + format
      } else {
        return ''
      }
    }

    let strIn = args.join('')

    let output = await emoteCheck(strIn).catch((e) => {
      errorParse('Emote Check Fail', message)
      console.error(e)
    })

    if (output) {
      message.channel.send('https://cdn.discordapp.com/emojis/' + output)
   //   console.log(output)
    } else {
      errorParse('i cannot do this :(', message)
    }
  }
}