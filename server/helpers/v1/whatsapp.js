const WebSocket = require('ws');
const Request = require('request');
const { createClient } = require('redis');
const { v1 } = require('config');
const { STORAGE, fela } = v1;
const _ = require('lodash');
const client = createClient(6380, STORAGE.REDIS.url, {
  auth_pass: STORAGE.REDIS.password,
  tls: { servername: STORAGE.REDIS.url },
});
const responseTimeout = 5000;
const queue = {};
const liveConversations = {};

// function messageParser(data) {
//   const mapper = {
//     bold: '*',
//     italics: '_',
//     strikethrough: '~',
//     monospace: '```',
//   };
// }

function broadcastThis(data) {
  const liveData = liveConversations[data.conversation.id];
  if (liveData) {
    // broadcast to them
    const { text } = data;
    // TODO: process text for whatsapp
    Request.post(
      {
        url: 'https://pickyassist.com/app/api/v2/push',
        json: true,
        body: {
          token: '2456c74d64eec98546d3e5ad126ef9de1b7f0730',
          priority: 1,
          number: parseInt(`234${String(liveData.number).slice(-10)}`),
          message: text,
          application: 2,
        },
      },
      (_err, reqBody, _resp) => {
        console.log(_err, _resp);
        if (_err) {
          // unable to initiate conversation
          return;
        }

        if (reqBody.statusCode !== 200) {
          // unable to initiate conversation
        }
      },
    );
  }
}

function popMe(replyToId) {
  delete queue[replyToId];
}

function cardsToItems(attachments, conversationId) {
  let resp = '';
  const { content } = attachments;
  const { buttons } = content;
  if (buttons) {
    resp += buttons.map((n, i) => `*${i + 1}*. _${n.title.trim()}_`).join('\n');
    const live = liveConversations[conversationId];
    if (live) {
      try {
        client.set(
          conversationId,
          JSON.stringify({ context: buttons.map(i => i.value) }),
        );
      } catch (e) {
        // server error
      }
    }
  }

  return resp;
}

function sendMessageToClient(data) {
  // send message to user
  // by calling picky assist api in this case
  try {
    const { activities } = JSON.parse(data);

    // const allForUser = _.takeRightWhile(activities, (m) => { return m.type === 'message' && m.from.id === fela.name; });

    const lastMessage = activities.pop();

    switch (lastMessage.type) {
      case 'typing':
        break;
      case 'event':
        // console.log(lastMessage.name);
        break;
      case 'message':
        if (lastMessage.from.id === fela.name) {
          // from fela
          const { replyToId, text } = lastMessage;
          const owner = queue[replyToId];
          // console.log(allForUser);
          if (owner) {
            if (lastMessage.inputHint === 'ignoringInput') {
              // If the message is ignoring input, there is probably another one coming
              // send broadcast

              // eslint-disable-next-line no-unused-expressions
              queue[replyToId].prefix
                ? (queue[replyToId].prefix[lastMessage.id] = text)
                : (queue[replyToId].prefix = { [lastMessage.id]: text });
              //  broadcastThis(lastMessage);
            } else {
              // TODO: preprocess text to whatsapp format before sending

              owner(lastMessage);
              popMe(replyToId);
            }
          }
        } else {
          // to fela
        }
        break;
      default:
    }
  } catch (e) {
    console.log('Strange:', data);
  }
}

function compress(data) {
  const q = {};
  data.replace(/([^=&]+)=([^&]*)/g, (m, key, value) => {
    q[key] = (q[key] ? `${q[key]},` : '') + value;
  });
  return q;
}

function getWatermark(streamUrl) {
  const parsed = compress(streamUrl.split('?').pop());
  return parsed.watermark;
}

function reconnectToFela(
  res,
  conversationId,
  number,
  messageIn,
  uniqueId,
  mediaURl,
  watermark = null,
) {
  let reConnectionLink;
  if (watermark) {
    reConnectionLink = `https://directline.botframework.com/v3/directline/conversations/${conversationId}?watermark=${watermark}`;
  } else {
    reConnectionLink = `https://directline.botframework.com/v3/directline/conversations/${conversationId}`;
  }
  // save conversation against user number
  liveConversations[conversationId] = { number };

  Request.get(
    {
      url: reConnectionLink,
      json: true,
      headers: {
        Authorization: `Bearer ${fela.token}`,
      },
    },
    (_err, reqBody, _resp) => {
      if (_err) {
        // unable to initiate conversation
        return;
      }

      if (reqBody.statusCode !== 200) {
        // unable to initiate conversation
        return;
      }
      proceedWithConversation(
        res,
        _resp,
        number,
        messageIn,
        uniqueId,
        mediaURl,
      );
    },
  );
}

