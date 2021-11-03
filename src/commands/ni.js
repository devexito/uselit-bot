module.exports = {
  name: 'ni',
  description: 'kcoc',
  desc: '.',
  aliases: ['nikitochka'],
  permissions: '',
  owner: true,
  cooldown: 60,
  usage: 'коля коля трахни меня',
  async execute(message) {
    message.reply(`сейчас прилетит... <@350177157550571521>`)
    message.channel.send('<@350177157550571521>')
    message.channel.send('<@350177157550571521> <@350177157550571521> <@350177157550571521>')
  },
}