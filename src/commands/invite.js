const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'invite',
  aliases: ['invite'],
  description: 'Provides a link which can be used to invite this bot to your servers.',
  desc: 'Invite this bot',
  permissions: '',
  async execute(message) {
    const embed = new MessageEmbed()
      .setColor('#3131BB')
      .setDescription('[Click here to invite me!](https://discord.com/api/oauth2/authorize?client_id=774605566793875476&permissions=363584&scope=bot)')
    await message.reply({ embeds: [embed] })
  },
}