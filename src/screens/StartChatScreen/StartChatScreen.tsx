import React, {FC, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {TwilioService} from '../../api/services/TwilioService';

const StartChatScreen: FC = () => {
  const [channelName, setChannelName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const onCreateOrJoin = async () => {
    try {
      setLoading(true);
      const client = await TwilioService.getInstance().getChatClient();
      let channel;
      try {
        channel = await client.getChannelByUniqueName(channelName);
      } catch (err) {
        console.log('channel err');
        console.log(err);
      }
      console.log('channel in try--->', channel);
      if (!channel) {
        console.log('if block !channel');
        const newChannel = await client.createChannel({
          uniqueName: channelName,
          friendlyName: channelName,
        });
        newChannel.join();
        return;
      }
      channel.status === 'joined' ? channel : channel.join();
    } catch (err) {
      console.log('err from startChat');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Text>TEST</Text>
      <TextInput
        style={styles.input}
        value={channelName}
        onChangeText={setChannelName}
        placeholder="Channel name"
      />
      <TouchableOpacity style={styles.button} onPress={onCreateOrJoin}>
        <Text>Create or Join</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color="blue" />}
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
  input: {
    borderWidth: 1,
    borderColor: 'black',
  },
  button: {
    backgroundColor: 'red',
  },
});

export default StartChatScreen;
