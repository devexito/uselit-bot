const { readdirSync } = require('fs')
const { join } = require('path')
const { errorParse } = require('../../util/util')

module.exports = {
  name: 'reload',
  owner: true,
  description: 'Can only be used by a bot\'s owner',
  desc: '.',
  aliases: ['rel'],
  args: true,
  async execute(message, args) {
    if (!owners.includes(message.author.id)) {
      return errorParse('⛔ Missing Access', message)
    }

    const commandName = args[0].toLowerCase()
    const command = message.client.commands.get(commandName)
      || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

    if (!command) return errorParse(`Cannot find command \`${commandName}\``, message)
    readdirSync(join(__dirname, '..')).forEach(f => {
      const files = readdirSync(join(__dirname, '..', f))
      if (files.includes(`${command.name}.js`)) {
        const file = `../${f}/${command.name}.js`
        try {
          delete require.cache[require.resolve(file)]
          const newCommand = require(file)
          message.client.commands.set(newCommand.name, newCommand)
      
          message.reply(`✅ Command \`${command.name}\` successfully reloaded`)
        } catch (err) {
          console.error(err.stack || err)
          return errorParse(`Reload Failure:\n\`${err.message}\``, message)
        }
      }
    })
  },
}