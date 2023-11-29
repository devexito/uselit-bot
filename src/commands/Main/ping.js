const { formatNumber } = require('../../util/util')

module.exports = {
  name: 'ping',
  description: 'Shows message delay',
  desc: 'Pong',
  permissions: '',
  async execute(message) {
    const msg = await message.editOrReply('Pinging...')
    let botTime = message.botReply ? msg.editedTimestamp : msg.createdTimestamp
    let authorTime = message.edited ? message.editedTimestamp : message.createdTimestamp
    const ping = Math.round(botTime - authorTime)
    return msg.edit(`Pong!\nMessage latency: \`${formatNumber(ping)}ms\`\nHeartbeat: \`${Math.round(message.client.ws.ping)}ms\``)
  }
}