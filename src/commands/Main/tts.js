const { emote, errorParse, argsError } = require('../../util/util')
const { repliedMessage } = require('../../util/message')
const fs = require('fs')
const axios = require('axios')

module.exports = {
  name: 'tts',
  description: 'Just speaks out loud a specified text in a selected language.\nSupports message replies.\nExample usage: `tts en-US_female your text here`',
  desc: 'Text to speech',
  permissions: '',
  aliases: ['texttospeech'],
  usage: '<lang>-<LANG>_<male/female> <text>',
  args: true,
  async execute(message, args) {

    let [ setting, ...arges ] = args

    if (arges) arges = arges.join(' ').trim().split(' ')

    let reply = await repliedMessage(message).catch((e) => console.error(e))
    if (arges && arges[0] !== '' && arges.length) {
    } else if (reply && reply[0] !== '' && reply.length) {
      arges = reply
    } else if (reply && reply[0] == '') {
      return errorParse('No text provided in reply', message)
    } else if (arges[0] === '') {
      return argsError(this, message)
    }

    var regEx = /[a-z]{2,7}(-[A-Z]{2,7})?_(female|male)/g
    if (regEx.test(setting)) {
      regEx.exec(setting)
    } else {
      return errorParse('Invalid format of the parameter!', message, '`' + this.usage + '`')
    }

    const msg = await message.reply('Speaking text... ' + emote('hungary'))

    let code = randomText()
    const tempPath = './tempmusic/translate' + code + '.mp3'
    let write = fs.createWriteStream(tempPath)
    
    const res = await axios.get(
      'https://texttospeech.responsivevoice.org/v1/text:synthesize?text=' + encodeURI(arges.join(' ')) + '&lang=' + setting.split('_')[0] + '&engine=g1&name=&pitch=0.5&rate=0.5&volume=1&key=kvfbSITh&gender=' + setting.split('_')[1],
      {
        headers: {
          'accept': '*/*',
          'accept-encoding': 'identity;q=1, *;q=0',
          'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
          'chrome-proxy': 'frfr',
          'range': 'bytes=0-',
          'referer': 'https://translate.google.ru/',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36 OPR/60.0.3255.151'
        },
        responseType: 'stream'
      }
    ).catch(( er ) => {
      msg.delete()
      console.error(er)
      fs.unlinkSync(tempPath)
      return errorParse(er, message)
    })
    res.data.pipe(write)
    write.on('finish', async () => {
      try {
        await msg.edit({ content: ':speaking_head: :loudspeaker: :loud_sound: :bangbang:', files: [tempPath] }).catch((e) => {
          console.error(e)
          fs.unlinkSync(tempPath)
          return msg.edit('Unable to attach the audio file ' + emote('perms'))
        })
        fs.unlinkSync(tempPath)
      } catch (e) {
        console.error(e)
        fs.unlinkSync(tempPath)
        errorParse('Google did not want to sing that', message ? message : msg)
      }
    })
  }
}

function randomText() {
  let arr = ['a', 'b', 'c', 'd', 'e', '0', '1', '2', '3', '4']
  let out = ''
  let i = 0
  while(i < 30) {
    out = out + arr[getRandomInt(0, 9)]
    i++
  }
  if(i == 30) {
    return out
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

