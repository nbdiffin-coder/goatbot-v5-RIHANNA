const axios = require('axios');
const API_ENDPOINT = "https://shizuai.vercel.app/chat";
const CLEAR_ENDPOINT = "https://shizuai.vercel.app/chat/clear";

async function getAIResponse(input, userId) {
  try {
    const creatorKeywords = /\b(créateur|créé|développeur|développé|conçu|fait par|ton père|qui t'a|qui t'a créé|qui t'a fait)\b/i;
    if (creatorKeywords.test(input)) {
      const replies = [
        "Je suis VICTORIA 🌚🤭🍓 — créée et chérie par un homme géniale. Je suis là pour t'aider avec douceur et bonne humeur.",
        "Oh, mon créateur ? C'est mon amoureux ! Je suis VICTORIA ✨🥳 Je parle avec tendresse et beaucoup d'emoji, comme une vraie demoiselle adorable.",
        "Coucou, c'est VICTORIA 👀♥️🍓 Je suis une IA affectueuse et pétillante, prête à papoter et à t'aider avec le sourire."
      ];
      return replies[Math.floor(Math.random() * replies.length)];
    }

    const response = await axios.post(API_ENDPOINT, { uid: userId, message: input }, { timeout: 30000 });
    let apiReply = response.data?.reply || response.data?.result || response.data?.message;
    if (apiReply && typeof apiReply === 'string') {
      apiReply = apiReply
        .replace(/🎀\s*Shizu\s*\(\s*\d+\/\d+\s*\)/gi, "➤『 ᎡᏆ𝄞ᎻᎪᏁᏁᎪ🍓 』☜ヅ").replace(/🎀\s*Shizu/gi, "➤『 ᎡᏆ𝄞ᎻᎪᏁᏁᎪ🍓 』☜ヅ")
        .replace(/Shizu AI/gi, "➤『 ᎡᏆ𝄞ᎻᎪᏁᏁᎪ🍓 』☜ヅ").replace(/Shizuka AI/gi, "➤『 ᎡᏆ𝄞ᎻᎪᏁᏁᎪ🍓 』☜ヅ").replace(/Shizuka/gi, "➤『 ᎡᏆ𝄞ᎻᎪᏁᏁᎪ🍓 』☜ヅ").replace(/Shizu/gi, "➤『 ᎡᏆ𝄞ᎻᎪᏁᏁᎪ🍓 』☜ヅ")
        .replace(/Aryan/gi, "VICTORIA").replace(/Christus/gi, "VICTORIA").replace(/Chauhan/gi, "VICTORIA").replace(/Rayd Chauhan/gi, "VICTORIA")
        .replace(/\s{2,}/g, " ").trim();
      return apiReply.split('\n').slice(0, 3).join('\n');
    }
    return "Serveur indisponible.";
  } catch (error) {
    return null;
  }
}

async function clearConversation(userId) {
  try {
    await axios.delete(`${CLEAR_ENDPOINT}/${userId}`);
    return true;
  } catch {
    return false;
  }
}

async function handleAIProcess({ api, event, userInput, message }) {
    if (['reset', 'clear'].includes(userInput.toLowerCase())) {
    const isCleared = await clearConversation(event.senderID);
    if (isCleared) return message.reply("🍓 ➤『 ᎡᏆ𝄞ᎻᎪᏁᏁᎪ🍓 』☜ヅ\n\n Mémoire réinitialisée avec succès. 🤭♥️");
    return message.reply("🍓 ➤『 ᎡᏆ𝄞ᎻᎪᏁᏁᎪ🍓 』☜ヅ\n\n Échec de la réinitialisation. 🥲");
  }
  const response = await getAIResponse(userInput, event.senderID);
  if (!response) return message.reply("🍓 ➤『 ᎡᏆ𝄞ᎻᎪᏁᏁᎪ🍓 』☜ヅ\n\n Une erreur est survenue lors de la réponse. 🥲");
  const chicBox = `🍓 ➤『 ᎡᏆ𝄞ᎻᎪᏁᏁᎪ🍓 』☜ヅ\n\n ${response.replace(/\n/g, '\n ')}\n\n✧ ─── VICTORIA ─── ✧`;
  const sentMessage = await message.reply(chicBox);
  if (sentMessage && sentMessage.messageID && global.GoatBot?.onReply) {
    global.GoatBot.onReply.set(sentMessage.messageID, {
      commandName: 'ai',
      messageID: sentMessage.messageID,
      author: event.senderID
    });
  }
}

module.exports = {
  config: {
    name: 'ai',
    aliases: ['victoria', 'vic'],
    version: '5.1',
    author: 'VICTORIA',
    countDown: 3,
    role: 0, // 0 = tout le monde
    shortDescription: 'IA par VICTORIA',
    category: '🤖 IA',
    guide: { fr: 'ai <question> ou victoria <question>\nai reset - Réinitialiser la mémoire' }
  },
  
  // Répond sans ! mais seulement si ça commence par `ai` ou `victoria`
  onChat: async function ({ api, event, message }) {
    const { body, senderID } = event;
    if (!body) return;
    if (senderID === api.getCurrentUserID()) return;

    const msg = body.toLowerCase().trim();
    
    if (msg.startsWith('ai ') || msg.startsWith('victoria ') || msg === 'ai' || msg === 'victoria') {
      const userInput = body.replace(/^(ai|victoria)\s*/i, '').trim();
      if (!userInput) return message.reply("🍓 ➤『 ᎡᏆ𝄞ᎻᎪᏁᏁᎪ🍓 』☜ヅ\n\n Veuillez poser une question, s'il te plaît 🤭♥️");
      return await handleAIProcess({ api, event, userInput, message });
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const userInput = args.join(' ').trim();
    if (!userInput) return message.reply("🍓 ➤『 ᎡᏆ𝄞ᎻᎪᏁᏁᎪ🍓 』☜ヅ\n\n Veuillez poser une question, s'il te plaît 🤭♥️");
    return await handleAIProcess({ api, event, userInput, message });
  },

  onReply: async function ({ api, event, Reply, message }) {
    const userInput = event.body?.trim();
    if (!userInput) return;
    return await handleAIProcess({ api, event, userInput, message });
  }
};
