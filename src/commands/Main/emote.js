const { errorParse } = require('../../util/util')

module.exports = {
  name: 'emote',
  description: 'Sends URL of a server emoji',
  desc: 'Image link of a server emoji',
  permissions: '',
  aliases: ['emote', 'emoji', 'enlarge'],
  args: true,
  usage: '<emoji>',
  async execute(message, args) {
    function emoteCheck(input) {
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
    let output
    
    try {
      output = emoteCheck(strIn)
    } catch (e) {
      console.error(e)
      return errorParse('Emote Check Failed', message)
    }

    if (output) {
      return message.editOrReply('https://cdn.discordapp.com/emojis/' + output)
    } else {
      return errorParse('i cannot do this :(', message)
    }
  }
}