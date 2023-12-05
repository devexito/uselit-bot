const { errorParse } = require('../../util/util')
const { repliedMessageObject } = require('../../util/message')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'feedback',
  aliases: ['fb', 'report'],
  description: 'Sends a message to bot\'s owner, plus some little info like username and guild ID.',
  desc: 'Contact bot\'s owner',
  permissions: '',
  usage: '<text>',
  args: true,
  cooldown: 10,
  async execute(message, args) {
    let replying = false
    const { FEEDBACK_CHANNEL } = message.client.config

    if (args[0] == 'reply') {
      args.shift()
      replying = true
    }
    args = args.join(' ').trim()

    if (replying) {
      if (!message.client.config.OWNERS.split(' ').includes(message.author.id)) return null
      let msg = await repliedMessageObject(message)
      if (!msg) return null
      if (msg.embeds.length && 
msg.embeds[0].fields && 
msg.embeds[0].fields.length && 
msg.embeds[0].fields[0].value) {
        try {
          let [chId, msgId] = msg.embeds[0].fields[0].value.split(', ')

          message.client.channels.cache.get(chId).messages.cache.get(msgId).reply({ content: `**Feedback Response:** ${args}`, allowedMentions: { repliedUser: true } })
          .then(() => {
            message.react('✅')
            return null
          })
          .catch((e) => {
            message.react('❌')
            return errorParse(e, message)
          })
        } catch (e) {
          console.log(e)
          return null
        }
      }
      return null
    }

    if (args.length < 4 || args.length > 1024) {
      return errorParse('The message must have at least 4 and at most 1024 characters.', message)
    }

    let regEx = /<(a?):[\w]{2,40}:([0-9]{16,21})>/
    if (regEx.test(args)) {
      return errorParse('Avoid sending emotes, they will not be shown anyway.', message)
    }

    let comment = message.content.split(' ')
    comment.shift().trim()

    const embed = new MessageEmbed()
      .setColor('#3131BB')
      .setTitle('Uselit Feedback')
      .setDescription(`
User: **${message.author.tag}**\n(||${message.author.id}||)
Guild: \`${message.guild ? message.guild.name : 'Private message'}\`\n(||${message.guild?.id}||)
Channel: \`${message.channel.name}\`\n(||${message.channel.id}||)
\nMessage:\`\`\`\n${comment.join(' ')}\n\`\`\``)
      .addField('IDs', `${message.channel.id}, ${message.id}`)
    message.client.channels.cache.get(FEEDBACK_CHANNEL).send({ embeds: [embed] })
    return message.editOrReply('Feedback sent.')
  }
}