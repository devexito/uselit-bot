const { MessageEmbed, version } = require('discord.js')
module.exports = {
  name: 'about',
  aliases: ['info', 'bot', 'botinfo'],
  description: 'Information about this bot',
  desc: 'Who made this',
  permissions: '',
  async execute(message, args) {
    const ownersArray = message.client.config.OWNERS.split(' ')
    let ownersInfo = []
    for (let i in ownersArray) {
      ownersInfo.push(`<@${ownersArray[i]}> (@${message.client.users.cache.get(ownersArray[i]).username})`)
    }
    let prefix = message.guild ? await db.get(`prefix_${message.guild.id}`) : ''
    if (!prefix) prefix = message.client.config.DEFAULT_PREFIX

    const revision = require('child_process')
      .execSync('git rev-parse HEAD')
      .toString().trim()
      .slice(0, 7)

    const embed = new MessageEmbed()
      .setColor('#3131BB')
      .addField('Description', `This bot was created by JUE13 as the first experience of creating bots and was never intended for a wide usage. There are some free fun commands, and that is it.`, false)
      .addField('Owners', ownersInfo.join('\n'), true)
      .addField('Support', 'Use the feedback command', true)
      .addField('Prefix', '@mention or ' + prefix, true)
      .addField('Source', 'https://github.com/devexito/uselit-bot', true)
      .addField('Commit', revision, true)
      .addField('Discord.js Version', version.toString(), true)

      .setTitle('About Uselit')
      
     // .setAuthor(message.author.tag, message.author.displayAvatarURL())
     // .setTimestamp(new Date())
    return message.editOrReply(null, { embeds: [embed], files: [] })
  },
}