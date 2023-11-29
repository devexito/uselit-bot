
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
      shue: '<a:oatmeal:908025294298972230>',
      sidor: '<:shue:893362194689974283>',
      fluid: '<:fluid:831795650219343912>',
      hmmm: '<:hmmm:814451433087827990>',
      heroin: '<:heroin:937532321148567604>',
      suhariki: '<:gay_sex_minet_anal:937532440799502356>',
      clueless: '<:clueless:937532045364695142>',
      nice_shit: '<:nice_shit:937532782228406342>',
      hungary: '<a:hungary:843514096027959367>',
      badklass: '<a:deeznuts:874607834061484082>',
      losyash: '<:sillytime:854287027888979988>',
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

  static errorParse(error, message, usage = false) {
    const embed = new MessageEmbed()
      .setColor('#A00000')
      .setTitle('⚠️ Command Error')
      .setDescription(error?.toString() || 'unknown error')
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
    if (usage) {
      embed
        .addField('Usage', usage)
    }

    if (!message.botReply) {
      return message.reply({ embeds: [embed] })
    } else {
      return message.botReply.edit({ content: null, embeds: [embed] })
    }
  }

  static argsError(command, message) {
    const embed = new MessageEmbed()
      .setColor('#3131BB')
      .setTitle(command.name)
    if (command.description) embed.setDescription(command.description)
    if (command.aliases && command.aliases.length) embed.addField('Aliases', command.aliases.join('\n'))
    if (command.usage) embed.addField('Usage', '`' + command.usage + '`')
    if (!message.botReply) {
      return message.reply({ embeds: [embed] })
    } else {
      return message.botReply.edit({ content: null, embeds: [embed] })
    }
  }

  static validateUrl(value) {
    return /^(?:(?:(?:https?):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value)
  }
}
