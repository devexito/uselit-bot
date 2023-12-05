const { Client, Collection, Intents, MessageEmbed, Permissions, Message } = require('discord.js')
const myintents = new Intents(32767)
myintents.add('DIRECT_MESSAGES')
const client = new Client({ intents: myintents, allowedMentions: { repliedUser: false, parse: ['users'] }, partials: ['CHANNEL']})

client.config = require('dotenv').config().parsed
const { emote, shorten, errorParse, argsError } = require('./util/util.js')

const { readdirSync } = require('fs')
const { sep } = require('path')
client.cooldowns = new Collection()
client.commands = new Collection()
client.storedMessageIDs = new Collection()
const { cooldowns, storedMessageIDs } = client

const { QuickDB } = require('quick.db')
db = new QuickDB({ filePath: '../db.sqlite' })

//const NickChanger = require('./services/nickChanger')

function load(dir = './src/commands/') {
  readdirSync(dir).forEach(dirs => {
    const commandFiles = readdirSync(`${dir}${sep}${dirs}${sep}`).filter(files => files.endsWith('.js'))

    for (const file of commandFiles) {
      const command = require(`./commands/${dirs}/${file}`)
      client.commands.set(command.name, command)
    }
  })
}

load()

Message.prototype.editOrReply = function(text, options = { embeds: [], files: [] }) {
  //console.log(this.content, text)
  let msg
  if (!this.botReply) {
    msg = this.reply({ content: text, ...options })
  } else {
    msg = this.botReply.edit({ content: text, ...options })
  }
  return msg
}

client.on('ready', () => {
  console.log(`[READY] Logged in as ${client.user.tag}`)

  if (!client.config.FEEDBACK_CHANNEL) {
    console.error('*******\n******* NO FEEDBACK_CHANNEL SET IN ENV VARIABLES!\n*******')
  }

  //new NickChanger(client)

  setInterval(() => {
    client.user.setPresence({
      activities: [{
        name: 'the undefined of undefined, with undefined under undefined', 
        type: 'COMPETING'
      }],
      status: 'online'
    })
  }, 60000) // каждую минуту
})

client.on('messageCreate', onMessage)
client.on('messageUpdate', async (old, _new) => {
  const storedData = await storedMessageIDs.has(old.id) ? await storedMessageIDs.get(old.id) : null
  if (old.content !== _new.content) {
    onMessage(_new, true, storedData)
  }
})

async function onMessage(message, edit = false, botReply = null) {
  // костыль для статуса печатания
  if (message.author.id === client.user.id) {
    return
  } else if (!edit) {
    if (message.content == 'undefined') {
      message.channel.send('undefined.')
      return message.react(emote('dieass')).catch(() => {})
    } else if (message.content == 'null') {
      return message.channel.send('null.')
    } else if (message.content == 'NaN') {
      return message.channel.send('NaN.')
    }
  }
  
  message.edited = edit
  message.botReply = botReply
  // ограничения
  if (message.author.bot) return
  
  // CHECK FOR PREFIX
  let prefixes = [`<@${client.user.id}>`, `<@!${client.user.id}>`]
  let prefix = message.guild ? await db.get(`prefix_${message.guild.id}`) : ''
  if (prefix === null || prefix === undefined) prefix = client.config.DEFAULT_PREFIX
  if (!message.guild) prefixes.push(client.config.DEFAULT_PREFIX)
  prefixes.push(prefix)

  // If only mentioned, send a dummy message
  if (message.content == `<@${client.user.id}>` || message.content == `<@!${client.user.id}>` ) {
    let desc = 'In direct messages, you can use commands without providing a prefix.'
    if (message.guild) desc = `My prefix is \`${prefix}\``
    desc += `\nType \`${prefix}help\` for a list of available commands.`
    const embed = new MessageEmbed()
      .setColor('#3131BB')
      .setTitle(client.user.username)
      .setDescription(desc)
    const msg = message.editOrReply(null, { embeds: [embed], files: [] })
    return storeBotReply(message, msg)
  }

  for (i in prefixes) {
    if (message.content.startsWith(prefixes[i])) {
      prefix = prefixes[i]
      break
    }
  }
  // If in DMs, we can ignore the prefix
  if (!message.content.startsWith(prefix) && message.guild) return

  const commandBody = message.content.slice(prefix.length)
  const args = commandBody.trim().replace(/ +(?= )/g,'').split(' ')
  const commandName = args.shift().toLowerCase()

  const command = client.commands.get(commandName) 
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
  if (!command) return
  
  // Command arguments parser
  if (command.args && !args.length) {
    const msg = argsError(command, message)
    return await storeBotReply(message, msg)
  }
  if (command.ignore_dms && command.ignore_dms === true && message.guild == null) {
    const msg = errorParse(`This command cannot be used in private messages.`, message)
    return await storeBotReply(message, msg)
  }
  if (command.permissions?.length && !message.member?.permissions?.has(Permissions.FLAGS[command.permissions])) {
    const msg = errorParse(`You have insufficient permissions on the server.\n\nThis command requires the following permissions: \`${command.permissions}\``, message)
    return await storeBotReply(message, msg)
  }
  const owners = client.config.OWNERS.split(' ')
  if (command.owner && !owners.includes(message.author.id)) {
    const msg = errorParse('⛔ Owner Only', message)
    return await storeBotReply(message, msg)
  }

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
      return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`)
      .then(m => setTimeout(() => m.delete(), timeLeft * 1000)).catch(() => {})
    }
  }

  timestamps.set(message.author.id, now)
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)
  
  // EXECUTION
  await command.execute(message, args)
  .then(async (msg) => {
    if (msg) {
      //console.log('msg: ', msg.id)
      await storeBotReply(message, msg)
    }
  })
  .catch(async (e) => {
    const msg = errorParse('**Critical:** ' + e.message, message)
    await storeBotReply(message, msg)
    console.error(e)
  })
  
  // logs
  return !command || !prefix ? null : console.log(`${command.name}  ${shorten(args.join(' '), 1000)} in: ${message.guild?.name}, ${storedMessageIDs.get(message.id)}`)
}

async function storeBotReply(message, msg) {
  if (!message.botReply && msg) {
    await storedMessageIDs.set(message.id, msg)
    //console.log(await storedMessageIDs.get(message.id))
    setTimeout(() => storedMessageIDs.delete(message.id), 300000) // 5 min
  }
}

client.login(client.config.TOKEN)

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', reason.stack || reason)
})