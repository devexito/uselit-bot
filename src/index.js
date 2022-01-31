const { Client, Collection, Intents, MessageEmbed, Permissions } = require('discord.js')
const myintents = new Intents(32767)
myintents.remove(['DIRECT_MESSAGES'])
const client = new Client({ intents: myintents, allowedMentions: { repliedUser: false, parse: ['users'] }})

const { emote, shorten, errorParse, argsError } = require('./util/util.js')
const config = require('./config.js')
prefix = config.defaultPrefix
client.config = config

const { readdirSync } = require('fs')
const { sep } = require('path')
client.cooldowns = new Collection()
client.commands = new Collection()
const { cooldowns } = client

const NickChanger = require('./services/nickChanger')

const load = (dir = './src/commands/') => {
  readdirSync(dir).forEach(dirs => {
    const commandFiles = readdirSync(`${dir}${sep}${dirs}${sep}`).filter(files => files.endsWith('.js'))

    for (const file of commandFiles) {
      const command = require(`./commands/${dirs}/${file}`)
      client.commands.set(command.name, command)
    }
  })
}

load()

client.on('ready', () => {
  console.log(`[READY] Logged in as ${client.user.tag}`)

  if (!config.feedbackChannel) {
    console.error('No feedbackChannel set in config!')
  }

  new NickChanger(client)

  setInterval(() => {
    client.user.setPresence({
      activities: [{
        name: 'the largest amount of undefined', 
        type: 'COMPETING'
      }],
      status: 'online'
    })
  }, 60000) // каждую минуту

  bk = []
})

client.on('messageCreate', async message => {
  // костыль для статуса печатания
  if (message.author.id === client.user.id) {
    return
  } else if (message.content == 'undefined') {
    message.channel.send('undefined.')
    return message.react(emote('dieass')).catch(() => {})
  } else if (message.content == 'null') {
    return message.channel.send('null.')
  } else if (message.content == 'NaN') {
    return message.channel.send('NaN.')
  }

  // ограничения
  if (message.author.bot || !message.guild) return




//  ТУТ ПИЗДЕЦ
//  if (message.author.id == '350177157550571521') return message.reply({ content: 'токсик', allowedMentions: { repliedUser: true } })

  if (bk.length > 0 && bk.includes(message.author.id)) {
    message.react(emote('badklass')).catch(() => {})
  }

  if (message.content.startsWith(`<@${client.user.id}>`) || message.content.startsWith(`<@!${client.user.id}>`) ) {
    const embed = new MessageEmbed()
      .setColor('#3131BB')
      .setTitle(client.user.username)
      .setDescription(`My prefix is \`${prefix}\`\nType \`${prefix}help\` for a list of available commands.`)
    return message.reply({ embeds: [embed] })
  }
  if (!message.content.startsWith(prefix)) return

  const commandBody = message.content.slice(prefix.length)
  const args = commandBody.trim().replace(/ +(?= )/g,'').split(' ')
  const commandName = args.shift().toLowerCase()

  const command = client.commands.get(commandName) 
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

  if (!command) return

  if (command.args && !args.length) {
    return argsError(command, message)
  }
/*
  if (command.permissions && command.permissions.length && !message.author.permissions.has(Permissions.FLAGS[command.permissions])) {
    return errorParse(`This command requires ${command.permissions.join(', ')} permissions.`)
  }
*/
    // COOLDOWNS
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection())
  }

  const now = Date.now()
  const timestamps = cooldowns.get(command.name)
  const cooldownAmount = (command.cooldown || 2) * 1000

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000
      return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`).then(m => setTimeout(() => m.delete(), timeLeft * 1000)).catch(() => {})
    }
  }

  timestamps.set(message.author.id, now)
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)

  // EXECUTION
  await command.execute(message, args)
  .catch((e) => {
    errorParse('**Critical:** ' + e.message, message)
    console.error(e)
  })
        //   logs   //
  return !command || !prefix ? null : console.log(`${command.name}  ${shorten(args.join(' '), 1000)} in: ${message.guild.name}`)

})


client.login(config.token)

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', reason.stack || reason)
})