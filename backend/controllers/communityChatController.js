// import * as communityChatService from '../services/communityChatService.js';

export const listMessagesByChannel = async (req, res, next) => {
  try {
    const { name: channelName } = req.params;
    // TODO: Implementar communityChatService.getMessages(channelName)
    res.status(200).json({ message: `Mensagens do canal ${channelName} (placeholder).` });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    // const userId = req.user.id;
    const { channelName, text } = req.body;
    if (!channelName || !text) {
        return res.status(400).json({ message: "channelName e text são obrigatórios."});
    }
    // TODO: Implementar communityChatService.postMessage(userId, channelName, text)
    res.status(201).json({ message: `Mensagem enviada para o canal ${channelName} (placeholder).` });
  } catch (error) {
    next(error);
  }
};
