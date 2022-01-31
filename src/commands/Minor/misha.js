module.exports = {
  name: 'misha',
  description: 'reference',
  desc: '.',
  owner: true,
  async execute(message) {
    if (message.author.id == '342247854875738113') {
      return message.reply('Ща припездует! undefined')
    } else if (message.author.id == '350177157550571521') {
      return message.reply('Тебе фиш нужен? Держи <@296159764151402496>')
    } else {
      message.channel.send(`Ща припездует! <@342247854875738113>`)
    }
  },
}