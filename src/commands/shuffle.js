const { errorParse } = require('../util/util')

module.exports = {
  name: 'shuffle',
  description: 'Shuffles words around in your message',
  desc: 'Shuffle your words',
  permissions: '',
  aliases: ['s', 'randomize'],
  args: true,
  usage: '<message ID|text>',
  async execute(message, args) {
    let isError
    async function messageCheck(input, message) {
        const regEx = /([0-9]{17,21})/
        console.log('eba ' + input + regEx.test(input))
        if (regEx.test(input)) {
          console.log('blya ' + input)
        } else return

      let content
      await message.channel.messages.fetch(input)
        .then(msg => {
          content = msg.content.split(' ')
      }).catch(e => isError = true)

      return content ? content : isError = true
    }

    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        // And swap it with the current element.
        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
      }

      return array
    }

    let msgId = await messageCheck(args[0], message)
    if (isError) return errorParse('Couldn\'t find the message', message)
    if (msgId) args = msgId
    shuffle(args)
    console.log(args)
    message.reply(args.join(' ').trim())
  },
}