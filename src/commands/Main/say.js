module.exports = {
  name: 'say',
  description: 'Sends a message with arguments as message content, and deletes author message',
  desc: 'Send a message as bot',
  permissions: 'MANAGE_MESSAGES',
  args: true,
  usage: '<text>',
  async execute(message, args) {
    let text = args.join(' ').trim()
    
    message.delete().catch((e) => console.log(e))
    
    return message.channel.send(text).catch(() => message.react('🚽'))
  },
}