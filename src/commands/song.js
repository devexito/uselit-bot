const { errorParse } = require('../util/util')
const { repliedMessage } = require('../util/message')
const fs = require('fs')
const axios = require('axios')
const ffmpeg = require('fluent-ffmpeg-extended')
const exec = require('child_process').exec
const { getPackedSettings } = require('http2')

module.exports = {
  name: 'song',
  description: 'Makes a very funny song!!!!\n\nSupports message replies.\nExample usage: `>song ru-RU_female your text here`',
  desc: 'Make a song',
  permissions: '',
  usage: '<lang>-<LANG>_<male/female> <text>',
  cooldown: -3,
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
      return errorParse('No text provided', message)
    }

    var regEx = /[a-z]{2,7}(-[A-Z]{2,7})?_(female|male)/g
    if (regEx.test(setting)) {
      regEx.exec(setting)
    } else {
      return errorParse('Invalid format of the parameter!', message, '`' + this.usage + '`')
    }

// Õ¿◊¿ÀŒ —Œ«ƒ¿Õ»ﬂ ◊¿—“”ÿ »
    const msg = await message.reply('Making a song... <:shue:893362194689974283>')

    let code = randomText()
    let write = fs.createWriteStream('./musics/translate' + code + '.mp3')
    
    const res = await axios.get(
      'https://texttospeech.responsivevoice.org/v1/text:synthesize?text=' + encodeURI(arges.join(' ')) + '&lang=' + setting.split('_')[0] + '&engine=g3&name=&pitch=0.5&rate=0.5&volume=1&key=0POmS5Y2&gender=' + setting.split('_')[1],
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
      return errorParse(er, message)
    })
    res.data.pipe(write)
    write.on('finish', () => {
      try {
        new ffmpeg.Metadata('./musics/translate' + code + '.mp3', (dat, err) => {
          exec('ffmpeg -i ./musics/garmoshka1.mp3 -i ./musics/translate' + code + '.mp3 -i ./musics/garmoshka2.mp3 -filter_complex "[1]adelay=3300,volume=5[s1];[0]adelay=3300[s0];[2]adelay=' + (dat.durationsec * 1000 + 3600) + '[s2];[0][s0][s1][s2]amix=4[mixout]" -map [mixout] ./musics/msg' + code + '.mp3', async () => {
            await msg.edit({ content: 'Here is your song <:sidor:812173881271386162>', files: ['./musics/msg' + code + '.mp3'] }).catch(() => {
              msg.edit('Unable to attach the audio file <a:perms:842810795997265970>')
            })
            fs.unlinkSync('./musics/translate' + code + '.mp3')
            fs.unlinkSync('./musics/msg' + code + '.mp3')
          })
        })
      } catch (e) {
        console.error(e)
        errorParse('Google does not want to sing that', message ? message : msg)
      }
    })
  }
}

function randomText() {
  arr = ['a', 'b', 'c', 'd', 'e', '0', '1', '2', '3', '4']
  out = ''
  i = 0
  while(i < 50) {
    out = out + arr[getRandomInt(0, 9)]
    i++
  }
  if(i == 50) {
    return out
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

