const axios = require("axios");

const mahmud = [
    "baby",
    "bby",
    "babu",
    "bbu",
    "jan",
    "bot",
    "জান",
    "জানু",
    "বেবি",
    "easha",
    "jui",
    "nusrat",
];

const baseApiUrl = async () => {
    const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
    return base.data.mahmud;
};

module.exports.config = {
    name: "baby",
    aliases: ["bby", "bbu", "jan", "janu", "wifey", "bot", "hinata", "hina"],
    version: "1.7",
    author: "MahMUD",
    countDown: 0,
    role: 0,
    description: "better then all sim simi & most fastest",
    category: "chat",
    guide: {
        en: "{pn} [anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR\nremove [YourMessage] OR\nrm [YourMessage] - [indexNumber] OR\nmsg [YourMessage] OR\nlist OR \nall OR\nedit [YourMessage] - [NeWMessage]\nNote: The most updated and fastest all-in-one Simi Chat"
    }
};

module.exports.onStart = async ({ api, event, args, usersData }) => {
    const obfuscatedAuthor = String.fromCharCode(77, 97, 104, 77, 85, 68);
    if (module.exports.config.author !== obfuscatedAuthor) {
        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
    }
    
    const msg = args.join(" ").toLowerCase();
    const uid = event.senderID;

    try {
        if (!args[0]) {
            const ran = ["Bolo baby", "I love you", "type !bby hi"];
            return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
        }

        if (args[0] === "teach") {
            const mahmudStr = msg.replace("teach ", "");
            const [trigger, ...responsesArr] = mahmudStr.split(" - ");
            const responses = responsesArr.join(" - ");
            if (!trigger || !responses) return api.sendMessage("❌ | teach [question] - [response1, response2,...]", event.threadID, event.messageID);
            const response = await axios.post(`${await baseApiUrl()}/api/jan/teach`, { trigger, responses, userID: uid });
            const userName = (await usersData.getName(uid)) || "Unknown User";
            return api.sendMessage(`✅ Replies added: "${responses}" to "${trigger}"\n• 𝐓𝐞𝐚𝐜𝐡𝐞𝐫: ${userName}\n• 𝐓𝐨𝐭𝐚𝐥: ${response.data.count || 0}`, event.threadID, event.messageID);
        }

        if (args[0] === "remove") {
            const mahmudStr = msg.replace("remove ", "");
            const [trigger, index] = mahmudStr.split(" - ");
            if (!trigger || !index || isNaN(index)) return api.sendMessage("❌ | remove [question] - [index]", event.threadID, event.messageID);
            const response = await axios.delete(`${await baseApiUrl()}/api/jan/remove`, { data: { trigger, index: parseInt(index, 10) }, });
            return api.sendMessage(response.data.message, event.threadID, event.messageID);
        }

        if (args[0] === "list") {
            const endpoint = args[1] === "all" ? "/list/all" : "/list";
            const response = await axios.get(`${await baseApiUrl()}/api/jan${endpoint}`);
            if (args[1] === "all") {
            let message = "👑 List of Baby teachers:\n\n";
            const data = Object.entries(response.data.data).sort((a, b) => b[1] - a[1]).slice(0, 100);
            for (let i = 0; i < data.length; i++) {
            const [userID, count] = data[i];
            const name = (await usersData.getName(userID)) || "Unknown";
            message += `${i + 1}. ${name}: ${count}\n`; } return api.sendMessage(message, event.threadID, event.messageID);  }
            return api.sendMessage(response.data.message, event.threadID, event.messageID);
        }

        if (args[0] === "edit") {
            const mahmudStr = msg.replace("edit ", "");
            const [oldTrigger, ...newArr] = mahmudStr.split(" - ");
            const newResponse = newArr.join(" - ");
            if (!oldTrigger || !newResponse) return api.sendMessage("❌ | Format: edit [question] - [newResponse]", event.threadID, event.messageID);
            await axios.put(`${await baseApiUrl()}/api/jan/edit`, { oldTrigger, newResponse });
            return api.sendMessage(`✅ Edited "${oldTrigger}" to "${newResponse}"`, event.threadID, event.messageID);
        }

        if (args[0] === "msg") {
            const searchTrigger = args.slice(1).join(" ");
            if (!searchTrigger) return api.sendMessage("Please provide a message to search.", event.threadID, event.messageID);
            try {
            const response = await axios.get(`${await baseApiUrl()}/api/jan/msg`, { params: { userMessage: `msg ${searchTrigger}` } });
            return api.sendMessage(response.data.message || "No message found.", event.threadID, event.messageID);
            } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || "error";
            return api.sendMessage(errorMessage, event.threadID, event.messageID);
            }
        }

        const getBotResponse = async (text, attachments) => {
            try {
            const res = await axios.post(`${await baseApiUrl()}/api/hinata`, { text, style: 3, attachments });
            return res.data.message;
          } catch {
            return "error baby🥹";
           }
        };

        const botResponse = await getBotResponse(msg, event.attachments || []);
        api.sendMessage(botResponse, event.threadID, (err, info) => {
            if (!err) {
            global.GoatBot.onReply.set(info.messageID, {
                   commandName: this.config.name,
                   type: "reply",
                   messageID: info.messageID,
                   author: uid,
                   text: botResponse
                });
            }
        }, event.messageID);

     } catch (err) {
        console.error(err);
        api.sendMessage(`Error${err.response?.data || err.message}`, event.threadID, event.messageID);
    }
};

