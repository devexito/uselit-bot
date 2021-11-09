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
function findImageUrlInAttachment(attachment) {
  if (attachment.proxyUrl && (attachment.height || attachment.width)) {
    if (attachment.isImage) {
      if (attachment.url) {
        const url = new URL(attachment.url)
        if (TRUSTED_URLS.includes(url.host)) {
          return attachment.url
        }
      }
      return attachment.proxyUrl
    } else if (attachment.isVideo) {
      return attachment.proxyUrl + '?format=png'
    }
  }
  return null
}



function findImageUrlInEmbed(embed, ignoreGIFV = false) {
  if (!ignoreGIFV && embed.type === MessageEmbedTypes.GIFV) {
    // try to use our own unfurler for the url since it'll use the thumbnail
    // imgur returns the .gif image in thumbnail, so check if that ends with .gif
    const url = findImageUrlInEmbed(embed, true);
    if (url && url.endsWith('.gif')) {
      return url
    }
    if (embed.url) {
      return embed.url
    }
    return null
  }
  const { image } = embed
  if (image && image.proxyUrl && (image.height || image.width)) {
    if (image.url) {
      const url = new URL(image.url)
      if (TRUSTED_URLS.includes(url.host)) {
        return image.url
      }
    }
    return image.proxyUrl
  }
  const { thumbnail } = embed
  if (thumbnail && thumbnail.proxyUrl && (thumbnail.height || thumbnail.width)) {
    if (thumbnail.url) {
      const url = new URL(thumbnail.url)
      if (TRUSTED_URLS.includes(url.host)) {
        return thumbnail.url
      }
    }
    return thumbnail.proxyUrl
  }
  const { video } = embed
  if (video && video.proxyUrl && (video.height || video.width)) {
    return video.proxyUrl + '?format=png'
  }
  return null
}



function findImageUrlInMessage(message, url = null) {
  if (url) {
    for (let [embedId, embed] of message.embeds) {
      if (embed.url === url) {
        return findImageUrlInEmbed(embed)
      }
    }
  }
  for (let [attachmentId, attachment] of message.attachments) {
    const url = findImageUrlInAttachment(attachment)
    if (url) {
      return url
    }
  }
  for (let [embedId, embed] of message.embeds) {
    const url = findImageUrlInEmbed(embed)
    if (url) {
      return url
    }
  }
  return null
}



module.exports = {
  repliedMessageObject,
  repliedMessage,
  findImageUrlInAttachment,
  findImageUrlInEmbed,
  findImageUrlInMessage
}