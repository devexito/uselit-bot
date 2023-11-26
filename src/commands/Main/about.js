const { MessageEmbed, version } = require('discord.js')
module.exports = {
  name: 'about',
  aliases: ['info', 'bot', 'botinfo'],
  description: 'Information about this bot',
  desc: 'Who made this',
  permissions: '',
  async execute(message, args) {
    const ownersArray = message.client.config.OWNERS.split('\n')
    let ownersInfo = []
    for (let i in ownersArray) {
      ownersInfo.push(`<@${ownersArray[i]}> (@${message.client.users.cache.get(ownersArray[i]).username})`)
    }
    let prefix = message.guild ? await db.get(`prefix_${message.guild.id}`) : ''
    if (prefix === null || prefix === undefined) prefix = client.config.DEFAULT_PREFIX

    const embed = new MessageEmbed()
      .setColor('#3131BB')
      .addField('Description', `This bot was created by JUE13 as the first experience of creating bots and was never intended for a wide usage. There are some free fun commands, and that is it.`, false)
      .addField('Owners', ownersInfo.join('\n'), true)
      .addField('Discord.js Version', version.toString(), true)
      .addField('Support', 'Use the feedback command', true)
      .addField('Prefix', '@mention or ' + prefix)

      //.addField('Running since', uptime(), true)

      .setTitle('About Uselit')
      
     // .setAuthor(message.author.tag, message.author.displayAvatarURL())
     // .setTimestamp(new Date())
    message.reply({ embeds: [embed] })
  },
}