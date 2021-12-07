const { errorParse } = require('../../util/util')

module.exports = {
  name: 'prune',
  args: true,
  owner: true,
  description: 'Purges messages in a current channel',
  desc: 'Purges messages in a channel',
  aliases: ['p', 'purge', 'clear'],
  permissions: 'administrator',
  async execute(message, args) {
    if (!message.client.config.owners.includes(message.author.id)) return
    const amount = parseInt(args[0]) + 1

    if (isNaN(amount)) {
      return errorParse('Invalid Amount', message)
    } else if (amount <= 1 || amount > 100) {
      return errorParse('please input a number between 1 and 99', message)
    }
    message.channel.bulkDelete(amount, true).catch(err => {
      console.error(err)
      errorParse('Couldn\'t bulk delete the messages: ' + err.message, message)
    })
  },
}