function sendMessageToFela(
  res,
  number,
  conversationId,
  messageIn,
  conversationAuth,
) {
  client.get(conversationId, (_err, lastContext) => {
    if (!_err && lastContext) {
      const { context } = JSON.parse(lastContext);
      const inde = parseInt(messageIn, 10);
      if (!isNaN(inde)) {
        // eslint-disable-next-line no-param-reassign
        messageIn = context[inde - 1];
        // client.set(conversationId, '[]', 'EX', 2);
      }
    }
    Request.post(
      {
        url: `https://directline.botframework.com/v3/directline/conversations/${conversationId}/activities`,
        headers: {
          Authorization: conversationAuth,
        },
        body: {
          text: messageIn,
          textFormat: 'plain',
          type: 'message',
          channelId: 'directline',
          from: { id: number, role: 'user' },
          locale: 'en-GB',
          timestamp: new Date().toISOString(),
        },
        json: true,
      },
      (_err2, respBody, _resp) => {
        if (_err2) {
          // unable to initiate conversation
          return;
        }
        if (respBody.statusCode !== 200) {
          // unable to initiate conversation
          return;
        }
        queue[_resp.id] = reply => {
          // TODO: we may have to delay message for a bit because
          let out = '';
          let info = '';
          if (queue[reply.replyToId].prefix) {
            // eslint-disable-next-line no-restricted-syntax
            for (const g in queue[reply.replyToId].prefix) {
              if (queue[reply.replyToId].prefix[g]) {
                info += ` \`\`\`${queue[reply.replyToId].prefix[g]}\`\`\`\n\n `;
              }
            }
          }
          if (reply.attachments) {
            out += cardsToItems(reply.attachments[0], conversationId);
          }

          // broadcast might be in a queue
          res.json({
            'message-out': [info, ` _*${reply.text.trim()}*_ `, out].join('\n'),
            delay: 0,
            application: 2,
          });
          setTimeout(() => popMe(_resp.id), responseTimeout);
        };
      },
    );
  });
}

// Listen to Fela, ehn!
function listenForFelaResponse(
  res,
  streamUrl,
  number,
  conversationId,
  messageIn,
  conversationAuth,
) {
  const ws = new WebSocket(streamUrl);

  ws.on('open', () => {
    // save watermark and conversationId into client
    const watermark = getWatermark(streamUrl);
    if (watermark) {
      try {
        client.set(
          number,
          JSON.stringify({ watermark, conversationId, number }),
        );
      } catch (e) {
        // server error
      }
    }
    // send initial message
    sendMessageToFela(res, number, conversationId, messageIn, conversationAuth);
  });

  ws.on('message', data => {
    sendMessageToClient(data);
  });
}

// Conversation manager
function proceedWithConversation(
  res,
  stream,
  number,
  messageIn,
  uniqueId,
  mediaURl,
) {
  const { conversationId, token, streamUrl } = stream;
  const conversationAuth = `Bearer ${token}`;
  Request.post(
    {
      url: `https://directline.botframework.com/v3/directline/conversations/${conversationId}/activities`,
      headers: {
        Authorization: conversationAuth,
        'Content-Type': 'application/json',
      },
      body: {
        from: {
          id: number,
          name: 'whatsapp-user',
        },
        name: 'startConversation',
        type: 'event',
        value: '',
        channelData: {
          personId: number,
          environment: 'myfela.ng',
        },
      },
      json: true,
    },
    (err2, respBody, resp) => {
      if (err2) {
        // unable to initiate conversation
        return;
      }

      if (respBody.statusCode !== 200) {
        // unable to initiate conversation
        return;
      }
      // start a socket instance and save it for receiving message
      listenForFelaResponse(
        res,
        streamUrl,
        number,
        conversationId,
        messageIn,
        conversationAuth,
      );
    },
  );
}

/* Picky webHook endpoint */
module.exports = (req, res) => {
  const { number } = req.body;
  const messageIn = req.body['message-in'];
  const uniqueId = req.body['unique-id'];
  const mediaURl = req.body['media-url'];

  client.get(number, (err, oldConversationData) => {
    if (err) {
      // respond with unable to process request
      return;
    }

    if (oldConversationData) {
      // reconnect to conversation
      try {
        const { conversationId, watermark } = JSON.parse(oldConversationData);
        reconnectToFela(
          res,
          conversationId,
          number,
          messageIn,
          uniqueId,
          mediaURl,
          watermark,
        );
      } catch (e) {
        // server error
      }
    } else {
      // create new conversation
      Request.post(
        {
          url:
            'https://directline.botframework.com/v3/directline/conversations',
          json: true,
          headers: {
            Authorization: `Bearer ${fela.token}`,
          },
        },
        (err2, respBody, resp) => {
          if (err2) {
            // unable to initiate conversation
            return;
          }

          if (respBody.statusCode !== 201 && respBody.statusCode !== 200) {
            // unable to initiate conversation
            return;
          }
          if (respBody.statusCode === 200) {
            // conversation already created
            // reconnect to conversation
            const { conversationId } = resp;
            reconnectToFela(
              res,
              conversationId,
              number,
              messageIn,
              uniqueId,
              mediaURl,
              null,
            );
            return;
          }

          proceedWithConversation(
            res,
            resp,
            number,
            messageIn,
            uniqueId,
            mediaURl,
          );
        },
      );
    }
  });
};
