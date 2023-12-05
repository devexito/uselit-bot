const { errorParse } = require('../../util/util')

module.exports = {
  name: 'prune',
  args: true,
  description: 'Purges messages in a current channel',
  desc: 'Purges messages in a channel',
  aliases: ['purge', 'clear'],
  permissions: 'MANAGE_MESSAGES',
  usage: '<amount of messages between 1 and 100>',
  ignore_dms: true,
  async execute(message, args) {
    const amount = parseInt(args[0]) + 1

    if (isNaN(amount)) {
      return errorParse('Invalid Amount', message)
    } else if (amount <= 1 || amount > 100) {
      return errorParse('Please input a number between 1 and 100', message)
    }
    message.channel.bulkDelete(amount, true).catch(err => {
      console.error(err)
      return errorParse('Couldn\'t bulk delete the messages: ' + err.message, message)
    })
  },
}