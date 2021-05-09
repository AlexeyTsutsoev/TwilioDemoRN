import React, {FC} from 'react';
import {Text, TouchableOpacity} from 'react-native';

export type Props = {
  channel: any;
  onPress: () => void;
};

const ChatListItem: FC<Props> = (props: Props) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Text>{props.channel.name}</Text>
    </TouchableOpacity>
  );
};

export default ChatListItem;
