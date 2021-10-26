module.exports = {
  name: 'say',
  description: 'Sends a message with arguments as message content, and deletes author message',
  permissions: '',
  args: true,
  usage: '<text>',
  async execute(message, args) {
    let text = args.join(' ').trim()
    
    try {
      message.delete()
    } catch (e) {
      console.log(e)
    }
    message.channel.send(text).catch(() => message.react('🚽'))
  },
}