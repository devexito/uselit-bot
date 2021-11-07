module.exports = {
  name: 'foo',
  description: 'foo bar',
  desc: 'bar',
  permissions: '',
  owner: true,
  async execute(message) {
    message.react('🇧')
    message.react('🇦')
    message.react('🇷')
  },
}