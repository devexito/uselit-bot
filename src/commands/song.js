const { formatNumber } = require('../util/util')
const fs = require('fs')
const axios = require('axios')
const ffmpeg = require('fluent-ffmpeg-extended')
const exec = require('child_process').exec
const { getPackedSettings } = require('http2')

module.exports = {
  name: 'song',
  description: 'Makes a very funny song!!!!',
  desc: 'Makes a song.',
  permissions: '',
  usage: '<<lang>-<LANG>_<male/female>>(ru-RU_female) <text>',
  async execute(message, args) {
    const msg = await message.reply('Making a song...')

    const [ setting, ...arges ] = args
    
    if (!args[0]) return errorParse('Invalid Arguments', message, usage)

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
    )
    res.data.pipe(write)
    write.on('finish', () => {
      try {
        new ffmpeg.Metadata('./musics/translate' + code + '.mp3', (dat, err) => {
          exec('ffmpeg -i ./musics/garmoshka1.mp3 -i ./musics/translate' + code + '.mp3 -i ./musics/garmoshka2.mp3 -filter_complex "[1]adelay=3300,volume=5[s1];[0]adelay=3300[s0];[2]adelay=' + (dat.durationsec * 1000 + 3600) + '[s2];[0][s0][s1][s2]amix=4[mixout]" -map [mixout] ./musics/msg' + code + '.mp3', async () => {
            await msg.edit({ content: 'Done! <:nice_shit:895272991099867147>', files: ['./musics/msg' + code + '.mp3'] })
            fs.unlinkSync('./musics/translate' + code + '.mp3')
            fs.unlinkSync('./musics/msg' + code + '.mp3')
          })
        })
      } catch (e) {
        console.log(e)
        msg.reply('Гугл не захотел это петь.')
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