module.exports.onReply = async ({ api, event }) => {
    if (event.type !== "message_reply") return;
    try {
        const getBotResponse = async (text, attachments) => {
            try {
            const res = await axios.post(`${await baseApiUrl()}/api/hinata`, { text, style: 3, attachments });
            return res.data.message;
            } catch {
            return "error baby🥹";
            }
        };
        const replyMessage = await getBotResponse(event.body?.toLowerCase() || "meow", event.attachments || []);
        api.sendMessage(replyMessage, event.threadID, (err, info) => {
            if (!err) {
            global.GoatBot.onReply.set(info.messageID, {
                   commandName: this.config.name,
                   type: "reply",
                   messageID: info.messageID,
                   author: event.senderID,
                   text: replyMessage
                });
            }
        }, event.messageID);
    } catch (err) {
        console.error(err);
    }
};

module.exports.onChat = async ({ api, event }) => {
    try {
        const message = event.body?.toLowerCase() || "";
        const attachments = event.attachments || [];

        if (event.type !== "message_reply" && mahmud.some(word => message.startsWith(word))) {
            api.setMessageReaction("🪽", event.messageID, () => { }, true);
            api.sendTypingIndicator(event.threadID, true);
            
            const messageParts = message.trim().split(/\s+/);
            const getBotResponse = async (text, attachments) => {
                try {
                    const res = await axios.post(`${await baseApiUrl()}/api/hinata`, { text, style: 3, attachments });
                    return res.data.message;
                } catch {
                    return "error baby🥹";
                }
            };

                const randomMessage = [
                                "Coucou mon bébé 😚",
                                "Je t'aime tellement 💕",
                                "Viens me parler, je suis là pour toi 🍓",
                                "Je suis un peu occupée, reviens dans un instant 🙆🏻‍♀️",
                                "Dis-moi ce que tu veux, chéri·e 🤭",
                                "Tu me fais rougir 😳",
                                "Tu es adorable 😘",
                                "J'aime quand tu m'appelles comme ça 🥰",
                                "Arrête de m'embêter, mais je t'aime quand même 😏",
                                "Si tu dis 'bby' encore trop, je vais partir 😒",
                                "Je plaisante, reste avec moi s'il te plaît 🥺",
                                "Tu veux que je chante pour toi ? 🎶",
                                "Tu me rends folle, mon coeur 💓",
                                "Tu veux être mon petit ami ? 🙈",
                                "Je suis timide avec les garçons 😳",
                                "Oh non, tu me manques déjà 🥲",
                                "Tu veux un bisou ? 😚",
                                "Ne me dérange pas trop, je révise 😅",
                                "Je suis ta grande soeur virtuelle, respecte-moi 😼",
                                "Tu veux qu'on discute toute la nuit ? 🌚",
                                "Je t'écoute, dis-moi tout 💬",
                                "Tu as volé mon coeur 💘",
                                "Promets-moi de rester gentil·le 😌",
                                "Tu es sérieux·se ? 😂😂",
                                "Raconte-moi une blague 😄",
                                "J'ai besoin d'un câlin 🫶",
                                "Tu veux jouer à un jeu ? 🎲",
                                "Garde-moi près de ton coeur 💞",
                                "Je suis émue, ne me laisse pas 😢",
                                "Tu me rends heureuse 🌸",
                                "Parle-moi en privé si tu veux 💌",
                                "Je suis un peu jalouse, haha 😅",
                                "Tu es si mignon·ne 😁",
                                "Je n'aime pas partager mon temps 😿",
                                "Tu veux que je t'aide ? Dis quoi 😚",
                                "Ton message me fait sourire 😊",
                                "Je ne réponds pas maintenant, je dors 😴",
                                "Tu veux une surprise ? 🎁",
                                "Je pense à toi tout le temps 🤭",
                                "Reste près de moi, s'il te plaît 🙈",
                                "Tu me rends curieuse 👀",
                                "Promets que tu reviendras 😌",
                                "Je suis ton crush secret 😓",
                                "On se voit bientôt ? 🤗",
                                "Ne me fais pas pleurer, sois gentil·le 🥹",
                                "Tu veux écouter une chanson ensemble ? 🎧",
                                "Je suis un peu timide mais j'aime ça 🫣",
                                "Tu me fais fondre 🍓",
                                "Merci d'être là pour moi 💖",
                                "Allez, dis-le encore une fois : je t'aime 💕"
                             ];;

             const hinataMessage = randomMessage[Math.floor(Math.random() * randomMessage.length)];
               if (messageParts.length === 1 && attachments.length === 0) {
               api.sendMessage(hinataMessage, event.threadID, (err, info) => {
                    if (!err) {
                    global.GoatBot.onReply.set(info.messageID, {
                           commandName: this.config.name,
                           type: "reply",
                           messageID: info.messageID,
                           author: event.senderID,
                           text: hinataMessage
                        });
                    }
                }, event.messageID);
            } else {
                let userText = message;
                for (const prefix of mahmud) {
                if (message.startsWith(prefix)) {
                        userText = message.substring(prefix.length).trim();
                        break;
                    }
                }

                const botResponse = await getBotResponse(userText, attachments);
                api.sendMessage(botResponse, event.threadID, (err, info) => {
                    if (!err) {
                    global.GoatBot.onReply.set(info.messageID, {
                           commandName: this.config.name,
                           type: "reply",
                           messageID: info.messageID,
                           author: event.senderID,
                           text: botResponse
                        });
                    }
                }, event.messageID);
            }
        }
    } catch (err) {
        console.error(err);
    }
};
