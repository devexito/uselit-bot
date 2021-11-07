const { MessageEmbed } = require('discord.js')
const { errorParse } = require('../../util/util')

module.exports = {
  name: 'help',
  description: 'List all commands or info about a specific command',
  desc: 'This list',
  aliases: ['commands', 'cmd'],
  permissions: '',
  usage: '[command name]',
  async execute(message, args) {
    let { commands } = message.client
    let allcommands = commands
    commands = commands.filter(b => !b.owner)

    const embed = new MessageEmbed()
      .setColor('#3131BB')

    if (!args.length) {
      let spaces = '         ' // 9 spaces
      let commandList = commands.map(command => command.name + spaces.substring(command.name.length) + ' - ' + command.desc)

      embed
        .setTitle('Command List')
        .setDescription('```\n' + commandList.join('\n') + '```')
        .setFooter('Type ' + prefix + 'help [command name] to show more info about a specific command.\nHint: Commands with any text input support message references. Try replying to a message while executing a ">generate", ">shuffle" or ">talk" command without arguments!')
    } else {
      const name = args[0].toLowerCase()
      const command = allcommands.get(name)
          || allcommands.find(c => c.aliases && c.aliases.includes(name))
      
      if (args[0] == 'me') {
        return errorParse('sorry but i don\'t know how to help you, wish i had more than just stupid useless commands code with a lot of crutches', message)
      }

      try {
        embed.setTitle(command.name)
      } catch (e) {
        return errorParse('Invalid Command', message)
      }

      if (command.description) embed.setDescription(command.description)
      if (command.aliases) embed.addField('Aliases', command.aliases.join('\n'))
      if (command.usage) embed.addlField('Usage', '`' + command.usage + '`')
    }

    message.reply({ embeds: [embed] })
  },
}