const Embed = require('../services/embedConstructor.js')

module.exports = class Util {
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
    let embed = new Embed()
      .color('#A00000')
      .title('⚠️ Command Error')
      .description(error)
      .author(message.author.tag, message.author.displayAvatarURL())
    if (usage) {
      embed = embed
        .field('Usage', usage)
    }
    embed = embed
      .build()
    message.reply({ embeds: [embed] })
  }

  static argsError(command, message, prefix) {
    let usage
    if (command.usage) usage = `\`${prefix}${command.name} ${command.usage}\``
    return Util.errorParse('Invalid Arguments', message, usage)
  }
}