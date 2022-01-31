const { shorten, errorParse, argsError } = require('../../util/util')
const { repliedMessage } = require('../../util/message')

module.exports = {
  name: 'replace',
  description: 'Replaces text in one of the last 50 messages (search is literal!) or in the reply with your text.',
//nWrap an argument in `"` to escape trimming.
  desc: 'Replace text in message',
  aliases: ['sed', 'rep'],
  args: true,
  usage: '<what to replace>/<with what to replace>',
  async execute(message, args) {
    args = args.join(' ')
    if (args.includes('/')) {
      args = args.split('/')
    } else {
      return errorParse('Invalid arguments!', message, this.usage)
    }
    let trim = [ true, true ]
/*
    try {
      args[0].split('" "')[0].split('"')[1]
      trim[0] = true
    } catch (e) {console.log('first', e)}
    try {
      args[1].split('" "')[1].split('"')[0]
      trim[1] = true
    } catch (e) {console.log('second', e)}
    console.log(args)
*/

    let reply = await repliedMessage(message).catch((e) => console.error(e))
    if (undefined != reply && reply.length) {
      reply = reply.join(' ')
      let output = replace(reply, args, trim)
      if (output === reply) return errorParse('Output is the same as input', message)
      return message.reply(shorten(output, 2000)).catch((e) => {})
    } else {
      await findTextInMessageHistory(message, args[0]).then((out) => {
        if (!out) return argsError(this, message)
        let outReplaced = replace(out, args, trim)
        if (!outReplaced) {
          console.error('outReplaced is empty')
          return errorParse('I received nothing', message)
        }
        if (outReplaced === out) return errorParse('Output is the same as input', message)
        return message.reply(shorten(outReplaced, 2000)).catch(() => {})
      }).catch((e) => { errorParse(e, message) })
    }
  },
}

function replace(text, input, trim) {
  if (!text || !input.length) return null

  let [ what, ...withText ] = input
  withText = withText.join('|')
  //if (!trim[1]) withText = withText.trim()
  //if (!trim[0]) what = what.trim()
  let regex = new RegExp(what, 'g')
  let result = text.replace(regex, withText)

  return result
}


async function findTextInMessageHistory(message, text) {
  let found = false
  return new Promise(function(resolve, reject) {
    message.channel.messages.fetch({ limit: 50 }).then(arr => {
      arr.map(m => {
        if (m.content.includes(text) && !found && m.id !== message.id) {
          found = true
          resolve(m.content)
        }
      })
    }).then(() => {
      if (!found) reject( 'No literal matching text found in last 50 messages' )
    }).catch((e) => {
      reject(e)
    })
    
  })
}