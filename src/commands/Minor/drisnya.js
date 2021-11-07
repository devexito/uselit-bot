const { errorParse } = require('../../util/util')
module.exports = {
  name: 'drisnya',
  description: 'useless message',
  desc: '.',
  permissions: '',
  aliases: ['dnise', 'juj'],
  usage: '<text>',
  cooldown: 99999,
  owner: true,
  async execute(message) {
    if (message.author.id == '346230037105868810') return errorParse('undefined is not defined', message)
    message.channel.send(`Ща припездует!   <@346230037105868810> <@346230037105868810> <@346230037105868810>   <@346230037105868810> <@346230037105868810>`)
  },
}