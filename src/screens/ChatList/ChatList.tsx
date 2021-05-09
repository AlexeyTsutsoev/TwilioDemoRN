import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import Client from 'twilio-chat';
import {Channel} from 'twilio-chat/lib/data/channels';
import {Paginator} from 'twilio-chat/lib/interfaces/paginator';
import {Message} from 'twilio-chat/lib/message';
import {getTwilioToken} from '../../api/axios/chatApi';
import {TwilioService} from '../../api/services/TwilioService';
import {routes} from '../../navigators/StackNavigator';
import {updateChannels} from '../../redux/reducer';
import {RootState} from '../../redux/store';
import ChatListItem from './components/ChatListItem';

const ChatList: FC = ({navigation, route}: any) => {
  const [loading, setLoading] = useState<Boolean>(true);
  const channels = useSelector((state: RootState) => state.main.channels);
  const dispatch = useDispatch();
  const channelPaginator = useRef<Paginator<Channel> | undefined>();
  const {name} = route.params;
  console.log('channels from redux--->', channels);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate(routes.StartChatScreen)}>
          <Text>Add</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const setChannelEvents = useCallback(
    (client: Client) => {
      client.on('messageAdded', (message: Message) => {
        dispatch(updateChannels(message));
      });
      return client;
    },
    [dispatch],
  );

  const getSubsChannels = useCallback(
    (client: Client) => {
      console.log('client from getSub', client);

      client.getSubscribedChannels().then((paginator: Paginator<Channel>) => {
        channelPaginator.current = paginator;
        const newChannels = TwilioService.getInstance().parseChannels(
          channelPaginator.current.items,
        );
        console.log('new channels--->', newChannels);

        dispatch(updateChannels(newChannels));
      });
    },
    [dispatch],
  );

  useEffect(() => {
    (async () => {
      try {
        console.log('effect for token');
        const token = await getTwilioToken(name);
        await TwilioService.getInstance().getChatClient(token);
        await TwilioService.getInstance().addTokenListener(getTwilioToken);
        const client = await TwilioService.getInstance().getChatClient();
        setChannelEvents(client);
        getSubsChannels(client);

        return () => TwilioService.getInstance().clientShutdown();
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [getSubsChannels, name, setChannelEvents]);

  return (
    <View style={styles.screen}>
      {loading ? (
        <ActivityIndicator color="red" size="large" />
      ) : (
        <FlatList
          data={channels}
          keyExtractor={(item: any) => item.id}
          renderItem={({item}) => (
            <ChatListItem
              channel={item}
              onPress={() =>
                navigation.navigate(routes.ChatRoom, {
                  channelId: item.id,
                  identity: name,
                })
              }
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  button: {
    borderRadius: 50,
    backgroundColor: 'green',
  },
});

export default ChatList;
