const { shorten, errorParse, argsError } = require('../../util/util')
const { repliedMessage } = require('../../util/message')

module.exports = {
  name: 'shuffle',
  description: 'Shuffles words around in your message.\n\nSupports message replies.',
  desc: 'Shuffle your words',
  permissions: '',
  aliases: ['s', 'randomize'],
  usage: '<text>',
  async execute(message, args) {
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

    let reply = await repliedMessage(message).catch((e) => console.error(e))
    if (undefined != args && args.length) {
      shuffle(args)
      return message.editOrReply(shorten(args.join(' ').trim(), 2000)).catch(e => errorParse(e.toString(), message))
    } else if (undefined != reply && reply.length) {
      shuffle(reply)
      return message.editOrReply(shorten(reply.join(' ').trim(), 2000)).catch(e => errorParse(e.toString(), message))
    } else {
      return argsError(this, message)
    }
  },
}