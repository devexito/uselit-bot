const Discord = require('discord.js')
const intents = new Discord.IntentsBitField(
  Discord.IntentsBitField.Flags.Guilds |
  Discord.IntentsBitField.Flags.GuildMessages |
  Discord.IntentsBitField.Flags.GuildMembers |
  Discord.IntentsBitField.Flags.MessageContent
)
const client = new Discord.Client({ 
  intents: intents, allowedMentions: {
    repliedUser: false, parse: ['users']
  }
})

const { emote, shorten, errorParse, argsError } = require('./util/util.js')
const config = require('./config.js')
prefix = config.defaultPrefix
feedbackChannel = ''
owners = config.owners

const { readdirSync } = require('fs')
const { sep } = require('path')
client.cooldowns = new Discord.Collection()
client.commands = new Discord.Collection()
const { cooldowns } = client

const load = (dir = './src/commands/') => {
  readdirSync(dir).forEach(dirs => {
    const commandFiles = readdirSync(`${dir}${sep}${dirs}${sep}`)
      .filter(files => files.endsWith('.js'))

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
  } else {
    feedbackChannel = config.feedbackChannel
  }

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

client.on('messageCreate', onMessage)
//client.on('messageUpdate', (old, _new) => old.content !== _new.content && onMessage(_new, true))

async function onMessage(message, edit = false) {

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

  if (message.author.bot || !message.guild) return


  if (
    message.content.startsWith(`<@${client.user.id}>`) ||
    message.content.startsWith(`<@!${client.user.id}>`)
    ) {
    const embed = new Discord.EmbedBuilder()
      .setColor(0x3131BB)
      .setTitle(client.user.username)
      .setDescription(
        `My prefix is \`${prefix}\`\nType \`${prefix}help\` for a list of available commands.`
      )
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

    // COOLDOWNS
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection())
  }

  const now = Date.now()
  const timestamps = cooldowns.get(command.name)
  const cooldownAmount = (command.cooldown || 2) * 1000

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000
      return message.reply(
        `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`
      ).then(m => setTimeout(() => m.delete(), timeLeft * 1000)).catch(() => {})
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

  /*if (!edit) {
        //   logs   //
    return !command || !prefix ? null : console.log(
      `${command.name}  ${shorten(args.join(' '), 1000)} in: ${message.guild.name}`
    )
  }*/
}


client.login(config.token)

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', reason.stack || reason)
})