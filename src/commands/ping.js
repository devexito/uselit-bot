const { formatNumber } = require('../util/util')

module.exports = {
  name: 'ping',
  description: 'Ping!',
  permissions: '',
  async execute(message, args) {
    const msg = await message.reply('Pinging...')
    const ping = Math.round(msg.createdTimestamp - message.createdTimestamp)
    return msg.edit(`Pong!\nMessage latency: \`${formatNumber(ping)}ms\`\nAverage integral ping to API: \`${Math.round(message.client.ws.ping)}ms\``)
  }
}