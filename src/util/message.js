const { URL } = require('url')

const { errorParse } = require('../util/util')
const TRUSTED_URLS = Object.freeze([
  'cdn.discordapp.com',
  'images-ext-1.discordapp.net',
  'images-ext-2.discordapp.net',
  'media.discordapp.net',
])


async function repliedMessageObject(message) {
  if (!message.reference) return
  const msg = await message.channel.messages.fetch(message.reference.messageId).catch((e) => {
    console.error(e)
    return null
  })
  if (!msg || message.deleted) return null

  return msg
}



async function repliedMessage(message) {
  if (!message.reference) return
  const msg = await message.channel.messages.fetch(message.reference.messageId).catch((e) => {
    console.error(e)
    return null
  })
  if (!msg || message.deleted) return null
  let content = msg.content.replace(/ +(?= )/g,'').split(' ')

  if (msg.embeds.length > 0) {
    if (msg.embeds[0].description) {
      content = msg.embeds[0].description.replace(/ +(?= )/g,'').split(' ')
    } else if (!content || !content.length) {
      return null
    }
  }

  return content[0] !== '' ? content : null
}


// taken from notsobot.ts
async function findImageUrlInAttachment(attachment) {
  if (attachment.proxyURL && (attachment.height || attachment.width)) {
    if (attachment.isImage) {
      if (attachment.url) {
        const url = new URL(attachment.url)
        if (TRUSTED_URLS.includes(url.host)) {
          return attachment.url
        }
      }
      return attachment.proxyURL
    } else if (attachment.isVideo) {
      return attachment.proxyURL + '?format=png'
    } else {
      console.log('not image nor video')
    }
  }
  console.log('attachment check fail')
  return null
}



async function findImageUrlInEmbed(embed, ignoreGIFV = false) {
  if (!ignoreGIFV && embed.type === 'gifv') {
    // try to use our own unfurler for the url since it'll use the thumbnail
    // imgur returns the .gif image in thumbnail, so check if that ends with .gif
    const url = await findImageUrlInEmbed(embed, true)
    if (url && url.endsWith('.gif')) {
      return url
    }
    if (embed.url) {
      return embed.url
    }
    console.log('gifv check fail')
    return null
  }
  const { image } = embed
  if (image && image.proxyURL && (image.height || image.width)) {
    if (image.url) {
      const url = new URL(image.url)
      if (TRUSTED_URLS.includes(url.host)) {
        return image.url
      } else {
        console.log('url image untrusted')
      }
    } else {
      console.log('no image.url')
    }
    return image.proxyURL
  }
  const { thumbnail } = embed
  if (thumbnail && thumbnail.proxyURL && (thumbnail.height || thumbnail.width)) {
    if (thumbnail.url) {
      const url = new URL(thumbnail.url)
      if (TRUSTED_URLS.includes(url.host)) {
        return thumbnail.url
      } else {
        console.log('url thumbnail untrusted')
      }
    } else {
      console.log('no thumbnail.url')
    }
    return thumbnail.proxyURL
  } else {
    console.log('no thumbnail')
  }
  const { video } = embed
  if (video && video.proxyURL && (video.height || video.width)) {
    return video.proxyURL + '?format=png'
  }
  console.log('embed check fail')
  return null
}



async function findImageUrlInMessage(message, url = null) {
  if (url) {
    for (let [embedId, embed] of Object.entries(message.embeds)) {
      if (embed.url === url) {
        return await findImageUrlInEmbed(embed)
      } else {
        console.log('no embed.url')
      }
    }
  }
  for (let [attachmentId, attachment] of Object.entries(message.attachments)) {
    const url = await findImageUrlInAttachment(attachment)
    if (url) {
      return url
    } else {
      console.log('no attach url')
    }
  }
  for (let [embedId, embed] of Object.entries(message.embeds)) {
    const url = await findImageUrlInEmbed(embed)
    if (url) {
      return url
    } else {
      console.log('no embed url')
    }
  }
  console.log('message check fail')
  console.log(message)
  return null
}



module.exports = {
  repliedMessageObject,
  repliedMessage,
  findImageUrlInAttachment,
  findImageUrlInEmbed,
  findImageUrlInMessage
}