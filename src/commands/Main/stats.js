const Discord = require('discord.js')
const { execSync } = require('child_process');

const githubURL = 'https://github.com/jue131/uselit-bot'

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
    
    const gitHash = execSync('git rev-parse HEAD').toString().trim()
    const gitHashShort = gitHash.slice(0, 7)

    const embed = new Discord.EmbedBuilder()
      .setColor(0x3131BB)
      .addFields(
        { name: 'Guilds', value: message.client.guilds.cache.size.toString(), inline: true },
        { name: 'Users', value: message.client.users.cache.size.toString(), inline: true },
        { name: 'Commands', value: `${commands.size.toString()} available (${allcommands.size.toString()} total)`, inline: true },

        { name: 'Used/Allocated memory', value: `${memUsed} MB/${memAllocate} MB`, inline: true },
        { name: 'Running since', value: uptime(), inline: true },
        { name: 'Current commit', value: `[\`${gitHashShort}\`](${githubURL}/commit/${gitHash})`, inline: true }
       )

      .setTitle('Bot statistics')
     // .setAuthor(message.author.tag, message.author.displayAvatarURL())
     // .setTimestamp(new Date())
    message.reply({ embeds: [embed] })
  },
}