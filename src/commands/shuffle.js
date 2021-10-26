module.exports = {
  name: 'shuffle',
  description: 'Shuffles words around in your message',
  desc: 'Shuffle your words',
  permissions: '',
  aliases: ['s', 'randomize'],
  args: true,
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

    shuffle(args)
    message.reply(args.join(' ').trim())
  },
}