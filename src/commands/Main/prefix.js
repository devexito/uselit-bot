const { errorParse } = require('../../util/util')
const defaultPrefix = require('dotenv').config().parsed.DEFAULT_PREFIX
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'prefix',
  description: `Changes the bot prefix in a current server.\nDefault bot prefix is \`${defaultPrefix}\``,
  desc: 'Change bot prefix',
  permissions: 'MANAGE_GUILD',
  ignore_dms: true,
  args: true,
  usage: '<new prefix>',
  async execute(message, args) {
    if (args[0].length > 20) {
      return errorParse('Too long prefix!', message)
    }
    const newPrefix = await db.set(`prefix_${message.guild.id}`, args[0])

    let desc = `The bot prefix has been successfully updated to \`${newPrefix}\`.`
    if (newPrefix != defaultPrefix) {
      desc += `\nYou can change the prefix back by running \`${newPrefix}prefix ${defaultPrefix}\``
    }

    const embed = new MessageEmbed()
      .setColor('#3131BB')
      .setTitle('✅ Prefix updated')
      .setDescription(desc)
    return message.editOrReply(null, { embeds: [embed], files: [] })
  }
}