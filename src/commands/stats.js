const Embed = require('../services/embedConstructor.js')
module.exports = {
  name: 'stats',
  aliases: ['info', 'bot', 'botinfo'],
  description: 'Shows a little information about bot',
  desc: 'Stats for nerds',
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
      .field('Guilds', client.guilds.cache.size.toString(), true)
      .field('Users', client.users.cache.size.toString(), true)
      .field('Commands', `${commands.size.toString()} (${allcommands.size.toString()})`, true)

      .field('Used memory', memUsed.toString() + ' MB', true)
      .field('Allocated memory', memAllocate.toString() + ' MB', true)
      .field('Running since', await uptime(), true)

      .title('Bot statistics')
      .author(message.author.tag, message.author.displayAvatarURL())
      .timestamp()
      .build()
    message.reply({ embeds: [embed] })
  },
}