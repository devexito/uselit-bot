// stolen from npm library

const {
  MessageActionRow,
  Message,
  MessageEmbed,
  MessageButton,
} = require('discord.js');
const { isInvalid } = require('../util/message');
const { shorten } = require('../util/util');
const gen = require('../services/generateText');

/**
 * Creates a pagination embed
 * @param {Message} msg (of bot)
 * @param {MessageEmbed[]} pages
 * @param {MessageButton[]} buttonList
 * @param {number} timeout
 * @param {Message} message (of user)
 * @param {boolean} replied
 * @returns
 */
const paginationEmbed = async (msg, pages, buttonList, timeout = 120000, message, args) => {
  if (!msg || !msg.channel)
    throw new Error('Channel is inaccessible.');
  
  let page = 0;
  
  if (pages[0].description && pages[0].description.length > 2999)
    buttonList[3].setDisabled(true);
  
  const row = new MessageActionRow().addComponents(buttonList).toJSON();
  let curPage = await msg.edit({
    embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
    components: [row],
  }).catch(() => {});
  
  const filter = i => buttonList.filter(button => button.customId === i.customId).length

  let collector;
  try {
    collector = await curPage.createMessageComponentCollector({
      filter,
      time: timeout,
    });
  } catch (e) {
    return console.error(e);
  }
  
  const disabledRow = new MessageActionRow().setComponents(
    buttonList.map(button => button.setDisabled(true))
  ).toJSON();

  collector.on('collect', async (i) => {
    let isPaging = false;
    let output;

    let msgIsDeleted = await isInvalid(curPage);
  
    switch (i.customId) {
      case buttonList[0].customId: // PREVIOUS
        page = page > 0 ? --page : pages.length - 1;
        isPaging = true;
        break;
      case buttonList[1].customId: // NEXT
        page = page + 1 < pages.length ? ++page : 0
        isPaging = true;
        break;
      case buttonList[2].customId: // REGENERATE TEXT
        isPaging = false;
        if (!args) {
          console.log(msgIsDeleted + ' ' + args)
          await i.deferUpdate();
          collector.stop();
          break;
        }
        await i.deferUpdate();
        await i.editReply({
          embeds: [pages[page].setFooter('Regenerating text...')],
          components: [disabledRow],
        }).catch(() => {});
        output = await gen.fetchText(msg, args);
        page = 0;
        break;
      case buttonList[3].customId: // GENERATE MORE TEXT
        isPaging = false;
        await i.deferUpdate();
        await i.editReply({
          embeds: [pages[page].setFooter('Generating more text...')],
          components: [disabledRow],
        }).catch(() => {});
        let embedText = pages[page].description.split(' ');
        output = await gen.fetchText(msg, embedText);
        if (output)
          args = output.input.split(' ');
        page = 0;
        break;
      case buttonList[4].customId: // CLOSE BUTTONS
        isPaging = false;
        await i.deferUpdate();
        if ((i.user.id == message.author.id) || msgIsDeleted || !args)
          collector.stop();
        break;
      default:
        break;
    }

    if (output) {
      for (let i = 0; i < pages.length; i++) {
        pages[i] = pages[i].setDescription(shorten(output.input + output.res[i]));
      }

      if (pages[page].description.length > 2999) {
        row.spliceComponents(3, 1, buttonList[3].setDisabled(true))
      }
      
      await i.editReply({
        embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
        components: [row],
      }).catch(() => {});
    } else if (isPaging) {
      await i.deferUpdate();
      await i.editReply({
        embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
        components: [row],
      }).catch(() => {});
    };
    
    collector.resetTimer();
  });
  
  collector.on('end', async () => {
    let isMessageInvalid = await isInvalid(curPage)
    if (!isMessageInvalid) {
      curPage.edit({
        embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
        components: [],
      }).catch(() => {});
    } else {
      console.log('the curPage message is invalid. huh.')
    }
  });
  
  return curPage;
};
module.exports = paginationEmbed;