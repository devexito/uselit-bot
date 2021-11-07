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
  permissions: 'owner',
  async execute(message, args) {
    if (message.author.id !== message.client.config.ownerID) {
      return errorParse('⛔ Missing Access', message)
    }

    const commandName = args[0].toLowerCase()
    const command = message.client.commands.get(commandName)
      || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

    if (!command) return errorParse(`Cannot find command \`${commandName}\``, message)
    readdirSync(join(__dirname, '..')).forEach(f => {
      const files = readdirSync(join(__dirname, '..', f))
      if (files.includes(`${commandName}.js`)) {
        const file = `../${f}/${commandName}.js`
        try {
          delete require.cache[require.resolve(file)]
          const newCommand = require(file)
          message.client.commands.set(newCommand.name, newCommand)
      
          console.log(`Обновляю ${command.name}`)
          message.reply(`✅ Command \`${command.name}\` successfully reloaded`)
        } catch (err) {
          console.error(err.stack || err)
          return errorParse(`Reload Fail:\n\`${err.message}\``, message)
        }
      }
    })
  },
}