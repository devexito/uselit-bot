const { emote, getRandomInt } = require('../../util/util')
const Discord = require('discord.js')

module.exports = {
  name: 'sex',
  description: 'Sex a user (or a thing?)',
  desc: 'Sex',
  usage: '[user]',
  typing: true,
  permissions: '',
  async execute(message, args) {
    const randomNumber = getRandomInt(256)
    const virgin = 101 - getRandomInt(101)
    let sexState = 'sexing'
    let user = args
    const embed = new Discord.EmbedBuilder()
      .setColor(0x3131BB)
    
    async function mentionCheck(input, message) {
      input.join('')
      var regEx = /<@\!?([0-9]{17,21})>/
      let output = regEx.exec(input)[1]
      //console.log('blya ' + input + ' da ' + output)

      if (!isNaN(output) && message.client.users.cache.get(output)) {
        return '`' + message.client.users.cache.get(output).username + '`'
      } else return
    }

    if (message.content.includes(message.author.id)) {
      sexState = 'making fun of'
      user = 'yourself'
    } else {
// 1st etap
      user = await mentionCheck(user, message).catch((e) => {})
    }

    if (!user) {
      if (args.length > 0) {
// 2nd etap
        user = '`' + args.join(' ').trim() + '`'
      } else {
// 3rd etap
        user = '`' + message.guild.members.cache.random().user.username + '`'
      }
    }

    embed.setTitle('You are ' + sexState + ' ' + user)
      .setDescription(emote('nice_shit'))
      .addFields(
        { name: 'Sex level', value: randomNumber.toString(), inline: true },
        { name: 'Virgin', value: virgin.toString() + '%', inline: true }
       )
    message.reply({ embeds: [embed] })
  }
}