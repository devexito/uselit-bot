module.exports = {
  name: 'sparrow',
  aliases: ['spar', 'fredrik', 'life'],
  desc: '.',
  owner: true,
  description: 'the man',
  async execute(message) {
    if (message.author.id == '371199011094528000') return message.reply('это твоя команда...')
    message.channel.send(`hey <@371199011094528000>, ${message.author.username} has a crush on you. 💘\nwould you like to take their present? (they have to tell you what is the present) (please take it)`)
  },
}