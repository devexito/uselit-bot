const { emote, errorParse } = require('../../util/util')
const { repliedMessage } = require('../../util/message')
const fs = require('fs')
const axios = require('axios')
const ffmpeg = require('fluent-ffmpeg-extended')
const exec = require('child_process').exec
const { getPackedSettings } = require('http2')

module.exports = {
  name: 'song',
  description: 'Makes a very funny song!!!!\nNow outputs video instead of audio for mobile Discord compatibility.\nSupports message replies.\nExample usage: `>song ru-RU_female your text here`\nUse `-audio` to force output mp3 audio file.',
  desc: 'Make a song',
  permissions: '',
  usage: '<lang>-<LANG>_<male/female> <text> [-audio]',
  args: true,
  async execute(message, args) {
    let [ setting, ...arges ] = args
    let outFormat = '.mp4'
    let noVideo = false

    if (arges && arges[arges.length - 1] === '-audio') {
      outFormat = '.mp3'
      noVideo = true
      arges.splice(-1, 6)
    }
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

// ÍÀ×ÀËÎ ÑÎÇÄÀÍÈß ×ÀÑÒÓØÊÈ
    const msg = await message.reply('Making a song... ' + emote('shue'))

    let imgPath = ''
   // img${getRandomInt(1, 4) || 0}.png
    if (!noVideo) imgPath = ` -loop 1 -i ./musics/img0.png`

    let code = randomText()
    let write = fs.createWriteStream('./tempmusic/translate' + code + '.mp3')
    
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
      fs.unlinkSync('./tempmusic/translate' + code + '.mp3')
      return errorParse(er, message)
    })
    res.data.pipe(write)
    write.on('finish', () => {
      try {
        new ffmpeg.Metadata('./tempmusic/translate' + code + '.mp3', (dat, err) => {
          exec(`ffmpeg -i ./musics/garmoshka1.mp3 -i ./tempmusic/translate${code}.mp3 -i ./musics/garmoshka2.mp3${imgPath} -filter_complex "[1]adelay=3300,volume=5[s1];[0]adelay=3300[s0];[2]adelay=${(dat.durationsec * 1000 + 3600)}[s2];[0][s0][s1][s2]amix=4[mixout]" -map [mixout] ${noVideo ? '' : '-map 3:v -c:v libx264 -pix_fmt yuv420p -shortest '}./tempmusic/msg${code}${outFormat}`, async () => {
            await msg.edit({ content: 'Here is your song ' + emote('sidor'), files: ['./tempmusic/msg' + code + outFormat] }).catch((e) => {
              console.error(e)
              msg.edit('Unable to attach the audio file ' + emote('perms'))
              fs.unlinkSync('./tempmusic/translate' + code + '.mp3')
              fs.unlinkSync('./tempmusic/msg' + code + outFormat)
            })
            fs.unlinkSync('./tempmusic/translate' + code + '.mp3')
            fs.unlinkSync('./tempmusic/msg' + code + outFormat)
          })
        })
      } catch (e) {
        console.error(e)
        errorParse('Google did not want to sing that', message ? message : msg)
        fs.unlinkSync('./tempmusic/translate' + code + '.mp3')
        fs.unlinkSync('./tempmusic/msg' + code + outFormat)
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

