const config = require('../config.js')
const { errorParse } = require('../util/util')

module.exports = {
  name: 'prune',
  args: true,
  owner: true,
  description: 'Shows avatar of mentioned user',
  aliases: ['p', 'purge', 'clear'],
  permissions: 'administrator',
  async execute(message, args) {
    if (message.author.id !== config.ownerID) return
    const amount = parseInt(args[0]) + 1

    if (isNaN(amount)) {
      return errorParse('Invalid Amount', message)
    } else if (amount <= 1 || amount > 100) {
      return errorParse('please input a number between 1 and 99', message)
    }
    message.channel.bulkDelete(amount, true).catch(err => {
      console.error(err)
      errorParse('❗an error has occurred while trying to evaluate the command', message)
    })
  },
}