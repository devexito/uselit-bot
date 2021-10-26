const config = require('../config.js')
const Embed = require('../services/embedConstructor.js')
const prefix = config.defaultPrefix
const { errorParse } = require('../util/util')

module.exports = {
  name: 'help',
  description: 'List all commands or info about a specific command',
  aliases: ['commands', 'cmd'],
  permissions: '',
  usage: '[command name]',
  async execute(message, args) {
    const data = []
    let { commands } = message.client
    let allcommands = commands
    commands = commands.filter(b => !b.owner)
    
    let embed = new Embed()
      .color('#2f3136')

    if (!args.length) {
      embed = embed
        .title('Command List')
        .description(commands.map(command => command.name).join('\n'))
        .footer('Type ' + prefix + 'help [command name] to show more info about a specific command.')

    //  message.reply('List of all commands:\n```\n' + commands.map(command => command.name).join(', ') + '```\nType "' + prefix + 'help [command name]" to show more info about a specific command')
    } else {
      const name = args[0].toLowerCase()
      const command = allcommands.get(name)
          || allcommands.find(c => c.aliases && c.aliases.includes(name))
      
      if (args[0] == 'me') {
        return errorParse('sorry but i don\'t know how to help you, wish i had more than just stupid useless commands code with a lot of crutches', message)
      }

      try {
        embed = embed.title(command.name)
      } catch (e) {
        return errorParse('Invalid Command', message)
      }

      if (command.description) embed = embed.description(command.description)
      if (command.aliases) embed = embed.field('Aliases', command.aliases)
      if (command.usage) embed = embed.field('Usage', '`' + command.usage + '`')
    }

    embed = embed.build()
    message.reply({ embed })
  },
}