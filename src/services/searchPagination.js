// stolen from npm library

const {
  MessageActionRow,
  Message,
  MessageEmbed,
  MessageButton,
} = require('discord.js');
const { shorten } = require('../util/util');
const gen = require('../services/searchGoogle');


const paginationEmbed = async (msg, pages, buttonList, timeout = 120000, message, args) => {
  if (!msg && !msg.channel) throw new Error('Channel is inaccessible.');
  if (!pages) throw new Error('Pages are not given.');

  let page = 0;

  const row = new MessageActionRow().addComponents(buttonList);
  let curPage;
  if (msg) {
    curPage = await msg.edit({
      embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
      components: [row],
    }).catch(() => {});
  } else {
    console.log('no message? skipping');
    return null;
  };

  const disabledRow = new MessageActionRow().addComponents(
    buttonList[0].setDisabled(true),
    buttonList[1].setDisabled(true),
    buttonList[2].setDisabled(true),
    buttonList[3].setDisabled(true),
    buttonList[4].setDisabled(true)
  );

  const filter = (i) =>
    i.customId === buttonList[0].customId ||
    i.customId === buttonList[1].customId ||
    i.customId === buttonList[2].customId ||
    i.customId === buttonList[3].customId ||
    i.customId === buttonList[4].customId;
  let collector;
  try {
    collector = await curPage.createMessageComponentCollector({
      filter,
      time: timeout,
    });
  } catch (e) {
    return console.error(e);
  }

  collector.on('collect', async (i) => {
    let isPaging = false;
    let msgIsDeleted = false;
    let output;

    //if (curPage.deleted) return;

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
        if (output) args = output.input.split(' ');
        page = 0;
        break;
      case buttonList[4].customId: // CLOSE BUTTONS
        isPaging = false;
        await i.deferUpdate();
        if ((i.user.id == message.author.id) || message.deleted || !args) collector.stop();
        break;
      default:
        break;
    }
    if (output) {
      pages[0] = pages[0].setDescription(shorten(output.input + output.res[0]));
      pages[1] = pages[1].setDescription(shorten(output.input + output.res[1]));
      pages[2] = pages[2].setDescription(shorten(output.input + output.res[2]));
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

  collector.on('end', () => {
    if (!curPage.deleted) {
      curPage.edit({
        embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)],
        components: [],
      }).catch(() => {});
    };
  });

  return curPage;
};
module.exports = paginationEmbed;