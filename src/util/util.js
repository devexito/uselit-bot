const { MessageEmbed } = require('discord.js')

module.exports = class Util {
  static emote(which) {
    const emoteList = {
      // BALLS VALLEY
      ball: '<a:ball:858301009309466634>',
      pregnant: '<a:pregnant:886071002067529770>',
      perms: '<a:perms:842810795997265970>',
      man: '<:man:886071033621254204>',
      dieass: '<a:dieass:869488306314936370>',
      shue: '<:shue:893362194689974283>',
      sidor: '<:sidor:812173881271386162>',
      fluid: '<:fluid:831795650219343912>',
      // BADKLASS MANIA
      badklass: '<:badklass:493361730160820234>',
      // EMOJI EPTA
      losyash: '<:losyash:870324026218790913>',
      heroin: '<:heroin:870323994958651424>',
      suhariki: '<:gay_sex_minet_anal:893360848058318848>',
      clueless: '<:clueless:896283754652381214>',
      nice_shit: '<:nice_shit:895272991099867147>',
    }
    if (!emoteList[which]) throw new TypeError(`${which} is not a valid emote in emote list.`)
    return emoteList[which]
  }

  static shorten(text, maxLen = 4000) {
    return text.length > maxLen ? `${text.substr(0, maxLen - 3)}…` : text
  }
  
  static formatNumber(number, minimumFractionDigits = 0) {
    return Number.parseFloat(number).toLocaleString(undefined, {
      minimumFractionDigits,
      maximumFractionDigits: 2
    })
  }
  
  static formatTime(time) {
    const min = Math.floor(time / 60)
      const sec = Math.floor(time - (min * 60))
      const ms = time - sec - (min * 60)
      return `${min}:${sec.toString().padStart(2, '0')}.${ms.toFixed(4).slice(2)}`
  }

  static base64(text, mode = 'encode') {
    if (mode === 'encode') return Buffer.from(text).toString('base64')
    if (mode === 'decode') return Buffer.from(text, 'base64').toString('utf8') || null
    throw new TypeError(`${mode} is not a supported base64 mode.`)
  }
  
  static today() {
    const now = new Date()
    now.setHours(0)
    now.setMinutes(0)
    now.setSeconds(0)
    now.setMilliseconds(0)
    now.setUTCHours(now.getUTCHours())
    return now
  }
  
  static getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max))
  }

  static errorParse(error, message, usage = false, edit = false) {
    const embed = new MessageEmbed()
      .setColor('#A00000')
      .setTitle('⚠️ Command Error')
      .setDescription(error)
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
    if (usage) {
      embed
        .addField('Usage', usage)
    }
    if (!edit) {
      message.reply({ embeds: [embed] })
    } else {
      message.edit({ content: '_ _', embeds: [embed] })
    }
  }

  static argsError(command, message) {
    const embed = new MessageEmbed()
      .setColor('#3131BB')
      .setTitle(command.name)
    if (command.description) embed.setDescription(command.description)
    if (command.aliases && command.aliases.length) embed.addField('Aliases', command.aliases.join('\n'))
    if (command.usage) embed.addField('Usage', '`' + command.usage + '`')
    return message.reply({ embeds: [embed] })
  }

  static validateUrl(value) {
    return /^(?:(?:(?:https?):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value)
  }
}