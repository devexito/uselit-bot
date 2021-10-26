const config = require('../config.js')
const { errorParse } = require('../util/util')

module.exports = {
  name: 'reload',
  owner: true,
  description: 'Can only be used by a bot\'s owner',
  aliases: ['rel'],
  args: true,
  permissions: 'owner',
  async execute(message, args) {
    if (message.author.id !== config.ownerID) {
      return errorParse('⛔ Missing Access', message)
    }

    const commandName = args[0].toLowerCase()
    const command = message.client.commands.get(commandName)
      || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

    if (!command) return errorParse(`Cannot find command \`${commandName}\``, message)
    delete require.cache[require.resolve(`./${command.name}.js`)]
    try {
      const newCommand = require(`./${command.name}.js`)
      message.client.commands.set(newCommand.name, newCommand)
      
      console.log(`Обновляю ${command.name}`)
      message.reply(`✅ Command \`${command.name}\` successfully reloaded`)
      } catch (error) {
      console.error(error)
      errorParse(`Reload Fail:\n\`${error.message}\``, message)
    }
  },
}