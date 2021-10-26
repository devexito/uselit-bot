const Embed = require('../services/embedConstructor.js')
module.exports = {
  name: 'info',
  aliases: ['stats', 'bot', 'botinfo'],
  description: 'Shows a little information about bot',
  permissions: '',
  async execute(message, args, client) {
    let { commands } = message.client
    let allcommands = commands
    commands = commands.filter(b => !b.owner)
    const used = process.memoryUsage();
    async function mem(key) {
      return Math.round(used[key] / 1024 / 1024 * 100) / 100
    } 
    const memUsed = await mem('heapUsed')
    const memAllocate = await mem('heapTotal')
    async function uptime() {
      let a = client.readyAt - 1
      a = a.toString()
      a = a.slice(0, a.length - 3)
     // let b = Math.floor(process.uptime())
      return `<t:${a}:R>`
    }

    let embed = new Embed()
      .color('#0019B9')
      .field('Guilds', client.guilds.cache.size, true)
      .field('Users', client.users.cache.size, true)
      .field('Commands', `${commands.size} (${allcommands.size})`, true)

      .field('Used memory', memUsed + ' MB', true)
      .field('Allocated memory', memAllocate + ' MB', true)
      .field('Uptime', await uptime(), true)
     // .title(thisChannel.name)
      .author(message.author.tag, message.author.displayAvatarURL())
      .timestamp()
      .build()
    message.reply({ embed })
  },
}