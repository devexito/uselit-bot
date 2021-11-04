module.exports = {
  name: 'foo',
  description: 'foo bar',
  desc: 'bar',
  permissions: '',
  cooldown: -1,
  owner: true,
  async execute(message) {
    message.react('🇧')
    message.react('🇦')
    message.react('🇷')
  },
}