const { MessageEmbed } = require('discord.js')
module.exports = {
  name: 'stats',
  aliases: ['info', 'bot', 'botinfo'],
  description: 'Shows a little information about bot',
  desc: 'Stats for nerds',
  permissions: '',
  async execute(message, args) {
    let { commands } = message.client
    let allcommands = commands
    commands = commands.filter(b => !b.owner)

    const used = process.memoryUsage()
    function mem(key) {
      return Math.round(used[key] / 1024 / 1024 * 100) / 100
    } 
    const memUsed = await mem('heapUsed').toString()
    const memAllocate = await mem('heapTotal').toString()

    function uptime() {
      let a = message.client.readyAt - 1
      a = a.toString()
      a = a.slice(0, a.length - 3)
      return `<t:${a}:R>`
    }

    const embed = new MessageEmbed()
      .setColor('#3131BB')
      .addField('Guilds', message.client.guilds.cache.size.toString(), true)
      .addField('Users', message.client.users.cache.size.toString(), true)
      .addField('Commands', `${commands.size.toString()} (${allcommands.size.toString()})`, true)

      .addField('Used/Allocated memory', `${memUsed} MB/${memAllocate} MB`, true)
      .addField('Running since', uptime(), true)

      .setTitle('Bot statistics')
     // .setAuthor(message.author.tag, message.author.displayAvatarURL())
     // .setTimestamp(new Date())
    message.reply({ embeds: [embed] })
  },
}