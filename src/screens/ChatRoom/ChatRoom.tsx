import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {GiftedChat, IMessage} from 'react-native-gifted-chat';
import {Channel} from 'twilio-chat/lib/channel';
import {TwilioService} from '../../api/services/TwilioService';

const ChatRoom: FC = ({route}: any) => {
  const {channelId, identity} = route.params;
  const [messages, setMessages] = useState<IMessage[]>([]);
  const channelClient = useRef<Channel>({} as Channel);
  const shatMessagePagination = useRef<any>();

  const setChannelEvents = useCallback(channel => {
    channelClient.current = channel;
    channelClient.current?.on('messageAdded', (message: any) => {
      const newMessage = TwilioService.getInstance().parseMessage(message);
      const {giftedId} = message.attributes;
      if (giftedId) {
        setMessages(prevMessages => {
          if (prevMessages.some(msg => msg._id === giftedId)) {
            return prevMessages.map(m => (m._id === giftedId ? newMessage : m));
          }
          return [newMessage, ...prevMessages];
        });
      }
    });
    return channelClient.current;
  }, []);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    const attributes = {giftedId: newMessages[0]._id};
    setMessages(prev => GiftedChat.append(prev, newMessages));
    channelClient.current?.sendMessage(newMessages[0].text, attributes);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const client = await TwilioService.getInstance().getChatClient();
        const channel = await client.getChannelBySid(channelId);
        const currentChannel = setChannelEvents(channel);
        const paginator = await currentChannel?.getMessages();
        shatMessagePagination.current = paginator;
        const newMsgs = TwilioService.getInstance().parseMessages(
          paginator.items,
        );
        setMessages(newMsgs);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [channelId, setChannelEvents]);

  return (
    <GiftedChat
      messages={messages}
      onSend={(newMsgs: IMessage[]) => onSend(newMsgs)}
      user={{_id: identity}}
    />
  );
};

export default ChatRoom;
