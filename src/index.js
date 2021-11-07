const { Client, Collection, Intents, MessageEmbed } = require('discord.js')
const myintents = new Intents(32767)
myintents.remove(['DIRECT_MESSAGES'])
const client = new Client({ intents: myintents, allowedMentions: { repliedUser: false, parse: ['users'] }})

const { shorten, errorParse, argsError } = require('./util/util.js')
const config = require('./config.js')
prefix = config.defaultPrefix
client.config = config

const { readdirSync } = require('fs')
const { sep } = require('path')
client.cooldowns = new Collection()
client.commands = new Collection()
const { cooldowns } = client

const load = (dir = './src/commands/') => {
  readdirSync(dir).forEach(dirs => {
    const commandFiles = readdirSync(`${dir}${sep}${dirs}${sep}`).filter(files => files.endsWith('.js'))

    for (const file of commandFiles) {
      const command = require(`./commands/${dirs}/${file}`)
      //process.stdout.clearLine()
      //process.stdout.cursorTo(0)
      //process.stdout.write(`Loading command ${command.name}...`)
      client.commands.set(command.name, command)
    }
  })
}

load()

client.on('ready', () => {
  //process.stdout.write('\n')
  console.log(`[READY] Logged in as ${client.user.tag}`)

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
    return message.react('<a:dieass:869488306314936370>').catch(() => {})
  } else if (message.content == 'null') {
    return message.channel.send('null.')
  } else if (message.content == 'NaN') {
    return message.channel.send('NaN.')
  }

  // ограничения
  if (message.author.bot || !message.guild) return

  if (bk.length > 0 && bk.includes(message.author.id)) {
    message.react('<:badklass:493361730160820234>').catch(() => {})
  }

  if (message.content.startsWith(`<@${client.user.id}>`) || message.content.startsWith(`<@!${client.user.id}>`) ) {
    const embed = new MessageEmbed()
      .setColor('#3131BB')
      .setTitle(client.user.username)
      .setDescription(`My prefix is \`${prefix}\``)
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
    return argsError(command, message, prefix)
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
    }
  }

  timestamps.set(message.author.id, now)
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)

  // EXECUTION
  await command.execute(message, args)
  .catch((e) => {
    errorParse('Critical Command Error: ' + e.message, message)
    console.error(e)
  })
        //   logs   //
  return !command || !prefix ? null : console.log(`${command.name}  ${shorten(args.join(' '), 1000)} in: ${message.guild.name}`)

})


client.on('guildMemberUpdate', async (oldMember, newMember) => {
  if (oldMember.nickname === newMember.nickname) return
  let guild = 467759978716069888
  let m = [350177157550571521, 761943058924830740, 567411443276840984]
  let n = ['❤Nikitock Fanta❤', '❤femboy debil❤', '❤serafemboy❤']

  if (oldMember.guild.id != guild) return console.log('escaped guild')
  if (newMember.user.id == m[0]) {
    if (newMember.nickname != n[0]) {
      newMember.setNickname(n[0])
    }
  } else if (newMember.user.id == m[1]) {
    if (newMember.nickname != n[1]) {
      newMember.setNickname(n[1])
    }
  } else if (newMember.user.id == m[2]) {
    if (newMember.nickname != n[2]) {
      newMember.setNickname(n[2])
    }
  } else return console.log('escaped member')
  console.log(newMember.user.username + ' has changed from ' + oldMember.nickname + ' to ' + newMember.nickname + '! Changing back to their defaults')
})


client.login(config.token)