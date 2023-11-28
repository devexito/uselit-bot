const { formatNumber } = require('../../util/util')

module.exports = {
  name: 'ping',
  description: 'Shows message delay',
  desc: 'Pong',
  permissions: '',
  async execute(message) {
    const msg = await message.editOrReply('Pinging...')
    const ping = Math.round(msg.createdTimestamp - message.createdTimestamp)
    return msg.edit(`Pong!\nMessage latency: \`${formatNumber(ping)}ms\`\nHeartbeat: \`${Math.round(message.client.ws.ping)}ms\``)
  }
}