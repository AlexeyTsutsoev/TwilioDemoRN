import React, {FC, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {routes} from '../../navigators/StackNavigator';

const StartScreen: FC = ({navigation}: any) => {
  const [name, setName] = useState<string>('');

  return (
    <View style={styles.screen}>
      <Text>test</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="enter your name for chat"
      />
      <TouchableOpacity
        style={styles.button}
        disabled={!name}
        onPress={() => navigation.navigate(routes.ChatList, {name})}>
        <Text>Login</Text>
      </TouchableOpacity>
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

export default StartScreen;
