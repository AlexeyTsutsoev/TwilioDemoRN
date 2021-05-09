import {Client} from 'twilio-chat';
import {Channel} from 'twilio-chat/lib/channel';
import {Message} from 'twilio-chat/lib/message';

export class TwilioService {
  static serviceInstance: TwilioService;
  static chatCLient: Client;

  static getInstance() {
    if (!TwilioService.serviceInstance) {
      TwilioService.serviceInstance = new TwilioService();
    }
    return TwilioService.serviceInstance;
  }

  getChatClient = async (token?: string): Promise<Client> => {
    if (!TwilioService.chatCLient && !token) {
      throw new Error("Token doesn't exist");
    }

    if (!TwilioService.chatCLient && token) {
      try {
        const newClient = await Client.create(token);
        TwilioService.chatCLient = newClient;
        return TwilioService.chatCLient;
      } catch (err) {
        console.log(err);
      }
    }

    return TwilioService.chatCLient;
  };

  addTokenListener = async (getToken: Function): Promise<Client> => {
    if (!TwilioService.chatCLient) {
      throw new Error("Twilio Client doesn't exist");
    }

    TwilioService.chatCLient.on('tokenAboutToExpire', async () => {
      const token = await getToken();
      TwilioService.chatCLient.updateToken(token);
    });

    TwilioService.chatCLient.on('tokenExpired', async () => {
      const token = await getToken();
      TwilioService.chatCLient.updateToken(token);
    });

    return TwilioService.chatCLient;
  };

  parseChannel = (channel: Channel) => ({
    id: channel.sid,
    name: channel.friendlyName,
    createdAt: channel.dateCreated,
    updatedAt: channel.dateUpdated,
    lastMessageTime:
      channel.lastMessage?.dateCreated ??
      channel.dateCreated ??
      channel.dateUpdated,
  });

  parseChannels = (channels: Channel[]) =>
    channels.map(channel => this.parseChannel(channel));

  parseMessage = (message: Message) => ({
    _id: message.sid,
    text: message.body,
    createdAt: message.dateCreated,
    user: {
      _id: message.author,
      name: message.author,
    },
    received: true,
  });

  parseMessages = (messages: Message[]) =>
    messages?.map(message => this.parseMessage(message));

  clientShutdown = (): void => {
    TwilioService.chatCLient?.shutdown();
    TwilioService.chatCLient = {} as Client;
  };
}
