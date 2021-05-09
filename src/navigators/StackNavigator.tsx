import React, {FC} from 'react';
import StartScreen from '../screens/StartScreen/StartScreen';
import {createStackNavigator} from '@react-navigation/stack';
import ChatList from '../screens/ChatList/ChatList';
import StartChatScreen from '../screens/StartChatScreen/StartChatScreen';
import ChatRoom from '../screens/ChatRoom/ChatRoom';

export const routes = {
  StartScreen: 'StartScreen',
  StartChatScreen: 'StartChatScreen',
  ChatList: 'ChatList',
  ChatRoom: 'ChatRoom',
};

const Stack = createStackNavigator();

const StackNavigator: FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={routes.StartScreen} component={StartScreen} />
      <Stack.Screen name={routes.StartChatScreen} component={StartChatScreen} />
      <Stack.Screen name={routes.ChatList} component={ChatList} />
      <Stack.Screen name={routes.ChatRoom} component={ChatRoom} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
